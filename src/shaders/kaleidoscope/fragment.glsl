uniform sampler2D tDiffuse;
uniform float frame;

varying vec2 vUv;

void main() {
    vec2 pos;

    if (frame < 3991.0) {
        pos = vUv;
    } else if (frame < 4100.0) {
        pos = mod(vUv, 0.5) * 2.0;
    } else if (frame < 4265.0) {
        pos = abs(vUv - 0.5);
    } else if (frame < 4320.0) {
        pos = 0.5 + abs(vUv - 0.5);
    } else if (frame < 4343.0) {
        pos = vUv;
    } else if (frame < 4360.0) {
        pos = 0.25 + mod(vUv, 0.5);
    } else if (frame < 4382.0) {
        pos = 0.5 + abs(vUv - 0.5);
    } else if (frame < 4407.0) {
        pos = 0.5 + abs(vUv - 0.5) / 2.0;
    } else if (frame < 4435.0) {
        vec2 inner = mod(vUv, 0.5) * 2.0;
        pos = 0.5 + abs(inner - 0.5) / 2.0;
    } else if (frame < 4540.0) {
        pos = 0.5 + abs(vUv - 0.5) / 1.5;
    }

    gl_FragColor = texture2D(tDiffuse, pos);
}
