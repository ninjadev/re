(function(global) {
  class TextureMultiplexerNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
          C: new NIN.TextureInput(),
          D: new NIN.TextureInput()
        },
        outputs: {
          selected: new NIN.TextureOutput(),
        }
      });
    }

    render() {
      const bar = 12 * 4;
      const offset = bar;
      this.inputs.A.enabled = false;
      this.inputs.B.enabled = false;
      this.inputs.C.enabled = false;
      this.inputs.D.enabled = false;
      if(BEAN < offset + bar * 7 + 12 * 2 - 6) {
        this.inputs.A.enabled = true;
        this.outputs.selected.setValue(this.inputs.A.getValue());
      } else if(BEAN < offset + bar * 8) {
        this.inputs.B.enabled = true;
        this.outputs.selected.setValue(this.inputs.B.getValue());
      } else if(BEAN < offset + bar * 16) {
        this.inputs.C.enabled = true;
        this.outputs.selected.setValue(this.inputs.C.getValue());
      } else {
        this.inputs.D.enabled = true;
        this.outputs.selected.setValue(this.inputs.D.getValue());
      }
    }
  }

  global.TextureMultiplexerNode = TextureMultiplexerNode;
})(this);
