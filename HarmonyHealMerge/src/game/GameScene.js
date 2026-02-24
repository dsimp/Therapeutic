import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.gridSize = 6;
    this.tileSize = 60;
    this.startY = 100;
    this.startX = 20; // 60x6 = 360, leaves 20px padding on each side for a 400px width
    this.grid = [];
    this.score = 0;
  }

  preload() {
    // Generate placeholder graphics since we don't have images yet
    const graphics = this.add.graphics();
    
    // Remedies placeholders
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(30, 30, 25);
    graphics.generateTexture('beet', 60, 60);
    graphics.clear();
    
    graphics.fillStyle(0xdddddd, 1);
    graphics.fillCircle(30, 30, 25);
    graphics.generateTexture('garlic', 60, 60);
    graphics.clear();

    graphics.fillStyle(0xffff00, 1);
    graphics.fillCircle(30, 30, 25);
    graphics.generateTexture('banana', 60, 60);
    graphics.clear();

    // Afflictions placeholders (Clouds)
    graphics.fillStyle(0x000000, 0.5);
    graphics.fillRoundedRect(5, 15, 50, 30, 10);
    graphics.generateTexture('poor_circulation', 60, 60);
    graphics.clear();

    graphics.fillStyle(0x0000aa, 0.5);
    graphics.fillRoundedRect(5, 15, 50, 30, 10);
    graphics.generateTexture('fatigue', 60, 60);
    graphics.clear();
  }

  create() {
    this.cameras.main.setBackgroundColor('#f0f8ff'); // Zen Alice Blue background
    
    // Create Grid array setup
    for (let r = 0; r < this.gridSize; r++) {
      this.grid[r] = [];
      for (let c = 0; c < this.gridSize; c++) {
        this.grid[r][c] = null;
        // Background slots
        this.add.rectangle(
          this.startX + c * this.tileSize + this.tileSize / 2,
          this.startY + r * this.tileSize + this.tileSize / 2,
          this.tileSize - 4,
          this.tileSize - 4,
          0xffffff,
          0.5
        ).setStrokeStyle(2, 0xdddddd);
      }
    }

    // Input listeners
    this.input.on('pointerdown', this.onPointerDown, this);
    this.input.on('pointermove', this.onPointerMove, this);
    this.input.on('pointerup', this.onPointerUp, this);

    this.spawnAffliction();
    this.spawnAffliction();
    
    // We send an event to React Native via standard custom event logic or direct bridge if using WebView
    // Here we'll just log
  }

  spawnAffliction() {
    const col = Phaser.Math.Between(0, this.gridSize - 1);
    const row = Phaser.Math.Between(0, 2); // spawn in top half
    if (!this.grid[row][col]) {
      const type = Phaser.Math.Between(0, 1) === 0 ? 'poor_circulation' : 'fatigue';
      const sprite = this.add.sprite(
        this.startX + col * this.tileSize + this.tileSize / 2,
        this.startY + row * this.tileSize + this.tileSize / 2,
        type
      );
      sprite.entityType = 'affliction';
      sprite.id = type;
      this.grid[row][col] = sprite;
    }
  }

  spawnRemedyAtBottom() {
      // In a real flow, players select remedies from the bottom.
      // We'll mimic dragging by having the pointer create one for now if tapping below grid
  }

  onPointerDown(pointer) {
    if (pointer.y > this.startY + this.gridSize * this.tileSize) {
      // Tap below the grid, create a drag item
      const type = Phaser.Math.Between(0, 2);
      const types = ['beet', 'garlic', 'banana'];
      this.dragItem = this.add.sprite(pointer.x, pointer.y, types[type]);
      this.dragItem.id = types[type];
      this.dragItem.entityType = 'remedy';
    }
  }

  onPointerMove(pointer) {
    if (this.dragItem) {
      this.dragItem.x = pointer.x;
      this.dragItem.y = pointer.y;
    }
  }

  onPointerUp(pointer) {
    if (this.dragItem) {
      // Did it drop on a grid cell?
      if (pointer.x >= this.startX && pointer.x <= this.startX + this.gridSize * this.tileSize &&
          pointer.y >= this.startY && pointer.y <= this.startY + this.gridSize * this.tileSize) {
          
          const col = Math.floor((pointer.x - this.startX) / this.tileSize);
          const row = Math.floor((pointer.y - this.startY) / this.tileSize);
          
          const target = this.grid[row][col];
          if (target && target.entityType === 'affliction') {
             this.checkHeal(this.dragItem, target, row, col);
          } else {
             // Drop it there if empty
             if (!target) {
                 this.dragItem.x = this.startX + col * this.tileSize + this.tileSize / 2;
                 this.dragItem.y = this.startY + row * this.tileSize + this.tileSize / 2;
                 this.grid[row][col] = this.dragItem;
                 this.dragItem = null;
                 this.checkMerge(row, col);
             } else {
                 this.dragItem.destroy(); // Failed drop
             }
          }
      } else {
          this.dragItem.destroy(); // Dropped outside
      }
      this.dragItem = null;
    }
  }

  checkHeal(remedy, affliction, row, col) {
      // Logic from remedies.json goes here
      // Hardcoded simple check for now: beet heals poor_circulation, banana heals fatigue
      let heals = false;
      if (remedy.id === 'beet' || remedy.id === 'garlic') heals = (affliction.id === 'poor_circulation');
      if (remedy.id === 'banana') heals = (affliction.id === 'fatigue');

      if (heals) {
          // Heal Burst Effect
          this.createHealBurst(affliction.x, affliction.y);
          
          affliction.destroy();
          remedy.destroy();
          this.grid[row][col] = null;
          this.score += 150;
          
          // Communicate score to React Native!
          // window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'SCORE', value: this.score }));
          
          this.cameras.main.shake(100, 0.01);
      } else {
          // Bounce off
          this.tweens.add({
              targets: remedy,
              y: remedy.y + 50,
              alpha: 0,
              duration: 300,
              onComplete: () => remedy.destroy()
          });
      }
  }

  checkMerge(row, col) {
      // In modern merge games, dropping a beet next to a beet merges them into a Super Beet
      // For this prototype, we'll leave this as a stub
  }

  createHealBurst(x, y) {
      const circle = this.add.circle(x, y, 10, 0x00ff00);
      this.tweens.add({
          targets: circle,
          scale: 5,
          alpha: 0,
          duration: 400,
          onComplete: () => circle.destroy()
      });
  }

  update() {
    // Keep game loop running
  }
}
