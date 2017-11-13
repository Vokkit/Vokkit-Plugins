const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')

class SaveCommand extends Command {
  constructor () {
    super('save', '월드를 저장합니다.', '/save', [
      []
    ])
  }

  execute (parameterNumber, sender, parameter) {
    switch (parameterNumber) {
      case 0:
        const worlds = Vokkit.getServer().getWorlds()
        for (const i in worlds) {
          worlds[i].saveWorld()
        }
        Vokkit.getServer().getLogger().info('월드를 저장했습니다.')
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }
}

module.exports = SaveCommand
