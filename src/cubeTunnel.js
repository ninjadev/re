(function(global) {
  class cubeTunnel extends NIN.Node {

    

    constructor(id, options) {
      super(id, {
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
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      this.spawningCubes = [];
      for(var i=0; i<12; i++) {
        var newCube = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 8),
                                     new THREE.MeshBasicMaterial({ color: 0x000fff }));
        this.spawningCubes.push(newCube);
        this.spawningCubes[i].position.x = 1000;
        this.scene.add(this.spawningCubes[i]);
      }

      this.camera.position.z = 100;
    }

    update(frame) {
      var startBEAN = 3840;

      var relativeBEAN = BEAN - startBEAN;

      var slideDuration = 12;
      var cornerSlideDuration = 24;

      this.spawningCubes[0].position.x = -4;
      this.spawningCubes[0].position.y = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 0) + slideDuration)/ slideDuration);
      this.spawningCubes[1].position.x = 4;
      this.spawningCubes[1].position.y = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 6) + slideDuration)/ slideDuration);

      this.spawningCubes[3].position.x = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 24) + slideDuration)/ slideDuration);
      this.spawningCubes[3].position.y = -4;
      this.spawningCubes[4].position.x = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 30) + slideDuration)/ slideDuration);
      this.spawningCubes[4].position.y = 4;

      this.spawningCubes[6].position.x = 4;
      this.spawningCubes[6].position.y = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 42) + slideDuration)/ slideDuration);
      this.spawningCubes[7].position.x = -4;
      this.spawningCubes[7].position.y = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 48) + slideDuration)/ slideDuration);
 
      this.spawningCubes[9].position.x = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 60) + slideDuration)/ slideDuration);
      this.spawningCubes[9].position.y = 4;
      this.spawningCubes[10].position.x = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 66) + slideDuration)/ slideDuration);
      this.spawningCubes[10].position.y = -4;

      this.spawningCubes[2].position.x = 12;
      this.spawningCubes[2].position.y = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 12) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[5].position.x = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 36) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[5].position.y = 12;
      this.spawningCubes[8].position.x = -12;
      this.spawningCubes[8].position.y = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 54) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[11].position.x = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 72) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[11].position.y = -12;
    }

    render(renderer) {
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
     }
  }

  global.cubeTunnel = cubeTunnel;
})(this);