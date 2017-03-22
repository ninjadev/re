(function(global) {
  class GalagaNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        inputs: {
          percolator: new NIN.Input()
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });
      this.noteCount = 0;

      this.bassAnalysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 0.2);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.particles = [];
      this.activeParticles = 0;
      for(let i = 0; i < 2048; i++) {
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
          pitch: 78,
        }, {
          start: beat * 2.5,
          end: beat * 3.5,
          pitch: 76,
        }, {
          start: beat * 3.5,
          end: beat * 5,
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
          pitch: 78,
        }, {
          start: beat * 9 + 4 * subeighth,
          end: beat * 11,
          pitch: 76,
        }, {
          start: beat * 11.5,
          end: beat * 13,
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
          pitch: 78,
        }, {
          start: beat * 19,
          end: beat * 19.5,
          pitch: 76,
        }, {
          start: beat * 19.5,
          end: beat * 21,
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
          pitch: 78,
        }, {
          start: beat * 23.5,
          end: beat * 23 + 9,
          pitch: 76,
        }, {
          start: beat * 23 + 9,
          end: beat * 25,
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
          pitch: 71,
          
          /**/

        }, {
          start: beat * 30,
          end: beat * 30,
          pitch: 71,

        }
      ];

      for(let i = 0; i < this.notes.length - 1; i++) {
        const note = this.notes[i];
        const nextNote = this.notes[i + 1];
        let noteLength = note.end - note.start;
        const notePause = nextNote.start - note.end;
        if(notePause < beat / 2) {
          if(noteLength > beat / 2) {
            noteLength -= beat / 2;
          } else {
            noteLength /= 2;
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
    }

    update(frame) {
      this.frame = frame;
      if(frame == 4542) {
        this.currentNote = 0;
        this.activeNotes = 0;
      }
      this.spaceshipX = smoothstep(-8, 0, (this.frame - 4450) / 150) +
        (this.frame - 4500) / 200 + 6 + smoothstep(0, 8, (this.frame - 5350) / 50);
      if(this.notes[this.currentNote + 1]) {
        this.spaceshipY = 0;
        const beanOffset = 12 * 4 * 41;
        const currentNote = this.notes[this.currentNote];
        const nextNote = this.notes[this.currentNote + 1];
        const startFrame = FRAME_FOR_BEAN(beanOffset + currentNote.end);
        const endFrame = FRAME_FOR_BEAN(beanOffset + nextNote.start);
        this.spaceshipY = smoothstep(currentNote.pitch,
                                     nextNote.pitch,
                                     (frame - startFrame) / (endFrame - startFrame));
        this.spaceshipY = (24 - (this.spaceshipY - 66)) / 4;
        if(BEAN >= beanOffset + this.notes[this.currentNote].start &&
           BEAN < beanOffset + this.notes[this.currentNote].end) {
          for(let i = 0; i < 10; i++) {
            const particle = this.particles[this.activeParticles++];
            const angle = Math.random() * Math.PI * 2;
            const spread = Math.random() / 16;
            particle.x = this.spaceshipX + Math.cos(angle) * spread;
            particle.y = this.spaceshipY + Math.sin(angle) * spread;
            particle.dx = -0.1 + Math.random() * 0.01;
            particle.dy = (Math.random() - 0.5) * 0.005;
            particle.life = 100;
          }
        } else if(BEAN >= beanOffset + this.notes[this.currentNote + 1].start) {
          this.currentNote = this.currentNote + 1;
        }
      }

      for(let i = 0; i < this.activeParticles; i++) {
        const particle = this.particles[i];
        particle.x += particle.dx;
        particle.y += particle.dy;
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
      this.ctx.fillStyle = '#222';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      const zoom = 1;
      const angle = 0;
      const x = 0;
      const y = 0;
      this.ctx.save();
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      this.ctx.scale(zoom, zoom);
      this.ctx.rotate(angle);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2);
      this.ctx.translate(x, y);
      this.ctx.fillStyle = 'white';
      this.ctx.globalAlpha = 0.5;
      for(let i = 0; i < this.stars.length; i++) {
        for(let j = 0; j < this.stars[i].length; j++) {
          const star = this.stars[i][j];
          const size = (1 + i / 2) * GU / 16;
          this.ctx.fillRect(
            ((32 * 1024 + star.x - this.frame / 16 * (1 + i)) % 32) * GU,
            star.y * GU,
            size,
            size / 4);
        }
      }

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = '#111';
      this.ctx.globalCompositeOperation = 'lighter';
      const width = 0.5;
      for(let i = 0; i < this.activeParticles; i++) {
        const particle = this.particles[i];
        this.ctx.fillRect(
          (particle.x) * GU,
          (particle.y) * GU + width / 4 * GU,
          width * GU,
          width * GU / 2);
      }
      this.ctx.globalCompositeOperation = 'source-over';

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = 'orange';
      this.ctx.fillRect(this.spaceshipX * GU, this.spaceshipY * GU, GU / 2, GU / 2);

      this.ctx.restore();

      this.ctx.globalAlpha = 1;
      this.ctx.fillStyle = 'red';
      this.ctx.font = 'bold ' + (0.2 * GU) + 'pt Arial';
      this.ctx.textBaseline = 'top';
      this.ctx.fillText('PLAYER 1', 0.2 * GU, 0);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText('NINJADEV', 1.7 * GU, 0);
      this.ctx.fillStyle = 'red';
      this.ctx.fillText('HIGHSCORE', 13 * GU, 0);
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(this.frame, 15 * GU, 0);
      this.ctx.fillStyle = 'red';
      this.ctx.fillText('BULLETS |||| |||| ||||', 0.2 * GU, 8.5 * GU);
      this.ctx.fillStyle = 'red';
      this.ctx.fillText('SHIP HEALTH ', 13 * GU, 8.5 * GU);
      this.ctx.fillStyle = 'white';

      let health = '';
      let analysisValue = this.bassAnalysis.getValue(this.frame);
      while(analysisValue > 0) {
        analysisValue -= 0.5;
        health += '|';
      }
      this.ctx.fillText(health, 15 * GU, 8.5 * GU);

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.GalagaNode = GalagaNode;
})(this);
