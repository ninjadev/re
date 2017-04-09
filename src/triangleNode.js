(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_snare.wav', 'spectral_energy', 0.03);
    }
    update(frame) {
      if(BEAN < 12 * 4 * 49) {
        this.uniforms.A.value = this.inputs.A.getValue();
      } else {
        this.uniforms.A.value = this.inputs.B.getValue();
      }
      this.uniforms.big.value = lerp(0, Math.max(Math.sin(frame/100), 0.5), (frame - FRAME_FOR_BEAN(12 * 4 * 49)) / 100);
      this.uniforms.amount.value = lerp(0, 1.0, (frame - FRAME_FOR_BEAN(12 * 4 * 48.5)) / 50);

      this.uniforms.frame.value = frame - this.analysis.getValue(frame) * 18;
    }
  }

  global.triangleNode = triangleNode;
})(this);
