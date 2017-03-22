(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      console.log("options for triangle", options);
      options.shader = SHADERS.triangle;

      super(id, options);
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.triangleNode = triangleNode;
})(this);
