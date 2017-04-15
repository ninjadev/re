(function(global) {
  class RotozoomShaderNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        texture: new NIN.TextureInput(),
      };
      super(id, options);

      this.startTime = FRAME_FOR_BEAN(12 * 4 * (76 + 8));
      this.amountStartTime = FRAME_FOR_BEAN(12 * 4 * (76.5 + 8));
      this.uniforms.translate.value = new THREE.Vector2();
    }

    update(frame) {
      const amount = easeOut(
        0,
        1,
        (frame - this.amountStartTime) / (this.amountStartTime - this.startTime) / 8);


      if(BEAN >= 12 * 4 * (79.5 + 8)) {
        if(BEAN < 12 * 4 * (79.5 + 8) + 3) {
          frame = this.amountStartTime;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9){
          frame = this.amountStartTime + 10;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 3){
          frame = this.amountStartTime + 20;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 6){
          frame = this.amountStartTime + 30;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 6 + 1.5){
          frame = this.amountStartTime + 40;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 9){
          frame = this.amountStartTime + 50;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 9 + 3){
          frame = this.amountStartTime + 60;
        } else if(BEAN < 12 * 4 * (79.5 + 8) + 9 + 9 + 6){
          frame = this.amountStartTime + 70;
        }
      }

      this.uniforms.angle.value = (frame - this.amountStartTime) * 0.01 * amount;
      this.uniforms.zoom.value = 0.5 + amount * (frame - this.amountStartTime) * 0.01;
      this.uniforms.translate.value.x = 1. + amount * (0.5 + 2. * Math.sin(frame * 0.02));
      this.uniforms.translate.value.y = 1. + amount * (2. * Math.cos(frame * 0.02));
      this.uniforms.frame.value = frame;
      this.uniforms.tDiffuse.value = this.inputs.texture.getValue();
    }
  }

  global.RotozoomShaderNode = RotozoomShaderNode;
})(this);
