import Map from './map'


const TILE_SIZE = 64

const levelImages = {
  '#': 'wall',
  '.': 'target',
  '*': 'target',
  '+': 'target',
}

const objectImages = {
  '@': 'player',
  '+': 'player',
  '$': 'crate',
  '*': 'crate_on_target',
}


const createLevelState = (level, levelNumber, maxLevels) => ({

  preload() {
    this.load.image('ground', 'images/ground.png')
    this.load.image('wall', 'images/wall.png')
    this.load.image('target', 'images/target.png')
    this.load.image('player', 'images/char.png')
    this.load.image('crate', 'images/crate.png')
    this.load.image('crate_on_target', 'images/crate_on_target.png')
  },

  create() {
    this.levelNumber = levelNumber
    this.maxLevels = maxLevels

    this.add.tileSprite(0, 0, this.world.width, this.world.height, 'ground')
    this.label = this.add.text(40, this.world.height - 40,
      `Minicosmos Sokoban: Level ${levelNumber}/${maxLevels} | [R]eset | [N]ext level | [P]revious level`,
      { font: '20px Arial' })

    this.map = new Map(level)
    this.objects = []
    this.calculateOffsets()
    this.renderLevel()
    this.renderObjects()

    this.input.keyboard.onDownCallback = this.onKeyDown.bind(this)
    this.input.keyboard.addKeyCapture(this.input.keyboard.createCursorKeys())
  },

  calculateOffsets() {
    const mapArray = this.map.toArray()

    let maxWidth = 0
    mapArray.forEach(row => { if (row.length > maxWidth) maxWidth = row.length })
    const levelWidth = maxWidth * TILE_SIZE
    const levelHeight = mapArray.length * TILE_SIZE

    this.xOffset = (this.world.width - levelWidth) / 2
    this.yOffset = (this.world.height - levelHeight) / 2 - 20
  },

  onKeyDown(e) {
    let dx = 0, dy = 0
    switch (e.keyCode) {
      case Phaser.Keyboard.LEFT:
        dx = -1
        break
      case Phaser.Keyboard.RIGHT:
        dx = 1
        break
      case Phaser.Keyboard.UP:
        dy = -1
        break
      case Phaser.Keyboard.DOWN:
        dy = 1
        break
      case Phaser.Keyboard.R:
        this.map.init()
        this.renderObjects()
        break
      case Phaser.Keyboard.N:
        this.startNextLevel()
        break
      case Phaser.Keyboard.P:
        this.startPreviousLevel()
        break
    }
    if (this.map.movePlayer({ dx, dy })) {
      this.renderObjects()
    }
    if (this.map.isCompleted()) {
      this.startNextLevel()
    }
  },

  startNextLevel() {
    const nextLevel = this.levelNumber + 1
    if (nextLevel <= this.maxLevels) {
      this.game.state.start(`level_${nextLevel}`)
    }
  },

  startPreviousLevel() {
    const prevLevel = this.levelNumber - 1
    if (prevLevel > 0) {
      this.game.state.start(`level_${prevLevel}`)
    }
  },

  renderLevel() {
    this.renderChars(levelImages)
  },

  renderObjects() {
    this.objects.map(o => o.kill())
    this.objects = this.renderChars(objectImages)
  },

  renderChars(imageNames) {
    const mapArray = this.map.toArray()
    const rendered = []
    for (let i = 0; i < mapArray.length; i++) {
      const row = mapArray[i]
      for (let j = 0; j < row.length; j++) {
        const char = row[j]
        const imageName = imageNames[char]
        if (imageName) {
          let x = j*TILE_SIZE + this.xOffset
          let y = i*TILE_SIZE + this.yOffset
          rendered.push(this.add.image(x, y, imageName))
        }
      }
    }
    return rendered
  },
})

export default createLevelState
