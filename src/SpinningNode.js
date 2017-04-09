(function(global) {
  class Supersphere {
    constructor(defaultColor) {
      this.defaultColor = defaultColor;
      this.mesh = new THREE.Object3D();

      const radius = 100;
      const sphereLayers = 40;
      const sphereRadius = 4;
      const sphereGeometry = new THREE.SphereBufferGeometry(sphereRadius, 32, 32);

      this.cache = {};
      this.black = new THREE.Color('black');

      for (let i=0; i<sphereLayers; i++) {
        const angle = Math.PI * i / (sphereLayers - 1);
        const radiusOfPlane = Math.sin(angle) * radius;

        // This is the correct version
        const spheresInPlane = 8;
        const x = Math.cos(angle) * radius;

        const spheresOfPlane = new THREE.Object3D();
        spheresOfPlane.intensity = 0.0;

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

    update(frame, intensity) {
      let prevIntensity;
      let nextIntensity = intensity;

      for (const [i, circles] of this.mesh.children.entries()) {
        if (circles.children.length === 0) continue;

        circles.rotation.x = Math.sin(i/9 + frame / 300);

        prevIntensity = circles.intensity;
        circles.intensity = nextIntensity;

        let color;
        if (nextIntensity < 3.0) {
          color = this.black;
        } else if (nextIntensity in this.cache) {
          color = this.cache[nextIntensity];
        } else {
          const mixer = (nextIntensity - 3.0) / 1.0;
          const newColor = new THREE.Color(
            0.588 * mixer + 0.125 * (1 - mixer),
            0.101 * mixer + 0.858 * (1 - mixer),
            0.588 * mixer + 0.478 * (1 - mixer)
          );
          color = this.cache[nextIntensity] = newColor;
        }

        for (const circle of circles.children) {
          circle.material.color = color;
          circle.material.emissive = color;
        }

        nextIntensity = prevIntensity;
      }

      const startBEAN = 162.75 * 12;
      if (BEAN < startBEAN) return;

      for (const [i, circles] of this.mesh.children.entries()) {
        if ((((39 - i) / 8) | 0) < ((BEAN - startBEAN) / 3)) {
          for (const circle of circles.children) {
            circle.material.color = this.defaultColor;
            circle.material.emissive = this.defaultColor;
          }
        }
      }
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

      this.s = new Supersphere(new THREE.Color(0x000000));
      this.scene.add(this.s.mesh);

      this.resize();
    }

    update(frame) {
      super.update(frame);

      if (frame >= 4435 && frame <= 4610) {
        this.s.update(frame, 4.0);
      } else {
        this.s.update(frame, this.analysis.getValue(frame));
      }
    }
  }

  global.SpinningNode = SpinningNode;
})(this);
