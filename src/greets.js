(function(global) {
  class greets extends NIN.THREENode {
    constructor(id, options) {
      super(id, options);

      this.scene.background = new THREE.Color(0x5599ff);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasMaterial = new THREE.MeshBasicMaterial({map: this.canvasTexture, side: THREE.DoubleSide});

      this.screenMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
      this.screen = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), this.screenMaterial);
      this.scene.add(this.screen);

      this.camera.position.y = 10;

      this.frames = [];
      for (let i=0; i < 161; i++) {
        this.frames[i] = Loader.loadTexture(`/res/morphed/${i.toString().padStart(3, '0')}_interpolated.jpg`);
      }

      this.platforms = [];
      for (let i=0; i < 16; i++) {
        const platform = new THREE.Mesh(
          new THREE.BoxGeometry(10, 4, 80),
          new THREE.MeshToonMaterial({color: 0xffff00})
        );
        platform.position.set(i % 2 ? 7 : -7, 3, 1610 - i * 100);
        this.scene.add(platform);
        this.platforms.push(platform);
      }

      this.light = new THREE.DirectionalLight(0xffffff, 0.8);
      this.light.position.y = 10;
      this.scene.add(this.light);

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

      this.resize();

      this.ctx.fillStyle = '#660066';
      this.ctx.fillRect(0, 0, 10 * GU, 100 * GU);

      this.ctx.scale(-1, 1);

      this.ctx.font = '20px arial';
      this.ctx.textBaseline = 'middle';
      this.ctx.textAlign = 'center';
      this.ctx.fillStyle = '#ffffff';
      this.ctx.fillText('MERCURY', 5 * GU, 15 * GU);
      this.ctx.fillText('REVISION', 5 * GU, 35 * GU);
      this.ctx.fillText('PANDACUBE', 5 * GU, 55 * GU);

      this.canvasTexture.needsUpdate = true;
      this.canvasMaterial.needsUpdate = true;
    }

    update(frame) {
      super.update(frame);

      const startBEAN = 228 * 12;

      const baseIndex = clamp(0, (BEAN - startBEAN) / (2 * 12) | 0, 15);

      const slideIndex = clamp(0, frame - FRAME_FOR_BEAN(startBEAN + 2 * 12 * baseIndex), 27);
      const animationIndex = clamp(0, frame - FRAME_FOR_BEAN(startBEAN + 12 + 2 * 12 * baseIndex), 27);

      this.screenMaterial.map = this.frames[clamp(0, baseIndex * 10 + animationIndex / 3, 160) | 0];

      this.screen.position.z = lerp(1700, 100, (frame - FRAME_FOR_BEAN(startBEAN)) / 885);
      this.screen.position.x = (baseIndex % 2 ? -7 : 7) + (baseIndex % 2 ? 1 : -1) * slideIndex * 14 / 27;
      this.screen.position.y = easeIn(easeOut(10, 15, slideIndex / 14), 10, (slideIndex - 14) / 13);

      this.camera.position.z = this.screen.position.z + lerp(50, 25, (frame - FRAME_FOR_BEAN(startBEAN)) / 885);
      this.camera.position.y = lerp(15, 10, (frame - FRAME_FOR_BEAN(startBEAN)) / 885);

      this.light.position.z = this.camera.position.z;
    }

    resize() {
      super.resize();

      this.canvas.width = 10 * GU;
      this.canvas.height = 100 * GU;
    }
  }

  global.greets = greets;
})(this);
