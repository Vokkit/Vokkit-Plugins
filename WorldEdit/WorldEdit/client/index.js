const PluginBase = require('../../../public/src/plugin/PluginBase.js')

function makeMesh(pos1, pos2) {
  const resultGeometry = new THREE.Geometry()
  const resultMaterial = new THREE.MeshBasicMaterial({
    color: 0x00ff00
  })
  const resultMesh = new THREE.Mesh(resultGeometry, resultMaterial)

  let geometry, mesh

  const x = pos2[0] - pos1[0] + 1
  const y = pos2[1] - pos1[1] + 1
  const z = pos2[2] - pos1[2] + 1

  const lineWidth = 2 / 16

  geometry = new THREE.BoxGeometry(x, lineWidth, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x / 2, 0, 0)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(x, lineWidth, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x / 2, y, 0)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(x, lineWidth, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x / 2, 0, z)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(x, lineWidth, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x / 2, y, z)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, y, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(0, y / 2, 0)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, y, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x, y / 2, 0)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, y, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(0, y / 2, z)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, y, lineWidth)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x, y / 2, z)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, lineWidth, z)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(0, 0, z / 2)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, lineWidth, z)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x, 0, z / 2)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, lineWidth, z)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(0, y, z / 2)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  geometry = new THREE.BoxGeometry(lineWidth, lineWidth, z)
  mesh = new THREE.Mesh(geometry)
  mesh.position.set(x, y, z / 2)
  mesh.updateMatrix()
  resultGeometry.merge(geometry, mesh.matrix)

  resultMesh.position.set(pos1[0], pos1[1], pos1[2])
  return resultMesh
}

class Main extends PluginBase {
  onLoad () {
    this.posMesh = []
    Vokkit.getClient().getSocket().on('addMesh', (data) => {
      const pos1 = []
      const pos2 = []
      for (let i = 0; i < 3; i++) {
        if (data.pos1[i] > data.pos2[i]) {
          pos1[i] = data.pos2[i]
          pos2[i] = data.pos1[i]
        } else {
          pos1[i] = data.pos1[i]
          pos2[i] = data.pos2[i]
        }
      }
      if (this.posMesh[data.id]) Vokkit.getClient().getScreenManager().getScreen('MainScreen').getGroup().remove(this.posMesh[data.id])
      this.posMesh[data.id] = makeMesh(pos1, pos2)
      Vokkit.getClient().getScreenManager().getScreen('MainScreen').getGroup().add(this.posMesh[data.id])
    })
  }
}

module.exports = Main
