(function(global) {

  const MAX_POINTS = 1024 * 8 * 8;
  const MAX_LIFE = 90;
  const DISTANCE_THRESHOLD = 5;

  const easeOutExpo = function (t, b, c, d) {
      return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
  };

  const MAX_OBJECTS = 10;
  const RADIUS = Math.sqrt(1 / DISTANCE_THRESHOLD);

  class QuadTree {

    constructor(level, x, y, w, h) {
      this.objects = [];
      this.level = level;
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.nodes = [];
    }

    debugRender(ctx) {
      ctx.globalAlpha = 1;
      ctx.strokeStyle = 'red';
      ctx.strokeRect(this.x * GU, this.y * GU, this.w * GU, this.h * GU);
      for(let node of this.nodes) {
        node.debugRender(ctx);
      }
      ctx.strokeStyle = 'green';
      for(let obj of this.objects) {
        ctx.beginPath();
        ctx.ellipse(obj.x * GU, obj.y * GU, RADIUS * GU, RADIUS * GU, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    traverse(fn, objects=[]) {
      for(let objA of objects) {
        for(let objB of this.objects) {
          let x = objA.x - objB.x;
          let y = objA.y - objB.y;
          let lengthSquared = x * x + y * y;
          if(lengthSquared < 1 / DISTANCE_THRESHOLD) {
            fn(objA, objB, lengthSquared);
          }
        }
      }
      for(let i = 0; i < this.objects.length; i++) {
        for(let j = i + 1; j < this.objects.length; j++) {
          const objA = this.objects[i];
          const objB = this.objects[j];
          let x = objA.x - objB.x;
          let y = objA.y - objB.y;
          let lengthSquared = x * x + y * y;
          if(lengthSquared < 1 / DISTANCE_THRESHOLD) {
            fn(objA, objB, lengthSquared);
          }
        }
      }
      for(let node of this.nodes) {
        node.traverse(fn, objects.concat(this.objects));
      }
    }

    clear() {
      this.objects = []; 
      for(let node of this.nodes) {
        node.clear();
      }
    }

    split() {
      const halfWidth = this.w / 2;
      const halfHeight = this.h / 2;
      const x = this.x;
      const y = this.y;
      this.nodes[0] = new QuadTree(this.level + 1,
                                   x, y,
                                   halfWidth, halfHeight);
      this.nodes[1] = new QuadTree(this.level + 1,
                                   x + halfWidth, y,
                                   halfWidth, halfHeight);
      this.nodes[2] = new QuadTree(this.level + 1,
                                   x + halfWidth, y + halfHeight,
                                   halfWidth, halfHeight);
      this.nodes[3] = new QuadTree(this.level + 1,
                                   x, y + halfHeight,
                                   halfWidth, halfHeight);
    }

    getIndex(obj) {
      for(let i = 0; i < 4; i++) {
        const x = obj.x - RADIUS;
        const y = obj.y - RADIUS;
        const w = RADIUS * 2;
        const h = RADIUS * 2;
        if(x >= this.nodes[i].x && x + w < this.nodes[i].x + this.nodes[i].w &&
           y >= this.nodes[i].y && y + h < this.nodes[i].y + this.nodes[i].w) {
          return i;
        }
      }
      return -1;
    }


    insert(obj) {
      if(this.nodes[0]) {
        const index = this.getIndex(obj);
        if(index != -1) {
          this.nodes[index].insert(obj);
          return;
        }
      }

      this.objects.push(obj);
      if(this.objects.length >= MAX_OBJECTS && !this.nodes[0]) {
        this.split();
        const objects = this.objects;
        this.objects = [];
        for(let object of objects) {
          this.insert(object);
        }
      }
    }
  }

  class PianoGraphNode extends NIN.Node {
    constructor(id, options) {
      super(id, {
        inputs: {
          logo: new NIN.TextureInput(),
          polygons: new NIN.Input(),
        },
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d');
      this.resize();
      this.outputTexture = new THREE.VideoTexture(this.canvas);
      this.outputTexture.magFilter = THREE.LinearFilter;
      this.outputTexture.minFilter = THREE.LinearFilter;
      this.pianoAnalysis = new audioAnalysisSanitizer('stem_percolator.wav', 'spectral_energy', 0.5);

      this.points = [];
      for(let i = 0; i < MAX_POINTS; i++) {
        this.points.push({
          x: 0,
          y: 0,
          dx: 0,
          dy: 0,
          life: 0,
        });
      }
      this.activePoints = 0;
    }

    loadPolygons() {
      this.oldPolygonValue = this.inputs.polygons.getValue();
      this.polygons = [];
      const keys = Object.keys(this.oldPolygonValue);
      for(let key of keys) {
        const polygon = this.oldPolygonValue[key];
        if(typeof polygon == 'number') {
          continue;
        }
        this.polygons.push(polygon);
      }
    }

    spawnPointsAroundPolygon() {
      let dice = Math.random() * this.oldPolygonValue.lineLength;
      let lineIndex;
      let chosenPolygon;
      outer:
      for(let polygon of this.polygons) {
        if(dice - polygon.lineLength <= 0) {
          chosenPolygon = polygon;
          for(let i = 0; i < polygon.length; i++) {
            const line = polygon[i];
            if(dice - line.lineLength <= 0) {
              lineIndex = i;
              break outer;    
            }
            dice -= line.lineLength;
          }
        }
        dice -= polygon.lineLength;
      }
      const x0 = chosenPolygon[lineIndex][0];
      const y0 = chosenPolygon[lineIndex][1];
      const x1 = chosenPolygon[(lineIndex + 1) % chosenPolygon.length][0];
      const y1 = chosenPolygon[(lineIndex + 1) % chosenPolygon.length][1];
      const w = x1 - x0;
      const h = y1 - y0;
      const random = Math.random();
      this.spawnPoint((x0 + w * random) * 8 / 64 * 4 + 0.75,
                      (y0 + h * random) * 8 / 64 * 4 + 2,
      0.003);
    }

    spawnPoint(x, y, speed=0.005) {
      if(this.activePoints == MAX_POINTS) {
        return;
      }
      const angle = Math.random() * Math.PI * 2;
      const point = this.points[this.activePoints++];
      point.x = x;
      point.y = y;
      point.dx = speed * Math.cos(angle);
      point.dy = speed * Math.sin(angle);
      point.life = MAX_LIFE;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {

      this.frame = frame;

      if(this.oldPolygonValue != this.inputs.polygons.getValue()) {
        this.loadPolygons();
      }

      if(frame == 6313) {
        this.activePoints = 0;
      }

      this.beatorama = false;
      if(BEAT) {
        switch((BEAN - 12 * 4) % (12 * 4 * 8)) {
          case 0: case 1:
          case 6:
          case 12:
          case 18:
          case 24:
          case 33:
          case 42:
          case 5.5 * 12:
          case 6 * 12:
          case 6.25 * 12:
          case 6.5 * 12:
          case 7 * 12:
          case 7.5 * 12:
          case 7.75 * 12:
          case 8.5 * 12:
          case 9 * 12:
          case 9.5 * 12:
          case 10 * 12:
          case 10.75 * 12:
          case 11.5 * 12:
            for(let i = 0; i < 32; i++) {
              this.spawnPoint(
                8 + (Math.random() - 0.5) * 8 * 2 / this.zoom * 1.1,
                4.5 + (Math.random() - 0.5) * 4.5 * 2 / this.zoom * 1.1);
            }
        }
      }

      let analysisValue = this.pianoAnalysis.getValue(frame);
      if(frame < 7000) {
        while(analysisValue > 0) {
          this.spawnPoint(
            8 + (Math.random() - 0.5) * 8 * 2 / this.zoom * 1.1,
            4.5 + (Math.random() - 0.5) * 4.5 * 2 / this.zoom * 1.1);
          if(frame > 6800 && frame < 7000) {
            this.spawnPointsAroundPolygon();
            this.spawnPointsAroundPolygon();
            analysisValue -= 0.1;
          } else {
            analysisValue -= 0.05;
          }
        }
      } else {
        for(let i = 0; i < 4; i++) {
          this.spawnPoint(
            8 + (Math.random() - 0.5) * 8 * 2 / this.zoom * 1.1,
            4.5 + (Math.random() - 0.5) * 4.5 * 2 / this.zoom * 1.1);
        }
      }

      for(let i = 0; i < this.activePoints; i++) {
        const point = this.points[i];
        point.x += point.dx;
        point.y += point.dy;
        point.life--;
        point.lifeScaled = easeOutExpo(point.life, 0, 1, MAX_LIFE);
        if(point.life == 0) {
          this.activePoints--;
          const temp = this.points[this.activePoints];
          this.points[this.activePoints] = this.points[i];
          this.points[i] = temp;
          i--;
        }
      }
      this.zoom = smoothstep(2, 0.5, (frame - 6314) / (7309 - 6314));
    }

    render(renderer) {
      const quadTree = new QuadTree(0, -16 / 2, -9 / 2, 16 * 2, 9 * 2);
      for(let i = 0; i < this.activePoints; i++) {
        quadTree.insert(this.points[i]);
      }
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.globalCompositeOperation = 'lighter';
      this.ctx.save();
      this.ctx.fillStyle = '#0d1d38';
      this.ctx.globalAlpha = 1;
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.fillStyle = 'white';
      this.ctx.strokeStyle = 'white';
      this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2); 
      this.ctx.scale(this.zoom, this.zoom);
      this.ctx.translate(-this.canvas.width / 2, -this.canvas.height / 2); 
      for(let i = 0; i < this.activePoints; i++) {
        const point = this.points[i];
        this.ctx.globalAlpha = point.lifeScaled;
        this.ctx.beginPath();
        let size = 0.03 * GU * point.lifeScaled;
        if(point.lifeScaled > 0.995) {
          size += easeOut(0.05 * GU, 0, 1 - (point.lifeScaled - 0.995) * 200);
        }
        this.ctx.ellipse(point.x * GU, point.y * GU, size,  size, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
      quadTree.traverse((a, b, lengthSquared) => {
        this.ctx.globalAlpha =  (1 - lengthSquared * DISTANCE_THRESHOLD) * a.lifeScaled * b.lifeScaled;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x * GU, a.y * GU);
        this.ctx.lineTo(b.x * GU, b.y * GU);
        this.ctx.lineWidth = GU * 0.01;
        this.ctx.stroke();
      });
      //quadTree.debugRender(this.ctx);
      if(this.frame > 6979) {
        const scale = 2;
        const image = this.inputs.logo.getValue().image;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = lerp(0, 1, (this.frame - 6979) / 100);
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'lighter';
        this.ctx.drawImage(image, -image.width / 4, -image.height / 4);
        this.ctx.restore();
      }
      this.ctx.restore();
      if(this.beatorama)  {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }

      if(this.frame > 7242 - 20) {
        this.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, easeIn(0, 16, (this.frame - 7242 + 20) / 20) * GU, 2.5 * GU);
      }
      if(this.frame > 7283 - 20) {
        this.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        const value = easeIn(0, 16, (this.frame - 7283 + 20) / 20);
        this.ctx.fillRect((16 - value) * GU, (9 - 2.5) * GU, 16 * GU, 2.5 * GU);
      }
      if(this.frame > 7309 - 20) {
        this.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 2 * GU, easeIn(0, 16, (this.frame - 7309 + 20) / 20) * GU, 5 * GU);
      }
      this.outputTexture.needsUpdate = true;
      this.outputs.render.setValue(this.outputTexture);
    }
  }

  global.PianoGraphNode = PianoGraphNode;
})(this);
