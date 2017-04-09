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
      if (typeof this.opacity == 'number') {
        this.uniforms.opacity.value = this.opacity;
      } else {
        if (frame >= this.opacity.from && frame < this.opacity.to) {
          this.uniforms.opacity.value = this.opacity.value;
        } else {
          this.uniforms.opacity.value = this.opacity.default;
        }
      }

      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.B.value = this.inputs.B.getValue();
    }
  }

  global.AddNode = AddNode;
})(this);
