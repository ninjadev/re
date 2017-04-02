(function(global) {
  class TextureMultiplexerNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput(),
          E: new NIN.TextureInput(),
          F: new NIN.TextureInput(),
          G: new NIN.TextureInput(),
          H: new NIN.TextureInput(),
          I: new NIN.TextureInput(),
          J: new NIN.TextureInput(),
          K: new NIN.TextureInput(),
          L: new NIN.TextureInput(),
        },
        outputs: {
          selected: new NIN.TextureOutput(),
        }
      });
    }

    update(frame) {
      const bar = 12 * 4;
      const offset = bar;
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.D.enabled = false;
      this.inputs.E.enabled = false;
      this.inputs.F.enabled = false;
      this.inputs.G.enabled = false;
      this.inputs.H.enabled = false;
      this.inputs.I.enabled = false;
      this.inputs.J.enabled = false;
      this.inputs.K.enabled = false;
      this.inputs.L.enabled = false;
      if(BEAN < offset + bar * 7 + 12 * 2 - 6) {
        this.inputs.A.enabled = true;
        this.outputs.selected.setValue(this.inputs.A.getValue());
      } else if(BEAN < offset + bar * 8) {
        this.inputs.B.enabled = true;
        this.outputs.selected.setValue(this.inputs.B.getValue());
      } else if(BEAN < offset + bar * 24) {
        this.inputs.C.enabled = true;
        this.outputs.selected.setValue(this.inputs.C.getValue());
      } else if(BEAN < offset + bar * 32) {
        this.inputs.E.enabled = true;
        this.outputs.selected.setValue(this.inputs.E.getValue());
      } else if(BEAN < offset + bar * 40) {
        this.inputs.F.enabled = true;
        this.outputs.selected.setValue(this.inputs.F.getValue());
        // Bass starts here again
      } else if(BEAN < offset + bar * 48) {
        this.inputs.G.enabled = true;
        this.outputs.selected.setValue(this.inputs.G.getValue());
      } else if(BEAN < offset + bar * 56) {
        this.inputs.H.enabled = true;
        this.outputs.selected.setValue(this.inputs.H.getValue());
      } else if(BEAN < offset + bar * 65 /* extra bar */) {
        this.inputs.I.enabled = true;
        this.outputs.selected.setValue(this.inputs.I.getValue());
      } else if(BEAN < offset + bar * 74) {
        this.inputs.J.enabled = true;
        this.outputs.selected.setValue(this.inputs.J.getValue());
      } else if(BEAN < offset + bar * 78) {
        this.inputs.K.enabled = true;
        this.outputs.selected.setValue(this.inputs.K.getValue());
      } else if(BEAN < offset + bar * 90) {
        this.inputs.L.enabled = true;
        this.outputs.selected.setValue(this.inputs.L.getValue());
      }
    }
  }

  global.TextureMultiplexerNode = TextureMultiplexerNode;
})(this);
