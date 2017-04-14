uniform float radius;
uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float max2(vec2 v) {
    return max(v.x, v.y);
}

void main() {
    vec4 bg = texture2D(tDiffuse, vUv);
    vec2 uv = -1.0 + 2.0 * vUv;
    uv.x *= 16.0/9.0;

    if (frame < 6200.) {
        if (length(uv) > radius) {
            bg = vec4(0.125, 0.859, 0.478, 1.0);
            vec3 c = mix(vec3(0.0), bg.xyz, 2.0 - length(uv));
            bg = vec4(c, 1.);
        }
    } else if (frame < 6260.) {
        if (abs(uv.x) + 2.*abs(uv.y) > 2.1) {
            bg = vec4(0.0);
        }
    } else if (frame < 6280.) {
        if (2.*abs(uv.x) + abs(uv.y) > 1.6) {
            bg = vec4(0.0);
        }
    } else if (frame < 6300.) {
        if (abs(uv.x) + 2.*abs(uv.y) > 1.3) {
            bg = vec4(0.0);
        }
    } else {
        if (2.*abs(uv.x) + abs(uv.y) > 0.53) {
            bg = vec4(0.0);
        }
    }


    gl_FragColor = bg;
}
