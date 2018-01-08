const PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')
const EventPriority = require('../../../src/io/github/Vokkit/event/EventPriority.js')
const FixCommand = require('./commands/FixCommand')

const fix = []

class Main extends PluginBase {

  onEnable () {
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerLoginEvent', this.onPlayerLogin)
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerMoveEvent', this.onPlayerMove, EventPriority.MONITOR)
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new FixCommand(fix))
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
      event.getPlayer().getSocket().on('VRRotation', (data) => {
        const pcPlayer = Vokkit.getServer().getPlayer(name)
        if (pcPlayer !== null) {
          if (!fix[pcPlayer.getName()]) fix[pcPlayer.getName()] = 0
          const location = pcPlayer.getLocation()
          location.setYaw(fix[pcPlayer.getName()] + data.yaw)
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
