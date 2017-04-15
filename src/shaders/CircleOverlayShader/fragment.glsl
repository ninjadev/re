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
            vec4 green = vec4(0.125, 0.859, 0.478, 1.0);
            vec4 pink = vec4(1., 0., 0.635, 1.0);

            float mixer = max(min((frame - 5409.) / (5425. - 5409.), 1.0), 0.0);

            bg = mix(green, pink, mixer);

            vec3 c = mix(vec3(0.0), bg.xyz, 2.0 - length(uv));
            bg = vec4(c, 1.);
        }
    } else if (frame < 6257.) {
        float multiplier = 0.2;
        if (abs(uv.x) + 2.*abs(uv.y) > 2.9 -
                floor(frame/6216.) * multiplier -
                floor(frame/6221.) * multiplier -
                floor(frame/6225.) * multiplier -
                floor(frame/6230.) * multiplier -
                floor(frame/6244.) * multiplier -
                floor(frame/6248.) * multiplier -
                floor(frame/6253.) * multiplier) {
            bg = blackground;
        }
    } else if (frame < 6278.) {
        float multiplier = 0.6;
        if (2.*abs(uv.x) + abs(uv.y) > 1.8 -
                floor(frame/6271.) * multiplier) {
            bg = blackground;
        }
    } else if (frame < 6313.) {
        if (abs(uv.x) + 2.*abs(uv.y) > 1.3 -
                floor(frame/6292.) * 0.4 -
                floor(frame/6296.) * 0.4 -
                floor(frame/6306.) * 0.3) {
            bg = blackground;
        }
    } else {
        bg = blackground;
    }

    gl_FragColor = bg;
}
