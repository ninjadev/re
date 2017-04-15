(function(global) {
  class displacementNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();

      this.uniforms.displacement0.value = smoothstep(
          0,
          1,
          (frame - FRAME_FOR_BEAN(12 * 4 * 96 - 12)) / 13);
      this.uniforms.displacement1.value = smoothstep(
          0,
          1,
          (frame - FRAME_FOR_BEAN(12 * 4 * 96 - 12 + 3)) / 13);
      this.uniforms.displacement2.value = smoothstep(
          0,
          1,
          (frame - FRAME_FOR_BEAN(12 * 4 * 96 - 12 + 4.5)) / 13);
      this.uniforms.displacement3.value = smoothstep(
          0,
          1,
          (frame - FRAME_FOR_BEAN(12 * 4 * 96 - 12 + 6)) / 13);
    }
  }

  global.displacementNode = displacementNode;
})(this);
