(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      console.log("options for triangle", options);
      options.shader = SHADERS.triangle;

      this.quad.material.uniforms.

      super(id, options);
    }

    update(frame) {
      this.quad.material.uniforms.frame.value = frame;
    }
  }

  global.triangleNode = triangleNode;
})(this);
