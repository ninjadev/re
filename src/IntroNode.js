(function(global) {
  class IntroNode extends NIN.Node {
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

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;
      this.circleThrob = 0;
      this.hihatThrob = 0;
      this.squares = [];
    }

    fire(cardinality) {
      let sizeModifier = 1;
      if(cardinality == 3) {
        sizeModifier = 2.6;
      }
      this.squares.unshift({
        size: 0.5 * sizeModifier,
        rotation: this.noteCount * Math.PI / 8 * sizeModifier,
        cardinality
      });
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
      this.ctx.globalCompositeOperation = 'xor';
    }

    update(frame) {
      const beat = 12;
      const bar = 12 * 4;

      this.hihatThrob *= 0.9;
      if(this.hihatThrob < 0) {
        this.hihatThrob = 0;
      }
      this.circleThrob *= 0.93;
      if(this.circleThrob < 0.15) {
        this.circleThrob = 0.15;
      }
      if(frame <= FRAME_FOR_BEAN(bar)) {
        this.circleThrob = 0;
      }

      for(let i = 0; i < this.squares.length; i++) {
        this.squares[i].size *= 1.035;
        if(this.squares[i].size > 100) {
          this.squares.pop(i);
        }
      }
      if(BEAT && (BEAN - bar) % (bar * 8) == 0) {
        this.noteCount = 0;
      }
      if(this.inputs.percolator.getValue()) {
        if(this.noteCount < 7) {
          this.fire(4);
        } else if(this.noteCount < 11) {
          this.fire(5);
        } else if(this.noteCount < 12) {
          this.fire(6);
        } else if(this.noteCount < 18) {
          this.fire(3);
        }
        if(this.noteCount < 18) {
          this.circleThrob = 1;
        }
        this.noteCount++;
      }
      this.rotation = -frame / 30;
      this.frame = frame;
    }

    renderShape(ctx, shape) {
      ctx.beginPath();
      const radius = GU * 2;
      ctx.moveTo(Math.sin(0) * radius, Math.cos(0) * radius);
      for(let i = 0; i < shape.cardinality; i++) {
        ctx.lineTo(Math.sin(i / shape.cardinality * Math.PI * 2) * radius,
                   Math.cos(i / shape.cardinality * Math.PI * 2) * radius);
      }
      ctx.fill();
    }

    render(renderer) {
      const x = this.noteCount / 20 * 16;
      this.ctx.globalCompositeOperation = 'xor';
      this.ctx.clearRect(0, 0, 16 * GU, 9 * GU);
      for(let i = 0; i < this.squares.length; i++) {
        this.ctx.save();
        this.ctx.fillStyle = '#00a2ff';
        this.ctx.translate(8 * GU, 4.5 * GU);
        this.ctx.rotate(this.rotation + this.squares[i].rotation);
        const scale = this.squares[i].size;
        this.ctx.scale(scale, scale);
        this.renderShape(this.ctx, this.squares[i]);
        const otherScaler = 0.85;
        this.ctx.scale(otherScaler, otherScaler);
        this.renderShape(this.ctx, this.squares[i]);
        this.ctx.restore();
      }
      this.ctx.fillStyle = '#ff00a2';
      const step = clamp(0, (this.noteCount - 12) / 6, 1);

      if(BEAN >= 12 * 4 * 4 && BEAN < 12 * 4 * 7) {
        this.ctx.save();
        this.ctx.translate(8 * GU, 4.5 * GU);
        this.ctx.rotate(
          this.frame / 60 / 60 * 130 / 4 * Math.PI * 2 +
          0.25 * Math.sin(Math.PI + this.frame / 60 / 60 * 130 * Math.PI * 2)
      );
        const width = GU * 1.1;
        this.ctx.fillRect(- width / 2, -width / 2, width, width);
        this.ctx.scale(0.9, 0.9);
        this.ctx.fillRect(- width / 2, -width / 2, width, width);
        this.ctx.restore();
      }

      this.circleEndSize = smoothstep(0, 1, (this.frame - 927) / (996 - 927));

      const r = smoothstep(255, 27, this.circleEndSize * 2);
      const g = smoothstep(0, 9, this.circleEndSize * 2);
      const b = smoothstep(162, 34, this.circleEndSize * 2);
      this.ctx.fillStyle = `rgb(${r|0}, ${g|0}, ${b|0})`;
      this.ctx.beginPath();
      this.ctx.ellipse(
        8 * GU,
        4.5 * GU,
        0.5 * GU * this.circleThrob * (1 + this.circleEndSize * 200),
        0.5 * GU * this.circleThrob * (1 + this.circleEndSize * 200),
        0, 0, Math.PI * 2);
      this.ctx.fill();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.IntroNode = IntroNode;
})(this);
