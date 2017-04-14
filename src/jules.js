(function(global) {
  class jules extends NIN.THREENode {
    constructor(id) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.hexagonRotation = 0;
      this.group = [];
      let geo = new THREE.CircleBufferGeometry(3, 6);
      for (let i=0;i<50;i++) {
        this.group[i] = [];
        for (let j=0;j<50;j++) {
          let mat = {};
          if ((i+j) % 2 == 0) {
            mat = new THREE.MeshBasicMaterial({color: 0xff00a2});
          }
          else if ((i+j) % 2 == 1) {
            mat = new THREE.MeshBasicMaterial({color: 0x0092dd});
          }
          let mesh = new THREE.Mesh(geo, mat);
          mesh.position.set((i-25)*30,(j-25)*30,-3);
          this.group[i][j]= mesh;
          this.scene.add(this.group[i][j]);
        }
      }

      let light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
      this.scene.background = new THREE.Color(0, 0, 0);
    }

    update(frame) {
      super.update(frame);

      const startBEAN = 196 * 12;

      if (BEAN < startBEAN + 12 * 16 || BEAN > startBEAN + 12 * 24) {
        if (BEAT && (BEAN % 12) == 0) {
          this.hexagonRotation += Math.PI/3/4;
        }
      } else {
        if (BEAT && [0, 9, 18].includes(BEAN % 24)) {
          this.hexagonRotation += Math.PI/3/4;
        }
      }

      this.scene.background.setRGB(0.1, 0.0, 0.1);
      if(BEAN >= 12 * 4 * 53 - 12 && BEAN < 12 * 4 * 53) {
        this.scene.background.setRGB(1, 1, 1);
        if(BEAN < 12 * 4 * 53 - 9) {
          this.scene.background.setHex(0xff00a2);
        } else if(BEAN < 12 * 4 * 53 - 6) {
          this.scene.background.setHex(0x0092dd);
        } else if(BEAN < 12 * 4 * 53 - 3) {
          this.scene.background.setHex(0xff00a2);
        } else {
          this.scene.background.setHex(0x0092dd);
        }
      }

      let scale = 1 + Math.sin((frame - FRAME_FOR_BEAN(startBEAN + 12 * 32)) * Math.PI * 2 / 60 / 60 * 130 / 6) / 4;
      for (let i=0; i<50; i++) {
        for (let j=0; j<50; j++) {
          if (BEAT) {
            this.group[i][j].rotation.z = this.hexagonRotation * ((i + j) % 2 == 0 ? 1 : -1);
          }

          if (BEAN < startBEAN + 12 * 8) {
            const endBEAN = startBEAN + 12 * 8;
            const xyz = (i+j) % 2 == 0 ? 1.5 : 0.5;
            this.group[i][j].scale.set(xyz, xyz, xyz);

            this.group[i][j].position.x = (i - 25) * 10 * (0.5 + (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(endBEAN) - FRAME_FOR_BEAN(startBEAN)));
            this.group[i][j].position.y = (j - 25) * 10 * (0.5 + (frame - FRAME_FOR_BEAN(startBEAN)) / (FRAME_FOR_BEAN(endBEAN) - FRAME_FOR_BEAN(startBEAN)));
          } else if (BEAN < startBEAN + 12 * 16) {
            this.group[i][j].position.x = lerp((i - 25) * 10 * 1.5, (i - 25) * 10 * 1.5 - 50, (frame - FRAME_FOR_BEAN(startBEAN + 12 * 8)) / (FRAME_FOR_BEAN(startBEAN + 12 * 16) - FRAME_FOR_BEAN(startBEAN + 12 * 8)));
            if (BEAN % 12 == 0) {
              const temp = (i + j + (BEAN / 12 % 2)) % 2 == 0 ? 1.5 : 0.5;
              this.group[i][j].scale.set(temp, temp, temp);
              this.group[i][j].position.z = 0;
            }
          } else if (BEAN < startBEAN + 12 * 32 && BEAT) {
            const endBEAN = startBEAN + 12 * 32;
            this.group[i][j].position.x = -50 + (i - 25) * 10 * 1.5 - (i - 25) * 10 * (frame - FRAME_FOR_BEAN(startBEAN + 12 * 16)) / (FRAME_FOR_BEAN(endBEAN) - FRAME_FOR_BEAN(startBEAN + 12 * 16));
            this.group[i][j].position.y = (j - 25) * 10 * 1.5 - (j - 25) * 10 * (frame - FRAME_FOR_BEAN(startBEAN + 12 * 16)) / (FRAME_FOR_BEAN(endBEAN) - FRAME_FOR_BEAN(startBEAN + 12 * 16));

            const xyz = (i+j) % 2 == 0 ? 1.5 * scale : 0.5 * scale;
            this.group[i][j].scale.set(xyz, xyz, xyz);
          }
        }
      }
    }
  }

  global.jules = jules;
})(this);
