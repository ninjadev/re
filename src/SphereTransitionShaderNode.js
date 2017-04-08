(function(global) {
  class SphereTransitionShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };

      super(id, options);

      this.startFrame = FRAME_FOR_BEAN(12 * 4 * 32.8);
      this.endFrame = FRAME_FOR_BEAN(12 * 4 * 33.0);
    }

    update(frame) {
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      this.uniforms.mixer.value = easeIn(1.0, 0.0,
        (frame - this.startFrame) / (this.endFrame - this.startFrame));
    }

    render(renderer) {
      if(BEAN < 12 * 4 * 32.8) {
        this.outputs.render.setValue(this.inputs.A.getValue());
      } else if(BEAN < 12 * 4 * 33.0) {
        super.render(renderer);
      } else {
        this.outputs.render.setValue(this.inputs.B.getValue());
      }
    }
  }
  global.SphereTransitionShaderNode = SphereTransitionShaderNode;
})(this);
