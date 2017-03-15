(function(global) {
  class IsoscrollerNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.leadAnalysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 1);

      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      //this.camera = new THREE.OrthographicCamera(-16 / 2, 16 / 2, 9 / 2, - 9 / 2, 1, 1000);
      this.camera = new THREE.PerspectiveCamera();
      this.camera.position.set(5, 10, 10);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.resize();

      this.scene = new THREE.Scene();
      this.background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.MeshBasicMaterial({
          color: 0xbeeb9f,
          side: THREE.BackSide
        }));
      this.scene.add(this.background);
      this.cube = new THREE.Mesh(
        new THREE.BoxGeometry(5, 0.5, 1000),
        new THREE.MeshStandardMaterial({
          color: 0x79bd8f
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

    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
    }

    update(frame) {
      this.cube.scale.x = 1 + 0.02 * this.leadAnalysis.getValue(frame);

      const frameOffset = 1444;
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
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.cube.position.z = frame / 10;

    }

    render(renderer) {
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }
  }

  global.IsoscrollerNode = IsoscrollerNode;
})(this);
