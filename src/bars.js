(function(global) {

  class bars extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        inputs: {
          percolator: new NIN.Input()
        },
        camera: options.camera,
      });

      this.scene.background = new THREE.Color(0x6C92B4);

      this.cubes = [];
      for (let j=0; j < 17; j++) {
        const cuberow = [];
        for (let i=0; i < 16; i++) {
          const cube = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 32),
                                      new THREE.MeshToonMaterial({color: 0xaa4839 }));
          cube.rotation.y = 1;
          cube.scale.y = 0.01;
          cube.position.x = 100000;
          cube.position.z = 20 * (j - 8);
          this.scene.add(cube);
          cuberow.push(cube);

        }
        this.cubes.push(cuberow);
      }

      this.rowStartIndices = [8,9,7,10,6,11,5,12,4,13,3,14,2,15,1,16,0];

      this.splashes = [];
      for (let i=0; i < 12; i++) {
        let zIndex = (i / 4 | 0);
        if (zIndex == 2) {
          zIndex = -1;
        }
        const splash = {
          radius: 0,
          x: 10 + 80 * ((i % 4) - 2),
          z: 80 * zIndex,
          opacity: 0,
        };
        this.splashes.push(splash);
      }

      const light = new THREE.AmbientLight(0xffffff, 0.1);
      this.scene.add(light);

      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(0, 100, 100);
      this.scene.add(dirLight);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasMaterial = new THREE.MeshBasicMaterial({map: this.canvasTexture});
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1200, 1200),
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
      if (frame >= 2549 && frame <= 2800) {
        this.camera.up = new THREE.Vector3(1, 0, 0);
      } else {
        this.camera.up = new THREE.Vector3(0, 1, 0);
      }

      if (this.inputs.percolator.getValue()) {
        this.rowStartIndex++;
      }

      super.update(frame);

      const fft = demo.music ? demo.music.getFFT() : [];


      if (frame < 1880) {
        this.rowStartIndex = 0;
      }

      const relativeBEAN = (BEAN / 12 - 67) | 0;
      for (const [j, cuberow] of this.cubes.entries()) {
        for (const [i, cube] of cuberow.entries()) {
          const index = 15 - i;
          const fftSlice = fft.slice(
            index * 55,
            index * 55 + 55
          );
          const fftAvg = fftSlice.reduce((a, b) => a + b, 0) / 55;
          let height = clamp(0, 150 + fftAvg, 150);
          height = height * 0.001 * (index + 30);

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

          if (i < relativeBEAN && (this.rowStartIndices.slice(0, this.rowStartIndex).includes(j))) {
            cube.position.x = 10 + 20 * (i - 8);
            if (frame > endStartFrameTwo) {
              if (j !== 8 || i !== 8) {
                cube.scale.x = lerp(1, 0, (frame - endStartFrameTwo - 0) / 20);
                cube.scale.z = lerp(1, 0, (frame - endStartFrameTwo - 0) / 20);
              } else {
                cube.scale.x = lerp(1, 0, (frame - endStartFrameTwo - 30) / 10);
                cube.scale.z = lerp(1, 0, (frame - endStartFrameTwo - 30) / 10);
              }
            } else {
              cube.scale.x = 1;
              cube.scale.z = 1;
            }
          } else {
            cube.position.x = 100000;
          }
        }
      }

      for (let [i, splash] of this.splashes.entries()) {
        if (i >= 8) {
          i -= 4;
        }
        const startFrame = FRAME_FOR_BEAN(67 * 12 + 48 * i);
        splash.opacity = easeOut(0, 1, (frame - startFrame) / 150);
        splash.radius = lerp(0, 1, (frame - startFrame) / 150);
      }

      const planeColorFrame = FRAME_FOR_BEAN(98 * 12 + 12) - 10;
      const r = lerp(255, 0, (frame - planeColorFrame) / 20);
      const g = lerp(224, 146, (frame - planeColorFrame) / 20);
      const b = lerp(144, 221, (frame - planeColorFrame) / 20);
      this.backgroundColor = `rgb(${r|0}, ${g|0}, ${b|0})`;
    }

    resize() {
      super.resize();

      this.canvas.width = 20 * GU;
      this.canvas.height = 20 * GU;
    }

    render(renderer) {
      this.ctx.fillStyle = this.backgroundColor;
      this.ctx.fillRect(0, 0, 20 * GU, 20 * GU);

      for (const splash of this.splashes) {
        this.ctx.fillStyle = `rgba(0, 146, 221, ${splash.opacity})`;
        this.ctx.beginPath();
        this.ctx.ellipse(
          10 * GU + splash.x / 60 * GU,
          10 * GU + splash.z / 60 * GU,
          splash.radius * GU,
          splash.radius * GU,
          0, 0, Math.PI * 2);
        this.ctx.fill();
      }
      this.canvasTexture.needsUpdate = true;
      this.canvasMaterial.needsUpdate = true;

      super.render(renderer);
    }
  }

  global.bars = bars;
})(this);
