package expo.modules.headset

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.media.AudioDeviceCallback
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Build
import android.os.Handler
import android.os.Looper
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

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

  override fun definition() = ModuleDefinition {
    Name("Headset")

    Events("onRouteChange", "onRemote")

    Function("getRoute") { route() }

    OnStartObserving {
      if (observing) return@OnStartObserving
      observing = true
      audio.registerAudioDeviceCallback(deviceCallback, Handler(Looper.getMainLooper()))
      ContextCompat.registerReceiver(
        context, remoteReceiver, IntentFilter(ACTION), ContextCompat.RECEIVER_NOT_EXPORTED
      )
    }

    OnStopObserving {
      if (!observing) return@OnStopObserving
      observing = false
      audio.unregisterAudioDeviceCallback(deviceCallback)
      runCatching { context.unregisterReceiver(remoteReceiver) }
    }
  }

  private fun emitRoute() = sendEvent("onRouteChange", route())

  private fun route(): Map<String, String> {
    var result = mapOf("type" to "speaker", "name" to "")
    for (d in audio.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
      val type = when (d.type) {
        AudioDeviceInfo.TYPE_WIRED_HEADSET, AudioDeviceInfo.TYPE_WIRED_HEADPHONES -> "wired"
        AudioDeviceInfo.TYPE_USB_HEADSET -> "usb"
        AudioDeviceInfo.TYPE_BLUETOOTH_A2DP, AudioDeviceInfo.TYPE_BLUETOOTH_SCO -> "bluetooth"
        else -> if (Build.VERSION.SDK_INT >= 31 && (d.type == AudioDeviceInfo.TYPE_BLE_HEADSET || d.type == AudioDeviceInfo.TYPE_BLE_SPEAKER)) "bluetooth" else null
      } ?: continue
      val entry = mapOf("type" to type, "name" to (d.productName?.toString() ?: ""))
      if (type != "bluetooth") return entry
      result = entry
    }
    return result
  }

  companion object {
    const val ACTION = "expo.modules.headset.REMOTE"
  }
}
