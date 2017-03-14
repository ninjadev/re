(function(global) {
  class TextureMultiplexerNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        inputs: {
          A: new NIN.TextureInput(),
          B: new NIN.TextureInput(),
        },
        outputs: {
          selected: new NIN.TextureOutput(),
        }
      });
    }

    render() {
      const bar = 12 * 4;
      const offset = bar;
      if(BEAN < offset + bar * 7 + 12 * 2 - 6) {
        this.outputs.selected.setValue(this.inputs.A.getValue());
      } else {
        this.outputs.selected.setValue(this.inputs.B.getValue());
      }
    }
  }

  global.TextureMultiplexerNode = TextureMultiplexerNode;
})(this);
