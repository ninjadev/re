uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float insideStar(vec2 position, vec2 star, int stage) {
    vec2 delta = abs(position - star);
    if (stage == 0) {
        if (delta.x == 0. && delta.y == 0.) {
            return 1.;
        }
    } else if (stage == 1) {
        if (delta.x > 0. && delta.x < 5. && delta.y == 0. ||
            delta.y > 0. && delta.y < 5. && delta.x == 0.) {
            return 1.;
        }
    } else if (stage == 2) {
        if (abs(delta.x) == abs(delta.y) && delta.x < 6.0 && delta.x > 0.0) {
            return 1.;
        }
    } else if (stage == 3 || stage == 4) {
        if (delta == vec2(1., 2.) ||
                delta == vec2(0.) ||
                delta == vec2(2., 0.) ||
                delta == vec2(3.)) {
            return 1.;
        }
    } else if (stage == 5) {
        if (delta.x == 0. && delta.y < 2. || delta.y == 0. && delta.x < 2.) {
            return 1.;
        }
    }

    return 0.;
}

void main() {
    int x = int((vUv.x * 160.0) - 80.0);
    int y = int((vUv.y * 90.0) - 45.0);
    vec2 pos = vec2(x, y);

    int stage = int(mod(frame / 12., 9.));

    float s = max(insideStar(pos, vec2(40 + 3 * int(sin(frame)), -15), stage),
              max(insideStar(pos, vec2(-10, 30 + 4 * int(sin(frame))), stage),
              max(insideStar(pos, vec2(-70 + 3 * int(sin(frame)), 5), stage),
              max(insideStar(pos, vec2(40, 40 + 4 * int(sin(frame))), stage),
              max(insideStar(pos, vec2(10 + 4 * int(sin(frame)), -8), stage),
                  insideStar(pos, vec2(-40, -30 + 3 * int(sin(frame))), stage))))));

    if (s == 1.) {
        //gl_FragColor = vec4(vUv, 0.9 + 0.5 * sin(frame / 60.0), 1.0);
        gl_FragColor = vec4(148./255.,0.,211./255., 0.);
    } else {
        gl_FragColor = vec4(0.);
    }
}
