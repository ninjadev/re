(function(global) {
  class Floor {
    constructor(pattern) {
      this.pattern = pattern;
      const width = 18;
      const padding = 2;

      const texture = Loader.loadTexture('res/obsidian564x564.jpg');

      this.mesh = new THREE.Object3D();
      for (let [x, row] of this.pattern.entries()) {
        for (let [z, elm] of row.entries()) {
          if (elm !== 1) { continue;  }

          const cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(width, 10, width),
            new THREE.MeshBasicMaterial({
              map: texture,
            }));

          cube.position.set(
            (z - this.pattern[0].length / 2) * (width + padding) + Math.random(),
            0,
            (x - this.pattern.length / 2) * (width + padding) + Math.random());
          this.mesh.add(cube);
        }
      }
    }
  }

  class NINFloor extends Floor {
    constructor() {
      const pattern = [
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

      super(pattern);
    }
  }

  class RevisionFloor extends Floor {
    constructor() {
      const pattern = [
        [ , , , , , , , , ,1,1,1, , , , , , , , , , , ],
        [ , , , , , ,1,1,1,1,1,1,1,1,1, , , , , , , , ],
        [ , , , , ,1, ,1,1, , , , , ,1,1,1,1, , , , , ],
        [ , , , ,1,1, ,1,1,1, , , ,1,1, ,1,1,1, , , , ],
        [ , , ,1, , , , , , , , , , , , , ,1,1,1, , , ],
        [ , ,1, , , , , ,1,1,1,1,1, , , , , ,1,1,1, , ],
        [ ,1,1, , , ,1,1,1,1,1,1,1,1,1, , , , ,1,1, , ],
        [ ,1, , , ,1, , , , , ,1,1,1,1,1, , , , ,1,1, ],
        [1, , , , ,1,1, , , , , , , ,1,1, , , , ,1,1, ],
        [1, , , ,1,1, , , , ,1,1, , , , ,1, , , ,1,1, ],
        [1,1, , ,1,1,1,1, ,1, , ,1, , ,1,1, , , ,1,1, ],
        [1,1, , ,1,1, , , ,1, , ,1, , ,1,1, , ,1,1, , ],
        [1,1, , ,1,1, , ,1,1,1,1, , , ,1,1, , ,1,1, , ],
        [1,1, , ,1, , ,1,1,1,1, , ,1, ,1,1, , ,1,1, , ],
        [1,1,1, , ,1, , ,1,1, , ,1,1,1,1, , , , ,1, , ],
        [ ,1,1, , , ,1, , , , , ,1,1,1,1, , , ,1,1, , ],
        [ ,1,1,1, , , ,1, , ,1,1,1,1,1, , ,1, ,1, , , ],
        [ , ,1,1,1, , , ,1,1,1,1,1, , , , ,1,1,1, , , ],
        [ , , ,1,1, , , , , , , , , , , , , ,1, , , , ],
        [ , ,1,1,1,1, , , ,1,1,1,1, , ,1,1,1, , , , , ],
        [ , ,1,1, ,1,1,1,1,1,1,1,1,1,1,1, , , , , , , ],
        [ , , , , , , , ,1,1,1,1,1, , , , , , , , , , ],
      ];

      super(pattern);
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
      this.nin.mesh.position.y = -7;
      this.scene.add(this.nin.mesh);

      this.revision = new RevisionFloor();
      this.revision.mesh.position.y = -7;
      this.scene.add(this.revision.mesh);

      this.skybox = new THREE.Mesh(
        new THREE.BoxBufferGeometry(700, 400, 700),
        new THREE.ShaderMaterial(SHADERS[options.shader])
      );

      this.skybox.position.y = 100;

      this.skybox.material.side = THREE.BackSide;
      this.scene.add(this.skybox);
    }

    update(frame) {
      const baseFrame = 7260;
      super.update(frame);
      this.lava.update(frame);

      this.nin.mesh.position.y = lerp(-7, 0, (frame - baseFrame) / 250);
      this.nin.mesh.position.y = lerp(this.nin.mesh.position.y, -7, (frame - baseFrame - 200) / 250);

      this.revision.mesh.position.y = lerp(-7, 0, (frame - baseFrame - 250) / 250);
      this.revision.mesh.position.y = lerp(this.revision.mesh.position.y, -7, (frame - baseFrame - 250 -150) / 250);

      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.skybox.material.uniforms.frame.value =  (BEAN - 2 + 5 * 3) % 24;
    }
  }

  global.lavaNode = lavaNode;
})(this);
