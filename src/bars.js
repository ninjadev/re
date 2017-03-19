(function(global) {

  class bars extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
      });

      this.scene.background = new THREE.Color(0xF3C13A);

      this.cubes = [];
      for (let i=0; i < 20; i++) {
        const cube = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 40, 32),
                                    new THREE.MeshToonMaterial({color: 0x875F9A }));
        cube.rotation.y = 1;
        cube.scale.y = 0.01;
        cube.position.x = 100000;
        this.scene.add(cube);
        this.cubes.push(cube);
      }

      const light = new THREE.PointLight(0xffffff, 1, 500);
      light.position.set(0, 10, 0);
      this.scene.add(light);
    }

    update(frame) {
      super.update(frame);

      const relativeBEAN = (BEAN / 12 - 55) | 0;
      for (const [i, cube] of this.cubes.entries()) {
        if (relativeBEAN > this.cubes.length) {
          if (relativeBEAN > 62) {
            cube.scale.y = (BEAN / 3 - 230) / 10 + 0.5;
          } else {
            cube.scale.y = 0.5 + 0.25 * Math.sin((i * 4 + frame) / 10);
            cube.position.y = 5 * Math.sin((i * 4 + frame) / 10);
          }
        } else {
          cube.position.y = 0;
          cube.scale.y = 0.02;
        }
        if (i < relativeBEAN) {
          cube.position.x = 20 * (i - 10);
        } else {
          cube.position.x = 100000;
        }
      }
    }
  }

  global.bars = bars;
})(this);
