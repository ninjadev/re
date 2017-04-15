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

      this.black = '#000000';
      this.white = '#ffffff';
      this.pink = '#ff00a2';
      this.blue = '#0092dd';
      this.green = '#20db7a';
      this.bgcolor = this.white;
      this.colorNIN = this.white;
      this.colorJA = this.white;
      this.colorDEV = this.white;
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

      if (BEAT) {
        //if (BEAN == 12 * 4 * 97 + 32) this.colorNIN = this.black;
        //if (BEAN == 12 * 4 * 97 + 32 + 5) this.colorJA = this.black;
        //if (BEAN == 12 * 4 * 97 + 32 + 5 + 5) this.colorDEV = this.black;
        if (BEAN == 12 * 4 * 98+1 || BEAN == 4849) {
          this.colorNIN = this.black;
          this.colorJA = this.black;
          this.colorDEV = this.black;
        }
        if (BEAN == 12 * 4 * 98 + 24 || BEAN == 12 * 4 * 98 + 24 + 9 || BEAN == 12 * 4 * 98 + 24 + 9 + 8) {
          this.flippState();
        }
      }
      this.cameraDDX += -this.cameraDX * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100);
      this.cameraDDY += -this.cameraDY * 0.9 + (Math.random() - 0.5) * smoothstep(0, 1, (frame-startFrame)/100);
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
      this.ctx.translate(this.cameraX * GU, this.cameraY * GU);
      
      this.ctx.fillStyle = this.colorNIN;
      this.ctx.font = 'bold ' + (1.5 * GU) + 'pt outrun';
      this.ctx.textBaseline = 'middle';

      this.ctx.fillText('NIN', 1.3 * GU, 4.5 * GU);

      this.ctx.fillStyle = this.colorJA;
      this.ctx.fillText('JA', 5.8 * GU, 4.5 * GU);

      this.ctx.fillStyle = this.colorDEV;
      this.ctx.fillText('DEV', 9.2 * GU, 4.5 * GU);
      
      this.ctx.restore();

      this.output.needsUpdate = true;
      this.outputs.render.setValue(this.output);
    }

    flippState() {
      this.bgcolor = this.bgcolor == this.black ? this.white : this.black;
      this.colorNIN = this.colorNIN == this.black ? this.pink : this.black;
      this.colorJA = this.colorJA == this.black ? this.blue : this.black;
      this.colorDEV = this.colorDEV == this.black ? this.green : this.black;
    }
  }

  global.ninEnd = ninEnd;
})(this);
