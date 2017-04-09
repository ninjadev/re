(function(global) {
  class TunnelShader extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);
      this.throb = 0;
    }

    update(frame) {
      this.throb *= 0.95;
      if(this.throb < 0.01) {
        this.throb = 0;
      }
      if(BEAT && (BEAN % 12 == 0)) {
        this.throb = 1;
      }
      this.uniforms.throb.value = this.throb;
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.tDiffuse.getValue();
    }
  }

  global.TunnelShader = TunnelShader;
})(this);
