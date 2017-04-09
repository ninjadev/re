(function(global) {
  class MinecraftTransitionShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };

      super(id, options);

      this.startBean = 12 * 4 * 74;
      this.endBean = 12 * 4 * 75;
    }

    update(frame) {
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.mixer.value = easeOut(0, 1,
        (frame - FRAME_FOR_BEAN(this.startBean)) / (this.endBean - this.startBean));
    }

    render(renderer) {
      if (BEAN < this.endBean) {
        super.render(renderer);
      } else {
        this.outputs.render.setValue(this.inputs.A.getValue());
      }
    }
  }
  global.MinecraftTransitionShaderNode = MinecraftTransitionShaderNode;
})(this);
