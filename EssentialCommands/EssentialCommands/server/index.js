var PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')

const BanCommand = require('./commands/BanCommand.js')
const KickCommand = require('./commands/KickCommand.js')
const SaveCommand = require('./commands/SaveCommand.js')
const HealthCommand = require('./commands/HealthCommand.js')

class Main extends PluginBase {

  onLoad () {
    const banCommand = new BanCommand()
    const kickCommand = new KickCommand()
    const saveCommand = new SaveCommand()
    const healthCommand = new HealthCommand()
    Vokkit.getServer().getPluginManager().registerEvent(this, 'PlayerLoginEvent', banCommand.getListener())
    Vokkit.getServer().getCommandManager().getCommandProvider().register(banCommand)
    Vokkit.getServer().getCommandManager().getCommandProvider().register(kickCommand)
    Vokkit.getServer().getCommandManager().getCommandProvider().register(saveCommand)
    Vokkit.getServer().getCommandManager().getCommandProvider().register(healthCommand)
  }
}

module.exports = Main
