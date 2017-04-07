(function(global) {
  class jules extends NIN.THREENode {
    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.hexagonRotation = 0;
      this.group = [];
      for (var i=0;i<50;i++) {
        this.group[i] = [];
        for (var j=0;j<50;j++) {
          var geo = new THREE.CircleBufferGeometry(3, 6);
          if ((i+j) % 2 == 0) {
            var mat = new THREE.MeshBasicMaterial({color: 0xc94c4c});
          }
          else if ((i+j) % 2 == 1) {
            var mat = new THREE.MeshBasicMaterial({color: 0xb1cbbb});
          }
          var mesh = new THREE.Mesh(geo, mat);
          mesh.position.set((i-25)*10,(j-25)*10,0);
          this.group[i][j]= mesh;
          this.scene.add(this.group[i][j]);
        }
      }

      var light = new THREE.PointLight(0xffffff, 1, 100);
      light.position.set(50, 50, 50);
      this.scene.add(light);

      this.camera.position.z = 100;
    }

    update(frame) {
      super.update(frame);
      if (BEAT && (BEAN % 12) == 0) {
        this.hexagonRotation += Math.PI/3/4;
      }
      var scale = Math.sin(frame*Math.PI*2/60/60*130/3)
      for (var i=0;i<50;i++) {
        for (var j=0;j<50;j++) {
          if (frame < 8550) { 
            if (BEAT) {
              var xyz = (i+j) % 2 == 0 ? 1.8 : 0.8;
              this.group[i][j].scale.set(xyz, xyz, xyz);
              this.group[i][j].position.x = (i-25)*10*((Math.sin(frame/100)+3)/3);
              this.group[i][j].position.y = (j-25)*10*((Math.sin(frame/100)+3)/3);
              this.group[i][j].rotation.z = this.hexagonRotation * ((i + j) % 2 == 0 ? 1 : -1);
            }
          }
          else if (frame < 8750) {
            if (BEAT) { 
              var temp = (i + j) % 2 == 0 ? 1 + 0.8 * scale : 1 + -0.8 * scale;
              this.group[i][j].scale.set(temp, temp, temp);
            }
          }
          else if (frame < 8920) {
            this.group[i][j].position.x = -(i-25)*10*((Math.sin(frame/100)+3)/3);
            this.group[i][j].position.y = -(j-25)*10*((Math.sin(frame/100)+3)/3);  
          }
          else if (frame == 8920) {
            var min = (i+j)%2==0 ? 60 : 280;
            var h = Math.floor(Math.random() * 50) + min;
            console.log(h);
            this.group[i][j].material.color.setHSL(h/100, 1, 0.60);
          }
        }
      }
    }
  }

  global.jules = jules;
})(this);
