import * as Phaser from 'phaser';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.won   = data.won;
    this.score = data.score;
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    const message = this.won ? 'You Win!'  : 'Game Over';
    const color   = this.won ? 0x2e7d32    : 0xb71c1c;

    this.add.rectangle(W / 2, H / 2, W, H, 0x000000, 0.55);

    this.add.rectangle(W / 2, H / 2 - 20, 360, 90, color, 1);
    this.add.text(W / 2, H / 2 - 28, message, {
      fontSize: '32px', color: '#ffffff', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);
    this.add.text(W / 2, H / 2 + 2, 'Final score: ' + this.score + ' / 5', {
      fontSize: '14px', color: '#eeeeee', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 60, 'SPACE to play again   ·   M for menu', {
      fontSize: '14px', color: '#cccccc', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.mKey     = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('GameScene');
    } else if (Phaser.Input.Keyboard.JustDown(this.mKey)) {
      this.scene.start('StartScene');
    }
  }
}
