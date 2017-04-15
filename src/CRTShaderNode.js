(function(global) {
  class CRTShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
        tDiffuse2: new NIN.TextureInput()
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      if(BEAN >= 12 * 4 * 84) {
        this.inputs.tDiffuse.enabled = true;
        this.inputs.tDiffuse2.enabled = false;
        this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      } else {
        this.inputs.tDiffuse.enabled = false;
        this.inputs.tDiffuse2.enabled = true;
        this.uniforms.tDiffuse.value = this.inputs.tDiffuse2.getValue();
      }
      this.uniforms.amount.value = smoothstep(0, 1.5, (frame - FRAME_FOR_BEAN(12 * 4 * 83.5)) / 50);
      this.uniforms.amount.value = smoothstep(this.uniforms.amount.value, 1, (frame - FRAME_FOR_BEAN(12 * 4 * 83.75)) / 30);

      if(BEAN >= 12 * 4 * (77.75 + 8)) {
        if(BEAN < 12 * 4 * (77.75 + 8) + 3) {
          this.uniforms.amount.value = 2;
        } else if(BEAN < 12 * 4 * (77.75 + 8) + 6) {
          this.uniforms.amount.value = 1;
        } else if(BEAN < 12 * 4 * (77.75 + 8) + 9) {
          this.uniforms.amount.value = 2;
        } else {
          this.uniforms.amount.value = 1;
        }
      }
    }
  }

  global.CRTShaderNode = CRTShaderNode;
})(this);
