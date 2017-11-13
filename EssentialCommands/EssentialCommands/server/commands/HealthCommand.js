const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')
const ParameterType = require('../../../../src/io/github/Vokkit/command/parameter/ParameterType.js')

class HealthCommand extends Command {
  constructor () {
    super('health', '플레이어의 체력을 설정합니다.', '/health <Player> <health>', [
      [ParameterType.PLAYER, ParameterType.NUMBER]
    ])
  }

  execute (parameterNumber, sender, parameter) {
    let player
    switch (parameterNumber) {
      case 0:
        player = parameter[0].getValue()
        player.setHealth(parseInt(parameter[1].getValue()))
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }
}

module.exports = HealthCommand
