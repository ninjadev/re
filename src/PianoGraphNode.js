(function(global) {

  const MAX_POINTS = 1024 * 8;
  const MAX_LIFE = 100;
  const DISTANCE_THRESHOLD = 5;

  const easeOutExpo = function (t, b, c, d) {
      return c * ( -Math.pow( 2, -10 * t/d ) + 1 ) + b;
  };

  const MAX_OBJECTS = 6;
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
          logo: new NIN.TextureInput()
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

    spawnPoint(x, y) {
      if(this.activePoints == MAX_POINTS) {
        return;
      }
      const point = this.points[this.activePoints++];
      point.x = x;
      point.y = y;
      point.dx = 0.01 * (Math.random() - .5);
      point.dy = 0.01 * (Math.random() - .5);
      point.life = MAX_LIFE;
    }

    resize() {
      this.canvas.width = 16 * GU;
      this.canvas.height = 9 * GU;
    }

    update(frame) {

      this.frame = frame;

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
                8 + (Math.random() - 0.5) * 8 * 2 / this.zoom,
                4.5 + (Math.random() - 0.5) * 4.5 * 2 / this.zoom);
            }
        }
      }

      let analysisValue = this.pianoAnalysis.getValue(frame);
      while(analysisValue > 0) {
        this.spawnPoint(
          8 + (Math.random() - 0.5) * 8 * 2 / this.zoom,
          4.5 + (Math.random() - 0.5) * 4.5 * 2 / this.zoom);
        analysisValue -= 0.05;
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
        const size = 0.02 * GU * point.lifeScaled;
        this.ctx.ellipse(point.x * GU, point.y * GU, size,  size, 0, 0, Math.PI * 2);
        this.ctx.fill();
      }
      quadTree.traverse((a, b, lengthSquared) => {
        this.ctx.globalAlpha =  (1 - lengthSquared * DISTANCE_THRESHOLD) * a.lifeScaled * b.lifeScaled;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x * GU, a.y * GU);
        this.ctx.lineTo(b.x * GU, b.y * GU);
        this.ctx.stroke();
      });
      //quadTree.debugRender(this.ctx);
      if(this.frame > 6983) {
        const scale = 2;
        const image = this.inputs.logo.getValue().image;
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.scale(scale, scale);
        this.ctx.globalAlpha = 1;
        this.ctx.drawImage(image, -image.width / 4, -image.height / 4);
      }
      this.ctx.restore();
      if(this.beatorama)  {
        this.ctx.globalAlpha = 1;
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.outputTexture.needsUpdate = true;
      this.outputs.render.setValue(this.outputTexture);
    }
  }

  global.PianoGraphNode = PianoGraphNode;
})(this);
