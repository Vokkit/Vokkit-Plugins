const BaseLang = require('./BaseLang.js')

class Lang extends BaseLang{
  constructor(language) {
    super()
    if (language === 'ko') {
      this.data = {
        kick: '서버 관리자가 당신을 추방했습니다. 이유: %s',
        ban: '서버 관리자가 당신을 영구히 추방했습니다. 이유: %s'
      }
    } else {
      this.data = {
        kick: 'Server admin kicked you. Reason: %s',
        ban: 'Server admin banned you. Reason: %s'
      }
    }
  }
}

module.exports = Lang