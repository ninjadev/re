(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_snare.wav', 'spectral_energy', 0.03);
    }
    update(frame) {
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.big.value = Math.max(Math.sin(frame/100), 0.5);

      this.uniforms.frame.value = frame - this.analysis.getValue(frame) * 18;
    }
  }

  global.triangleNode = triangleNode;
})(this);
