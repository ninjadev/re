(function(global) {
  class SSAONode extends NIN.ShaderNode {
    constructor(id, options) {
      options.shader = THREE.SSAOShader;
      options.inputs = {
        uniforms: new NIN.Input(),
      };
      super(id, options);
    }

    update(frame) {
      const uniforms = this.inputs.uniforms.getValue();
      if(!uniforms) {
        return;
      }
      for(let key of ['tDiffuse',
                      'tDepth',
                      'size',
                      'cameraNear',
                      'cameraFar',
                      'onlyAO',
                      'aoClamp',
                      'lumInfluence']) {
        this.uniforms[key].value = uniforms[key].value;
      }
    }
  }

  global.SSAONode = SSAONode;
})(this);
