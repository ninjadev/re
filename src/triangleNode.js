(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.throb = 0;
    }

    update(frame) {
      this.uniforms.frame.value = frame;

      this.throb *= 0.95;
      if(BEAT && BEAN % 12 == 0) {
        this.throb = 1;
      }

      this.uniforms.disformationAmount.value = this.throb;

      if(BEAN < 12 * 4 * 49) {
        this.inputs.A.enabled = true;
        this.inputs.B.enabled = false;
        this.uniforms.A.value = this.inputs.A.getValue();
      } else {
        this.inputs.A.enabled = false;
        this.inputs.B.enabled = true;
        this.uniforms.A.value = this.inputs.B.getValue();
      }

      if(BEAN < 12 * 4 * 49) {
        this.uniforms.bounceSpeedMultiplier.value = 0.25 / 2;
      } else if(BEAN < 12 * 4 * (49 + 4 - 0.5)) {
        this.uniforms.bounceSpeedMultiplier.value = 0.25;
      } else if(BEAN < 12 * 4 * (49 + 4)) {
        this.uniforms.bounceSpeedMultiplier.value = 0.5;
      } else if(BEAN < 12 * 4 * (49 + 11)) {
        this.uniforms.bounceSpeedMultiplier.value = 0.5;
      }
    }

    render(renderer) {
      super.render(renderer);
      if(BEAN < 12 * 4 * 49) {
        this.outputs.render.setValue(this.inputs.A.getValue());
      } else {
        this.outputs.render.setValue(this.renderTarget.texture);
      }
    }
  }

  global.triangleNode = triangleNode;
})(this);
