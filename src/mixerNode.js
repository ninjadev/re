(function(global) {
  class mixerNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = SHADERS.mixer;
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.mixerNode = mixerNode;
})(this);
