(function(global) {
  class NinjadevLogoNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          texture: new NIN.TextureOutput()
        }
      });

      this.polygons = {
        N: [
          [0, 0],
          [1, 0],
          [3, 6],
          [3, 0],
          [4, 0],
          [4, 9],
          [3, 9],
          [1, 3],
          [1, 9],
          [0, 9],
          [0, 0],
        ],
        I: [
          [5, 0],
          [6, 0],
          [6, 9],
          [5, 9],
          [5, 0],
        ],
        M: [
          [7, 0],
          [8, 0],
          [10, 6],
          [10, 0],
          [11, 0],
          [11, 9],
          [10, 9],
          [8, 3],
          [8, 9],
          [7, 9],
          [7, 0],
        ],
        J: [
          [13, 0],
          [14, 0],
          [14, 4],
          [12, 10],
          [11, 10],
          [13, 4],
          [13, 0],
        ],
        A: [
          [16, 0],
          [19, 9],
          [18, 9],
          [16, 3],
          [14, 9],
          [13, 9],
          [16, 0],
        ],
        D: [
          [17, 0],
          [21, 0],
          [21, 6],
          [20, 9],
          [17, 0],
        ],
        D_hole: [
          [18 + 1/3, 1],
          [20, 1],
          [20, 6],
          [18 + 1/3, 1],
        ],
        E: [
          [22, 0],
          [24, 0],
          [24, 1],
          [23, 1],
          [23, 4],
          [24, 4],
          [24, 5],
          [23, 5],
          [23, 8],
          [25, 8],
          [25, 9],
          [22, 9],
          [22, 0],
        ],
        V: [
          [25, 0],
          [26, 0],
          [26, 6],
          [28, 0],
          [29, 0],
          [26, 9],
          [25, 6],
          [25, 0],
        ]
      };

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.texture = new THREE.Texture(this.canvas);
      this.outputs.texture.setValue(this.texture);
      this.resize();
    }

    redraw() {
      this.ctx.save();
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      const scale =  GU / 4;
      this.ctx.scale(scale, scale);
      for(let letter of 'NIMJADEV') {
        let polygon = this.polygons[letter];
        console.log(letter, polygon);
        this.ctx.beginPath();
        this.ctx.moveTo(...polygon[0]);
        for(let i = 1; i < polygon.length; i++) {
          this.ctx.lineTo(...polygon[i]);
        }
        this.ctx.fill();
      }
      this.ctx.globalCompositeOperation = 'xor';
      this.ctx.beginPath();
      this.ctx.moveTo(this.polygons.D_hole[0], this.polygons.D_hole[1]);
      for(let i = 1; i < this.polygons.D_hole.length; i++) {
        this.ctx.lineTo(...this.polygons.D_hole[i]);
      }
      this.ctx.fill();
      this.ctx.restore();
      this.texture.needsUpdate = true;
    }

    resize() {
      this.canvas.width = 16 * GU / 64 * 29 * 2;
      this.canvas.height = 16 * GU / 64 * 10 * 2;
      this.redraw();
    }
  }

  global.NinjadevLogoNode = NinjadevLogoNode;
})(this);
