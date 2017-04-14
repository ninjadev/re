(function(global) {
  class cubeTunnel extends NIN.Node {

    constructor(id, options) {
      super(id, {
        outputs: {
          render: new NIN.TextureOutput()
        }
      });

      this.scene = new THREE.Scene();
      this.renderTarget = new THREE.WebGLRenderTarget(640, 360, {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBFormat
      });
      this.camera = new THREE.PerspectiveCamera(45, 16 / 9, 1, 10000);

      this.top_material = new THREE.ShaderMaterial(SHADERS.topshader);
      this.wall_material = new THREE.ShaderMaterial(SHADERS.wallshader);

      // Things used when spawning the first ring of cubes.
      this.spawningCubes = [];
      this.box_geom = new THREE.BoxGeometry(8, 8, 0);
      for(var i=0; i<12; i++) {
        var newCube = new THREE.Mesh(this.box_geom,
                                     this.top_material);
        this.spawningCubes.push(newCube);
        this.spawningCubes[i].position.x = 1000;
      }

        this.create_geoms();

              this.background = new THREE.Mesh(
        new THREE.BoxGeometry(1000, 1000, 1000),
        /*new THREE.MeshBasicMaterial({
          color: 0x1b0922,
          side: THREE.BackSide
        }));*/
        new THREE.ShaderMaterial(SHADERS.zigzug));
        this.background.material.side = THREE.BackSide;        /*
        new THREE.MeshBasicMaterial({
          color: 0x1b0922,
          side: THREE.BackSide
        }));
        */
    }

    update(frame) {
      var startBEAN = 4224;

      this.background.material.uniforms.frame.value = frame;
      this.background.material.uniforms.amount.value = easeOut(
        0,
        1,
        (frame - 968 + 10 ) / (1051 - 968)
      );

      var relativeBEAN = BEAN - startBEAN;
      var switch_time = 4320;
      var switch_time2 = 4584;
      var camera_move_start = 4414;
      var camera_speed = 0.155;

      if (BEAN < switch_time) {
        if (frame == FRAME_FOR_BEAN(startBEAN) + 1) {
          this.scene = new THREE.Scene();
          for(var i=0; i<12; i++) {
            this.scene.add(this.spawningCubes[i]);
          }
          this.scene.add(this.background);

          this.background.position.z = 100;
          this.background.position.y = 0;

        }
        // Spawning the first "ring" of cubes.
        this.camera.position.z = 100;
        this.camera.position.y = 0;
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        var slideDuration = 4;
        var cornerSlideDuration = 24;

        // Set the poistion of the cubes which grow into existence.
        this.spawningCubes[0].position.x = -4;
        this.spawningCubes[0].position.y = -12;
        this.spawningCubes[1].position.x = 4;
        this.spawningCubes[1].position.y = -12;

        this.spawningCubes[3].position.x = 12;
        this.spawningCubes[3].position.y = -4;
        this.spawningCubes[4].position.x = 12;
        this.spawningCubes[4].position.y = 4;

        this.spawningCubes[6].position.x = 4;
        this.spawningCubes[6].position.y = 12;
        this.spawningCubes[7].position.x = -4;
        this.spawningCubes[7].position.y = 12;
   
        this.spawningCubes[9].position.x = -12;
        this.spawningCubes[9].position.y = 4;
        this.spawningCubes[10].position.x = -12;
        this.spawningCubes[10].position.y = -4;

        // Grow the cubes at the BEAN number in the FRAME_FOR_BEAN call.
        this.spawningCubes[0].scale.x = 
        this.spawningCubes[0].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 0) + slideDuration)/ slideDuration);
        this.spawningCubes[1].scale.x = 
        this.spawningCubes[1].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 8) + slideDuration)/ slideDuration);

        this.spawningCubes[3].scale.x =
        this.spawningCubes[3].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 24) + slideDuration)/ slideDuration);
        this.spawningCubes[4].scale.x =
        this.spawningCubes[4].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 32) + slideDuration)/ slideDuration);

        this.spawningCubes[6].scale.x =
        this.spawningCubes[6].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 48) + slideDuration)/ slideDuration);
        this.spawningCubes[7].scale.x =
        this.spawningCubes[7].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 56) + slideDuration)/ slideDuration);
   
        this.spawningCubes[9].scale.x =
        this.spawningCubes[9].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 72) + slideDuration)/ slideDuration);
        this.spawningCubes[10].scale.x =
        this.spawningCubes[10].scale.y = easeIn(0, 1, (frame - FRAME_FOR_BEAN(startBEAN + 80) + slideDuration)/ slideDuration);

        // Fly in the corner cubes.
        this.spawningCubes[2].position.x = 12;
        this.spawningCubes[2].position.y = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 16) + cornerSlideDuration)/ cornerSlideDuration);
        this.spawningCubes[5].position.x = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 40) + cornerSlideDuration)/ cornerSlideDuration);
        this.spawningCubes[5].position.y = 12;
        this.spawningCubes[8].position.x = -12;
        this.spawningCubes[8].position.y = easeIn(100, 12, (frame - FRAME_FOR_BEAN(startBEAN + 64) + cornerSlideDuration)/ cornerSlideDuration);
        this.spawningCubes[11].position.x = easeIn(-100, -12, (frame - FRAME_FOR_BEAN(startBEAN + 88) + cornerSlideDuration)/ cornerSlideDuration);
        this.spawningCubes[11].position.y = -12;
      

      } else if (BEAN < switch_time2) {


        // Spawning the rest of the scene and start playing with camera.
        this.camera.position.z = 0;
        this.camera.position.y = 16;

        this.camera.lookAt(new THREE.Vector3(0,0,0));

        var beats2 = [0, 8, 16, 24, 36,      48, 50, 52, 54, 56, 58, 60, 62, 64, 66, 68];
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[0])) {
          this.scene = new THREE.Scene();
          this.create_layer_first_layer(0); 
          this.scene.add(this.background);
          this.background.position.z = 0;
          this.background.position.y = 16;
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[1])) {
          this.create_layer_first_layer(1);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[2])) {
          this.create_layer_first_layer(2);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[3])) {
          this.create_layer_first_layer(3);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[4])) {
          this.create_layer_first_layer(4);
          this.create_layer_first_layer(5);
        }

        if (frame == FRAME_FOR_BEAN(switch_time + beats2[5])) {
          this.create_layer(-20);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[6])) {
          this.create_layer(-40);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[8])) {
          this.create_layer(-60);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[9])) {
          this.create_layer(-80);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[10])) {
          this.create_layer(-100);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[11])) {
          this.create_layer(-120);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[12])) {
          this.create_layer(-140);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[13])) {
          this.create_layer(-160);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[14])) {
          this.create_layer(-180);
        }
        if (frame == FRAME_FOR_BEAN(switch_time + beats2[15])) {
          this.create_layer(-200);
        }

        if (frame > FRAME_FOR_BEAN(4414)) {
          this.camera.position.y = 16 - (frame - FRAME_FOR_BEAN(camera_move_start))*camera_speed;
        }

      } else {
        this.camera.position.z = 0;

        this.camera.lookAt(new THREE.Vector3(0,-200,0));
        this.camera.position.y = 16 - (FRAME_FOR_BEAN(switch_time2) - FRAME_FOR_BEAN(camera_move_start))*camera_speed;

        var elevation = 1;
        var beats3 = [24, 36, 48, 60, 72, 94];
        if (frame == FRAME_FOR_BEAN(switch_time2 + beats3[0])) {
          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 0;
          newPlane.position.y = -58.99;
          newPlane.position.z = 0;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);
        }

        if (frame == FRAME_FOR_BEAN(switch_time2 + beats3[1])) {
          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 0;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 0;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);
        }


        if (frame == FRAME_FOR_BEAN(switch_time2 + beats3[2])) {
          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 0;
          newPlane.position.y = -58.99;
          newPlane.position.z = 4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 0;
          newPlane.position.y = -58.99;
          newPlane.position.z = -4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);
        }

        if (frame == FRAME_FOR_BEAN(switch_time2 + beats3[3])) {
          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = -4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

                    var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = -4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);
        }

        if (frame == FRAME_FOR_BEAN(switch_time2 + beats3[4])) {
          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = -4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -4*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = -4*1.2;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);


          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = 8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 0;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);

          var newPlane = new THREE.Mesh(new THREE.PlaneGeometry(4*1.2, 4*1.2), this.top_material);
          newPlane.position.x = -8*1.2;
          newPlane.position.y = -58.99;
          newPlane.position.z = 0;
          newPlane.rotation.x = -Math.PI/2;
          newPlane.rotation.z = Math.PI;
          this.scene.add(newPlane);
        }
      }

      // When BEAN is equal to startBEAN + one of the numbers in the list, a ring is spawned on the texture on top of the cubes.
      // Only two rings at a time is supported. Modify topshader to add more if neccessary.
      var beats = [0, 9, 18, 24, 33, 42, 48, 57, 66, 72,                 88, 97, 106, 113, 122         ,144, 168, 192, 216, 240, 264, 288, 312, 336, 360, 384, 408, 432]; // 432 should be last
      var passed_1 = -1;
      var passed_2 = -1;
      var passed_3 = -1;
      var passed_4 = -1;
      //Figure out the last two passed time stamps (for ring spawning).
      for (var i = 0; i < beats.length; i++) {
        if(BEAN > startBEAN + beats[beats.length - 1 - i]) {
          if (passed_1 == -1) {
            passed_1 = beats.length - 1 - i;
          } else if (passed_2 == -1) {
            passed_2 = beats.length - 1 - i;
          } else if (passed_3 == -1) {
            passed_3 = beats.length - 1 - i;
          } else if (passed_4 == -1) {
            passed_4 = beats.length - 1 - i;
          }
        }
      }
      // Calculate where on the surface of the cube the ring should be. This makes the rings shrink (quite rapidly) after spawning.
      var stripe_position = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_1])) / 60;
      var stripe_position2;
      var stripe_position3;
      var stripe_position4;
      if(passed_2 != -1) {
        stripe_position2 = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_2])) / 60;
      } else {
        stripe_position2 = 0;
      }
      if(passed_3 != -1) {
        stripe_position3 = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_3])) / 60;
      } else {
        stripe_position3 = 0;
      }
      if(passed_4 != -1) {
        stripe_position4 = (frame - FRAME_FOR_BEAN(startBEAN + beats[passed_4])) / 60;
      } else {
        stripe_position4 = 0
      }
      // Set the properties of the top shader.
      this.top_material.uniforms.start1.value = clamp(0, stripe_position - 0.2, 1);
      this.top_material.uniforms.stop1.value = clamp(0, stripe_position, 1);
      this.top_material.uniforms.start2.value = clamp(0, stripe_position2 - 0.2, 1);
      this.top_material.uniforms.stop2.value = clamp(0, stripe_position2, 1);
      this.top_material.uniforms.start3.value = clamp(0, stripe_position3 - 0.2, 1);
      this.top_material.uniforms.stop3.value = clamp(0, stripe_position3, 1);
      this.top_material.uniforms.start4.value = clamp(0, stripe_position4 - 0.2, 1);
      this.top_material.uniforms.stop4.value = clamp(0, stripe_position4, 1);
      // Set the number tiles in the shader. Can be set to more or less anything, but small numbers are best IMO.
      if (BEAN < switch_time) {
        this.top_material.uniforms.tiles.value = 1;
      } else {        
        this.top_material.uniforms.tiles.value = 4;
      }

      var divider = 24;
      if ( Math.floor((BEAN / divider) % 4) == 0) {
        this.wall_material.uniforms.r.value = 0/256;
        this.wall_material.uniforms.g.value = 206/256;
        this.wall_material.uniforms.b.value = 209/256;
      } else  if ( Math.floor((BEAN / divider) % 4) == 1) {
        this.wall_material.uniforms.r.value = 46/256;
        this.wall_material.uniforms.g.value = 204/256;
        this.wall_material.uniforms.b.value = 113/256;
      } else if ( Math.floor((BEAN / divider) % 4) == 2) {
        this.wall_material.uniforms.r.value = 155/256;
        this.wall_material.uniforms.g.value = 89/256;
        this.wall_material.uniforms.b.value = 182/256;
      } else if ( Math.floor((BEAN / divider) % 4) == 3) {
        this.wall_material.uniforms.r.value = 230/256;
        this.wall_material.uniforms.g.value = 126/256;
        this.wall_material.uniforms.b.value = 34/256;
      }
    }

    render(renderer) {
      renderer.render(this.scene, this.camera, this.renderTarget, true);
      this.outputs.render.setValue(this.renderTarget.texture);
    }

    resize() {
      this.renderTarget.setSize(16 * GU, 9 * GU);
     }







    create_layer_first_layer(beat) {
      var distance = 8.485; // sqrt(6^2 + 6^2)
      var elevation = 1;
      var elevation2 = 0.5;
      var elevation3 = 1;
      var y=0;

      if (beat == 0) {
        // Center cube
        this.create_small(0,y+elevation,0,0);
      }

      if (beat == 1) {
        this.create_large(0,y,0,Math.PI/4);
      }

      if (beat == 2) {
        // Over, under, right left cube
        this.create_small(distance,y+elevation,0,0);

        this.create_small(-distance,y+elevation,0,0);

        this.create_small(0,y+elevation,distance,0);

        this.create_small(0,y+elevation,-distance,0);
      }
      
      if (beat == 3) {      
        this.create_large(distance,y+elevation2,0,Math.PI/4);
        this.create_large(-distance,y+elevation2,0,Math.PI/4);
        this.create_large(0,y+elevation2,distance,Math.PI/4);
        this.create_large(0,y+elevation2,-distance,Math.PI/4);
      } 

      if (beat == 4) {
        // Corner cubes
        this.create_small(distance,y+elevation,distance,0);

        this.create_small(-distance,y+elevation,-distance,0);

        this.create_small(distance,y+elevation,-distance,0);

        this.create_small(-distance,y+elevation,distance,0);
      }

      if (beat == 5) {
        this.create_large(distance,y+elevation3,distance,Math.PI/4);
        this.create_large(-distance,y+elevation3,-distance,Math.PI/4);
        this.create_large(distance,y+elevation3,-distance,Math.PI/4);
        this.create_large(-distance,y+elevation3,distance,Math.PI/4);
      }
    }

