(function(global) {
  class waterNode extends NIN.ShaderNode {
    constructor(id, options) {
      super(id, options);
      this.renderTarget = new THREE.WebGLRenderTarget(256, 256, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.resize();
    }

    update(frame) {
      this.uniforms.frame.value = frame;
    }

    resize() {
      this.renderTarget.setSize(256, 256);
    }
  }

  global.waterNode = waterNode;
})(this);
