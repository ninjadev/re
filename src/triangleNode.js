(function(global) {
  class triangleNode extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        A: new NIN.TextureInput(),
        B: new NIN.TextureInput(),
      };
      super(id, options);

      this.analysis = new audioAnalysisSanitizer('stem_snare.wav', 'spectral_energy', 0.16);
    }
    update(frame) {
      if(BEAN < 12 * 4 * 49) {
        this.inputs.A.enabled = true;
        this.inputs.B.enabled = false;
        this.uniforms.A.value = this.inputs.A.getValue();
      } else {
        this.inputs.A.enabled = false;
        this.inputs.B.enabled = true;
        this.uniforms.A.value = this.inputs.B.getValue();
      }

      let frameOffset = 0;
      if(BEAN > 12 * 4 * 51) {
        frameOffset = this.analysis.getValue(frame) * 32 * (BEAN >= 12 * 4 * 49) * (BEAN % 12 == 0 ? 1 : -1);
        if(BEAN < 12 * 4 * 54) {
          frameOffset = this.analysis.getValue(frame) * 87 * (BEAN >= 12 * 4 * 49) * (BEAN % 12 == 0 ? 1 : -0.8) + Math.sin(frame/1000);
        }
      }

      this.uniforms.big.value = lerp(0, Math.max(Math.sin(frame/100), 0.3), (frame - FRAME_FOR_BEAN(12 * 4 * 49)) / 100);
      this.uniforms.frame.value = frame * 2 - frameOffset;

      this.uniforms.amount.value = lerp(0, 1., (frame - FRAME_FOR_BEAN(12 * 4 * 48.5)) / 50);

      if(BEAN >= 12 * 4 * 53 - 12) {
        if(BEAN < 12 * 4 * 53 - 8) {
          this.uniforms.frame.value = 0;
        } else if(BEAN < 12 * 4 * 53 - 6) {
          this.uniforms.big.value = 0.3;
        } else if(BEAN < 12 * 4 * 53 - 3) {
          this.uniforms.frame.value = 600;
        } else if(BEAN < 12 * 4 * 53) {
          this.uniforms.frame.value = 300;
        }
      }

      if (frame > 6202) {
        if (frame < 6257.) {
          this.uniforms.frame.value = 1337;
        } else if (frame < 6278.) {
          this.uniforms.frame.value = -1133;
        } else if (frame < 6299.) {
          this.uniforms.frame.value = 1337;
        }
      } 
    }
  }

  global.triangleNode = triangleNode;
})(this);
