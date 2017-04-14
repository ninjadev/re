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
      this.canvas.height = 10 * GU; 
      this.canvas.width = 10 * GU; 
      this.output = new THREE.VideoTexture(this.canvas);
      this.output.minFilter = THREE.LinearFilter;
      this.output.magFilter = THREE.LinearFilter;


      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

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
    }

    update(frame) {
      this.frame = frame;

      if (BEAT) {
        if (BEAN == 12 * 4 * 98 || BEAN == 4849) {
          this.colorNIN = this.black;
          this.colorJA = this.black;
          this.colorDEV = this.black;
        }
        if (BEAN == 12 * 4 * 98 + 24 || BEAN == 12 * 4 * 98 + 24 + 9 || BEAN == 12 * 4 * 98 + 24 + 9+ 8) {
          this.flippState();
        }
      }
    }

    render() {
      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, 10*GU, 10*GU);

      this.ctx.fillStyle = this.bgcolor;
      this.ctx.fillRect(0, 0, 10*GU, 10*GU);
      this.ctx.fillStyle = this.colorNIN;
      this.ctx.fillText('NIN', 20, 230);
      this.ctx.font = 'bold ' + (1 * GU) + 'pt outrun';

      this.ctx.fillStyle = this.colorJA;
      this.ctx.fillText('JA', 3.6*GU, 230);

      this.ctx.fillStyle = this.colorDEV;
      this.ctx.fillText('DEV', 5.8*GU, 230);

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
