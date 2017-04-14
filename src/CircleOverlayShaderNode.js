(function(global) {
  class CircleOverlayShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
      };
      super(id, options);
    }

    update(frame) {
      this.uniforms.tDiffuse.value = this.inputs.A.getValue();

      let radius;
      if(BEAN < 12 * 4 * 49 - 12 - 6) {
      } else if(BEAN < 12 * 4 * 49 - 12 - 4) {
        radius = 1.875;
      } else if(BEAN < 12 * 4 * 49 - 12 - 2) {
        radius = 1.5;
      } else if(BEAN < 12 * 4 * 49 - 12) {
        radius = 1.05;
      } else if(BEAN < 12 * 4 * 49) {
        radius = 0.75;
      } else {
        radius = 10;
      }
      this.uniforms.radius.value = radius;
    }
  }

  global.CircleOverlayShaderNode = CircleOverlayShaderNode;
})(this);
