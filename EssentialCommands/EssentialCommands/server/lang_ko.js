const BaseLang = require('./BaseLang.js')

class lang_ko extends BaseLang {
  constructor () {
    super()
    this.data = {
      write_player_name: '플레이어 이름을 작성해 주세요.',
      player_not_exist: '%s 님이 존재하지 않습니다.',
      ban: '당신은 서버에서 영구히 추방당했습니다.'
    }
  }
}

module.exports = lang_ko
