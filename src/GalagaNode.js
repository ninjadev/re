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
        }
        /**/
      ];

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
      }
      this.spaceshipY = 0;
      const beanOffset = 12 * 4 * 41;
      if(BEAN >= beanOffset + this.notes[this.currentNote].start &&
         BEAN < beanOffset + this.notes[this.currentNote].end) {
        this.spaceshipY = this.notes[this.currentNote].pitch;
      } else if(BEAN > beanOffset + this.notes[this.currentNote].end) {
        this.currentNote = (this.currentNote + 1) % this.notes.length;
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
      this.ctx.fillStyle = 'orange';
      const spaceshipY = (24 - (this.spaceshipY - 66)) / 4;
      console.log(spaceshipY);
      this.ctx.fillRect(1 * GU, spaceshipY * GU, GU / 2, GU / 2);

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
