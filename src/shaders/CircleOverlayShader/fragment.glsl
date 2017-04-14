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

    vec4 blackground = vec4(0.1, 0., 0.1, 1.);

    if (frame < 6202.) {
        if (length(uv) > radius) {
            bg = vec4(0.125, 0.859, 0.478, 1.0);
            vec3 c = mix(vec3(0.0), bg.xyz, 2.0 - length(uv));
            bg = vec4(c, 1.);
        }
    } else if (frame < 6257.) {
        if (abs(uv.x) + 2.*abs(uv.y) > 2.1) {
            bg = blackground;
        }
    } else if (frame < 6278.) {
        if (2.*abs(uv.x) + abs(uv.y) > 1.6) {
            bg = blackground;
        }
    } else if (frame < 6299.) {
        if (abs(uv.x) + 2.*abs(uv.y) > 1.3) {
            bg = blackground;
        }
    } else {
        if (2.*abs(uv.x) + abs(uv.y) > 0.53) {
            bg = blackground;
        }
    }


    gl_FragColor = bg;
}
