
export default class Map {
  constructor(level) {
    this._level = level
    this.init()
  }
  init() {
    this._map = trimNewlines(this._level).split('\n').map(row => row.split(''))
    this._playerPos = this.findPlayer()
  }
  toArray() {
    return this._map.slice()
  }
  findPlayer() {
    let x = -1,
      y = -1
    for (let i = 0; i < this._map.length; i++) {
      let index = this._map[i].indexOf('@')
      if (index === -1) {
        index = this._map[i].indexOf('+')
      }
      if (index > -1) {
        x = index
        y = i
        break
      }
    }
    return { x, y }
  }
  movePlayer({ dx, dy }) {
    const { x, y } = this._playerPos

    const currentTile = this._map[y][x]
    const nextX = x + dx
    const nextY = y + dy
    const nextTile = this._map[nextY][nextX]
    const aheadX = nextX + dx
    const aheadY = nextY + dy
    const aheadTile = this._map[aheadY][aheadX]

    let moved = false, pushed = false

    if (nextTile === ' ' || nextTile === '.') {
      moved = true
    } else if (nextTile === '$' || nextTile === '*') {
      if (aheadTile === ' ' || aheadTile === '.') {
        moved = true
        pushed = true
      }
    }

    if (moved) {
      this._playerPos = { x: nextX, y: nextY }
      this._map[y][x] = currentTile === '+' ? '.' : ' '
      this._map[nextY][nextX] = (nextTile === '*' || nextTile === '.') ? '+' : '@'
      if (pushed) {
        this._map[aheadY][aheadX] = aheadTile === ' ' ? '$' : '*'
      }
    }

    return moved
  }
  isCompleted() {
    return !this._map.some(row => row.includes('$'))
  }
}

const trimNewlines = s => {
  let trimmed = s.slice()
  while (trimmed.startsWith('\n')) {
    trimmed = trimmed.slice(1)
  }
  while (trimmed.endsWith('\n')) {
    trimmed = trimmed.slice(0, -1)
  }
  return trimmed
}
