import * as Phaser from 'phaser';
import StartScene    from './StartScene.js';
import GameScene     from './GameScene.js';
import GameOverScene from './GameOverScene.js';

const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 500,
  backgroundColor: '#040434',
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 600 }, debug: false }
  },
  scene: [StartScene, GameScene, GameOverScene]
};

new Phaser.Game(config);
