var PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')

const BanCommand = require('./commands/BanCommand.js')
const KickCommand = require('./commands/KickCommand.js')

class Main extends PluginBase{
  onLoad() {
    let banCommand = new BanCommand()
    let kickCommand = new KickCommand()
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerLoginEvent', banCommand.getListener())
    Vokkit.getServer().getSocketManager().getCommandManager().getCommandProvider().register(banCommand)
    Vokkit.getServer().getSocketManager().getCommandManager().getCommandProvider().register(kickCommand)
  }
}

module.exports = Main