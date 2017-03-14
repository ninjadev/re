(function(global) {
  class IntroNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
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
      this.squares.unshift({
        size: 0.5,
        rotation: this.noteCount * Math.PI / 8,
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
      if(BEAT && BEAN <= bar) {
        this.noteCount = 0;
      }
      if(BEAT) {
        switch((BEAN - bar) % (bar * 8)) {
          case 0:
          case 2.5 * beat:
          case 3.5 * beat:
          case bar + 2.5 * beat:
          case bar + 3.5 * beat:
          case 2 * bar + 1.5 * beat:
          case 2 * bar + 3.5 * beat:
          case 3 * bar + 2.5 * beat:
          case 3 * bar + 3.5 * beat:
          case 4 * bar + 2.5 * beat:
          case 4 * bar + 3.5 * beat:
          case 5 * bar + 2.5 * beat:
          case 6 * bar:
          case 6 * bar + 1.5 * beat:
          case 6 * bar + 2 * beat:
          case 6 * bar + 2.5 * beat:
          case 6 * bar + 3 * beat:
          case 6 * bar + 3.5 * beat:
          case 7 * bar + 1.5 * beat:
          case 7 * bar + 3 * beat:
            if(this.noteCount < 7) {
              this.fire(4);
            } else if(this.noteCount < 11) {
              this.fire(5);
            } else if(this.noteCount < 12) {
              this.fire(6);
            } else {
              this.fire(3);
            }
            this.circleThrob = 1;
            this.noteCount++;
        }
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
        this.ctx.fillStyle = '#ffeead';
        this.ctx.translate(8 * GU, 4.5 * GU);
        this.ctx.rotate(this.rotation + this.squares[i].rotation);
        const scale = this.squares[i].size;
        this.ctx.scale(scale, scale);
        this.renderShape(this.ctx, this.squares[i]);
        const otherScaler = 0.95;
        this.ctx.scale(otherScaler, otherScaler);
        this.renderShape(this.ctx, this.squares[i]);
        this.ctx.restore();
      }
      this.ctx.fillStyle = '#ffeead';
      const step = clamp(0, (this.noteCount - 12) / 6, 1);
      this.ctx.fillRect((8 - step * 8) * GU, 0, step * 16 * GU, 9 * GU);
      this.ctx.beginPath();
      this.ctx.ellipse(
        8 * GU,
        4.5 * GU,
        0.5 * GU * this.circleThrob,
        0.5 * GU * this.circleThrob,
        0, 0, Math.PI * 2);
      this.ctx.fill();
      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.IntroNode = IntroNode;
})(this);
