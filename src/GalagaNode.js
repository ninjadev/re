(function(global) {

  const easeOutExpo = function (t, b, c, d) {
      return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
  };

  class GalagaNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.noteCount = 0;

      this.shipSprite = new Image();
      Loader.load('res/ninship.png', this.shipSprite);

      this.particleSprite = document.createElement('canvas');
      this.maskCanvas = document.createElement('canvas');

      if (!document.getElementById('arcade-font')) {
        var s = document.createElement('style');
        s.setAttribute('id', 'arcade-font');
        Loader.loadAjax('res/ARCADECLASSIC.base64', function(response) {
          s.innerHTML = [
            "@font-face {",
            "font-family: 'arcade';",
            "src: url(data:application/x-font-opentype;charset=utf-8;base64," + response + ") format('opentype');",
            "}"
          ].join('\n');
        })
        document.body.appendChild(s);
      }

      this.bassAnalysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 0.2);

      this.kickThrob = 0;
      this.snareThrob = 0;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.particles = [];
      this.activeParticles = 0;
      for(let i = 0; i < 2048 * 16; i++) {
        this.particles[i] = {
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          life: 0,
        };
      }

      const beat = 12;
      const bar = beat * 4;
      const subeighth = beat / 8;
      this.notes = [{
          start: 0,
          end: beat * 2,
          bend: 6,
          pitch: 78,
        }, {
          start: beat * 2.5,
          end: beat * 3.5,
          pitch: 76,
        }, {
          start: beat * 3.5,
          end: beat * 5,
          bend: 6,
          pitch: 66,
        /**/
        }, {
          start: beat * 5.5,
          end: beat * 6,
          pitch: 71,
        }, {
          start: beat * 6,
          end: beat * 6 + 2 * subeighth,
          pitch: 73,
        }, {
          start: beat * 6 + 2 * subeighth,
          end: beat * 6 + 3 * subeighth,
          pitch: 71,
        }, {
          start: beat * 6 + 4 * subeighth,
          end: beat * 6 + 6 * subeighth,
          pitch: 76,
        }, {
          start: beat * 7,
          end: beat * 7 + 4 * subeighth,
          pitch: 78,
        }, {
          start: beat * 7 + 4 * subeighth,
          end: beat * 7 + 7 * subeighth,
          pitch: 76,
        }, {
          start: beat * 7 + 6 * subeighth,
          end: beat * 9 + 4 * subeighth,
          bend: 3,
          pitch: 78,
        }, {
          start: beat * 9 + 4 * subeighth,
          end: beat * 11,
          pitch: 76,
        }, {
          start: beat * 11.5,
          end: beat * 13,
          bend: 6,
          pitch: 66,

        /**/

        }, {
          start: beat * 13 + 2 * subeighth,
          end: beat * 13 + 4 * subeighth,
          pitch: 69,

        }, {
          start: beat * 13 + 4 * subeighth,
          end: beat * 13 + 4 * subeighth + 1,
          pitch: 70,
        }, {
          start: beat * 13 + 4 * subeighth + 2,
          end: beat * 13 + 4 * subeighth + 3,
          pitch: 73,
        }, {
          start: beat * 13 + 4 * subeighth + 4,
          end: beat * 13 + 4 * subeighth + 5,
          pitch: 75,
        }, {
          start: beat * 14,
          end: beat * 14 + 3,
          pitch: 76,
        }, {
          start: beat * 14 + 6,
          end: beat * 15,
          pitch: 78,
        }, {
          start: beat * 15 + 3,
          end: beat * 15 + 9,
          pitch: 76,
        }, {
          start: beat * 16,
          end: beat * 18,
          bend: 6,
          pitch: 78,
        }, {
          start: beat * 19,
          end: beat * 19.5,
          pitch: 76,
        }, {
          start: beat * 19.5,
          end: beat * 21,
          bend: 6,
          pitch: 66,

          /**/

        }, {
          start: beat * 21.5,
          end: beat * 22,
          pitch: 71,
        }, {
          start: beat * 22,
          end: beat * 22 + 3,
          pitch: 73,
        }, {
          start: beat * 22 + 3,
          end: beat * 22 + 4.5,
          pitch: 71,
        }, {
          start: beat * 22 + 6,
          end: beat * 22 + 9,
          pitch: 76,
        }, {
          start: beat * 23,
          end: beat * 23.5,
          bend: 2,
          pitch: 78,
        }, {
          start: beat * 23.5,
          end: beat * 23 + 9,
          pitch: 76,
        }, {
          start: beat * 23 + 9,
          end: beat * 25,
          bend: 3,
          bendAmount: 1,
          pitch: 69,

        /**/

        }, {
          start: beat * 25.5,
          end: beat * 26,
          pitch: 66,
        }, {
          start: beat * 26,
          end: beat * 26.5,
          pitch: 69,
        }, {
          start: beat * 26.5,
          end: beat * 27,
          pitch: 73,
        }, {
          start: beat * 27,
          end: beat * 27.5,
          pitch: 76,
        }, {
          start: beat * 27.5,
          end: beat * 30,
          bend: 6,
          pitch: 71,
          
          /**/

        }, {
          start: beat * 34,
          end: beat * 34,
          pitch: 71,

        }
      ];

      for(let i = 0; i < this.notes.length - 1; i++) {
        const note = this.notes[i];
        const nextNote = this.notes[i + 1];
        let noteLength = note.end - note.start;
        const notePause = nextNote.start - note.end;
        if(notePause < beat / 4) {
          if(noteLength > beat / 2) {
            noteLength -= beat / 4;
          } else {
            noteLength *= 0.9;
          }
        }
        note.end = note.start + noteLength;
      }

      this.stars = [];
      for(let i = 0; i < 3; i++) {
        this.stars[i] = [];
        for(let j = 0; j < 128; j++) {
          this.stars[i][j] = {
            x: Math.random() * 32,
            y: Math.random() * 9,
          };
        }
      }
      this.currentNote = 0;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;

      this.maskCanvas.width = 16 * GU;
      this.maskCanvas.height = 9 * GU;

      this.particleSprite.width = GU / 4 * 2;
      this.particleSprite.height = GU / 4 * 2;
      const ctx = this.particleSprite.getContext('2d');
      const gradient = ctx.createRadialGradient(
        this.particleSprite.width / 2,
        this.particleSprite.width / 2,
        this.particleSprite.width / 2,
        this.particleSprite.width / 2,
        this.particleSprite.width / 2,
        0);
      gradient.addColorStop(0, 'rgba(32, 219, 122, 0)');
      gradient.addColorStop(1, '#20db7a');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.particleSprite.width, this.particleSprite.height);
    }

    update(frame) {
      this.frame = frame;
      if(frame == 4542) {
        this.currentNote = 0;
        this.activeParticles = 0;
      }

      this.kickThrob *= 0.95;
      this.snareThrob *= 0.99;
      if(BEAT && BEAN % 12 == 0) {
        this.kickThrob = 1;
      }
      if(BEAT && BEAN % 24 == 12) {
        this.snareThrob = 1;
      }

      if(demo.nm.nodes.galagafx_add) {
        demo.nm.nodes.galagafx_add.opacity = 0.1 + this.kickThrob / 2;
      }

      this.cameraOffsetX = 0;
      this.cameraOffsetY = 0;
      this.cameraOffsetDX = 0;
      this.cameraOffsetDY = 0;
      this.cameraOffsetDDX = 0;
      this.cameraOffsetDDY = 0;

      const beat = 12;
      const bar = 12 * 4;
      const offset = bar * 41;
      if(BEAN > offset + beat * 14 + 6 && BEAN < offset + beat * 18) {
        this.cameraOffsetDDX = (Math.random() - 0.5) / 4;
        this.cameraOffsetDDY = (Math.random() - 0.5) / 4;
      }

      this.cameraOffsetDX = -this.cameraOffsetX / 2;
      this.cameraOffsetDY = -this.cameraOffsetY / 2;

      this.cameraOffsetDX += this.cameraOffsetDDX;
      this.cameraOffsetDY += this.cameraOffsetDDY;
      this.cameraOffsetX += this.cameraOffsetDX;
      this.cameraOffsetY += this.cameraOffsetDY;

      this.spaceshipX = smoothstep(-8, 0, (this.frame - 4450) / 150) +
        (this.frame - 4500) / 200 + 6 + smoothstep(0, 8, (this.frame - 5350) / 50);
      if(this.notes[this.currentNote + 1]) {
        this.spaceshipY = 0;
        const beanOffset = 12 * 4 * 41;
        const currentNote = this.notes[this.currentNote];
        const nextNote = this.notes[this.currentNote + 1];
        const startFrame = FRAME_FOR_BEAN(beanOffset + currentNote.end);
        const endFrame = FRAME_FOR_BEAN(beanOffset + nextNote.start);
        const t = (frame - startFrame) / (endFrame - startFrame);
        this.spaceshipY = smoothstep(currentNote.pitch, nextNote.pitch, t);

        if(t < 0.5) {
          this.spaceshipRotation = smoothstep(0, 1, t * 2);
        } else {
          this.spaceshipRotation = smoothstep(1, 0, (t - 0.5) * 2);
        }
        if(nextNote.pitch > currentNote.pitch) {
          this.spaceshipRotation = -this.spaceshipRotation;
        }

        if(currentNote.bend) {
          const bendStart = FRAME_FOR_BEAN(beanOffset + currentNote.start);
          const bendEnd = FRAME_FOR_BEAN(beanOffset + currentNote.start + currentNote.bend);
          const bendAmount = currentNote.bendAmount || 2;
          this.spaceshipY += easeOut(-bendAmount, 0, (frame - bendStart) / (bendEnd - bendStart));
        }

        this.spaceshipY = (24 - (this.spaceshipY - 66)) / 4;

        this.spaceshipRotation *= Math.abs(currentNote.pitch - nextNote.pitch) / 12;
        if(BEAN >= beanOffset + this.notes[this.currentNote].start &&
           BEAN < beanOffset + this.notes[this.currentNote].end) {

          const vibratoStartFrame = FRAME_FOR_BEAN(beanOffset + this.notes[this.currentNote].start + 12 / 4 * 3);
          const vibratoEndFrame = FRAME_FOR_BEAN(beanOffset + this.notes[this.currentNote].start + 12 / 4 * 7);
          const vibratoModifier = clamp(0, (frame - vibratoStartFrame) / (vibratoEndFrame - vibratoStartFrame), 1);
          this.spaceshipY += 0.2 * vibratoModifier * Math.sin(frame * Math.PI * 2 / 60 / 60 * 130 * 4);

          for(let i = 0; i < 30; i++) {
            const particle = this.particles[this.activeParticles++];
            const angle = Math.random() * Math.PI * 2;
            const spread = Math.random() / 16;
            particle.x = this.spaceshipX + Math.cos(angle) * spread;
            particle.y = this.spaceshipY + Math.sin(angle) * spread;
            particle.dx = -0.15 + (Math.random() -0.5) * 0.005;
            particle.dy = 0 + (Math.random() - 0.5) * 0.001;
            particle.life = 100;
          }
        } else if(BEAN >= beanOffset + this.notes[this.currentNote + 1].start) {
          this.currentNote = this.currentNote + 1;
        }
      }

      for(let i = 0; i < this.activeParticles; i++) {
        const particle = this.particles[i];
        particle.lifeScaled = clamp(0, easeOutExpo(particle.life, 0, 1, 100), 1);
        particle.x += particle.dx;
        particle.y += particle.dy * particle.lifeScaled;
        if(particle.life-- == 0) {
          this.particles[i] = this.particles[this.activeParticles];
          this.particles[this.activeParticles] = particle;
          this.activeParticles--;
          i--;
        }
      }
    }

    render(renderer) {

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#210021';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      let zoom = 1;
      let angle = 0;
      let x = 0;
      let y = 0;

      const beat = 12;
      const bar = 12 * 4;
      const offset = bar * 41;
      const subeighth = beat / 8;

      let cameraShake = 0;

      zoom = smoothstep(3, 1, (this.frame - 4583) / 36);
      y = smoothstep(zoom * 4.5 - zoom * this.spaceshipY, 0, (this.frame - 4604) / 36);
      x = smoothstep(zoom * 1, 0, (this.frame - 4583) / 36);
      if(BEAN >= offset + beat * 13 + 2 * subeighth) {
        if(BEAN < offset + beat * 13 + 4 * subeighth) {
          zoom = lerp(1, 3, 1 / 24);
        } else if(BEAN < offset + beat * 13 + 4 * subeighth + 2) {
          zoom = lerp(1, 3, 2 / 24);
        } else if(BEAN < offset + beat * 13 + 4 * subeighth + 4) {
          zoom = lerp(1, 3, 3 / 24);
        } else if(BEAN < offset + beat * 14) {
          zoom = lerp(1, 3, 4 / 24);
        } else if(BEAN < offset + beat * 14 + 6) {
          zoom = lerp(1, 3, 5 / 24);
        } else if(BEAN < offset + beat * 15 + 3) {
          zoom = 3;
          angle = -0.1;
          y = 4;
          x = -3;
        } else if(BEAN < offset + beat * 15 + 9) {
          zoom = 2;
          angle = 0.1;
          y = 1;
          x = -2;
        } else if(BEAN < offset + beat * 18) {
          zoom = 3;
          angle = -0.1;
          y = 3.5;
          x = -1;
        } else if(BEAN < offset + beat * 19) {
          const start = FRAME_FOR_BEAN(offset + beat * 18);
          const end = FRAME_FOR_BEAN(offset + beat * 19);
          const t = (this.frame - start) / (end - start);
          zoom = smoothstep(3, 1, t);
          angle = smoothstep(-0.1, 0, t);
          y = smoothstep(3.5, 0, t);
          x = smoothstep(-1, 0, t);
        }
      }
      this.ctx.save();
      this.ctx.translate((x + this.cameraOffsetX)* GU, (y + this.cameraOffsetY) * GU);
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.rotate(angle);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      this.ctx.fillStyle = 'white';
      this.ctx.globalAlpha = 0.1 + 0.9 * this.kickThrob;
      let starLengthModifier = 1;
      let starSpeedModifier = 1;
      if(BEAN >= offset + beat * 14 + 6 && BEAN < offset + beat * 18) {
        starLengthModifier = 10;
        starSpeedModifier = 3;
      }
      for(let i = 0; i < this.stars.length; i++) {
        for(let j = 0; j < this.stars[i].length; j++) {
          const star = this.stars[i][j];
          const size = (1 + i / 2) / 16 * 2;
          let length = size * starLengthModifier;
          this.ctx.fillRect(
            ((32 * 1024 + star.x - starSpeedModifier * this.frame / 16 * (1 + i)) % 32) * GU,
            (star.y) * GU,
            length * GU,
            size / 16 * GU);
        }
      }

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#0500b05';
      //this.ctx.globalCompositeOperation = 'lighter';
      const width = 0.5;
      for(let i = 0; i < this.activeParticles; i++) {
        const particle = this.particles[i];
        this.ctx.globalAlpha = particle.lifeScaled;
        this.ctx.drawImage(
          this.particleSprite,
          (particle.x - 0.5) * GU - this.particleSprite.width / 2 - 0.5 * GU,
          particle.y * GU - this.particleSprite.height / 2);
      }
      this.ctx.globalCompositeOperation = 'source-over';

      this.ctx.globalAlpha = 1;
      const shipScale = GU / this.shipSprite.width * 1.5;
      this.ctx.translate(this.spaceshipX * GU, this.spaceshipY * GU);
      this.ctx.scale(shipScale, shipScale);
      this.ctx.rotate(this.spaceshipRotation);
      this.ctx.drawImage(this.shipSprite, -this.shipSprite.width / 2, -this.shipSprite.height / 2);
      this.ctx.fillStyle = '#ce2458';
      for(let i = 0; i < 7; i++) {
        this.ctx.fillStyle = Math.sin(Math.PI * 2 * i / 7 + this.frame / 60 / 60 * 130 * 4 * 2) > 0 ? '#ce2458' : '#1f1f1f';
        //this.ctx.fillRect((0.06 + i * 0.03) * GU * shipScale, 0.01 * GU, 0.02 * GU, 0.09 * GU);
        this.ctx.fillRect((6 + i * 3), 2, 2, 9);
      }

      this.ctx.restore();

      const hudShowTime = (this.frame - 4550) / 50;
      const hudOffset = easeOut(1, 0, hudShowTime);

      const colorA = '#961A96';
      const colorB = '#20db7a';

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = colorA;
      this.ctx.font = 'bold ' + ((0.4 + this.kickThrob * 0.02) * GU) + 'pt arcade';
      this.ctx.textBaseline = 'top';
      this.ctx.textAlign = 'center';
      this.ctx.fillText('PLAYER 1', 1.28 * GU, (0.1 - hudOffset) * GU);
      this.ctx.fillStyle = colorB;
      this.ctx.fillText('NINJADEV', 4.2 * GU, (0.1 - hudOffset) * GU);
      this.ctx.fillStyle = colorA;
      this.ctx.fillText('HIGHSCORE', 12.4 * GU, (0.1 - hudOffset) * GU);
      this.ctx.fillStyle = colorB;
      this.ctx.fillText(this.frame, 15.2 * GU, (0.1 - hudOffset) * GU);
      this.ctx.fillStyle = colorA;
      this.ctx.fillText('BULLETS', 1.26 * GU, (hudOffset + 8.35) * GU);
      this.ctx.fillStyle = colorB;
      for(let i = 0; i < 16; i++) {
        let offset = 0;
        if((BEAN % (12 * 4)) / 12 * 4 == i && i % 4 == 0) {
          offset = 0.2;
        }
        if (i == ((BEAN % (12 * 4)) / 12 * 4 | 0)) {
          this.ctx.globalAlpha = 1;
        } else {
          this.ctx.globalAlpha = 0.1;
        }
        if(i % 4 == 0) {
          this.ctx.fillStyle = colorB;
        } else {
          this.ctx.fillStyle = colorA;
        }
        this.ctx.fillText('o', (2.8 + 0.33 * i) * GU, (hudOffset + 8.35 - offset) * GU);
      }
      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = colorA;
      this.ctx.fillText('SHIP HEALTH ', 11.6 * GU, (hudOffset + 8.35) * GU);
      this.ctx.fillStyle = colorB;

      let health = '';
      let analysisValue = this.bassAnalysis.getValue(this.frame);
      while(analysisValue > 0) {
        analysisValue -= 0.6;
        health += 'X';
      }
      this.ctx.textAlign = 'left';
      this.ctx.fillText(health, 13.8 * GU, (hudOffset + 8.35) * GU);

      if(BEAN >= 12 * 4 * 49 - 12 - 6) {
        const ctx = this.maskCanvas.getContext('2d');
        ctx.clearRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
        ctx.fillRect(0, 0, this.maskCanvas.width, this.maskCanvas.height);
        ctx.globalCompositeOperation = 'xor';
        ctx.fillStyle = '#20db7a';
        let radius;
        if(BEAN < 12 * 4 * 49 - 12 - 4) {
          radius = 7.5;
        } else if(BEAN < 12 * 4 * 49 - 12 - 2) {
          radius = 6;
        } else if(BEAN < 12 * 4 * 49 - 12) {
          radius = 4.2;
        } else {
          radius = 3;
        }
        ctx.beginPath();
        ctx.ellipse(8 * GU, 4.5 * GU, radius * GU, radius * GU, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        ctx.font = (1.2 * GU) + 'pt arcade'; 
        if(radius == 3) {
          ctx.fillText('GREETS', 8 * GU, 4.5 * GU);
        }
        this.ctx.drawImage(this.maskCanvas, 0, 0);
      }

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.GalagaNode = GalagaNode;
})(this);
