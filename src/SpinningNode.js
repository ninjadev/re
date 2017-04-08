(function(global) {
  class Supersphere {
    constructor(defaultColor) {
      this.defaultColor = defaultColor;
      this.mesh = new THREE.Object3D();

      const radius = 100;
      const sphereLayers = 40;
      const sphereRadius = 4;
      const sphereGeometry = new THREE.SphereBufferGeometry(sphereRadius, 32, 32);

      for (let i=0; i<sphereLayers; i++) {
        const angle = Math.PI * i / (sphereLayers - 1);
        const radiusOfPlane = Math.sin(angle) * radius;

        // This is the correct version
        const spheresInPlane = 8;
        const x = Math.cos(angle) * radius;

        const spheresOfPlane = new THREE.Object3D();

        for (let j=0; j<spheresInPlane; j++) {
          const radiansIntoPlane = 2 * Math.PI * j / spheresInPlane;
          const y = Math.cos(radiansIntoPlane) * radiusOfPlane;
          const z = Math.sin(radiansIntoPlane) * radiusOfPlane;

          const square = new THREE.Mesh(
            sphereGeometry,
            new THREE.MeshStandardMaterial({
              color: this.defaultColor,
            }));

          square.position.set(x, y, z);
          spheresOfPlane.add(square);
        }

        this.mesh.add(spheresOfPlane);
      }
    }

    setNextColor(nextColor) {
      this.nextColor = nextColor;
    }

    update(frame) {
      let prevColor = undefined;
      let nextColor = this.nextColor || this.defaultColor;

      for (const [i, circles] of this.mesh.children.entries()) {
        if (circles.children.length === 0) continue;

        prevColor = circles.children[0].material.color;

        circles.rotation.x = Math.sin(i/9 + frame / 300);

        for (const circle of circles.children) {
          circle.material.color = nextColor;
          circle.material.emissive = nextColor;
        }

        nextColor = prevColor;
      }

      this.nextColor = null;

      // for (const [i, circles] of this.mesh.children.entries()) {
      //   circles.rotation.x = frame / 40 / (20.1 - i);
      // }
    }
  }

  class SpinningNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        inputs: {
          percolator: new NIN.Input()
        }
      });

      this.analysis = new audioAnalysisSanitizer('stem_flute.wav', 'spectral_energy', 1.0);

      this.background = new THREE.Mesh(
          new THREE.BoxGeometry(1000, 1000, 1000),
          new THREE.MeshToonMaterial({
            color: 0x0c0716,
            side: THREE.BackSide,
          }));

      this.scene.add(this.background);

      var light = new THREE.PointLight( 0xffffff, 1, 100 );
      light.position.set( -50, -50, -50 );
      this.scene.add(light);

      var pointLight = new THREE.PointLight(0xFFFFFF);
      pointLight.position.x = 10;
      pointLight.position.y = 50;
      pointLight.position.z = 130;
      this.scene.add(pointLight);

      this.colorIdx = 0;
      this.colors = [
        new THREE.Color(0x961A96),
        new THREE.Color(0x754F8E),
        new THREE.Color(0x20db7a),
        new THREE.Color(0x518B86),
      ];
      this.s = new Supersphere(new THREE.Color(0x000000));
      this.scene.add(this.s.mesh);

      this.resize();
    }

    update(frame) {
      super.update(frame);

      if (this.analysis.getValue(frame) > 3.5) {
        const idx = this.colorIdx++ % this.colors.length;
        this.s.setNextColor(this.colors[idx]);
      }

      if (frame >= 4435 && frame <= 4510) {
        this.s.setNextColor(this.colors[0]);
      }

      this.s.update(frame);
    }
  }

  global.SpinningNode = SpinningNode;
})(this);
