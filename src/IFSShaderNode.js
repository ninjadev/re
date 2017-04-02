(function(global) {
  class IFSShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_snare.wav', 'spectral_energy', 0.5);
    }

    update(frame) {
      this.uniforms.frame.value = frame - this.analysis.getValue(frame) * 6;
      if(BEAN >= 12 * 4 * 78.5) {
        this.uniforms.frame.value -= 300;
      }
    }
  }

  global.IFSShaderNode = IFSShaderNode;
})(this);
