uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.141592653589793


float triangle(float t) {
    return .5 - abs(mod(t, 1.) - .5);
}


void main() {

    vec4 color = vec4(27. / 255., 9. / 255., 34. / 255., 1.);
    vec2 uv = vUv;

    uv.y -= frame * 0.002;

    float modulator = mod(
        uv.x * 16. +
        0.3 * cos(frame * PI * 2. / 60. / 60. * 130.) * triangle(uv.y * 16.), 1.);
    float thickness = clamp(0., 1., 8. * amount - vUv.y * 8.);
    if(modulator < 0.25 * thickness) {
        color *= 1.1;
    }
    if(modulator > 1. - 0.25 * thickness) {
        color /= 1.1;
    }

    gl_FragColor = color;
}
