import { avatarImage } from './avatarImage';
import { beetrootImage } from './beetrootImage';
import { chamomileImage } from './chamomileImage';
import { gingerImage } from './gingerImage';
import { garlicImage } from './garlicImage';
import { spinachImage } from './spinachImage';
import { lavenderImage } from './lavenderImage';
import { citrusImage } from './citrusImage';

const gameHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <style>
    body { margin: 0; padding: 0; background-color: #0b132b; overflow: hidden; touch-action: none; font-family: sans-serif; }
    canvas { display: block; width: 100vw; height: 100vh; }
  </style>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js"></script>
</head>
<body>
  <script>
    const AVATAR_B64 = "${avatarImage}";
    const BEETROOT_B64 = "${beetrootImage}";
    const CHAMOMILE_B64 = "${chamomileImage}";
    const GINGER_B64 = "${gingerImage}";
    const GARLIC_B64 = "${garlicImage}";
    const SPINACH_B64 = "${spinachImage}";
    const LAVENDER_B64 = "${lavenderImage}";
    const CITRUS_B64 = "${citrusImage}";
    class GameScene extends Phaser.Scene {
      constructor() {
        super({ key: 'GameScene' });
        this.score = 0;
        this.health = { circulation: 0, stress: 50 };
        this.activeSymptoms = [];
        // Progression system: start with 3 basic ingredients
        this.unlockedRemedies = [
            { id: 'beetroot', name: 'Beetroot', baseColor: 'icon_base_red' },
            { id: 'ginger', name: 'Ginger', baseColor: 'icon_base_yellow' },
            { id: 'chamomile', name: 'Chamomile', baseColor: 'icon_base_green' }
        ];
        
        // Items that can be unlocked via score progression
        this.lockedRemedies = [
            { id: 'garlic', name: 'Garlic', baseColor: 'icon_base_green', unlockAt: 300 },
            { id: 'spinach', name: 'Spinach', baseColor: 'icon_base_green', unlockAt: 600 },
            { id: 'lavender', name: 'Lavender', baseColor: 'icon_base_yellow', unlockAt: 900 },
            { id: 'citrus', name: 'Citrus', baseColor: 'icon_base_red', unlockAt: 1200 }
        ];

        // Merge Recipes
        this.recipes = [
            { req1: 'ginger', req2: 'chamomile', resultId: 'tea', resultName: 'Soothing Tea', resultTint: 0xffaa00, resultBase: 'icon_base_yellow', spriteMatch: 'chamomile' },
            { req1: 'garlic', req2: 'spinach', resultId: 'vitality', resultName: 'Vitality Blend', resultTint: 0x55ff55, resultBase: 'icon_base_green', spriteMatch: 'spinach' },
            { req1: 'beetroot', req2: 'citrus', resultId: 'detox', resultName: 'Detox Shot', resultTint: 0xff3355, resultBase: 'icon_base_red', spriteMatch: 'beetroot' }
        ];
      }

      preload() {
        const graphics = this.add.graphics();
        
        // Use the pre-loaded HTML food image objects
        if (window.avatarImageObj) this.textures.addImage('avatar', window.avatarImageObj);
        if (window.beetrootImageObj) this.textures.addImage('beetroot', window.beetrootImageObj);
        if (window.chamomileImageObj) this.textures.addImage('chamomile', window.chamomileImageObj);
        if (window.gingerImageObj) this.textures.addImage('ginger', window.gingerImageObj);
        if (window.garlicImageObj) this.textures.addImage('garlic', window.garlicImageObj);
        if (window.spinachImageObj) this.textures.addImage('spinach', window.spinachImageObj);
        if (window.lavenderImageObj) this.textures.addImage('lavender', window.lavenderImageObj);
        if (window.citrusImageObj) this.textures.addImage('citrus', window.citrusImageObj);

        // UI Base plates for the icons (optional subtle glow under food)
        const drawBasePlate = (key, color) => {
            graphics.clear();
            graphics.lineStyle(2, color, 0.4);
            graphics.strokeCircle(40, 40, 38);
            graphics.fillStyle(color, 0.1);
            graphics.fillCircle(40, 40, 38);
            graphics.generateTexture(key, 80, 80);
        };
        drawBasePlate('icon_base_red', 0xff3300);
        drawBasePlate('icon_base_green', 0x27ae60);
        drawBasePlate('icon_base_yellow', 0xf1c40f);

        // Afflictions (Intense glowing auras)
        // Red glow for poor circulation/muscle strain
        graphics.clear();
        graphics.fillStyle(0xff3300, 1);
        graphics.fillCircle(40, 40, 20);
        graphics.fillStyle(0xff3300, 0.5);
        graphics.fillCircle(40, 40, 30);
        graphics.fillStyle(0xff3300, 0.2);
        graphics.fillCircle(40, 40, 40);
        graphics.generateTexture('poor_circulation_aura', 80, 80);

        // Purple glow for stress/headache
        graphics.clear();
        graphics.fillStyle(0xcc00ff, 1);
        graphics.fillCircle(40, 40, 20);
        graphics.fillStyle(0xcc00ff, 0.5);
        graphics.fillCircle(40, 40, 30);
        graphics.fillStyle(0xcc00ff, 0.2);
        graphics.fillCircle(40, 40, 40);
        graphics.generateTexture('stress_aura', 80, 80);
        // Yellow glow for digestion
        graphics.clear();
        graphics.fillStyle(0xf1c40f, 1);
        graphics.fillCircle(40, 40, 20);
        graphics.fillStyle(0xf1c40f, 0.5);
        graphics.fillCircle(40, 40, 30);
        graphics.fillStyle(0xf1c40f, 0.2);
        graphics.fillCircle(40, 40, 40);
        graphics.generateTexture('digestion_aura', 80, 80);
      }

      create() {
        // Deep, rich dark background similar to the reference
        this.cameras.main.setBackgroundColor('#081017');
        
        const cx = this.cameras.main.centerX;
        const cy = this.cameras.main.centerY - 50; // Shift up slightly for tray
        
        // Render the new Glass Holographic Avatar
        const avatar = this.add.image(cx, cy, 'avatar');
        
        // Scale avatar to fit nicely, making it dominate the screen
        const scale = (window.innerHeight * 0.95) / avatar.height;
        avatar.setScale(scale);
        avatar.setAlpha(0.95); // High visibility for the new internal systems
        
        // Add subtle floating animation to avatar
        this.tweens.add({
            targets: avatar,
            y: cy - 15,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Define body zones relative to the scaled original avatar
        // Adjusted roughly based on human anatomy in the center of the image
        this.zones = {
            'head': { x: cx, y: cy - (avatar.height * scale * 0.35), label: 'ANXIETY & DEPRESSION', aura: 'stress_aura' },
            'heart': { x: cx, y: cy - (avatar.height * scale * 0.1), label: 'CIRCULATORY ISSUES', aura: 'poor_circulation_aura' }, 
            'stomach': { x: cx - (avatar.width * scale * 0.2), y: cy - (avatar.height * scale * 0.2), label: 'MUSCLE STRAIN', aura: 'digestion_aura' }
        };

        // UI Layer Graphics (for connecting lines)
        this.uiGraphics = this.add.graphics();

        // Add Sleek Remedy Tray with Realistic Food Assets - Mobile Optimized
        const trayY = window.innerHeight - 120;
        this.trayGroup = this.add.group(); // Store tray items to layout dynamically
        this.layoutTray(trayY);

        this.input.on('gameobjectdown', this.onGameObjectDown, this);
        this.input.on('pointermove', this.onPointerMove, this);
        this.input.on('pointerup', this.onPointerUp, this);

        // Initial spawns - targeting specific biological systems now
        this.time.delayedCall(500, () => this.spawnSymptom('stress', 'head'));
        this.time.delayedCall(2000, () => this.spawnSymptom('poor_circulation', 'heart'));
      }

      layoutTray(trayY) {
          // Clear old UI
          this.trayGroup.clear(true, true);
          
          const padding = 10;
          const availableWidth = window.innerWidth - (padding * 2);
          const itemCount = this.unlockedRemedies.length;
          
          // Calculate spacing based on screen width to ensure it perfectly fits mobile devices
          const spacing = Math.min(80, availableWidth / itemCount); 
          const startX = (window.innerWidth / 2) - ((itemCount - 1) * spacing / 2);

          for (let i = 0; i < itemCount; i++) {
              const remedy = this.unlockedRemedies[i];
              this.createTrayItem(remedy, startX + (i * spacing), trayY);
          }
      }

      createTrayItem(remedyObj, x, y) {
        const id = remedyObj.id;
        const nameText = remedyObj.name;
        
        // Base plate
        let base = this.add.sprite(x, y, remedyObj.baseColor);
        base.setScale(0.85); // Slightly smaller for dense mobile tray
        this.trayGroup.add(base);

        // The realistic food icon
        let icon = this.add.sprite(x, y, remedyObj.spriteMatch || id).setInteractive();
        
        // Keep pure-black removal blend mode for dark UIs
        icon.setBlendMode(Phaser.BlendModes.SCREEN);
        if (remedyObj.resultTint) icon.setTint(remedyObj.resultTint); // Tint merged items to look unique
        
        // Scale down to fit the strict mobile size slot
        const baseSize = 65; 
        const iconScale = baseSize / icon.height; 
        icon.setScale(iconScale);
        
        // Add text label directly beneath
        let label = this.add.text(x, y + 40, nameText, {
            fontFamily: 'sans-serif',
            fontSize: '11px',
            color: '#aaccff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.trayGroup.add(label);
        
        icon.id = id;
        icon.nameString = nameText;
        icon.entityType = 'tray_remedy';
        icon.originX = x;
        icon.originY = y;
        icon.basePlate = base; 
        icon.label = label;
        
        this.trayGroup.add(icon);
        
        // Add subtle pulse to tray base plate
        this.tweens.add({
            targets: base,
            scale: 1.0,
            alpha: 0.6,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
      }

      spawnSymptom(type, zoneKey) {
          const existing = this.activeSymptoms.find(s => s.zoneKey === zoneKey);
          if (existing) return;

          const zone = this.zones[zoneKey];
          
          // Use an intensely pulsing additively-blended sprite directly over the target organ
          let sprite = this.add.sprite(zone.x, zone.y, zone.aura);
          sprite.setBlendMode(Phaser.BlendModes.ADD);
          
          // Pulse the opacity and size to highlight the specific anatomy beneath it
          const tween = this.tweens.add({
              targets: sprite,
              alpha: { from: 0.8, to: 0.2 },
              scale: { from: 1.0, to: 1.3 },
              yoyo: true,
              repeat: -1,
              duration: 800,
              ease: 'Sine.easeInOut'
          });

          // Draw sleek connecting line and label
          // Calculate label position (offset to the side)
          const isLeftSide = zone.x < this.cameras.main.centerX;
          const labelX = isLeftSide ? zone.x - 100 : zone.x + 100;
          const labelY = zone.y - 40;

          // Draw line
          const lineGraphics = this.add.graphics();
          lineGraphics.lineStyle(1, 0x88bbdd, 0.5);
          lineGraphics.beginPath();
          lineGraphics.moveTo(zone.x, zone.y);
          // Angle up and out
          lineGraphics.lineTo(labelX + (isLeftSide ? 20 : -20), labelY + 10);
          // Straight horizontal line under text
          lineGraphics.lineTo(labelX + (isLeftSide ? -60 : 60), labelY + 10);
          lineGraphics.strokePath();

          // Add text label
          let label = this.add.text(labelX, labelY - 5, zone.label, 
             { fontFamily: 'sans-serif', color: '#e0f0ff', fontSize: '11px', letterSpacing: 1 }
          );
          label.setOrigin(isLeftSide ? 1 : 0, 0.5);

          // The active "target" area for dropping the remedy is the organ's coordinate
          this.activeSymptoms.push({ 
              zoneKey: zoneKey, 
              typeId: type, 
              targetX: zone.x, 
              targetY: zone.y,
              systemGraphics: sprite, // we store the sprite here now
              systemTween: tween,
              label: label, 
              lineGraphics: lineGraphics 
          });
      }

      onGameObjectDown(pointer, gameObject) {
        if (gameObject.entityType === 'tray_remedy') {
          this.dragItem = gameObject;
          this.dragItem.setDepth(100);
          if (this.dragItem.basePlate) this.dragItem.basePlate.setAlpha(0); // Hide base while dragging
          if (this.dragItem.label) this.dragItem.label.setAlpha(0); // Hide text
          
          // Scale up slightly to see the realistic details while dragging
          this.tweens.add({ targets: this.dragItem, scale: this.dragItem.scale * 1.3, duration: 100 });
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
            let hitSymptom = null;
            let hitSymptomIndex = -1;
            let hitTrayItem = null;

            // 1. Check distance to active symptom zones on the avatar
            for (let i = 0; i < this.activeSymptoms.length; i++) {
                const symptom = this.activeSymptoms[i];
                const dist = Phaser.Math.Distance.Between(this.dragItem.x, this.dragItem.y, symptom.targetX, symptom.targetY);
                if (dist < 80) { // Hit radius for large organs
                    hitSymptom = symptom;
                    hitSymptomIndex = i;
                    break;
                }
            }
            
            // 2. Check distance to other tray items (Merging Mechanic)
            if (!hitSymptom) {
                const children = this.trayGroup.getChildren();
                for (let i = 0; i < children.length; i++) {
                    const item = children[i];
                    if (item.entityType === 'tray_remedy' && item !== this.dragItem) {
                        const dist = Phaser.Math.Distance.Between(this.dragItem.x, this.dragItem.y, item.x, item.y);
                        if (dist < 50) { // Snug hit box for merging
                            hitTrayItem = item;
                            break;
                        }
                    }
                }
            }
              
            if (hitSymptom) {
                this.checkHeal(this.dragItem, hitSymptom, hitSymptomIndex);
            } else if (hitTrayItem) {
                this.checkMerge(this.dragItem, hitTrayItem);
            } else {
                // Snap back to tray if missed everything
                this.snapBackDragItem();
            }
            this.dragItem = null;
        }
      }

      snapBackDragItem() {
          this.tweens.add({
              targets: this.dragItem,
              x: this.dragItem.originX,
              y: this.dragItem.originY,
              scale: 65 / this.dragItem.height, // Reset to mobile tray scale
              duration: 300,
              ease: 'Back.easeOut',
              onComplete: () => {
                  if (this.dragItem && this.dragItem.basePlate) {
                      this.dragItem.basePlate.setAlpha(1);
                      this.dragItem.label.setAlpha(1);
                  }
              }
          });
      }

      checkMerge(dragItem, targetItem) {
          const id1 = dragItem.id;
          const id2 = targetItem.id;
          
          let validRecipe = this.recipes.find(r => 
              (r.req1 === id1 && r.req2 === id2) || (r.req1 === id2 && r.req2 === id1)
          );

          if (validRecipe) {
              // Check if already unlocked
              if (!this.unlockedRemedies.find(u => u.id === validRecipe.resultId)) {
                  // Grand unlock!
                  this.createHealBurst(targetItem.x, targetItem.y);
                  
                  // Add Potent item to tray data
                  this.unlockedRemedies.push({
                      id: validRecipe.resultId,
                      name: validRecipe.resultName,
                      baseColor: validRecipe.resultBase,
                      spriteMatch: validRecipe.spriteMatch,
                      resultTint: validRecipe.resultTint
                  });
                  
                  // Flash visual text
                  let t = this.add.text(targetItem.x, targetItem.y - 80, 'MERGED!', { fontSize: '24px', color: '#ffff00', fontStyle: 'bold' }).setOrigin(0.5);
                  this.tweens.add({ targets: t, y: t.y - 50, alpha: 0, duration: 1500, onComplete: () => t.destroy() });
                  
                  // Redraw entire layout to fit new item
                  this.layoutTray(window.innerHeight - 120);
                  return; // Don't snap back, layout destroyed it safely
              }
          }
          
          // If not valid, or already merged it, just snap back
          this.snapBackDragItem();
      }

      checkHeal(remedy, symptomObj, index) {
          let heals = false;
          let points = 0;
          const affliction = symptomObj.typeId;
          
          // Base Items
          if (remedy.id === 'beetroot' && affliction === 'poor_circulation') { heals = true; points = 150; this.health.circulation = Math.min(100, this.health.circulation + 10); }
          if (remedy.id === 'chamomile' && affliction === 'stress') { heals = true; points = 160; this.health.stress = Math.max(0, this.health.stress - 15); }
          if (remedy.id === 'ginger' && affliction === 'digestion') { heals = true; points = 150; }
          
          // Potent Merged Items (Huge Points)
          if (remedy.id === 'tea' && (affliction === 'stress' || affliction === 'digestion')) { heals = true; points = 500; this.health.stress = 0; }
          if (remedy.id === 'vitality' && affliction === 'poor_circulation') { heals = true; points = 600; this.health.circulation = 100; }
          if (remedy.id === 'detox' && affliction === 'digestion') { heals = true; points = 700; }
          
          if (heals) {
              this.createHealBurst(symptomObj.targetX, symptomObj.targetY);
              
              // Stop the glow
              symptomObj.systemTween.stop();
              symptomObj.systemGraphics.destroy(); // Remove the glowing aura
              
              // Destroy UI elements
              symptomObj.label.destroy();
              if (symptomObj.lineGraphics) symptomObj.lineGraphics.destroy();
              this.activeSymptoms.splice(index, 1);
              
              // Send remedy back to tray invisibly so it can be reused
              remedy.x = remedy.originX;
              remedy.y = remedy.originY;
              remedy.setScale(65 / remedy.height); // back to exact base slot size
              if (remedy.basePlate) {
                  remedy.basePlate.setAlpha(1);
                  remedy.label.setAlpha(1);
              }
              
              this.score += points;
              
              // --- SCORE PROGRESSION CHECK ---
              const newlyUnlocked = this.lockedRemedies.find(r => this.score >= r.unlockAt);
              if (newlyUnlocked) {
                  this.lockedRemedies = this.lockedRemedies.filter(r => r.id !== newlyUnlocked.id); // remove from locked
                  this.unlockedRemedies.push(newlyUnlocked); // unlock it
                  
                  // Celebration text
                  let t = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, \`UNLOCKED: \${newlyUnlocked.name.toUpperCase()}!\`, { fontSize: '32px', color: '#00ffcc', fontStyle: 'bold', stroke: '#000', strokeThickness: 6 }).setOrigin(0.5);
                  t.setDepth(200);
                  this.tweens.add({ targets: t, y: t.y - 100, alpha: 0, duration: 2500, ease: 'Power2', onComplete: () => t.destroy() });
                  
                  this.layoutTray(window.innerHeight - 120); // Redraw tray to fit new item
              }
              
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'UPDATE', score: this.score, health: this.health }));
              }
              if (window.parent && window.parent !== window) {
                window.parent.postMessage(JSON.stringify({ type: 'UPDATE', score: this.score, health: this.health }), '*');
              }

              // Subtle screen shake
              this.cameras.main.shake(100, 0.002);
              
              // Spawns a new affliction after a delay
              this.time.delayedCall(2000, () => {
                  const types = ['stress', 'poor_circulation', 'digestion'];
                  const zones = ['head', 'heart', 'stomach'];
                  this.spawnSymptom(Phaser.Math.RND.pick(types), Phaser.Math.RND.pick(zones));
              });
          } else {
              // Bounces off if wrong remedy and returns to tray
              this.snapBackDragItem();
          }
      }

      createHealBurst(x, y) {
          const circle = this.add.circle(x, y, 10, 0x5bc0be);
          this.tweens.add({
              targets: circle,
              scale: 8,
              alpha: 0,
              duration: 500,
              ease: 'Cubic.easeOut',
              onComplete: () => circle.destroy()
          });
      }
    }

    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      transparent: true,
      scene: [GameScene],
      scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
      }
    };
    
    // Preload the base64 images via standard HTML before booting Phaser
    // This strictly bypasses Phaser data URI loader bugs and handles multiple textures safely
    const loadImages = async () => {
        const loadImg = (src, key) => new Promise(resolve => {
            const img = new Image();
            img.onload = () => { window[key] = img; resolve(); };
            img.src = src;
        });

        await Promise.all([
            loadImg(AVATAR_B64, 'avatarImageObj'),
            loadImg(BEETROOT_B64, 'beetrootImageObj'),
            loadImg(CHAMOMILE_B64, 'chamomileImageObj'),
            loadImg(GINGER_B64, 'gingerImageObj'),
            loadImg(GARLIC_B64, 'garlicImageObj'),
            loadImg(SPINACH_B64, 'spinachImageObj'),
            loadImg(LAVENDER_B64, 'lavenderImageObj'),
            loadImg(CITRUS_B64, 'citrusImageObj')
        ]);

        new Phaser.Game(config);
    };
    
    loadImages();
  </script>
</body>
</html>
`;

export default gameHTML;
