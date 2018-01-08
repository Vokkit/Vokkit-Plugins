const Command = require('../../../../src/io/github/Vokkit/command/commands/Command.js')
const ParameterType = require('../../../../src/io/github/Vokkit/command/parameter/ParameterType.js')
const Block = require('../../../../src/io/github/Vokkit/block/Block')

class HSphereCommand extends Command {
  constructor (main) {
    super('hsphere', '설정된 구간에 빈 구를 생성합니다.', '/hsphere <id>', [
      [ParameterType.NUMBER]
    ])
    this.main = main
  }

  execute (parameterNumber, sender, parameter) {
    if (!sender.getPlayer) {
      sender.sendMessage('이 명령어는 인게임에서만 사용 가능합니다.')
      return
    }
    const player = sender.getPlayer()
    const id = parameter[0].getValue()
    switch (parameterNumber) {
      case 0:
        if (!this.main.pos[player.getId()] || !this.main.pos[player.getId()][0]) {
          sender.sendMessage('지점 1을 설정해 주세요.')
          return
        }
        if (!this.main.pos[player.getId()][1]) {
          sender.sendMessage('지점 2를 설정해 주세요.')
          return
        }
        if (!this.main.pos[player.getId()][0].getWorld().equals(this.main.pos[player.getId()][1].getWorld())) {
          sender.sendMessage('두 지점은 같은 월드에 있어야 합니다.')
          return
        }
        const world = this.main.pos[player.getId()][0].getWorld()
        const pos1 = this.main.pos[player.getId()][0]
        const pos2 = this.main.pos[player.getId()][1]
        const rpos1 = []
        const rpos2 = []
        if (pos1.x > pos2.x) {
          rpos1[0] = pos2.x
          rpos2[0] = pos1.x
        } else {
          rpos1[0] = pos1.x
          rpos2[0] = pos2.x
        }

        if (pos1.y > pos2.y) {
          rpos1[1] = pos2.y
          rpos2[1] = pos1.y
        } else {
          rpos1[1] = pos1.y
          rpos2[1] = pos2.y
        }

        if (pos1.z > pos2.z) {
          rpos1[2] = pos2.z
          rpos2[2] = pos1.z
        } else {
          rpos1[2] = pos1.z
          rpos2[2] = pos2.z
        }

        let count = 0

        for (let x = rpos1[0]; x <= rpos2[0]; x++) {
          for (let y = rpos1[1]; y <= rpos2[1]; y++) {
            for (let z = rpos1[2]; z <= rpos2[2]; z++) {
              const xRadius = (rpos2[0] - rpos1[0]) / 2
              const yRadius = (rpos2[1] - rpos1[1]) / 2
              const zRadius = (rpos2[2] - rpos1[2]) / 2
              const result = (Math.pow(x - rpos1[0] - xRadius, 2) / Math.pow(xRadius, 2) + Math.pow(y - rpos1[1] - yRadius, 2) / Math.pow(yRadius, 2) + Math.pow(z - rpos1[2] - zRadius, 2) / Math.pow(zRadius, 2))
              const result2 = (Math.pow(x - rpos1[0] - xRadius, 2) / Math.pow(xRadius - 1, 2) + Math.pow(y - rpos1[1] - yRadius, 2) / Math.pow(yRadius - 1, 2) + Math.pow(z - rpos1[2] - zRadius, 2) / Math.pow(zRadius - 1, 2))
              if (result <= 1 && result2 >= 1) {
                world.setBlock(new Block(new THREE.Vector3(x, y, z), id))
                count++
              }
            }
          }
        }
        sender.sendMessage(`${count}개의 블럭을 변경했습니다.`)
        break
      default:
        sender.sendMessage(this.getUsage())
        break
    }
  }
}

module.exports = HSphereCommand
