const BaseLang = require('./BaseLang.js')

class English extends BaseLang {
  constructor () {
    super()
    this.data = {
      write_player_name: 'Please write player name.',
      player_not_exist: 'Player %s does not exist.',
      ban: 'You were banned from this server.'
    }
  }
}

module.exports = English
