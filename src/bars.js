(function(global) {

  class bars extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        inputs: {
          percolator: new NIN.Input()
        },
        camera: options.camera,
      });

      //this.scene.background = new THREE.Color(0x1a001a);
      this.scene.background = new THREE.Color(0x1a001a);
      this.background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        new THREE.ShaderMaterial(SHADERS.zigzag));
      this.background.material.side = THREE.BackSide;
        /*
        new THREE.MeshBasicMaterial({
          color: 0x1b0922,
          side: THREE.BackSide
        }));
        */
      this.scene.add(this.background);

      this.numBars = 16;  // per row
      this.avgBarPower = [
        0.009078874982284765,
        0.008483158601577038,
        0.0037441145397272457,
        0.0023338213808967237,
        0.0012133696247049364,
        0.0012292039311328129,
        0.0007307594487203212,
        0.0006105713962976541,
        0.0004710757868021734,
        0.0003082225009977584,
        0.00030216972748115824,
        0.00021645827442290329,
        0.00017606663537522761,
        0.00008073090271394498,
        0.000017557109822553474,
        4.363201143910552e-7
      ];

      this.sampleFreq = 44100;  // fallback in case of incompatible nin
      if (demo.music && demo.music.audioContext && demo.music.audioContext.sampleRate) {
        this.sampleFreq = demo.music.audioContext.sampleRate;
      }
      this.nyquistFreq = this.sampleFreq / 2;
      this.maxMel = 2595 * Math.log10(1 + this.nyquistFreq / 700);
      this.numBins = 1024;  // fallback in case of incompatible nin
      if (demo.music && demo.music.getFftSize) {
        this.numBins = demo.music.getFftSize() / 2;
      }
      this.freqPerBin = this.nyquistFreq / this.numBins;

      this.cubes = [];
      for (let j = 0; j < this.numBars; j++) {
        const cuberow = [];
        for (let i = 0; i < this.numBars; i++) {
          const cube = new THREE.Mesh(new THREE.CylinderGeometry(5, 5, 10, 32),
                                      new THREE.MeshStandardMaterial({
                                        color: 0xff00a2,
                                        emissive: 0x440022
                                      }));
          cube.rotation.y = 1;
          cube.scale.y = 0.01;
          cube.position.x = 100000;
          cube.position.z = -20 * j;
          cube.castShadow = true;
          cube.receiveShadow = true;
          this.scene.add(cube);
          cuberow.push(cube);
        }
        this.cubes.push(cuberow);
      }

      this.splashStartFrames = [];
      this.splashes = [];
      for (let i = 0; i < 8; i++) {
        const splash = {
          radius: 0,
          x: 21.42 + 42.86 * (i - 4),
          z: 0,
          opacity: 0,
        };
        this.splashes.push(splash);
      }

      const ambilight = new THREE.AmbientLight(0xffffff, 0.3);
      this.scene.add(ambilight);

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.canvasTexture = new THREE.CanvasTexture(this.canvas);
      this.canvasTexture.minFilter = THREE.LinearFilter;
      this.canvasTexture.magFilter = THREE.LinearFilter;
      this.canvasMaterial = new THREE.MeshStandardMaterial({
        map: this.canvasTexture,
        roughness: 0,
        emissive: 0x0057ff,
      });
      this.plane = new THREE.Mesh(
        new THREE.PlaneGeometry(1200, 1200),
        this.canvasMaterial
      );
      this.plane.receiveShadow = true;
      this.plane.rotation.x = -Math.PI * 0.5;
      this.scene.add(this.plane);

      var light = new THREE.DirectionalLight(0xffffff, 1, 100);
      this.directionalLight = light;
      light.position.set(150, 200, 100);
      light.castShadow = true;
      light.shadow.mapSize.width = 1024 * 2;
      light.shadow.mapSize.height = 1024 * 2;
      light.shadow.camera.near = 1;
      light.shadow.camera.far = 500;
      light.shadow.camera.left = -100;
      light.shadow.camera.right = 200;
      light.shadow.camera.bottom = -100;
      light.shadow.camera.top = 300;
      light.shadow.camera.position.set(150, 200, 100);
      light.shadow.camera.lookAt(new THREE.Vector3(0, 0, 0));
      let helper = new THREE.CameraHelper(light.shadow.camera);
      this.scene.add(light);
      //this.scene.add(helper);

      this.chordFrames = [];
      for (let i = 0; i < 8; i++) {
        this.chordFrames.push(FRAME_FOR_BEAN(67 * 12 + i * 12 * 4));
      }

      this.resize();
    }

    update(frame) {
      this.frame = frame;
      if (frame >= 2549 && frame <= 2800) {
        this.camera.up = new THREE.Vector3(1, 0, 0);
      } else {
        this.camera.up = new THREE.Vector3(0, 1, 0);
      }

      super.update(frame);

      this.background.material.uniforms.frame.value = frame;
      this.background.material.uniforms.amount.value = easeOut(
          0,
          1,
          (frame - 968 + 10 ) / (1051 - 968));

      const fft = demo.music ? demo.music.getFFT() : [];

      let currentHeights = [];
      for (let i = 0; i < this.numBars; i++) {
        const fraction = i / this.numBars;
        const mel = this.maxMel * fraction;
        const nextMel = mel + this.maxMel / this.numBars;
        const lowerFreqBound = 700 * (Math.pow(10, mel / 2595) - 1);
        const upperFreqBound = 700 * (Math.pow(10, nextMel / 2595) - 1);
        const lowerBin = 0 | Math.round(lowerFreqBound / this.freqPerBin);
        const upperBin = 0 | Math.round(upperFreqBound / this.freqPerBin);
        const numBins = upperBin - lowerBin;
        const fftSlice = fft.slice(lowerBin, upperBin);
        const fftAvgDb = fftSlice.reduce((a, b) => a + b, 0) / numBins;
        const linearAvg = Math.pow(10, fftAvgDb / 20);  // ranges from 0 to 1
        let height = 1.337 * Math.pow(linearAvg / this.avgBarPower[i], 2);
        currentHeights.push(height);
      }

      const relativeBEAN = (BEAN / 12 - 67) | 0;
      for (const [j, cuberow] of this.cubes.entries()) {
        for (const [i, cube] of cuberow.entries()) {
          let height = currentHeights[i];

          const endStartFrame = FRAME_FOR_BEAN(97 * 12 + 6) - 10;
          const endStartFrameTwo = FRAME_FOR_BEAN(98 * 12 + 6) - 10;
          height = smoothstep(height, 1, (frame - endStartFrame) / 20);
          height = smoothstep(height, 0, (frame - endStartFrameTwo) / 20);

          const middleFrame = FRAME_FOR_BEAN((67 + 9) * 12);
          if (j !== 0) {
            height = smoothstep(0, (1 - j / this.numBars) * height, (frame - middleFrame) / 240);
          }

          cube.scale.y = clamp(0.01, height, 20);
          cube.position.y = 5 * height;

          if (i < relativeBEAN && j < relativeBEAN) {
            cube.position.x = 10 + 20 * (i - 8);
            if (frame > endStartFrameTwo) {
              if (j !== 5 || i !== 8) {
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

      if (frame < 1880) {
        this.splashStartIndex = 0;
        this.splashStartFrames = [];
      }
      if (this.inputs.percolator.getValue()) {
        this.splashStartFrames[this.splashStartIndex] = frame;
        this.splashStartIndex = (this.splashStartIndex + 1) % 8;
      }

      for (let [i, splash] of this.splashes.entries()) {
        const startFrame = this.splashStartFrames[i] || frame;
        splash.opacity = easeOut(easeOut(0, 1, (frame - startFrame) / 150), 0, (frame - startFrame - 25) / 50);
        splash.radius = easeOut(0, 8, (frame - startFrame) / 500);
      }

      const planeColorFrame = FRAME_FOR_BEAN(98 * 12);
      const r = lerp(0, 0, (frame - planeColorFrame) / 54);
      const g = lerp(97, 146, (frame - planeColorFrame) / 54);
      const b = lerp(255, 221, (frame - planeColorFrame) / 54);
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

      const planeColorFrame = FRAME_FOR_BEAN(98 * 12);
      const r = lerp(0, 0, (this.frame - planeColorFrame) / 54);
      const g = lerp(146, 162, (this.frame - planeColorFrame) / 54);
      const b = lerp(221, 255, (this.frame - planeColorFrame) / 54);
      for (const splash of this.splashes) {
        const opacity = Math.round(splash.opacity * 100) / 100;
        this.ctx.fillStyle = `rgba(${r|0}, ${g|0}, ${b|0}, ${opacity})`;
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
