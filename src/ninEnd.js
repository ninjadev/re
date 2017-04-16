(function(global) {
  class ninEnd extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      if (!document.getElementById('outrun-font')) {
        var s = document.createElement('style');
        s.setAttribute('id', 'ooutrun-font');
        Loader.loadAjax('res/outrun.otf.base64', function(res) {
          s.innerHTML = [
            "@font-face {",
            "font-family: 'outrun';",
            "src: url(data:application/x-font-opentype;charset=utf-8;base64," + res +") format('opentype');",
            "}"
          ].join('\n');
        })
        document.body.appendChild(s);
      }

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvas.width = 16 * GU; 
      this.canvas.height = 9 * GU; 
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;


      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      this.cameraX = 0;
      this.cameraY = 0;
      this.cameraDX = 0;
      this.cameraDY = 0;
      this.cameraDDX = 0;
      this.cameraDDY = 0;


      var light = new THREE.PointLight( 0xffffff, 1, 100 );
      light.position.set( -50, -50, -50 );
      this.scene.add(light);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);

      this.camera.position.z = 100;
      this.frame = 0;

      this.black = '#190019';
      this.white = '#ffffff';
      this.pink = '#ff00a2';
      this.blue = '#0092dd';
      this.green = '#20db7a';
      this.blank = 'rgba(0,0,0,0)';
      this.initiate();
      this.resize();
    }

    resize() {
      super.resize();
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {
      this.frame = frame;
      var startFrame = FRAME_FOR_BEAN(12 * 4 * 99);

      if (frame < FRAME_FOR_BEAN(12 * 4 * 97) + 1) {
        this.initiate();
      }
      let t = 0;
      if (BEAN >= 12 * 4 * 97 + 24 + 1) {
        t = frame - FRAME_FOR_BEAN(12 * 4 * 97 + 24 + 1);
      }
      if (BEAN >= 12 * 4 * 98 - 12) {
        t = frame - FRAME_FOR_BEAN(12 * 4 * 98 - 12);
      }
      if (BEAN >= 12 * 4 * 98) {
        t = frame - FRAME_FOR_BEAN(12 * 4 * 98);
      }
      this.sizer = lerp(1, 1.2, t / 60);
      if (BEAT) {
        if (BEAN == 12 * 4 * 97 + 24 + 1) {
          this.bgcolor = this.pink;
          this.colorNIN = this.pink;
          this.colorJA = this.pink;
          this.colorDEV = this.pink;
          this.colorN = this.white;
          this.colorI = this.blank;
        }
        if (BEAN == 12 * 4 * 98 - 12) {
          this.bgcolor = this.blue;
          this.colorNIN = this.blue;
          this.colorJA = this.blue;
          this.colorDEV = this.blue;
          this.colorN = this.blank;
          this.colorI = this.white;
        }
        if (BEAN == 12 * 4 * 98) {
          this.bgcolor = this.green;
          this.colorNIN = this.green;
          this.colorJA = this.green;
          this.colorDEV = this.green;
          this.colorN = this.white;
          this.colorI = this.blank;
        }
        if (BEAN == 12 * 4 * 98 + 12) {
          this.initiate();
        }
        if (BEAN == 12 * 4 * 98 + 24) {
          this.bgcolor = this.black;
          this.colorNIN = this.pink;
          this.colorJA = this.black;
          this.colorDEV = this.black;
          this.colorN = this.blank;
          this.colorI = this.blank;
        }
        if (BEAN == 12 * 4 * 98 + 24 + 9) {
          this.bgcolor = this.white;
          this.colorJA = this.blue;
          this.colorDEV = this.white;
        }
        if (BEAN == 12 * 4 * 98 + 24 + 9 + 8) {
          this.bgcolor = this.black;
          this.colorDEV = this.green;
        }
        if (BEAN == 12 * 4 * 101) {
          this.colorNIN = this.blank;
          this.colorJA = this.blank;
          this.colorDEV = this.blank;
        }
      }
      this.overlayAlpha = lerp(0, 1, (frame - FRAME_FOR_BEAN(12 * 4 * 100 + 30)) / 50);
      this.rotator = smoothstep(0, -.2, (frame - FRAME_FOR_BEAN(12 * 4 * 98 + 24)) / 200);

      this.cameraDDX += -this.cameraDX * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDDY += -this.cameraDY * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100)/4;
      this.cameraDX = - this.cameraX * 0.5;
      this.cameraDY = - this.cameraY * 0.5;
      this.cameraDX *= 0.5;
      this.cameraDY *= 0.5;
      this.cameraDX += this.cameraDDX;
      this.cameraDY += this.cameraDDY;
      this.cameraX += this.cameraDX;
      this.cameraY += this.cameraDY;
      this.cameraX *= 0.5;
      this.cameraY *= 0.5;
    }

    render() {
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, 16*GU, 9*GU);

      this.ctx.save();
      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.rotate(this.rotator);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.translate(this.cameraX * GU, this.cameraY * GU);

      this.ctx.fillStyle = this.colorNIN;
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt outrun';
      this.ctx.textAlign = 'left';
      this.ctx.textBaseline = 'middle';

      this.ctx.fillText('NIN', 1.3 * GU, 4.5 * GU);

      this.ctx.fillStyle = this.colorJA;
      this.ctx.fillText('JA', 5.8 * GU, 4.5 * GU);

      this.ctx.fillStyle = this.colorDEV;
      this.ctx.fillText('DEV', 9.2 * GU, 4.5 * GU);

      this.ctx.restore();
      this.ctx.save();

      this.ctx.translate(8*GU, 4.5*GU);
      this.ctx.scale(this.sizer, this.sizer);
      this.ctx.translate(-8*GU, -4.5*GU);

      this.ctx.font = 'bold ' + (3 * GU) + 'pt outrun';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.fillStyle = this.colorN;
      this.ctx.fillText('N', 7.5 * GU, 4.5 * GU);

      this.ctx.fillStyle = this.colorI;
      this.ctx.fillText('I', 7.5 * GU, 4.5 * GU);

      this.ctx.restore();

      this.ctx.fillStyle = `rgba(0,0,0,${this.overlayAlpha})`;
      this.ctx.fillRect(0, 0, 16 * GU, 9 * GU);

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    initiate() {
      this.bgcolor = this.white;
      this.colorNIN = this.blank;
      this.colorJA = this.blank;
      this.colorDEV = this.blank;
      this.colorN = this.blank;
      this.colorI = this.blank;
      this.sizer = 1;
    }
  }

  global.ninEnd = ninEnd;
})(this);
