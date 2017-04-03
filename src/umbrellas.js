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

      this.aSquareSize = 0;
      this.foregroundColor = '#64db84';
      this.backgroundColor = '#84eb94';
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      const startBEAN = 100 * 12;
      const partTwoFrame = FRAME_FOR_BEAN(startBEAN + 16 * 12) - 20;
      for (const [i, umbrella] of this.umbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = clamp(8, 8 + (frame - startFrame) / 25, 20);
      }

      for (const [i, umbrella] of this.twombrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 4 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = clamp(-10, 8 - (frame - startFrame) / 25, 8);
      }

      for (const [i, umbrella] of this.threembrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 8 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = clamp(4.5, 4.5 + (frame - startFrame) / 25, 18);
      }

      for (const [i, umbrella] of this.fourmbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 12 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
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
      const zoomLevel = clamp(0, (BEAN - startBEAN + 12) / (2 * 12), 8);
      if ((zoomLevel | 0) % 2) {
        this.foregroundColor = '#64db84';
        this.backgroundColor = '#84eb94';
      } else {
        this.foregroundColor = '#84eb94';
        this.backgroundColor = '#64db84';
      }
      this.aSquareSize = (zoomLevel % 1) * 2;
      this.scale = clamp(0, 0.4 + 0.075 * zoomLevel, 1);
    }

    render() {
      this.ctx.fillStyle = '#64db84';
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.ctx.fillStyle = this.foregroundColor;
      this.roundRect(
        this.ctx,
        (8 - easeIn(4.5, 8, this.aSquareSize) * this.aSquareSize) * GU,
        (4.5 - 4.5 * this.aSquareSize) * GU,
        easeIn(9, 16, this.aSquareSize) * this.aSquareSize * GU,
        9 * this.aSquareSize * GU,
        easeIn(4.5, 0, this.aSquareSize * 0.5) * this.aSquareSize * GU,
        true,
        false);

      this.ctx.save();
      this.ctx.translate(8 * GU, 4.5 * GU);
      this.ctx.rotate(this.rotation);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.translate(-8 * GU, -4.5 * GU);

      let shadowGradient = this.ctx.createLinearGradient(0, 0, 0, 20 * GU);
      shadowGradient.addColorStop(0, '#408e54');
      shadowGradient.addColorStop(1, '#64db84');
      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas, ...this.bubbles]) {
        if(umbrella.opacity > 0) {
          this.ctx.save();
          this.ctx.fillStyle = shadowGradient;
          this.ctx.translate(umbrella.x * GU, umbrella.y * GU);
          this.ctx.rotate(-Math.PI / 4);
          this.ctx.rotate(-this.rotation);
          const radius = umbrella.progress * (1 * GU + 0.03 * umbrella.radius * GU)/ Math.PI / 2;
          this.ctx.fillRect(-radius, 0, radius * 2, 20 * GU);
          this.ctx.restore();
        }
      }

      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas, ...this.bubbles]) {
        this.ctx.strokeStyle = `rgba(0,0,0, ${umbrella.opacity})`;
        this.ctx.fillStyle = `rgba(242,133,33, ${umbrella.opacity})`;
        this.ctx.lineWidth = 0.2 * GU;
        this.ctx.beginPath();
        this.ctx.arc(umbrella.x * GU, umbrella.y * GU, umbrella.progress * (1 * GU + 0.03 * umbrella.radius * GU) / Math.PI / 2, 0, Math.PI * 2);
        this.ctx.stroke();
        this.ctx.fill();
      }
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    roundRect(ctx, x, y, width, height, radius, fill, stroke) {
      if (typeof stroke == 'undefined') {
        stroke = true;
      }
      if (typeof radius === 'undefined') {
        radius = 5;
      }
      if (typeof radius === 'number') {
        radius = {tl: radius, tr: radius, br: radius, bl: radius};
      } else {
        var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
        for (var side in defaultRadius) {
          radius[side] = radius[side] || defaultRadius[side];
        }
      }
      ctx.beginPath();
      ctx.moveTo(x + radius.tl, y);
      ctx.lineTo(x + width - radius.tr, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
      ctx.lineTo(x + width, y + height - radius.br);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
      ctx.lineTo(x + radius.bl, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
      ctx.lineTo(x, y + radius.tl);
      ctx.quadraticCurveTo(x, y, x + radius.tl, y);
      ctx.closePath();
      if (fill) {
        ctx.fill();
      }
      if (stroke) {
        ctx.stroke();
      }

    }
  }

  global.umbrellas = umbrellas;
})(this);
