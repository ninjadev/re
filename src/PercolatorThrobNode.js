(function(global) {
  class PercolatorThrobNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        outputs: {
          percolator: new NIN.Output()
        }
      });
    }

    update(frame) {
      const beat = 12;
      const bar = beat * 4;
      this.outputs.percolator.setValue(false);
      if(BEAT) {
        switch((BEAN - bar) % (bar * 8)) {
          case 0:
          case 2.5 * beat:
          case 3.5 * beat:
          case bar + 2.5 * beat:
          case bar + 3.5 * beat:
          case 2 * bar + 1.5 * beat:
          case 2 * bar + 3.5 * beat:
          case 3 * bar + 2.5 * beat:
          case 3 * bar + 3.5 * beat:
          case 4 * bar + 2.5 * beat:
          case 4 * bar + 3.5 * beat:
          case 5 * bar + 2.5 * beat:
          case 6 * bar:
          case 6 * bar + 1.5 * beat:
          case 6 * bar + 2 * beat:
          case 6 * bar + 2.5 * beat:
          case 6 * bar + 3 * beat:
          case 6 * bar + 3.5 * beat:
          case 7 * bar + 1.5 * beat:
          case 7 * bar + 3 * beat:
            this.outputs.percolator.setValue(true);
        }
      }
    }
  }

  global.PercolatorThrobNode = PercolatorThrobNode;
})(this);
