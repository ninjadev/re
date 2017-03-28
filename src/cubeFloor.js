(function(global) {
  class cubeFloor extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput(),
          depthUniforms: new NIN.Output(),
        }
      });

      this.depthUniforms = THREE.UniformsUtils.clone(THREE.SSAOShader.uniforms);

      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.depthRenderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.depthMaterial = new THREE.MeshDepthMaterial();
      this.depthMaterial.depthPacking = THREE.RGBADepthPacking;
      this.depthMaterial.blending = THREE.NoBlending;
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 2, 40);
      this.camera.position.z = 10;
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
      this.cubes = [];
      const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
      const size = 1;

      const light = new THREE.DirectionalLight(0xffffff);
      light.position.z = 100;
      light.position.x = 100;
      light.position.y = 100;
      this.scene.add(light);
      for(let x = 0; x < 16 * size; x++) {
        this.cubes[x] = [];
        for(let y = 0; y < 9 * size; y++) {
          const color = 0.2 + 0.5 * Math.random();
          const cube = this.cubes[x][y] = new THREE.Mesh(
            boxGeometry,
            new THREE.MeshStandardMaterial({
              color: new THREE.Color(color, color, color),
              roughness: .2,
              metalness: .9,
              shading: THREE.SmoothShading
            }));
          cube.originalColor = cube.material.color;
          cube.emissive = new THREE.Color(0, 0, 0);
          cube.redColor = new THREE.Color(0xff/0xff, 0, 0xa2/0xff);
          cube.material.shading = THREE.FlatShading;
          cube.position.x = x - 8 * size;
          cube.position.y = y - 4.5 * size;
          cube.position.z = Math.random();
          this.scene.add(cube);
        }
      }
      this.resize();
    }

    update(frame) {

      const size = 1;
      for(let x = 0; x < 16 * size; x++) {
        for(let y = 0; y < 9 * size; y++) {
          const cube = this.cubes[x][y];
          let u = x - 8 * size;
          let v = y - 4.5 * size;
          cube.position.z = 0.5 * Math.sin(
          (u ^ v) / 8 / size * Math.PI * 2 + frame / 100);

          if(false) {
            cube.material.emissive = cube.redColor;
          } else{
            cube.material.color = cube.originalColor;
            cube.material.emissive = cube.emissive;
          }
        }
      }
    }

    render(renderer) {
      renderer.overrideMaterial = null;
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      renderer.overrideMaterial = this.depthMaterial;
      renderer.render(this.scene, this.camera, this.depthRenderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
      this.outputs.depthUniforms.setValue(this.depthUniforms);
      this.depthUniforms.tDiffuse.value = this.renderTarget.texture;
      this.depthUniforms.tDepth.value = this.depthRenderTarget.texture;
      this.depthUniforms.size.value.set(16 * GU, 9 * GU);
      this.depthUniforms.cameraNear.value = this.camera.near;
      this.depthUniforms.cameraFar.value = this.camera.far;
      this.depthUniforms.onlyAO.value = false;
      this.depthUniforms.aoClamp.value = 0.3;
      this.depthUniforms.lumInfluence.value = 0.5;
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
      this.depthRenderTarget.setSize(16 * GU, 9 * GU);
    }
  }

  global.cubeFloor = cubeFloor;
})(this);
