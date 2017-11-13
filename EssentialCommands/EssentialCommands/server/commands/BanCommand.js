const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')
const ParameterType = require('../../../../src/io/github/Vokkit/command/parameter/ParameterType.js')

const fs = require('fs')
const path = require('path')

let bannedPlayers = []
const banPath = path.resolve('') + '\\ban.txt'

// Vokkit에 언어 관련 설정이 없으므로 한국어로 고정합니다.
const lang = new (require('../lang_ko.js'))()

class BanCommand extends Command {
  constructor () {
    super('ban', '플레이어를 영구히 추방합니다.', '/ban <Player>', [
      [ParameterType.PLAYER],
      [ParameterType.PLAYER, ParameterType.STRING]
    ])
    bannedPlayers = fs.readFileSync(banPath).toString().split('\n')
  }

  execute (parameterNumber, sender, parameter) {
    let player
    switch (parameterNumber) {
      case 0:
        player = parameter[0].getValue()

        player.getSocket().emit('ban', {})
        bannedPlayers.push(player.getAddress())
        fs.writeFileSync(banPath, bannedPlayers.join('\n'))
        break
      case 1:
        player = parameter[0].getValue()
        let message = parameter[1].getValue()

        player.getSocket().emit('ban', {
          reason: message
        })
        bannedPlayers.push(player.getAddress())
        fs.writeFileSync(banPath, bannedPlayers.join('\n'))
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }

  getListener () {
    return (event) => {
      var address = event.getAddress()
      if (bannedPlayers.indexOf(address) !== -1) {
        event.getPlayer().getSocket().emit('kick', {
          reason: lang.format('ban')
        })
      }
    }
  }
}

module.exports = BanCommand
