(function(global) {

  class bars extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        camera: options.camera,
      });

      this.scene.background = new THREE.Color(0x00a2ff);

      this.splashes = [];
      this.cubes = [];
      for (let j=0; j < 17; j++) {
        const cuberow = [];
        const splashrow = [];
        for (let i=0; i < 16; i++) {
          const cube = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 32),
                                      new THREE.MeshToonMaterial({color: 0x875F9A }));
          cube.rotation.y = 1;
          cube.scale.y = 0.01;
          cube.position.x = 100000;
          cube.position.z = 40 * (j - 8);
          this.scene.add(cube);
          cuberow.push(cube);

          const splash = {
            radius: 1,
            x: 10 + 20 * (i - 8),
            z: 40 * (j - 8),
          };
          splashrow.push(splash);
        }
        this.cubes.push(cuberow);
        this.splashes.push(splashrow);
      }

      const light = new THREE.AmbientLight(0xffffff, 0.1);
      this.scene.add(light);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0, 100, 100);
      this.scene.add(dirLight);

      /*
      this.triangles = [];
      for (let i=0; i < 8; i++) {
        const geom = new THREE.Geometry();
        geom.vertices.push(
          new THREE.Vector3(0,0,0),
          new THREE.Vector3(-100,500,0),
          new THREE.Vector3(100,500,0)
        );

        geom.faces.push(new THREE.Face3(0, 1, 2));
        geom.computeFaceNormals();

        const material = new THREE.MeshBasicMaterial({color: 0x22ccff, side: THREE.DoubleSide});
        const triangle = new THREE.Mesh(geom, material);
        triangle.position.set(0, 0, -300);
        triangle.rotation.set(0, 0, Math.PI);
        this.triangles.push(triangle);
        this.scene.add(triangle);
      }
      */

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasMaterial = new THREE.MeshBasicMaterial({map: this.canvasTexture});
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1600, 600),
        this.canvasMaterial
      );
      this.plane.rotation.x = -Math.PI * 0.5;
      this.scene.add(this.plane);

      this.chordFrames = [];
      for (let i=0; i < 8; i++) {
        this.chordFrames.push(FRAME_FOR_BEAN(67 * 12 + i * 12 * 4));
      }

      this.resize();
    }

    update(frame) {
      super.update(frame);

      const fft = demo.music.getFFT();

      const relativeBEAN = (BEAN / 12 - 67) | 0;
      for (const [j, cuberow] of this.cubes.entries()) {
        for (const [i, cube] of cuberow.entries()) {
          const index = 15 - i;
          let height = clamp(0, 150 + fft.slice(index * 64, index * 64 + 64).reduce((a,b) => a+b, 0) / 64, 120);
          height = (0.005 * (index)) * height;

          const endStartFrame = FRAME_FOR_BEAN(97 * 12 + 6) - 10;
          const endStartFrameTwo = FRAME_FOR_BEAN(98 * 12 + 6) - 10;
          height = smoothstep(height, 1, (frame - endStartFrame) / 20);
          height = smoothstep(height, 0, (frame - endStartFrameTwo) / 20);

          const middleFrame = FRAME_FOR_BEAN((67 + 9) * 12);
          if (j !== 8) {
            height = smoothstep(0, (1 - Math.abs(j - 8) / 8) * height, (frame - middleFrame) / 240);
          }

          cube.scale.y = clamp(0.01, height, 10);
          cube.position.y = 5 * height;

          if (i < relativeBEAN && (j === 8 || relativeBEAN >= 9)) {
            cube.position.x = 10 + 20 * (i - 8);
            if (frame > endStartFrameTwo + 20) {
              if (j !== 8 || i !== 8) {
                cube.position.x = 10000;
              }
            }

            this.splashes[j][i].x = 10 + 20 * (i - 8);
            this.splashes[j][i].z = 40 * (j - 8);
          } else {
            cube.position.x = 100000;

            this.splashes[j][i].x = 10000;
            this.splashes[j][i].z = 10000;
          }
        }
      }

      /*
      for (const [i, triangle] of this.triangles.entries()) {
        triangle.rotation.z = (frame - this.chordFrames[i]) / 60;
      }
      */

      const planeColorFrame = FRAME_FOR_BEAN(98 * 12 + 12) - 10;
      const r = smoothstep(255, 100, (frame - planeColorFrame) / 20);
      const g = smoothstep(255, 219, (frame - planeColorFrame) / 20);
      const b = smoothstep(255, 132, (frame - planeColorFrame) / 20);
      this.backgroundColor = `rgb(${r}, ${g}, ${b})`;

      this.splashRadius = lerp(1, 5, (frame - FRAME_FOR_BEAN(BEAN - BEAN % 48)) / 240);
    }

    resize() {
      super.resize();

      this.canvas.width = 160 * GU;
      this.canvas.height = 60 * GU;
    }

    render(renderer) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, 160 * GU, 60 * GU);

      this.ctx.fillStyle = 'rgba(100, 219, 132, 0.7)';
      for (const [j, splashrow] of this.splashes.entries()) {
        for (const [i, splash] of splashrow.entries()) {
          this.ctx.beginPath();
          this.ctx.ellipse(
            80 * GU + splash.x / 10 * GU,
            30 * GU + splash.z / 10 * GU,
            this.splashRadius * GU,
            this.splashRadius * GU,
            0, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
      this.canvasTexture.needsUpdate = true;
      this.canvasMaterial.needsUpdate = true;

      super.render(renderer);
    }
  }

  global.bars = bars;
})(this);
