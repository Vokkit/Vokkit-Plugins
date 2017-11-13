const PluginBase = require('../../../public/src/plugin/PluginBase.js')

class Main extends PluginBase {
  onLoad () {
    this.button = document.createElement('button')
    this.button.style.position = 'absolute'
    this.button.style.left = 'calc(50% - 50px)'
    this.button.style.bottom = '20px'
    this.button.style.width = '100px'
    this.button.style.border = '0'
    this.button.style.padding = '8px'
    this.button.style.cursor = 'pointer'
    this.button.style.backgroundColor = '#000'
    this.button.style.color = '#fff'
    this.button.style.fontFamily = 'sans-serif'
    this.button.style.fontSize = '13px'
    this.button.style.fontStyle = 'normal'
    this.button.style.textAlign = 'center'
    this.button.style.zIndex = '999'
    this.button.id = 'WebVRButton'

    const main = this

    if (navigator.getVRDisplays !== undefined) {
      navigator.getVRDisplays().then(function (displays) {
        let presentableCount = 0
        for (const i in displays) {
          if (displays[i].capabilities.canPresent) presentableCount++
        }
        if (presentableCount === 0) {
          alert('WebVR을 지원하나, 사용 가능한 디스플레이가 없습니다.')
          main.webVRSupport = false
        } else {
          alert('WebVR을 지원합니다.')
          for (let i in displays) {
            if (displays[i].capabilities.canPresent) {
              main.display = displays[i]
              Vokkit.getClient().getScreenManager().getScreen('MainScreen').getRenderer().vr.setDevice(displays[i])
            }
          }
          main.webVRSupport = true
          main.button.innerText = 'Enter VR'
          document.body.appendChild(main.button)
        }
      })
    } else {
      alert('WebVR을 지원하지 않는 브라우저입니다.')
      main.webVRSupport = false
    }
  }

  onEnable () {
    const main = this
    this.button.addEventListener('click', function () {
      navigator.getVRDisplays().then(function (displays) {
        for (let i in displays) {
          if (displays[i].capabilities.canPresent) {
            Vokkit.getClient().getScreenManager().getScreen('MainScreen').getRenderer().vr.enabled = true
            displays[i].requestPresent([{ source: Vokkit.getClient().getScreenManager().getScreen('MainScreen').getRenderer().domElement }])
          }
        }
      })
    })

    const quaternion = new THREE.Quaternion()
    const zee = new THREE.Vector3(0, 0, 1)
    const euler = new THREE.Euler()
    const q0 = new THREE.Quaternion()
    const q1 = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))
    let orient = 0
    const object = new THREE.Object3D()
    const socket = Vokkit.getClient().getSocket()
    window.addEventListener('orientationchange', function () {
      orient = window.orientation || 0
    })

    const rotations = []

    window.addEventListener('deviceorientation', function (event) {
      euler.set(event.beta / 180 * Math.PI, event.alpha / 180 * Math.PI, -event.gamma / 180 * Math.PI, 'YXZ')
      quaternion.setFromEuler(euler)
      quaternion.multiply(q1)
      quaternion.multiply(q0.setFromAxisAngle(zee, -orient))
      object.quaternion.copy(quaternion)
      const direction = Vokkit.getClient().getScreenManager().getScreen('MainScreen').getCamera().getWorldDirection()
      const objectDirection = object.getWorldDirection()
      const pitch = Math.asin(-objectDirection.y)
      const yaw = -Math.atan2(direction.x, direction.z)
      const objectYaw = -Math.atan2(objectDirection.x, objectDirection.z)
      main.pitch = pitch

      let average = 0

      if (rotations.length < 25) rotations.push(yaw - objectYaw)
      else {
        for (let i = 1; i < 25; i++) {
          rotations[i - 1] = rotations[i]
          if (i === 24) rotations[24] = yaw - objectYaw
        }
      }

      for (let i = 0; i < rotations.length; i++) {
        average += rotations[i]
      }
      average /= rotations.length

      main.yaw = objectYaw + average

      if (main.display !== undefined && main.display.isPresenting) {
        socket.emit('VRRotation', {
          yaw: main.yaw,
          pitch: main.pitch
        })
      }
    }, true)

    window.addEventListener('vrdisplaypresentchange', function () {
      if (main.display === undefined || !main.display.isPresenting) {
        Vokkit.getClient().getScreenManager().getScreen('MainScreen').getRenderer().vr.enabled = false
        main.basicYaw = null
        rotations.splice(0, rotations.length)
      }
    })
  }
}

module.exports = Main
