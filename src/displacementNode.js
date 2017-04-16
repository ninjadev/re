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

      if(BEAN >= 12 * 4 * 91 && BEAN < 12 * 4 * 95) {
        const beanOffset = 12 * 4 * 92 + 12 * 4 * (((BEAN - (12 * 4 * 92)) / (12 * 4)) | 0);
        this.uniforms.displacement0.value = easeOut(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 24)) / 13);
        this.uniforms.displacement1.value = easeOut(
            1,
            0,
            (frame - FRAME_FOR_BEAN(beanOffset - 24 + 6)) / 13);
        this.uniforms.displacement2.value = easeOut(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 24 + 12)) / 13);
        this.uniforms.displacement3.value = easeOut(
            1,
            0,
            (frame - FRAME_FOR_BEAN(beanOffset - 24 + 18)) / 13);
      } else {
        const beanOffset = 12 * 4 * 96;
        this.uniforms.displacement0.value = smoothstep(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 12)) / 13);
        this.uniforms.displacement1.value = smoothstep(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 12 + 3)) / 13);
        this.uniforms.displacement2.value = smoothstep(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 12 + 4.5)) / 13);
        this.uniforms.displacement3.value = smoothstep(
            0,
            1,
            (frame - FRAME_FOR_BEAN(beanOffset - 12 + 6)) / 13);
      }
    }
  }

  global.displacementNode = displacementNode;
})(this);
