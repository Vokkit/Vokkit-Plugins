var PluginBase = require('../../../public/src/io/github/Vokkit/plugin/PluginBase.js')

class Main extends PluginBase {
  onLoad() {
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
        for (let i in displays) {
          if (displays[i].capabilities.canPresent) presentableCount++
        }
        if (presentableCount == 0) {
          alert('WebVR을 지원하나, 사용 가능한 디스플레이가 없습니다.')
          main.webVRSupport = false
        } else {
          alert('WebVR을 지원합니다.')
          for (let i in displays) {
            if (displays[i].capabilities.canPresent) {
              main.display = displays[i]
              Vokkit.getClient().getSceneManager().getRenderer().vr.setDevice(displays[i])
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

  onEnable() {
    const main = this
    this.button.addEventListener('click', function () {
      navigator.getVRDisplays().then(function (displays) {
        for (let i in displays) {
          if (displays[i].capabilities.canPresent) {
            Vokkit.getClient().getSceneManager().getRenderer().vr.enabled = true
            displays[i].requestPresent([{ source: Vokkit.getClient().getSceneManager().getRenderer().domElement }])
          }
        }
      })
    })

    const quaternion = new THREE.Quaternion()
    const zee = new THREE.Vector3(0, 0, 1)
    const euler = new THREE.Euler()
    const q0 = new THREE.Quaternion()
    const q1 = new THREE.Quaternion(- Math.sqrt(0.5), 0, 0, Math.sqrt(0.5))
    let orient = 0
    const object = new THREE.Object3D()
    const socket = Vokkit.getClient().getSocket()
    window.addEventListener('orientationchange', function () {
      orient = window.orientation || 0
    })

    var rotations = []

    window.addEventListener('deviceorientation', function (event) {
      euler.set(event.beta / 180 * Math.PI, event.alpha / 180 * Math.PI, - event.gamma / 180 * Math.PI, 'YXZ') // 'ZXY' for the device, but 'YXZ' for us		
      quaternion.setFromEuler(euler) // orient the device		
      quaternion.multiply(q1) // camera looks out the back of the device, not the top		
      quaternion.multiply(q0.setFromAxisAngle(zee, - orient)) // adjust for screen orientation		
      object.quaternion.copy(quaternion)
      var direction = Vokkit.getClient().getSceneManager().getCamera().getWorldDirection()
      var objectDirection = object.getWorldDirection()
      var pitch = Math.asin(-objectDirection.y)
      var yaw = -Math.atan2(direction.x, direction.z)
      var objectYaw = -Math.atan2(objectDirection.x, objectDirection.z)
      main.pitch = pitch

      var average = 0

      if (rotations.length < 25) rotations.push(yaw - objectYaw)
      else {
        for (var i = 1 ; i < 25 ; i++) {
          rotations[i - 1] = rotations[i]
          if (i == 24) rotations[24] = yaw - objectYaw
        }
      }

      for (var i = 0 ; i < rotations.length ; i++) {
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
        Vokkit.getClient().getSceneManager().getRenderer().vr.enabled = false
        main.basicYaw = null
        rotations = []
      }
    })
  }
}

/**
 * @author mrdoob / http://mrdoob.com
 * @author Mugen87 / https://github.com/Mugen87
 *
 * Based on @tojiro's vr-samples-utils.js
 */
/*
var WEBVR = {

  isAvailable: function () {

    console.warn('WEBVR: isAvailable() is being deprecated. Use .checkAvailability() instead.')
    return navigator.getVRDisplays !== undefined

  },

  checkAvailability: function () {

    return new Promise(function (resolve, reject) {

      if (navigator.getVRDisplays !== undefined) {

        navigator.getVRDisplays().then(function (displays) {

          if (displays.length === 0) {

            reject('WebVR supported, but no VRDisplays found.')

          } else {

            resolve()

          }

        })

      } else {

        reject('Your browser does not support WebVR. See <a href="https://webvr.info">webvr.info</a> for assistance.')

      }

    })

  },

  getVRDisplay: function (onDisplay) {

    if ('getVRDisplays' in navigator) {

      navigator.getVRDisplays()
        .then(function (displays) {
          onDisplay(displays[0])
        })

    }

  },

  getMessage: function () {

    console.warn('WEBVR: getMessage() is being deprecated. Use .getMessageContainer( message ) instead.')

    var message

    if (navigator.getVRDisplays) {

      navigator.getVRDisplays().then(function (displays) {

        if (displays.length === 0) message = 'WebVR supported, but no VRDisplays found.'

      })

    } else {

      message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.'

    }

    if (message !== undefined) {

      var container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '0'
      container.style.top = '0'
      container.style.right = '0'
      container.style.zIndex = '999'
      container.align = 'center'

      var error = document.createElement('div')
      error.style.fontFamily = 'sans-serif'
      error.style.fontSize = '16px'
      error.style.fontStyle = 'normal'
      error.style.lineHeight = '26px'
      error.style.backgroundColor = '#fff'
      error.style.color = '#000'
      error.style.padding = '10px 20px'
      error.style.margin = '50px'
      error.style.display = 'inline-block'
      error.innerHTML = message
      container.appendChild(error)

      return container

    }

  },

  getMessageContainer: function (message) {

    var container = document.createElement('div')
    container.style.position = 'absolute'
    container.style.left = '0'
    container.style.top = '0'
    container.style.right = '0'
    container.style.zIndex = '999'
    container.align = 'center'

    var error = document.createElement('div')
    error.style.fontFamily = 'sans-serif'
    error.style.fontSize = '16px'
    error.style.fontStyle = 'normal'
    error.style.lineHeight = '26px'
    error.style.backgroundColor = '#fff'
    error.style.color = '#000'
    error.style.padding = '10px 20px'
    error.style.margin = '50px'
    error.style.display = 'inline-block'
    error.innerHTML = message
    container.appendChild(error)

    return container

  },

  getButton: function (display, canvas) {

    if ('VREffect' in THREE && display instanceof THREE.VREffect) {

      console.error('WebVR.getButton() now expects a VRDisplay.')
      return document.createElement('button')

    }

    var button = document.createElement('button')
    button.style.position = 'absolute'
    button.style.left = 'calc(50% - 50px)'
    button.style.bottom = '20px'
    button.style.width = '100px'
    button.style.border = '0'
    button.style.padding = '8px'
    button.style.cursor = 'pointer'
    button.style.backgroundColor = '#000'
    button.style.color = '#fff'
    button.style.fontFamily = 'sans-serif'
    button.style.fontSize = '13px'
    button.style.fontStyle = 'normal'
    button.style.textAlign = 'center'
    button.style.zIndex = '999'

    if (display) {

      button.textContent = 'ENTER VR'
      button.onclick = function () {

        display.isPresenting ? display.exitPresent() : display.requestPresent([{ source: canvas }])

      };

      window.addEventListener('vrdisplaypresentchange', function () {

        button.textContent = display.isPresenting ? 'EXIT VR' : 'ENTER VR'

      }, false)

    } else {

      button.textContent = 'NO VR DISPLAY'

    }

    return button

  }

}
*/

module.exports = Main