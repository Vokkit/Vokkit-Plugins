class BaseLang {
  constructor () {
    this.data = {}
  }

  format (key, args = []) {
    var ans = this.data[key]
    for (var i in args) {
      ans = ans.replace('%s', args[i])
    }
    return ans
  }
}

module.exports = BaseLang
