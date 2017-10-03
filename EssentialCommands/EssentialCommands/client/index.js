var PluginBase = require('../../../public/src/io/github/Vokkit/plugin/PluginBase.js')

const lang = new (require('./Lang.js'))(navigator.language)

class Main extends PluginBase{
  onLoad() {
    Vokkit.getClient().getSocket().on('kick', function(data) {
      alert(lang.format('kick', [data.reason]))
      location.reload()
    })

    Vokkit.getClient().getSocket().on('ban', function(data) {
      alert(lang.format('ban', [data.reason]))
      location.reload()
    })
  }
}

module.exports = Main