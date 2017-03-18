(function(global) {
  class Supersphere {
    constructor(defaultColor) {
      this.defaultColor = defaultColor;
      this.mesh = new THREE.Object3D();
      const radius = 100;
      const segmentsPerHalf = 25;

      const triangleSize = Math.PI * radius / segmentsPerHalf / 4;

      for (let i=0; i<=segmentsPerHalf; i++) {
        const angle = Math.PI * i / segmentsPerHalf;
        const radiusOfPlane = Math.sin(angle) * radius;
        const trianglesInPlane = Math.PI * radiusOfPlane / triangleSize;
        const x = Math.cos(angle) * radius;

        const trianglesOfPlane = new THREE.Object3D();

        for (let j=0; j<trianglesInPlane; j++) {
          const radiansIntoPlane = 2 * Math.PI * j / trianglesInPlane;
          const y = Math.cos(radiansIntoPlane) * radiusOfPlane;
          const z = Math.sin(radiansIntoPlane) * radiusOfPlane;

          const square = new THREE.Mesh(
            new THREE.SphereGeometry(triangleSize),
            new THREE.MeshBasicMaterial({
              color: this.defaultColor,
            }));

          square.position.set(x, y, z);
          trianglesOfPlane.add(square);
        }

        this.mesh.add(trianglesOfPlane);
      }
    }

    push(newColor) {
      let prevColor = undefined;
      for (const circles of this.mesh.children) {
        if (circles.children.length === 0) continue;

        prevColor = circles.children[0].material.color;

        for (const circle of circles.children) {
          circle.material.color = newColor;
        }

        newColor = prevColor;
      }
    }

    update(frame) {
      this.push(this.defaultColor);
      for (const [i, circles] of this.mesh.children.entries()) {
        circles.rotation.x = frame / 40 / (20.1 - i);
      }
    }
  }

  class SpinningNode extends NIN.Node {
    constructor(id) {
      super(id, {
        inputs: {
          percolator: new NIN.Input()
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });

      const ninTexture = Loader.loadTexture('res/nin.png');

      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);
      this.cube = new THREE.Mesh(new THREE.BoxGeometry(50, 50, 50),
                                 new THREE.MeshBasicMaterial({
                                   transparent: true,
                                   map: ninTexture,
                                   side: THREE.FrontSide,
                                   color: 0xffffff,
                                 }));

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
        new THREE.Color(0x94e700),
        new THREE.Color(0xc2e700),
        new THREE.Color(0xeaa500),
        new THREE.Color(0xf06d00),
        new THREE.Color(0xb04700),
      ];
      this.s = new Supersphere(new THREE.Color(0xeeeeee));
      this.scene.add(this.s.mesh);
      this.camera.position.x = 200;
    }

    update(frame) {
      if (this.inputs.percolator.getValue()) {
        const c = this.colors[this.colorIdx++ % this.colors.length];
        this.s.push(c);
        this.s.push(c);
        this.s.push(c);
        this.s.push(c);
        this.s.push(c);
      } else if (frame % 2 == 0) {
        this.s.update(frame);
      }

      this.camera.rotation.y = Math.PI / 2;
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
    }

    render(renderer) {
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }
  }

  global.SpinningNode = SpinningNode;
})(this);
