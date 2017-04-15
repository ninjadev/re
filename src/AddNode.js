(function(global) {
  class AddNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);
      this.opacity = options.opacity;
    }

    update(frame) {
      this.uniforms.opacity.value = this.opacity;
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.AddNode = AddNode;
})(this);
