package expo.modules.headset

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.media.AudioDeviceCallback
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.media.MediaMetadataRetriever
import android.media.MediaRouter2
import android.os.Build
import android.os.Handler
import android.os.Looper
import android.provider.Settings
import androidx.annotation.OptIn
import androidx.core.content.ContextCompat
import androidx.media3.common.util.UnstableApi
import expo.modules.audio.AudioPlayer
import expo.modules.kotlin.functions.Queues
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import java.io.File
import java.io.FileOutputStream

@OptIn(UnstableApi::class)
class HeadsetModule : Module() {
  private val context: Context get() = requireNotNull(appContext.reactContext)
  private val audio: AudioManager get() = context.getSystemService(Context.AUDIO_SERVICE) as AudioManager

  private var observing = false

  private val deviceCallback = object : AudioDeviceCallback() {
    override fun onAudioDevicesAdded(added: Array<out AudioDeviceInfo>) = emitRoute()
    override fun onAudioDevicesRemoved(removed: Array<out AudioDeviceInfo>) = emitRoute()
  }

  private val remoteReceiver = object : BroadcastReceiver() {
    override fun onReceive(c: Context, intent: Intent) {
      val action = intent.getStringExtra("action") ?: return
      sendEvent("onRemote", mapOf("action" to action))
    }
  }

  // Fired by the system the moment headphones are unplugged / disconnected,
  // before audio is rerouted to the speaker.
  private val noisyReceiver = object : BroadcastReceiver() {
    override fun onReceive(c: Context, intent: Intent) {
      if (intent.action == AudioManager.ACTION_AUDIO_BECOMING_NOISY) sendEvent("onNoisy", emptyMap<String, Any>())
    }
  }

  override fun definition() = ModuleDefinition {
    Name("Headset")

    Events("onRouteChange", "onRemote", "onNoisy")

    Function("getRoute") { route() }

    Function("getOutputs") { outputs().map { it.second } }

    AsyncFunction("setOutput") { player: AudioPlayer, id: Int? ->
      val device = id?.let { wanted -> audio.getDevices(AudioManager.GET_DEVICES_OUTPUTS).firstOrNull { it.id == wanted } }
      player.ref.setPreferredAudioDevice(device)
    }.runOnQueue(Queues.MAIN)

    Function("showOutputSwitcher") {
      val activity = appContext.currentActivity ?: return@Function false
      if (Build.VERSION.SDK_INT >= 34 && MediaRouter2.getInstance(activity).showSystemOutputSwitcher()) {
        return@Function true
      }
      runCatching {
        activity.startActivity(
          Intent("com.android.systemui.action.LAUNCH_MEDIA_OUTPUT_DIALOG")
            .setPackage("com.android.systemui")
            .putExtra("package_name", activity.packageName)
        )
        true
      }.getOrElse { openBluetooth() }
    }

    Function("openBluetoothSettings") { openBluetooth() }

    AsyncFunction("readMeta") { path: String, artPath: String ->
      readMeta(path.removePrefix("file://"), artPath.removePrefix("file://"))
    }

    OnStartObserving {
      if (observing) return@OnStartObserving
      observing = true
      audio.registerAudioDeviceCallback(deviceCallback, Handler(Looper.getMainLooper()))
      ContextCompat.registerReceiver(
        context, remoteReceiver, IntentFilter(ACTION), ContextCompat.RECEIVER_NOT_EXPORTED
      )
      ContextCompat.registerReceiver(
        context, noisyReceiver, IntentFilter(AudioManager.ACTION_AUDIO_BECOMING_NOISY), ContextCompat.RECEIVER_EXPORTED
      )
    }

    OnStopObserving {
      if (!observing) return@OnStopObserving
      observing = false
      audio.unregisterAudioDeviceCallback(deviceCallback)
      runCatching { context.unregisterReceiver(remoteReceiver) }
      runCatching { context.unregisterReceiver(noisyReceiver) }
    }
  }

  private fun openBluetooth(): Boolean {
    val activity = appContext.currentActivity ?: return false
    return runCatching { activity.startActivity(Intent(Settings.ACTION_BLUETOOTH_SETTINGS)); true }.getOrDefault(false)
  }

