uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    float c = 1.0;
    float dX = min(0.5, max(0.0, sin(frame / 80.0)));
    float dY = min(0.5, max(0.0, cos(frame / 80.0)));

    c = smoothstep(dX, dX-0.001, vUv.x);
    c += smoothstep(dY, dY-0.001, vUv.y);

    gl_FragColor = vec4(vec3(c), 1.0);
}
