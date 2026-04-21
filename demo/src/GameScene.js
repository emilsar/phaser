import * as Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }

  // ── create ───────────────────────────────────────────────────────────────
  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    this.genRect('ground',    W,   32, 0x4caf50);
    this.genRect('platform',  160, 18, 0x8b6914);
    this.genRect('plat_sm',   120, 18, 0x8b6914);
    this.genRect('player',    32,  48, 0x5c9ded);
    this.genCircle('coin',    10,      0xffd700);

    const ground = this.physics.add.staticImage(W / 2, H - 16, 'ground');

    this.platforms = this.physics.add.staticGroup();
    this.platforms.create(200, 350, 'platform');
    this.platforms.create(500, 250, 'platform');
    this.platforms.create(350, 160, 'plat_sm');

    this.player = this.physics.add.sprite(100, H - 80, 'player');
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, ground);
    this.physics.add.collider(this.player, this.platforms);

    this.coins = this.physics.add.staticGroup();
    this.coins.create(150,  H - 60, 'coin');
    this.coins.create(480,  H - 60, 'coin');
    this.coins.create(200,  320,    'coin');
    this.coins.create(500,  220,    'coin');
    this.coins.create(350,  130,    'coin');

    this.physics.add.overlap(this.player, this.coins, (_player, coin) => {
      coin.destroy();
      this.score++;
      this.scoreText.setText('Score: ' + this.score);
    });

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px', color: '#ffffff', fontFamily: 'monospace'
    }).setDepth(1);

    this.add.text(W / 2, 16, '← → to move   ↑ or Space to jump', {
      fontSize: '13px', color: '#aaaacc', fontFamily: 'monospace'
    }).setOrigin(0.5, 0).setDepth(1);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump:  Phaser.Input.Keyboard.KeyCodes.W
    });

    // Tunable parameters — adjusted at runtime via postMessage from the book page
    this.jumpVelocity = 550;
    this.moveSpeed    = 220;
    this.playerW      = 32;
    this.playerH      = 48;
    this.coinRadius   = 10;

    this._boundOnParam = this._onParam.bind(this);
    window.addEventListener('message', this._boundOnParam);
  }

  // ── update ────────────────────────────────────────────────────────────────
  update() {
    const body    = this.player.body;
    const onFloor = body.blocked.down;

    const left  = this.cursors.left.isDown  || this.wasd.left.isDown;
    const right = this.cursors.right.isDown || this.wasd.right.isDown;
    const jump  = Phaser.Input.Keyboard.JustDown(this.cursors.up)
               || Phaser.Input.Keyboard.JustDown(this.cursors.space)
               || Phaser.Input.Keyboard.JustDown(this.wasd.jump);

    if (left)       body.setVelocityX(-this.moveSpeed);
    else if (right) body.setVelocityX(this.moveSpeed);
    else            body.setVelocityX(0);

    if (jump && onFloor) body.setVelocityY(-this.jumpVelocity);
  }

  // ── postMessage handler ───────────────────────────────────────────────────
  _onParam(event) {
    const { param, value } = event.data || {};
    if (param === 'gravity') {
      this.physics.world.gravity.y = value;
    } else if (param === 'jumpVelocity') {
      this.jumpVelocity = value;
    } else if (param === 'moveSpeed') {
      this.moveSpeed = value;
    } else if (param === 'playerW' || param === 'playerH') {
      if (param === 'playerW') this.playerW = value;
      else this.playerH = value;
      this.player.setDisplaySize(this.playerW, this.playerH);
      this.player.body.setSize(this.playerW, this.playerH);
    } else if (param === 'coinRadius') {
      this.coinRadius = value;
      const d = value * 2;
      this.coins.getChildren().forEach(coin => {
        coin.setDisplaySize(d, d);
        coin.refreshBody();
      });
    }
  }

  // ── remove listener when scene shuts down ────────────────────────────────
  shutdown() {
    window.removeEventListener('message', this._boundOnParam);
  }

  // ── helpers ───────────────────────────────────────────────────────────────
  genRect(key, w, h, color) {
    const g = this.make.graphics({ add: false });
    g.fillStyle(color);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  genCircle(key, radius, color) {
    const size = radius * 2;
    const g = this.make.graphics({ add: false });
    g.fillStyle(color);
    g.fillCircle(radius, radius, radius);
    g.generateTexture(key, size, size);
    g.destroy();
  }
}