  private fun emitRoute() = sendEvent("onRouteChange", route())

  private fun typeOf(d: AudioDeviceInfo): String? = when (d.type) {
    AudioDeviceInfo.TYPE_BUILTIN_SPEAKER -> "speaker"
    AudioDeviceInfo.TYPE_WIRED_HEADSET, AudioDeviceInfo.TYPE_WIRED_HEADPHONES -> "wired"
    AudioDeviceInfo.TYPE_USB_HEADSET -> "usb"
    AudioDeviceInfo.TYPE_BLUETOOTH_A2DP -> "bluetooth"
    else -> if (Build.VERSION.SDK_INT >= 31 && (d.type == AudioDeviceInfo.TYPE_BLE_HEADSET || d.type == AudioDeviceInfo.TYPE_BLE_SPEAKER)) "bluetooth" else null
  }

  // Devices music can be routed to, one entry per physical device (BT devices expose
  // several AudioDeviceInfo entries, e.g. A2DP + LE).
  private fun outputs(): List<Pair<AudioDeviceInfo, Map<String, Any>>> {
    val seen = HashSet<String>()
    return audio.getDevices(AudioManager.GET_DEVICES_OUTPUTS).mapNotNull { d ->
      val type = typeOf(d) ?: return@mapNotNull null
      val name = if (type == "speaker") "" else d.productName?.toString().orEmpty()
      if (!seen.add("$type|$name")) return@mapNotNull null
      d to mapOf("id" to d.id, "type" to type, "name" to name)
    }
  }

  // The device the system routes media to by default: headphones win over the speaker.
  private fun route(): Map<String, Any> {
    val list = outputs().map { it.second }
    return list.firstOrNull { it["type"] == "wired" || it["type"] == "usb" }
      ?: list.firstOrNull { it["type"] == "bluetooth" }
      ?: mapOf("id" to (list.firstOrNull()?.get("id") ?: -1), "type" to "speaker", "name" to "")
  }

  private fun readMeta(path: String, artPath: String): Map<String, Any?> {
    val result = HashMap<String, Any?>()
    val mmr = MediaMetadataRetriever()
    try {
      mmr.setDataSource(path)
      result["title"] = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_TITLE)?.trim()?.ifEmpty { null }
      result["artist"] = (mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ARTIST)
        ?: mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUMARTIST))?.trim()?.ifEmpty { null }
      result["album"] = mmr.extractMetadata(MediaMetadataRetriever.METADATA_KEY_ALBUM)?.trim()?.ifEmpty { null }
      result["art"] = mmr.embeddedPicture?.let { saveArtwork(it, artPath) } ?: false
    } catch (_: Exception) {
      result["art"] = false
    } finally {
      runCatching { mmr.release() }
    }
    result["lyrics"] = runCatching { Lyrics.read(File(path)) }.getOrNull()
    return result
  }

  // Embedded covers are often 3000px+; downscale so lists, the notification and the
  // lock screen never decode huge bitmaps.
  private fun saveArtwork(bytes: ByteArray, artPath: String): Boolean {
    val bounds = BitmapFactory.Options().apply { inJustDecodeBounds = true }
    BitmapFactory.decodeByteArray(bytes, 0, bytes.size, bounds)
    if (bounds.outWidth <= 0) return false
    var sample = 1
    while (maxOf(bounds.outWidth, bounds.outHeight) / (sample * 2) >= ART_SIZE) sample *= 2
    val bitmap = BitmapFactory.decodeByteArray(bytes, 0, bytes.size, BitmapFactory.Options().apply { inSampleSize = sample })
      ?: return false
    val file = File(artPath)
    file.parentFile?.mkdirs()
    FileOutputStream(file).use { bitmap.compress(Bitmap.CompressFormat.JPEG, 90, it) }
    bitmap.recycle()
    return true
  }

  companion object {
    const val ACTION = "expo.modules.headset.REMOTE"
    private const val ART_SIZE = 1024
  }
}
