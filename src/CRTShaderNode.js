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
        this.inputs.tDiffuse.node.active = false;
        this.inputs.tDiffuse2.node.active = true;
        this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
      } else {
        this.inputs.tDiffuse.node.active = true;
        this.inputs.tDiffuse2.node.active = false;
        this.uniforms.tDiffuse.value = this.inputs.tDiffuse2.getValue();
      }
      this.uniforms.amount.value = smoothstep(0, 1.5, (frame - FRAME_FOR_BEAN(12 * 4 * 83.5)) / 50);
      this.uniforms.amount.value = smoothstep(this.uniforms.amount.value, 1, (frame - FRAME_FOR_BEAN(12 * 4 * 83.75)) / 30);
    }
  }

  global.CRTShaderNode = CRTShaderNode;
})(this);
