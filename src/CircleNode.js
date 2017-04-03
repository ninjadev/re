(function(global) {
  class CircleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = SHADERS.Circle;
      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.CircleNode = CircleNode;
})(this);