// Create a full layer of squares
    create_layer(y) {
      var distance = 8.485; // sqrt(6^2 + 6^2)
      var elevation = 1;
      var elevation2 = 0.5;
      var elevation3 = 1;

      // Center cube
      this.create_small(0,y+elevation,0,0);
      this.create_large(0,y,0,Math.PI/4);

      // Over, under, right left cube
      this.create_small(distance,y+elevation,0,0);
      this.create_large(distance,y+elevation2,0,Math.PI/4);

      this.create_small(-distance,y+elevation,0,0);
      this.create_large(-distance,y+elevation2,0,Math.PI/4);

      this.create_small(0,y+elevation,distance,0);
      this.create_large(0,y+elevation2,distance,Math.PI/4);

      this.create_small(0,y+elevation,-distance,0);
      this.create_large(0,y+elevation2,-distance,Math.PI/4);

      // Corner cubes
      this.create_small(distance,y+elevation,distance,0);
      this.create_large(distance,y+elevation3,distance,Math.PI/4);

      this.create_small(-distance,y+elevation,-distance,0);
      this.create_large(-distance,y+elevation3,-distance,Math.PI/4);

      this.create_small(distance,y+elevation,-distance,0);
      this.create_large(distance,y+elevation3,-distance,Math.PI/4);

      this.create_small(-distance,y+elevation,distance,0);
      this.create_large(-distance,y+elevation3,distance,Math.PI/4);
    }

    // Create a small cube at the desired location.
    create_small(x, y, z, ry) {
      var mesh = new THREE.Mesh();

      this.create_top(mesh, this.small_square_geom, this.top_material);

      this.create_walls(mesh, 1, this.wall_material, false);
      this.create_walls(mesh, 2, this.wall_material, true);

      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = z;
      mesh.rotation.y = ry;

      var small_scale = 1.2;
      mesh.scale.set(small_scale, small_scale, small_scale);

      this.scene.add(mesh);
    }

    // Create a large cube at the desired location.
    create_large(x, y, z, ry) {
      var mesh = new THREE.Mesh();

      this.create_top(mesh, this.large_square_geom, this.top_material);

      this.create_walls(mesh, 3, this.wall_material, false);
      this.create_walls(mesh, 4, this.wall_material, true);

      mesh.position.x = x;
      mesh.position.y = y;
      mesh.position.z = z;
      mesh.rotation.y = ry;

      this.scene.add(mesh);
    }

    // Create a top
    create_top(parrent, geometry, material) {
      var mesh = new THREE.Mesh( geometry, material );
      parrent.add( mesh );
    }

    // Create walls with an offset from the center forming a square tube facing inward or outward.
    create_walls(parrent, offset, material, outer_wall) {

      var small_inner_side_geom = new THREE.PlaneGeometry(2 * offset, 2 * offset);

      var side1 = new THREE.Mesh( small_inner_side_geom, material );
      side1.position.set(0, -offset, -offset);
      side1.rotation.y = Math.PI * outer_wall;
      parrent.add( side1 );

      var side2 = new THREE.Mesh( small_inner_side_geom, material );
      side2.position.set(offset, -offset, 0);
      side2.rotation.y = Math.PI * -0.5 + Math.PI * outer_wall;
      parrent.add( side2 );

      var side3 = new THREE.Mesh( small_inner_side_geom, material );
      side3.position.set(0, -offset, offset);
      side3.rotation.y = Math.PI * 1 + Math.PI * outer_wall;
      parrent.add( side3 );

      var side4 = new THREE.Mesh( small_inner_side_geom, material );
      side4.position.set(-offset, -offset, 0);
      side4.rotation.y = Math.PI * 0.5 + Math.PI * outer_wall;
      parrent.add( side4 );
    }

    // Create the custom geometry for the top surfaces (square with hole)
    create_geoms() {
      // Large square with hole
      this.large_square_geom = new THREE.Geometry(); 
      var lv0 = new THREE.Vector3(4,0,4);
      var lv1 = new THREE.Vector3(3,0,3);
      var lv2 = new THREE.Vector3(4,0,-4);
      var lv3 = new THREE.Vector3(3,0,-3);
      var lv4 = new THREE.Vector3(-4,0,4);
      var lv5 = new THREE.Vector3(-3,0,3);
      var lv6 = new THREE.Vector3(-4,0,-4);
      var lv7 = new THREE.Vector3(-3,0,-3);

      this.large_square_geom.vertices.push(lv0);
      this.large_square_geom.vertices.push(lv1);
      this.large_square_geom.vertices.push(lv2);
      this.large_square_geom.vertices.push(lv3);
      this.large_square_geom.vertices.push(lv4);
      this.large_square_geom.vertices.push(lv5);
      this.large_square_geom.vertices.push(lv6);
      this.large_square_geom.vertices.push(lv7);

      this.large_square_geom.faces.push( new THREE.Face3( 0, 2, 1 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 1, 2, 3 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 0, 1, 5 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 0, 5, 4 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 4, 5, 7 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 4, 7, 6 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 3, 2, 6 ) );
      this.large_square_geom.faces.push( new THREE.Face3( 3, 6, 7 ) );

      var lt0 = new THREE.Vector2( 1, 1 );
      var lt1 = new THREE.Vector2( 7/8, 7/8 );
      var lt2 = new THREE.Vector2( 1, 0 );
      var lt3 = new THREE.Vector2( 7/8, 1/8 );
      var lt4 = new THREE.Vector2( 0, 1 );
      var lt5 = new THREE.Vector2( 1/8, 7/8 );
      var lt6 = new THREE.Vector2( 0, 0 );
      var lt7 = new THREE.Vector2( 1/8, 1/8 );

      this.large_square_geom.faceVertexUvs[0][0] = [lt0, lt2, lt1];
      this.large_square_geom.faceVertexUvs[0][1] = [lt1, lt2, lt3];
      this.large_square_geom.faceVertexUvs[0][2] = [lt0, lt1, lt5];
      this.large_square_geom.faceVertexUvs[0][3] = [lt0, lt5, lt4];
      this.large_square_geom.faceVertexUvs[0][4] = [lt4, lt5, lt7];
      this.large_square_geom.faceVertexUvs[0][5] = [lt4, lt7, lt6];
      this.large_square_geom.faceVertexUvs[0][6] = [lt3, lt2, lt6];
      this.large_square_geom.faceVertexUvs[0][7] = [lt3, lt6, lt7];

    // Small square with hole
      this.small_square_geom = new THREE.Geometry(); 
      var sv0 = new THREE.Vector3( 2, 0, 2 );
      var sv1 = new THREE.Vector3( 1, 0, 1 );
      var sv2 = new THREE.Vector3( 2, 0, -2 );
      var sv3 = new THREE.Vector3( 1, 0, -1 );
      var sv4 = new THREE.Vector3( -2, 0, 2 );
      var sv5 = new THREE.Vector3( -1, 0, 1 );
      var sv6 = new THREE.Vector3( -2, 0, -2 );
      var sv7 = new THREE.Vector3( -1, 0, -1 );

      this.small_square_geom.vertices.push( sv0 );
      this.small_square_geom.vertices.push( sv1 );
      this.small_square_geom.vertices.push( sv2 );
      this.small_square_geom.vertices.push( sv3 );
      this.small_square_geom.vertices.push( sv4 );
      this.small_square_geom.vertices.push( sv5 );
      this.small_square_geom.vertices.push( sv6 );
      this.small_square_geom.vertices.push( sv7 );

      this.small_square_geom.faces.push( new THREE.Face3( 0, 2, 1 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 1, 2, 3 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 0, 1, 5 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 0, 5, 4 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 4, 5, 7 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 4, 7, 6 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 3, 2, 6 ) );
      this.small_square_geom.faces.push( new THREE.Face3( 3, 6, 7 ) );

      var st0 = new THREE.Vector2( 1, 1 );
      var st1 = new THREE.Vector2( 3/4, 3/4 );
      var st2 = new THREE.Vector2( 1, 0 );
      var st3 = new THREE.Vector2( 3/4, 1/4 );
      var st4 = new THREE.Vector2( 0, 1 );
      var st5 = new THREE.Vector2( 1/4, 3/4 );
      var st6 = new THREE.Vector2( 0, 0 );
      var st7 = new THREE.Vector2( 1/4, 1/4 );

      this.small_square_geom.faceVertexUvs[0][0] = [st0, st2, st1];
      this.small_square_geom.faceVertexUvs[0][1] = [st1, st2, st3];
      this.small_square_geom.faceVertexUvs[0][2] = [st0, st1, st5];
      this.small_square_geom.faceVertexUvs[0][3] = [st0, st5, st4];
      this.small_square_geom.faceVertexUvs[0][4] = [st4, st5, st7];
      this.small_square_geom.faceVertexUvs[0][5] = [st4, st7, st6];
      this.small_square_geom.faceVertexUvs[0][6] = [st3, st2, st6];
      this.small_square_geom.faceVertexUvs[0][7] = [st3, st6, st7];

      // Planes
      this.small_outer_side_geom = new THREE.PlaneGeometry( 4, 4 );
      this.large_inner_side_geom = new THREE.PlaneGeometry( 6, 6 );
      this.large_outer_side_geom = new THREE.PlaneGeometry( 8, 8 );

    };










  }

  global.cubeTunnel = cubeTunnel;
})(this);