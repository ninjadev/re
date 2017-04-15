(function(global) {
  class IFSShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 0.95);
      this.modulator = 0;
    }

    update(frame) {
      demo.nm.nodes.add.opacity = 1.5;
      if(frame < 9410) {
        this.modulator = 0;
      }
      if(frame < 9362) {
        this.modulator = (frame - 9300) * 2;
      }
      if(frame > 9410 && BEAT && BEAN % 12 * 4 == 0) {
        this.modulator += 10;
      }
      if(frame < 9410) {
        this.modulator += this.analysis.getValue(frame - 885) * 8;
      }
      this.uniforms.frame.value = frame * 0.95 - 520 + this.modulator;
      if(BEAN >= 12 * 4 * (8 + 78.5)) {
        this.uniforms.frame.value -= 300;
      }

      this.uniforms.colorSwitch.value = 0;
      if(BEAN >= 12 * 4 * (77.75 + 8)) {
        if(BEAN < 12 * 4 * (77.75 + 8) + 3) {
          this.uniforms.colorSwitch.value = 1;
        } else if(BEAN < 12 * 4 * (77.75 + 8) + 6) {
          this.uniforms.colorSwitch.value = 0;
        } else if(BEAN < 12 * 4 * (77.75 + 8) + 9) {
          this.uniforms.colorSwitch.value = 1;
        } else {
          this.uniforms.colorSwitch.value = 0;
        }
      }
    }
  }

  global.IFSShaderNode = IFSShaderNode;
})(this);
