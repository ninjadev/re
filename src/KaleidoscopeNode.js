(function(global) {
  class KaleidoscopeNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = SHADERS.kaleidoscope;
      options.inputs = {
        tDiffuse: new NIN.TextureInput()
      };

      super(id, options);
    }

    update(frame) {
      super.update(frame);

      this.quad.material.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.KaleidoscopeNode = KaleidoscopeNode;
})(this);
