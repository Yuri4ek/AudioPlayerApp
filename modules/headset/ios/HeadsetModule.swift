import AVFoundation
import ExpoModulesCore
import MediaPlayer

public class HeadsetModule: Module {
  private var routeObserver: NSObjectProtocol?
  private var nextTarget: Any?
  private var prevTarget: Any?

  public func definition() -> ModuleDefinition {
    Name("Headset")

    Events("onRouteChange", "onRemote")

    Function("getRoute") { self.route() }

    OnStartObserving {
      guard self.routeObserver == nil else { return }
      self.routeObserver = NotificationCenter.default.addObserver(
        forName: AVAudioSession.routeChangeNotification, object: nil, queue: .main
      ) { [weak self] _ in
        guard let self else { return }
        self.sendEvent("onRouteChange", self.route())
      }
      let center = MPRemoteCommandCenter.shared()
      center.nextTrackCommand.isEnabled = true
      center.previousTrackCommand.isEnabled = true
      self.nextTarget = center.nextTrackCommand.addTarget { [weak self] _ in
        self?.sendEvent("onRemote", ["action": "next"])
        return .success
      }
      self.prevTarget = center.previousTrackCommand.addTarget { [weak self] _ in
        self?.sendEvent("onRemote", ["action": "previous"])
        return .success
      }
    }

    OnStopObserving {
      if let o = self.routeObserver { NotificationCenter.default.removeObserver(o) }
      self.routeObserver = nil
      let center = MPRemoteCommandCenter.shared()
      if let t = self.nextTarget { center.nextTrackCommand.removeTarget(t) }
      if let t = self.prevTarget { center.previousTrackCommand.removeTarget(t) }
      self.nextTarget = nil
      self.prevTarget = nil
    }
  }

  private func route() -> [String: String] {
    for out in AVAudioSession.sharedInstance().currentRoute.outputs {
      switch out.portType {
      case .headphones: return ["type": "wired", "name": out.portName]
      case .usbAudio: return ["type": "usb", "name": out.portName]
      case .bluetoothA2DP, .bluetoothLE, .bluetoothHFP: return ["type": "bluetooth", "name": out.portName]
      case .airPlay: return ["type": "airplay", "name": out.portName]
      default: continue
      }
    }
    return ["type": "speaker", "name": ""]
  }
}
