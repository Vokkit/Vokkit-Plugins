var PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')

const BanCommand = require('./commands/BanCommand.js')
const KickCommand = require('./commands/KickCommand.js')
const SaveCommand = require('./commands/SaveCommand.js')

class Main extends PluginBase {
  onLoad () {
    const banCommand = new BanCommand()
    const kickCommand = new KickCommand()
    const saveCommand = new SaveCommand()
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerLoginEvent', banCommand.getListener())
    Vokkit.getServer().getSocketManager().getCommandManager().getCommandProvider().register(banCommand)
    Vokkit.getServer().getSocketManager().getCommandManager().getCommandProvider().register(kickCommand)
    Vokkit.getServer().getSocketManager().getCommandManager().getCommandProvider().register(saveCommand)
  }
}

module.exports = Main
