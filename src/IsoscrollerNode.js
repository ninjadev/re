(function(global) {
  class IsoscrollerNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          percolator: new NIN.Input()
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.leadAnalysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 1);
      this.circleThrob = 0;
      this.noteNumbers = 0;
      this.boxBoomScale = 1;

      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 1000);
      this.camera.position.set(5, 10, 10);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.resize();

      this.scene = new THREE.Scene();

      this.background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.ShaderMaterial(SHADERS.zigzag));
      this.background.material.side = THREE.BackSide;
      this.scene.add(this.background);
      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.5, 1000),
        new THREE.MeshStandardMaterial({
          color: 0xff00a2
        }));
      this.scene.add(this.cube);

      var light = new THREE.PointLight( 0xffffff, 1, 100 );
      light.position.set( -50, -50, -50 );
      this.scene.add(light);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);

      this.scene.add(new THREE.AmbientLight(0xffffff));

      this.boxes = [];
      this.boxShadows = [];
      for(let i = 0; i < 20; i++) {
        const box = new THREE.Mesh(
          new THREE.BoxGeometry(1, 1, 1),
          new THREE.MeshStandardMaterial({
            color: 0x00a2ff,
            roughness: 1,
            shading: THREE.SmoothShading
          }));
        box.position.y = 2;
        this.boxes.push(box);
        this.scene.add(box);
        const boxShadow = new THREE.Mesh(
          new THREE.BoxGeometry(1, 0.1, 1),
          new THREE.MeshStandardMaterial({
            color: 0x3c0026,
            roughness: 1,
            shading: THREE.SmoothShading
          }));
        boxShadow.position.y = 0.21;
        this.boxShadows.push(boxShadow);
        this.scene.add(boxShadow);
      }

      this.textCanvas = document.createElement('canvas');
      this.textCanvas.width = 2048;
      this.textCanvas.height = 128;

      this.textCtx = this.textCanvas.getContext('2d');

      this.nameOfDemoTexture = new THREE.Texture(this.textCanvas);
      this.nameOfDemoMaterial = new THREE.MeshBasicMaterial({
        map: this.nameOfDemoTexture,
        transparent: true,
      });

      if (!document.getElementById('vcr-font')) {
        var s = document.createElement('style');
        s.setAttribute('id', 'vcr-font');
        Loader.loadAjax('res/vcr.otf.base64', response => {
          s.innerHTML = [
            '@font-face {',
            'font-family: "vcr";',
            'src: url(data:application/x-font-opentype;charset=utf-8;base64,' + response + ') format("opentype");',
            '}'
          ].join('\n');
        });
        document.body.appendChild(s);
      }
      this.nameOfDemo = new THREE.Mesh(
        new THREE.BoxGeometry(0, 4, 64),
        this.nameOfDemoMaterial
      );
      this.nameOfDemo.position.x = -4;
      this.nameOfDemo.position.z = -60;
      this.nameOfDemo.rotation.z= Math.PI / 2;
      this.scene.add(this.nameOfDemo);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
    }

    update(frame) {
      this.nameOfDemo.position.z = (frame - 1000) / 10 - 50 +
        easeOut(0, 10, (frame - 999) / 60) +
        easeIn(0, 10, (frame - 1585) / 60);

      this.cube.scale.x = 1 + 0.02 * this.leadAnalysis.getValue(frame);
      this.background.material.uniforms.frame.value = frame;
      this.background.material.uniforms.amount.value = easeOut(
          0,
          1,
          (frame - 968 + 10 ) / (1051 - 968));

      if(frame == 997) {
        this.noteNumbers = 1;
        for(let i = 0; i < this.boxes.length; i++) {
          this.boxes[i].position.z = -i * 2;
        }
        for(let i = 0; i < this.boxShadows.length; i++) {
          this.boxShadows[i].position.z = -i * 2;
        }
      }

      for(let i = 0; i < this.boxes.length; i++) {
        const box = this.boxes[i];
        this.scene.remove(box);
        box.position.z += 0.035;
        if(i < this.noteNumbers) {
          this.scene.add(box);
        }
        const boxShadow = this.boxShadows[i];
        this.scene.remove(boxShadow);
        boxShadow.position.z += 0.035;
        if(i < this.noteNumbers) {
          this.scene.add(boxShadow);
        }

        const frameOffset = 1637 - 21;
        const transitionTime2 = 60 * 60 / 130 / 2;

        box.rotation.y = smoothstep(0, Math.PI / 2, (frame - 1529 + 40 - i * 3) / 10);
        boxShadow.rotation.y = smoothstep(0, Math.PI / 2, (frame - 1529 + 40 - i * 3) / 10);

        box.rotation.y = smoothstep(box.rotation.y, Math.PI, (frame - frameOffset + transitionTime2 - i * 3) / 10);

        if(frame == 1526) {
          this.boxBoomScale = 2;
        }
        this.boxBoomScale *= 0.999;
        if(this.boxBoomScale < 1) {
          this.boxBoomScale = 1;
        }
        box.scale.x = 1 / this.boxBoomScale;
        box.scale.y = this.boxBoomScale;
        box.scale.z = 1 / this.boxBoomScale;
        boxShadow.scale.x = 1 / this.boxBoomScale;
        boxShadow.scale.z = 1 / this.boxBoomScale;
      }

      this.circleThrob *= 0.93;
      if(this.circleThrob < 0.5) {
        this.circleThrob = 0.5;
      }
      if(this.inputs.percolator.getValue() && frame > 996) {
        this.circleThrob = 1;
        this.noteNumbers++;
      }

      const frameOffset = 1637;
      const frameOffset2 = 1882;
      const transitionTime = 60 * 60 / 130;
      const transitionTime2 = 60 * 60 / 130 / 2;
      const t = (frame - frameOffset + transitionTime) / transitionTime;
      this.camera.position.x = smoothstep(5, 0, t);
      this.camera.position.y = 10;
      this.camera.position.z = smoothstep(10, 5, t);
      if(frame > frameOffset2 - transitionTime2) {
        this.camera.position.y = smoothstep(10, 5, (frame - frameOffset2 + transitionTime2) / transitionTime2);
        this.camera.position.z = smoothstep(5, 0, (frame - frameOffset2 + transitionTime2) / transitionTime2);
      }
      this.camera.lookAt(new THREE.Vector3(0, smoothstep(0, 4, t), 0));
      this.background.rotation.copy(this.camera.rotation);

      this.cube.position.z = 500 + easeOut(9, -25,
          (frame - 996) / (1051 - 996));

      if(demo.nm.nodes.isoscroller_vignette) {
        demo.nm.nodes.isoscroller_vignette.uniforms.amount.value = 
          easeOut(0., 1., (frame - 968) / (996 - 968));
      }
    }

    render(renderer) {
      this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
      this.textCtx.font = '40pt vcr';
      this.textCtx.fillStyle = 'white';
      this.textCtx.fillText('NINJADEV PRESENTS: A DEMO CALLED «WHAT ARE YOU SYNCING ABOUT?»', 0, this.textCanvas.height / 2);
      this.nameOfDemoTexture.needsUpdate = true;
      this.nameOfDemoMaterial.needsUpdate = true;

      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }
  }

  global.IsoscrollerNode = IsoscrollerNode;
})(this);
