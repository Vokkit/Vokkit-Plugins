/// <reference path='../../../../Vokkit-types/index.d.ts' />
// 위 Reference에 대해서는 https://github.com/Vokkit/Vokkit-types을 참고하십시오.

const PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')
const EventPriority = require('../../../src/io/github/Vokkit/event/EventPriority.js')

class Main extends PluginBase {

  onEnable () {
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerLoginEvent', this.onPlayerLogin)
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerMoveEvent', this.onPlayerMove, EventPriority.MONITOR)
  }

  onPlayerLogin (event) {
    if (event.getPlayer().getName().endsWith('_Mobile')) {
      event.setCancelled(true)
      event.setReason('_Mobile로 끝나는 이름을 사용할 수 없습니다.')
      return
    }
    if (event.getPlayer().getType() === 'Mobile') {
      const name = event.getPlayer().getName()
      event.getPlayer().setName(name + '_Mobile')
      event.getPlayer().getSocket().on('VRRotation', function (data) {
        const pcPlayer = Vokkit.getServer().getPlayer(name)
        if (pcPlayer !== null) {
          const location = pcPlayer.getLocation()
          location.setYaw(data.yaw)
          location.setPitch(data.pitch)
          pcPlayer.teleport(location)
        }
      })
    }
  }

  onPlayerMove (event) {
    if (event.getPlayer().getType() === 'PC') {
      const mobilePlayer = Vokkit.getServer().getPlayer(event.getPlayer().getName() + '_Mobile')
      if (mobilePlayer) {
        mobilePlayer.teleport(event.getTo())
      }
    }
  }
}

module.exports = Main
