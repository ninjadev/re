(function(global) {
  class umbrellas extends NIN.Node {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.kickThrob = 0;

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;

      this.umbrellas = [];
      for (let i=0; i < 14; i++) {
        this.umbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.twombrellas = [];
      for (let i=0; i < 10; i++) {
        this.twombrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.threembrellas = [];
      for (let i=0; i < 6; i++) {
        this.threembrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.fourmbrellas = [];
      for (let i=0; i < 2; i++) {
        this.fourmbrellas[i] = {
          progress: 0,
          x: 8,
          y: 4.5,
        };
      }

      this.transishbrellas = [
        {
          progress: 0,
          x: 4,
          y: 3,
        },
        {
          progress: 0,
          x: 12,
          y: 3,
        },
        {
          progress: 0,
          x: 4,
          y: 6,
        },
        {
          progress: 0,
          x: 12,
          y: 6,
        }
      ];

      this.bubbles = [];
      for (let i=0; i < 13; i++) {
        this.bubbles[i] = {
          x: 8 + (i%3 - 1) * 4,
          y: 4.5,
          radius: 1,
          progress: Math.PI * 2,
          opacity: 0,
        };
      }

      this.twobbles = [];
      for (let i=0; i < 5; i++) {
        this.twobbles[i] = {
          x: 8 + (2 - i) * 8,
          y: 6,
          radius: 0.1,
          progress: Math.PI * 2,
          opacity: 0,
        };
      }

      this.zoomLevel = 0;

      this.aSquareSize = 0;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      this.frame = frame;
      this.kickThrob *= 0.95;
      if(this.kickThrob < 0.01) {
        this.kickThrob = 0;
      }
      if(BEAT && BEAN % 12 == 0) {
        this.kickThrob = 1;
      }

      const spacing = 6;
      const startBEAN = 100 * 12;
      const partTwoFrame = FRAME_FOR_BEAN(startBEAN + 16 * 12) - 20;
      for (const [i, umbrella] of this.umbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = 8 + spacing * (frame - startFrame) / 25;
      }

      for (const [i, umbrella] of this.twombrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 4 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.x = 8 - spacing * (frame - startFrame) / 25;
      }

      for (const [i, umbrella] of this.threembrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 8 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = 4.5 + spacing * (frame - startFrame) / 25;
      }

      for (const [i, umbrella] of this.fourmbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 12 + 12 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (i + frame - partTwoFrame) / 30);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        umbrella.y = 4.5 - spacing * (frame - startFrame) / 25;
      }

      for (const [i, umbrella] of this.transishbrellas.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 3 + 14.75 * 12);
        umbrella.progress = clamp(0, (frame - startFrame) / 2, Math.PI*2);
        umbrella.radius = clamp(1, 1 + (frame - startFrame) / 10, 100);
        umbrella.progress = smoothstep(umbrella.progress, 0, (frame - partTwoFrame - i * 3) / 20);
        umbrella.opacity = clamp(0, 1 - (frame - startFrame) / 500, 1);
        //umbrella.y = 4.5 - spacing * (frame - startFrame) / 25;
      }

      for (const [i, bubble] of this.bubbles.entries()) {
        const startFrame = FRAME_FOR_BEAN(startBEAN + i * 8 + 16 * 12);
        if (frame > startFrame) {
          bubble.opacity = 1;
        } else {
          bubble.opacity = 0;
        }
        bubble.radius = clamp(0, (frame - startFrame) / 5, 100);
        bubble.y = 3 + spacing * (frame - startFrame) / 25;
      }

      const twobbleBEANS = [
        startBEAN + 24 * 12 + 1.5 * 12,
        startBEAN + 24 * 12 + 2 * 12,
        startBEAN + 24 * 12 + 2.5 * 12,
        startBEAN + 24 * 12 + 3 * 12,
        startBEAN + 24 * 12 + 3.5 * 12,
      ];
      for (const [i, bubble] of this.twobbles.entries()) {
        const startFrame = FRAME_FOR_BEAN(twobbleBEANS[i]);
        if (frame > startFrame) {
          bubble.opacity = 1;
        } else {
          bubble.opacity = 0;
        }
        bubble.radius = clamp(0, (i * 12 + frame - startFrame) / 8, 100);
        const yolo = clamp(0, (BEAN - 30 * 12 - 6 - startBEAN) / 1 | 0, 4);
        const yolo2 = (BEAN - 31 * 12 + 6 - startBEAN) / 3 | 0;
        bubble.progress = clamp(0, 1 - yolo * 0.125 - yolo2 * 0.125, 1) * Math.PI * 2;
      }

      this.rotation = clamp(0, (frame - FRAME_FOR_BEAN(startBEAN + 8 * 12)) / 70, Math.PI);
      const zoomLevel = clamp(0, (BEAN - startBEAN) / (2 * 12), 8);
      if ((zoomLevel | 0) % 2) {
        this.foregroundColor = '#0092dd';
        this.backgroundColor = '#00a2ff';
      } else {
        this.foregroundColor = '#00a2ff';
        this.backgroundColor = '#0092dd';
      }
      this.aSquareSize = (zoomLevel % 1) * 2;
      this.scale = clamp(0, 0.4 + 0.075 * zoomLevel, 1);

      this.scale = smoothstep(this.scale, 0.6, (frame - FRAME_FOR_BEAN(startBEAN + 23.75 * 12)) / 40);
      this.scale = easeOut(this.scale, 0.3, (frame - FRAME_FOR_BEAN(startBEAN + 23.75 * 12)) / 160);
    }

    render() {

      let zoomSwitchStart = FRAME_FOR_BEAN(12 * 4 * 26.5);
      let zoomSwitchEnd = FRAME_FOR_BEAN(12 * 4 * 26.75 + 6);
      let zoomSwitchPivotEnd = FRAME_FOR_BEAN(12 * 4 * 27);
      let zoomSwitchPivot = FRAME_FOR_BEAN(12 *4 * 26.75);
      let zoomSwitchProgress = (this.frame - zoomSwitchStart) / (zoomSwitchEnd - zoomSwitchStart);
      let zoomSwitchScaler = Math.pow(2, smoothstep(0, 4, zoomSwitchProgress));
      let zoomSwitchX = lerp(0, -10, zoomSwitchProgress);
      let zoomSwitchUmbrellaScaler = 1;

      let startXTranslater = smoothstep(-7, 0, (this.frame - 2856) / 25);

      let colorA = '#0092dd';
      let colorAShadowStart = '#006688';
      let colorAShadowEnd = '#0088aa';
      let colorB = '#ff00a2';
      let colorBShadowStart = '#880066';
      let colorBShadowEnd = '#aa0088';

      if(this.frame > zoomSwitchPivot) {
        zoomSwitchX = 0;
        zoomSwitchScaler = 1;
        zoomSwitchUmbrellaScaler = smoothstep(0, 3,
            (this.frame - zoomSwitchPivot) / (zoomSwitchPivotEnd - zoomSwitchPivot));
        zoomSwitchUmbrellaScaler = smoothstep(zoomSwitchUmbrellaScaler, 1,
            (this.frame - zoomSwitchPivot) / (zoomSwitchPivotEnd - zoomSwitchPivot));
        colorB = '#0092dd';
        colorBShadowStart = '#006688';
        colorBShadowEnd = '#0088aa';
        colorA = '#ff00a2';
        colorAShadowStart = '#880066';
        colorAShadowEnd = '#aa0088';
      }
      this.ctx.fillStyle = colorA;
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);
      this.ctx.save();
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.globalAlpha = 0.2 * this.kickThrob;
      this.ctx.fillStyle = 'white';
      //this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);
      this.ctx.restore();

      this.ctx.save();
      this.ctx.translate(8 * GU, 4.5 * GU);
      this.ctx.rotate(this.rotation);
      this.ctx.scale(this.scale, this.scale);
      this.ctx.scale(zoomSwitchScaler, zoomSwitchScaler);
      this.ctx.translate(-8 * GU, -4.5 * GU);
      this.ctx.translate(zoomSwitchX * GU, 0);
      this.ctx.translate(startXTranslater * GU, 0);

      let shadowGradient = this.ctx.createLinearGradient(0, 0, 0, 20 * GU);
      shadowGradient.addColorStop(0, colorAShadowStart);
      shadowGradient.addColorStop(1, colorAShadowEnd);
      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas, ...this.bubbles, ...this.twobbles, ...this.transishbrellas]) {
        if(umbrella.opacity > 0) {
          this.ctx.save();
          this.ctx.fillStyle = shadowGradient;
          this.ctx.translate(umbrella.x * GU, umbrella.y * GU);
          this.ctx.rotate(-Math.PI / 4);
          this.ctx.rotate(-this.rotation);
          const radius = umbrella.progress * 0.3 * GU * zoomSwitchUmbrellaScaler;
          this.ctx.fillRect(-radius, 0, radius * 2, 100 * GU);
          this.ctx.restore();
        }
      }

      for (const umbrella of [...this.umbrellas, ...this.twombrellas, ...this.threembrellas, ...this.fourmbrellas, ...this.bubbles, ...this.twobbles, ...this.transishbrellas]) {
        if(umbrella.opacity == 0) {
          continue;
        }
        this.ctx.strokeStyle = '#002244';
        this.ctx.fillStyle = colorB;
        this.ctx.lineWidth = 0.1 * GU;
        this.ctx.beginPath();
        const radius = umbrella.progress * 0.3 * GU * zoomSwitchUmbrellaScaler;
        this.ctx.arc(umbrella.x * GU, umbrella.y * GU, radius, 0, Math.PI * 2);
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
