(function(global) {
  class LaneSwipeTransitionNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.uniforms.one.value = FRAME_FOR_BEAN(12 * 4 * 15);
      this.uniforms.two.value = FRAME_FOR_BEAN(12 * 4 * 15.5);
      this.uniforms.three.value = FRAME_FOR_BEAN(12 * 4 * 16);
      this.uniforms.four.value = FRAME_FOR_BEAN(12 * 4 * 16.5);
      this.uniforms.five.value = FRAME_FOR_BEAN(12 * 4 * 17);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
      if(BEAN < 12 * 4 * 15) {
        this.inputs.A.enabled = true;
        this.inputs.B.enabled = false;
      } else if (BEAN < 12 * 4 * 17) {
        this.inputs.A.enabled = true;
        this.inputs.B.enabled = true;
      } else {
        this.inputs.A.enabled = false;
        this.inputs.B.enabled = true;
      }
    }

    render(renderer) {
      if(BEAN < 12 * 4 * 15) {
        this.outputs.render.setValue(this.inputs.A.getValue());
      } else if(BEAN < 12 * 4 * 17) {
        super.render(renderer);
      } else {
        this.outputs.render.setValue(this.inputs.B.getValue());
      }
    }
  }

  global.LaneSwipeTransitionNode = LaneSwipeTransitionNode;
})(this);
