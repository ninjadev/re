(function(global) {
  class triangleNode extends NIN.ShaderNode {
    update(frame) {
      this.uniforms.frame.value = frame;
    }
  }

  global.triangleNode = triangleNode;
})(this);
