(function(global) {
  class BitGlitchShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        texture: new NIN.TextureInput(),
      }
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.amount.value = BEAN >= 12 * 4 * 79.5 ? 1 : 0;
      this.uniforms.tDiffuse.value = this.inputs.texture.getValue();
    }
  }

  global.BitGlitchShaderNode = BitGlitchShaderNode;
})(this);
