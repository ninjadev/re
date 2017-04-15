(function(global) {
  class IFSShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_kick.wav', 'spectral_energy', 0.95);
      this.modulator = 0;
    }

    update(frame) {
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
    }
  }

  global.IFSShaderNode = IFSShaderNode;
})(this);
