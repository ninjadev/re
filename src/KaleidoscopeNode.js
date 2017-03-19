(function(global) {
  class KaleidoscopeNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = SHADERS.kaleidoscope;
      super(id, options);
    }
  }

  global.KaleidoscopeNode = KaleidoscopeNode;
})(this);
