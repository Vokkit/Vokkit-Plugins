const PluginBase = require('../../../src/io/github/Vokkit/plugin/PluginBase.js')
const BoxCommand = require('./commands/BoxCommand')
const CutCommand = require('./commands/CutCommand')
const HSphereCommand = require('./commands/HSphereCommand')
const PosCommand = require('./commands/PosCommand')
const SetCommand = require('./commands/SetCommand')
const SphereCommand = require('./commands/SphereCommand')
const WallCommand = require('./commands/WallCommand')

class Main extends PluginBase {
  onLoad () {
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new BoxCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new CutCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new HSphereCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new PosCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new SetCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new SphereCommand(this))
    Vokkit.getServer().getCommandManager().getCommandProvider().register(new WallCommand(this))
  }
}

module.exports = Main
