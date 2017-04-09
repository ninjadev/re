(function(global) {
  class TunnelShader extends NIN.ShaderNode {
    constructor(id, options) {
      options.inputs = {
        tDiffuse: new NIN.TextureInput(),
      };
      super(id, options);
      this.spinnerArray = '\\|/-';
      this.throb = 0;
      this.textCanvas = document.createElement('canvas');
      this.textCtx = this.textCanvas.getContext('2d');

      this.uniforms.textCanvas.value = new THREE.VideoTexture(this.textCanvas);
      this.uniforms.textCanvas.value.magFilter = this.uniforms.textCanvas.value.minFilter = THREE.LinearFilter;
      this.resize();

      this.crews = [
        'mercury',
        'revision',
        'pandacube',
        'logicoma',
        'gargaj',
        'idle',
        'rohtie',
        'farbrausch',
        'kvasigen',
        'sandsmark',
        'darklite',
        'desire',
        't-101',
        'lft',
        'mrdoob',
        'outracks'
      ];
    }

    resize() {
      super.resize();
      if(this.textCanvas) {
        this.textCanvas.width = 6 * GU;
        this.textCanvas.height = 9 * GU;
      }
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
      this.frame = frame;
    }

    render(renderer) {
      this.textCtx.clearRect(0, 0, this.textCanvas.width, this.textCanvas.height);
      this.textCtx.textBaseline = 'top';
      this.textCtx.fillStyle = 'white';
      this.textCtx.font = (0.3 * GU) + 'pt vcr';
      this.textCtx.globalAlpha = 0.1;
      this.textCtx.fillRect(
          (0.52 - easeOut(20, 0, (this.frame - 6300) / 54)) * GU,
          4.25 * GU,
          4.78 * GU,
          0.5 * GU);
      this.textCtx.globalAlpha = 1;
      this.textCtx.textAlign = 'center';
      for(let i = -this.crews.length; i < this.crews.length * 2; i++) {
        const x = 2.85 + easeOut(20, 0, (this.frame - 6300 - i * 2) / 54);
        const y = (4.65 -
             0.5 * (i + 2) +
             ((this.frame - 6300) / 60 / 60 * 130 / 2) * 0.5 -
              0.1 * Math.sin(Math.PI * 2 * this.frame / 60 / 60 * 130 / 2));
        if(y > 4 && y < 5) {
          this.textCtx.globalAlpha = Math.max(0.1, Math.cos(1 + Math.PI * 2 * y / 9 * 8));
        } else {
          this.textCtx.globalAlpha = 0.1;
        }
        this.textCtx.fillText(
            this.crews[(this.crews.length + i) % this.crews.length],
            x * GU,
            y * GU);
      }
      this.textCtx.clearRect(0, 0, 6 * GU, 1 * GU);
      this.textCtx.clearRect(0, 8.46 * GU, 6 * GU, 1 * GU);
      this.textCtx.textAlign = 'left';
      this.textCtx.globalAlpha = 1;
      const spinner = this.spinnerArray[(this.frame / 60 / 60 * 130 * 8 | 0) % this.spinnerArray.length];
      const spinner2 = this.spinnerArray[this.spinnerArray.length - 1 - ((this.frame / 60 / 60 * 130 * 8 | 0) % this.spinnerArray.length)];
      this.textCtx.fillText(`=${spinner2}= GREETINGS TO =${spinner}=`, 0.52 * GU, 9 * 0.054 * GU);
      this.uniforms.textCanvas.value.needsUpdate = true;
      super.render(renderer);
    }
  }

  global.TunnelShader = TunnelShader;
})(this);
