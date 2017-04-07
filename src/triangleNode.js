(function(global) {
  class triangleNode extends NIN.ShaderNode {
    update(frame) {
      this.uniforms.frame.value = frame;
      this.uniforms.big.value = Math.min(Math.sin(frame/100), 0.5);
      // this value needs to change to follow the rythm
      this.uniforms.extra.value = smoothstep(0, 1, BEAT);
    }
  }

  global.triangleNode = triangleNode;
})(this);
