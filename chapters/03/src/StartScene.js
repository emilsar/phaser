import * as Phaser from 'phaser';

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.add.text(W / 2, H / 2 - 70, 'COIN QUEST', {
      fontSize: '48px', color: '#ffd700', fontFamily: 'monospace', fontStyle: 'bold'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 - 20, 'collect every coin   ·   avoid the red enemy', {
      fontSize: '14px', color: '#aaaacc', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(W / 2, H / 2 + 40, 'press SPACE to start', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.add.text(W / 2, H - 30, '← → to move   ↑ or Space to jump', {
      fontSize: '13px', color: '#777799', fontFamily: 'monospace'
    }).setOrigin(0.5);

    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.scene.start('GameScene');
    }
  }
}
