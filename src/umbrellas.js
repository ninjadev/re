(function(global) {
  class umbrellas extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.umbrellas = [];
      for (let i=0; i < 32; i++) {
        this.umbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.twombrellas = [];
      for (let i=0; i < 24; i++) {
        this.twombrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.threembrellas = [];
      for (let i=0; i < 16; i++) {
        this.threembrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.fourmbrellas = [];
      for (let i=0; i < 8; i++) {
        this.fourmbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      const startBEAN = 100 * 12;
      for (const [i, umbrella] of this.umbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = clamp(8, 8 + (frame - startFrame) / 50, 20);
      }

      for (const [i, umbrella] of this.twombrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 8 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = clamp(-10, 8 - (frame - startFrame) / 50, 8);
      }

      for (const [i, umbrella] of this.threembrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 16 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = clamp(4.5, 4.5 + (frame - startFrame) / 50, 18);
      }

      for (const [i, umbrella] of this.fourmbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 24 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = clamp(-10, 4.5 - (frame - startFrame) / 50, 4.5);
      }

      this.rotation = clamp(0, (frame - FRAME_FOR_BEAN((startBEAN + 32) * 12)) / 100, 10);
    }

    render() {
      this.ctx.fillStyle = '#ffeead';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.ctx.save();
      this.ctx.translate(8 * GU, 4.5 * GU);
      this.ctx.rotate(this.rotation);
      this.ctx.translate(-8 * GU, -4.5 * GU);

      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas]) {
        this.ctx.strokeStyle = `rgba(75,119,190, ${umbrella.opacity})`;
        this.ctx.lineWidth = 4;
        this.ctx.beginPath();
        this.ctx.arc(umbrella.x * GU, umbrella.y * GU, umbrella.radius + GU, 0, umbrella.progress);
        this.ctx.stroke();
      }
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }
  }

  global.umbrellas = umbrellas;
})(this);
