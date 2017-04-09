(function(global) {
  class MinecraftTransitionShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };

      super(id, options);

      this.startBean = 12 * 4 * 73;
      this.endBean = 12 * 4 * 74;

      this.firstShakeFrame = FRAME_FOR_BEAN(12 * 4 * 73 + 12 + 6);
      this.secondShakeFrame = FRAME_FOR_BEAN(12 * 4 * 73.75);
      this.thirdShakeFrame = FRAME_FOR_BEAN(12 * 4 * 74);
    }

    update(frame) {
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();

      this.uniforms.mixerOne.value = easeIn(0, 16, (frame - this.firstShakeFrame + 20) / 20);
      this.uniforms.mixerTwo.value = easeIn(16, 0, (frame - this.secondShakeFrame + 20) / 20);
      this.uniforms.mixerThree.value = easeIn(0, 16, (frame - this.thirdShakeFrame + 20) / 20);
    }

    render(renderer) {
      if(BEAN < this.startBean) {
        this.outputs.render.setValue(this.inputs.A.getValue());
      } else if(BEAN < this.endBean) {
        super.render(renderer);
      } else {
        this.outputs.render.setValue(this.inputs.B.getValue());
      }
    }
  }
  global.MinecraftTransitionShaderNode = MinecraftTransitionShaderNode;
})(this);
