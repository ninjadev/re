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

      this.top_material = new THREE.ShaderMaterial(SHADERS.topshader);

      this.spawningCubes = [];
      for(var i=0; i<12; i++) {
        var newCube = new THREE.Mesh(new THREE.BoxGeometry(8, 8, 0),
                                     this.top_material);
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
      this.spawningCubes[0].position.y = -12;
      this.spawningCubes[1].position.x = 4;
      this.spawningCubes[1].position.y = -12;

      this.spawningCubes[3].position.x = 12;
      this.spawningCubes[3].position.y = -4;
      this.spawningCubes[4].position.x = 12;
      this.spawningCubes[4].position.y = 4;

      this.spawningCubes[6].position.x = 4;
      this.spawningCubes[6].position.y = 12;
      this.spawningCubes[7].position.x = -4;
      this.spawningCubes[7].position.y = 12;
 
      this.spawningCubes[9].position.x = -12;
      this.spawningCubes[9].position.y = 4;
      this.spawningCubes[10].position.x = -12;
      this.spawningCubes[10].position.y = -4;

      this.spawningCubes[0].scale.x = 
      this.spawningCubes[0].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 0) + slideDuration)/ slideDuration);
      this.spawningCubes[1].scale.x = 
      this.spawningCubes[1].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 6) + slideDuration)/ slideDuration);

      this.spawningCubes[3].scale.x =
      this.spawningCubes[3].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 24) + slideDuration)/ slideDuration);
      this.spawningCubes[4].scale.x =
      this.spawningCubes[4].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 30) + slideDuration)/ slideDuration);

      this.spawningCubes[6].scale.x =
      this.spawningCubes[6].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 42) + slideDuration)/ slideDuration);
      this.spawningCubes[7].scale.x =
      this.spawningCubes[7].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 48) + slideDuration)/ slideDuration);
 
      this.spawningCubes[9].scale.x =
      this.spawningCubes[9].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 60) + slideDuration)/ slideDuration);
      this.spawningCubes[10].scale.x =
      this.spawningCubes[10].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 66) + slideDuration)/ slideDuration);

      easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 0) + slideDuration)/ slideDuration);

      this.spawningCubes[2].position.x = 12;
      this.spawningCubes[2].position.y = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 12) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[5].position.x = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 36) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[5].position.y = 12;
      this.spawningCubes[8].position.x = -12;
      this.spawningCubes[8].position.y = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 54) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[11].position.x = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 72) + cornerSlideDuration)/ cornerSlideDuration);
      this.spawningCubes[11].position.y = -12;

      //var beats = [0, 48, 96, 144, 192, 240, 288, 336];
      var beats = [0,  12,  24,  36,  48,  60,  72,  84,  96,  108,  120,  132,  144,  156,  168,  180,  192,  204,  216,  228,  240,  252,  264,  276,  288,  300,  312,  324,  336,  348,  360,  372,  384,  396,  408,  420,  432,  444,  456,  468,  480,  492,  504,  516,  528,  540,  552,  564,  576,  588];
      var passed_1 = -1;
      var passed_2 = -1;
      for (var i = 0; i < beats.length; i++) {
        if(BEAN > startBEAN + beats[beats.length - 1 - i]) {
          if (passed_1 == -1) {
            passed_1 = beats.length - 1 - i;
          } else if (passed_2 == -1) {
            passed_2 = beats.length - 1 - i;
          }
        }
      }

      var stripe_position = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_1])) / 48;
      var stripe_position2;
      if(passed_2 != -1) {
        stripe_position2 = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_2])) / 48;
      } else {
        stripe_position2 = 1;
      }

      this.top_material.uniforms.start1.value = clamp(0, stripe_position - 0.2, 1);
      this.top_material.uniforms.stop1.value = clamp(0, stripe_position, 1);
      this.top_material.uniforms.start2.value = clamp(0, stripe_position2 - 0.2, 1);
      this.top_material.uniforms.stop2.value = clamp(0, stripe_position2, 1);

      this.top_material.uniforms.tiles.value = 1;
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