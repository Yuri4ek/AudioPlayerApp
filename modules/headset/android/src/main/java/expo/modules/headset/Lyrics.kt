package expo.modules.headset

import java.io.File
import java.io.RandomAccessFile
import java.nio.charset.Charset

// Reads unsynchronised lyrics embedded in audio files:
// ID3v2 USLT/ULT frames (mp3, some wav/aiff) and Vorbis comments LYRICS/UNSYNCEDLYRICS (flac).
internal object Lyrics {
  private const val MAX_TAG = 16 * 1024 * 1024

  fun read(file: File): String? = RandomAccessFile(file, "r").use { f ->
    val head = ByteArray(10)
    if (f.read(head) < 10) return null
    val text = when {
      head[0] == 'I'.code.toByte() && head[1] == 'D'.code.toByte() && head[2] == '3'.code.toByte() -> id3(f, head)
      head[0] == 'f'.code.toByte() && head[1] == 'L'.code.toByte() && head[2] == 'a'.code.toByte() && head[3] == 'C'.code.toByte() -> flac(f)
      else -> null
    }
    text?.replace("\r\n", "\n")?.replace('\r', '\n')?.trim()?.ifEmpty { null }
  }

  private fun syncsafe(b: ByteArray, o: Int) =
    (b[o].toInt() and 0x7f shl 21) or (b[o + 1].toInt() and 0x7f shl 14) or (b[o + 2].toInt() and 0x7f shl 7) or (b[o + 3].toInt() and 0x7f)

  private fun int(b: ByteArray, o: Int, n: Int): Int {
    var v = 0
    for (i in 0 until n) v = (v shl 8) or (b[o + i].toInt() and 0xff)
    return v
  }

  private fun id3(f: RandomAccessFile, head: ByteArray): String? {
    val version = head[3].toInt()
    val flags = head[5].toInt()
    val size = syncsafe(head, 6)
    if (size <= 0 || size > MAX_TAG) return null
    var tag = ByteArray(size)
    f.readFully(tag)
    // Whole-tag unsynchronisation (v2.2/v2.3): drop 0x00 inserted after every 0xFF.
    if (version < 4 && flags and 0x80 != 0) tag = unsync(tag)

    var pos = 0
    if (flags and 0x40 != 0 && version >= 3) {
      pos += if (version == 4) syncsafe(tag, 0) else int(tag, 0, 4) + 4
    }
    val idLen = if (version == 2) 3 else 4
    val headerLen = if (version == 2) 6 else 10
    while (pos + headerLen <= tag.size) {
      if (tag[pos].toInt() == 0) break
      val id = String(tag, pos, idLen, Charsets.ISO_8859_1)
      val frameSize = when (version) {
        2 -> int(tag, pos + 3, 3)
        3 -> int(tag, pos + 4, 4)
        else -> syncsafe(tag, pos + 4)
      }
      val start = pos + headerLen
      if (frameSize <= 0 || start + frameSize > tag.size) break
      if (id == "USLT" || id == "ULT") {
        var frame = tag.copyOfRange(start, start + frameSize)
        if (version == 4 && int(tag, pos + 8, 2) and 0x0002 != 0) frame = unsync(frame)
        return uslt(frame)
      }
      pos = start + frameSize
    }
    return null
  }

  private fun unsync(b: ByteArray): ByteArray {
    val out = java.io.ByteArrayOutputStream(b.size)
    var i = 0
    while (i < b.size) {
      out.write(b[i].toInt())
      if (b[i] == 0xff.toByte() && i + 1 < b.size && b[i + 1].toInt() == 0) i++
      i++
    }
    return out.toByteArray()
  }

  // USLT: encoding(1) language(3) descriptor(terminated) text
  private fun uslt(frame: ByteArray): String? {
    if (frame.size < 5) return null
    val enc = frame[0].toInt()
    val charset: Charset = when (enc) {
      1 -> Charsets.UTF_16
      2 -> Charsets.UTF_16BE
      3 -> Charsets.UTF_8
      else -> Charsets.ISO_8859_1
    }
    val wide = enc == 1 || enc == 2
    var i = 4
    // Skip the content descriptor.
    if (wide) {
      while (i + 1 < frame.size && !(frame[i].toInt() == 0 && frame[i + 1].toInt() == 0)) i += 2
      i += 2
    } else {
      while (i < frame.size && frame[i].toInt() != 0) i++
      i += 1
    }
    if (i >= frame.size) return null
    var bytes = frame.copyOfRange(i, frame.size)
    // UTF-16 text after a descriptor carries its own BOM; if not, assume little-endian like most taggers.
    if (enc == 1 && bytes.size >= 2 && !(bytes[0] == 0xff.toByte() && bytes[1] == 0xfe.toByte()) && !(bytes[0] == 0xfe.toByte() && bytes[1] == 0xff.toByte())) {
      return String(bytes, Charsets.UTF_16LE).trimEnd('\u0000')
    }
    if (bytes.isNotEmpty() && bytes.last().toInt() == 0 && !wide) bytes = bytes.copyOf(bytes.size - 1)
    return String(bytes, charset).trimEnd('\u0000')
  }

  private fun flac(f: RandomAccessFile): String? {
    f.seek(4)
    val header = ByteArray(4)
    while (true) {
      if (f.read(header) < 4) return null
      val last = header[0].toInt() and 0x80 != 0
      val type = header[0].toInt() and 0x7f
      val len = int(header, 1, 3)
      if (type == 4) {
        if (len > MAX_TAG) return null
        val block = ByteArray(len)
        f.readFully(block)
        return vorbis(block)
      }
      f.seek(f.filePointer + len)
      if (last) return null
    }
  }

  private fun le(b: ByteArray, o: Int) =
    (b[o].toInt() and 0xff) or (b[o + 1].toInt() and 0xff shl 8) or (b[o + 2].toInt() and 0xff shl 16) or (b[o + 3].toInt() and 0xff shl 24)

  private fun vorbis(b: ByteArray): String? {
    var pos = 4 + le(b, 0)
    if (pos + 4 > b.size) return null
    val count = le(b, pos)
    pos += 4
    var fallback: String? = null
    repeat(count) {
      if (pos + 4 > b.size) return fallback
      val len = le(b, pos)
      pos += 4
      if (len < 0 || pos + len > b.size) return fallback
      val entry = String(b, pos, len, Charsets.UTF_8)
      pos += len
      val eq = entry.indexOf('=')
      if (eq > 0) {
        when (entry.substring(0, eq).uppercase()) {
          "UNSYNCEDLYRICS" -> return entry.substring(eq + 1)
          "LYRICS" -> fallback = entry.substring(eq + 1)
        }
      }
    }
    return fallback
  }
}
