uniform float stage;
uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float insideStar(vec2 position, vec2 star, int animationStage) {
    vec2 delta = abs(position - star);
    if (animationStage < 2) {
        if (delta.x == 0. && delta.y == 0.) {
            return 1.;
        }
    } else if (animationStage < 4) {
        if (delta.x > 0. && delta.x < 5. && delta.y == 0. ||
            delta.y > 0. && delta.y < 5. && delta.x == 0.) {
            return 1.;
        }
    } else if (animationStage < 6) {
        if (abs(delta.x) == abs(delta.y) && delta.x < 6.0 && delta.x > 0.0) {
            return 1.;
        }
    } else if (animationStage < 8) {
        if (delta == vec2(1., 2.) ||
                delta == vec2(0.) ||
                delta == vec2(2., 0.) ||
                delta == vec2(3.)) {
            return 1.;
        }
    } else if (animationStage < 10) {
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

    int animationStage = int(mod(stage, 12.));
    float s=0.;

    if (stage > 12.) {
        s = max(insideStar(pos, vec2(40 + 3 * int(sin(frame)), -15), animationStage), s);
        s = max(insideStar(pos, vec2(-10, 30 + 4 * int(sin(frame))), animationStage), s);
        s = max(insideStar(pos, vec2(-70 + 3 * int(sin(frame)), 5), animationStage), s);
        s = max(insideStar(pos, vec2(40, 40 + 4 * int(sin(frame))), animationStage), s);
        s = max(insideStar(pos, vec2(10 + 4 * int(sin(frame)), -8), animationStage), s);
        s = max(insideStar(pos, vec2(-40, -30 + 3 * int(sin(frame))), animationStage), s);
    } else {
        s = max(insideStar(pos, vec2(-20, 40), animationStage), s);
        s = max(insideStar(pos, vec2( 40, 0), animationStage), s);
        s = max(insideStar(pos, vec2( 20, 30), animationStage), s);
        s = max(insideStar(pos, vec2( 20, 35), animationStage), s);
        s = max(insideStar(pos, vec2( 50, 20), animationStage), s);
        s = max(insideStar(pos, vec2( 0,  10), animationStage), s);
    }

    vec4 star;
    vec4 background;

    if (frame > 8800.) {
        background = vec4(1.0);
        star = vec4(0.0, 0.0, 0.1, 1.0);
    } else {
        background = vec4(0.0, 0.0, 0.1, 1.0);
        star = vec4(1.0);
    }

    if (s == 1.) {
        gl_FragColor = background;;
    } else {
        gl_FragColor = star;
    }
}
