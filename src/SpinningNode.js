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
        spheresOfPlane.isFiring = false;
        spheresOfPlane.neighborIsFiring = false;

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

    update(frame, isFiring) {

      let neighborIsFiring;


      let length = this.mesh.children.length;
      for (const [i, circles] of this.mesh.children.entries()) {
        if (circles.children.length === 0) continue;


        if(BEAN >= (12 * 4 * 41 - 12)) {
          isFiring = false;
          circles.intensity = 1 - i / length;
        } else {
          circles.intensity *= 0.9;

          circles.previousIsFiring = circles.isFiring;
          circles.isFiring = neighborIsFiring;
          neighborIsFiring = circles.previousIsFiring;

          if(i == 0) {
            circles.isFiring = isFiring;
          }

          circles.rotation.x = Math.sin(i/9 + frame / 300);


          if(circles.isFiring) {
            circles.intensity = 1;
          }
        }

        let r, g, b;
        if(circles.intensity >= 0.5) {
          r = lerp(0.125, 0.588, (circles.intensity - 0.5) * 2);
          g = lerp(0.858, 0.101, (circles.intensity - 0.5) * 2);
          b = lerp(0.478, 0.588, (circles.intensity - 0.5) * 2);
        } else {
          r = Math.pow(lerp(0, 0.125, circles.intensity * 2), 2);
          g = Math.pow(lerp(0, 0.858, circles.intensity * 2), 5);
          b = Math.pow(lerp(0, 0.478, circles.intensity * 2), 2);
        }

        for (const circle of circles.children) {
          circle.material.color.setRGB(r, g, b);
          circle.material.emissive.setRGB(r, g, b);
        }
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
        this.s.update(frame, true);
      } else {
        let beat = false;
        if(BEAT) {
          switch(BEAN) {
            case 12 * 4 * 33:
            case 12 * 4 * 33.5 + 6:
            case 12 * 4 * 33.75 + 6:
            case 12 * 4 * 34.5:
            case 12 * 4 * 34.5 + 6:
            case 12 * 4 * 34.5 + 9:
            case 12 * 4 * 34.75 + 6:
            case 12 * 4 * 35 + 6:
            case 12 * 4 * 35.25 + 6:
            case 12 * 4 * 35.5 + 6:
            case 12 * 4 * 35.75:
            case 12 * 4 * 36.5 + 6:
            case 12 * 4 * 36.5 + 9:
            case 12 * 4 * 36.75 + 0:
            case 12 * 4 * 36.75 + 2:
            case 12 * 4 * 36.75 + 4:
            case 12 * 4 * 36.75 + 6:
            case 12 * 4 * 36.75 + 9:
            case 12 * 4 * 37:
            case 12 * 4 * 37 + 11:
            case 12 * 4 * 37 + 12:
            case 12 * 4 * 37.25 + 6:
            case 12 * 4 * 37.5 + 6:
            case 12 * 4 * 37.75 + 6:

            case 12 * 4 * 38:
            case 12 * 4 * 38.5 - 2:
            case 12 * 4 * 38.5:
            case 12 * 4 * 38.5 + 6:
            case 12 * 4 * 38.5 + 9:
            case 12 * 4 * 38.75:
            case 12 * 4 * 38.75 + 6:

            case 12 * 4 * 39:
            case 12 * 4 * 39 + 9 * 1:
            case 12 * 4 * 39 + 9 * 2:
            case 12 * 4 * 39 + 9 * 3:
            case 12 * 4 * 39 + 9 * 4:
            beat = true;
          }
        }
        this.s.update(frame, beat);
      }
    }
  }

  global.SpinningNode = SpinningNode;
})(this);
