(function(global) {
  class BlurPassNode extends NIN.ShaderNode {
    constructor(id, options) {
      const kernelSize = 25;
      const sigma = 4.0;

      const convolutionShader = THREE.ConvolutionShader;
      const uniforms = THREE.UniformsUtils.clone(convolutionShader.uniforms);
      if(options.direction == 'x') {
        uniforms.uImageIncrement.value = THREE.BloomPass.blurX;
      } else {
        uniforms.uImageIncrement.value = THREE.BloomPass.blurY;
      }
      uniforms.cKernel.value = THREE.ConvolutionShader.buildKernel(sigma);
      options.shader = {
        uniforms: uniforms,
        vertexShader:  convolutionShader.vertexShader,
        fragmentShader: convolutionShader.fragmentShader,
        defines: {
          KERNEL_SIZE_FLOAT: kernelSize.toFixed(1),
          KERNEL_SIZE_INT: kernelSize.toFixed(0)
        }
      };
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };
      super(id, options);
      this.uniforms = uniforms;
      this.resize();
    }

    resize() {
      const scale = 4;
      this.renderTarget.setSize(16 * GU / scale, 9 * GU / scale);
    }

    update() {
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.BlurPassNode = BlurPassNode;
})(this);
