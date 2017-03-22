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
      this.quad.material.uniforms.A.value = this.inputs.A.getValue();
      this.quad.material.uniforms.B.value = this.inputs.B.getValue();
      this.quad.material.uniforms.opacity.value = this.opacity;
    }
  }

  global.AddNode = AddNode;
})(this);
