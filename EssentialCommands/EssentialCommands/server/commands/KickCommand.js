const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')
const ParameterType = require('../../../../src/io/github/Vokkit/command/parameter/ParameterType.js')

class KickCommand extends Command {
  constructor () {
    super('kick', '플레이어를 추방합니다.', '/kick <Player>', [
      [ParameterType.PLAYER],
      [ParameterType.PLAYER, ParameterType.STRING]
    ])
  }

  execute (parameterNumber, sender, parameter) {
    let player
    switch (parameterNumber) {
      case 0:
        player = parameter[0].getValue()
        player.getSocket().emit('kick', {})
        break
      case 1:
        player = parameter[0].getValue()
        let message = parameter[1].getValue()

        player.getSocket().emit('kick', {
          reason: message
        })
        Vokkit.getServer().getLogger().info('kick')
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }
}

module.exports = KickCommand
