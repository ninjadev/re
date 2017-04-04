(function(global) {
  class NINFloor {
    constructor() {
      this.pattern = [
        [1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,0,0,0,0,1,1],
        [1,1,0,0,0,1,1,1,0,0,1,1,1,1,0,0,0,0,0,0,1,1],
        [1,1,1,0,0,0,1,1,1,0,1,1,1,1,1,0,0,0,0,0,1,1],
        [1,1,1,1,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,0,1,1],
        [1,1,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1],
        [1,1,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,1,1],
        [1,1,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,1,1],
        [1,1,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1,1,1,1,1],
        [1,1,0,0,0,0,1,1,1,0,1,0,1,1,1,0,0,0,1,1,1,1],
        [1,1,0,0,0,0,0,1,1,1,1,1,0,1,1,1,0,0,0,1,1,1],
        [1,1,0,0,0,0,0,0,1,1,1,1,0,0,1,1,1,0,0,0,1,1],
        [1,1,0,0,0,0,0,0,0,1,1,1,0,0,0,1,1,1,0,0,0,1],
      ];

      const texture = Loader.loadTexture('res/obsidian564x564.jpg');

      this.mesh = new THREE.Object3D();
      for (let [x, row] of this.pattern.entries()) {
        for (let [z, elm] of row.entries()) {
          if (elm == 0) { continue;  }

          const cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(14, 10, 15),
            new THREE.MeshBasicMaterial({
              map: texture,
            }));

          cube.position.set((z - 11.5) * 20 + Math.random(), 0, (x - 5.5) * 20 + Math.random());
          this.mesh.add(cube);
        }
      }
    }
  }

  class LavaFloor {
    constructor() {
      const W = 20;
      const N = 15;
      const texture = Loader.loadTexture('res/lava128x128.jpg');
      this.mesh = new THREE.Object3D;
      for (let x=-N; x<N; x++) {
        for (let y=-N; y<N; y++) {
          const geometry = new THREE.BoxBufferGeometry(W, 2, W);
          const material = new THREE.MeshBasicMaterial({
            map: texture,
          });
          const tile = new THREE.Mesh(geometry, material);
          tile.position.set(x * W, 0, y * W);
          this.mesh.add(tile);
        }
      }
    }

    update(frame) {
      for (const [i, tile] of this.mesh.children.entries()) {
        tile.position.y = Math.sin(frame / 20  + i);
      }
    }
  }

  class lavaNode extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
        outputs: {
          render: new NIN.TextureOutput(),
        }
      });

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 200;
      this.camera.position.y = 100;

      this.lava = new LavaFloor();
      this.scene.add(this.lava.mesh);

      this.nin = new NINFloor();
      this.nin.mesh.position.y = 10;
      this.scene.add(this.nin.mesh);

      this.skybox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(1000, 1000, 1000),
        new THREE.ShaderMaterial(SHADERS[options.shader])
      );

      this.skybox.material.side = THREE.BackSide;
      this.scene.add(this.skybox);
    }

    update(frame) {
      const baseFrame = 7260;
      super.update(frame);
      this.lava.update(frame);
      this.nin.mesh.position.y = lerp(-7, 0, (frame - baseFrame) / 250);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.skybox.material.uniforms.frame.value = frame;
    }
  }

  global.lavaNode = lavaNode;
})(this);
