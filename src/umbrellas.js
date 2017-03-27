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
      for (let i=0; i < 16; i++) {
        this.umbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.twombrellas = [];
      for (let i=0; i < 12; i++) {
        this.twombrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.threembrellas = [];
      for (let i=0; i < 8; i++) {
        this.threembrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.fourmbrellas = [];
      for (let i=0; i < 4; i++) {
        this.fourmbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.bubbles = [];
      for (let i=0; i < 19; i++) {
        this.bubbles[i] = {
          x: 8 + (i%3 - 1) * 2,
          y: 4.5,
          radius: 1,
          progress: Math.PI * 2,
          opacity: 0,
        };
      }

      this.zoomLevel = 0;
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
        umbrella.x = clamp(8, 8 + (frame - startFrame) / 25, 20);
      }

      for (const [i, umbrella] of this.twombrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 4 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = clamp(-10, 8 - (frame - startFrame) / 25, 8);
      }

      for (const [i, umbrella] of this.threembrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 8 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = clamp(4.5, 4.5 + (frame - startFrame) / 25, 18);
      }

      for (const [i, umbrella] of this.fourmbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 12 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = clamp(-10, 4.5 - (frame - startFrame) / 25, 4.5);
      }

      for (const [i, bubble] of this.bubbles.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 8 + 16 * 12);
        if (frame > startFrame) {
          bubble.opacity = 1;
        } else {
          bubble.opacity = 0;
        }
        bubble.radius = clamp(0, (frame - startFrame) / 5, 100);
        if (i === 18) {
          const yolo = clamp(0, (BEAN - 30 * 12 - 6 - startBEAN) / 1 | 0, 4);
          const yolo2 = (BEAN - 31 * 12 + 6 - startBEAN) / 3 | 0;
          bubble.x = clamp(6, 6 + (frame - startFrame) / 30, 8);
          bubble.progress = clamp(0, 1 - yolo * 0.125 - yolo2 * 0.125, 1) * Math.PI * 2;
          bubble.radius *= 3;
        } else {
          bubble.y = clamp(4.5, 4.5 + (frame - startFrame) / 25, 18);
        }
      }

      this.rotation = clamp(0, (frame - FRAME_FOR_BEAN(startBEAN + 8 * 12)) / 70, Math.PI);
      const zoomLevel = clamp(0, (BEAN - startBEAN + 12) / (2 * 12) | 0, 8);
      this.scale = clamp(0, 0.4 + 0.075 * zoomLevel, 1);
    }

    render() {
      this.ctx.fillStyle = '#ffeead';
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.ctx.save();
      this.ctx.translate(8 * GU, 4.5 * GU);
      this.ctx.rotate(this.rotation);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.translate(-8 * GU, -4.5 * GU);

      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas, ...this.bubbles]) {
        this.ctx.strokeStyle = `rgba(75,119,190, ${umbrella.opacity})`;
        this.ctx.lineWidth = 0.1 * GU;
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
