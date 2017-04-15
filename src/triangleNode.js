(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.uniforms.big.value = 0;
    }
    update(frame) {
      if(BEAN < 12 * 4 * 49) {
        this.inputs.A.enabled = true;
        this.inputs.B.enabled = false;
        this.uniforms.A.value = this.inputs.A.getValue();
      } else {
        this.inputs.A.enabled = false;
        this.inputs.B.enabled = true;
        this.uniforms.A.value = this.inputs.B.getValue();
      }
    }
  }

  global.triangleNode = triangleNode;
})(this);
