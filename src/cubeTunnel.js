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
      for(var i=0; i<16; i++) {
        var newCube = new THREE.Mesh(new THREE.BoxGeometry(5, 5, 5),
                                     new THREE.MeshBasicMaterial({ color: 0x000fff }));
        this.spawningCubes.push(newCube);
        this.spawningCubes[i].position.x = 1000;
        this.scene.add(this.spawningCubes[i]);
      }

      this.camera.position.z = 100;
    }

    update(frame) {
      var startBEAN = 3792 + 12 * 4;

      var relativeBEAN = BEAN - startBEAN;
      var cubeID = Math.max(0, Math.floor(relativeBEAN / 6));

      for(var i=cubeID; i<16; i++) {
        this.spawningCubes[i].position.x = 1000;
      }


      if (cubeID >= 0 && cubeID < 16 && ((cubeID+1)%4)) {
        this.spawningCubes[cubeID].position.x = 20 * Math.sin(cubeID/16*2*Math.PI);
        this.spawningCubes[cubeID].position.y = 20 * Math.cos(cubeID/16*2*Math.PI);
      }      
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
