(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      super(id, options);
    }
    update(frame) {
      this.uniforms.A.value = this.inputs.A.getValue();
      this.uniforms.frame.value = frame;
      this.uniforms.big.value = Math.max(Math.sin(frame/100), 0.5);
      if(BEAT && (BEAN%12==0)) {
        this.uniforms.shift.value = 1.0;
      }
      // this value needs to change to follow the rythm
      //this.uniforms.extra.value = smoothstep(0, 1, BEAT);
    }
  }

  global.triangleNode = triangleNode;
})(this);
