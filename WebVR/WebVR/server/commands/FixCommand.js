const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')
const ParameterType = require('../../../../src/io/github/Vokkit/command/parameter/ParameterType.js')

class FixCommand extends Command {
  constructor (fix) {
    super('fix', 'WebVR의 Yaw를 조정합니다.', '/fix <yaw>', [
      [ParameterType.NUMBER]
    ])
    this.fix = fix
  }

  execute (parameterNumber, sender, parameter) {
    if (!sender.getPlayer) {
      sender.sendMessage('이 명령어는 인게임에서만 사용 가능합니다.')
      return
    }
    switch (parameterNumber) {
      case 0:
        let player = sender.getPlayer()
        this.fix[player.getName()] = parameter[0].getValue() / 180 * Math.PI
        sender.sendMessage(parameter[0].getValue() + '도만큼 조정했습니다.')
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }
}

module.exports = FixCommand
