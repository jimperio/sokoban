import boot from './boot'
import levels from './levels'
import createLevelState from './level'


document.addEventListener('DOMContentLoaded', function() {
  const game = new Phaser.Game(
    720,
    640,
    Phaser.AUTO,
    'game',
    null,
    false,
    false
  )

  game.state.add('boot', boot)
  for (let i = 0; i < levels.length; i++) {
    game.state.add(`level_${i + 1}`, createLevelState(levels[i], i + 1, levels.length))
  }
  game.state.start('boot')
})
