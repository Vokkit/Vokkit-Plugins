const BaseLang = require('./BaseLang.js')

class lang_en extends BaseLang {
  constructor () {
    super()
    this.data = {
      write_player_name: 'Please write player name.',
      player_not_exist: 'Player %s does not exist.',
      ban: 'You were banned from this server.'
    }
  }
}

module.exports = lang_en
