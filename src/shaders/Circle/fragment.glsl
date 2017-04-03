uniform float frame;

varying vec2 vUv;

void main() {
    vec4 c1 = vec4(0.96, 0.80, 0.83, 1.0);

    vec4 c2 = vec4(0.58, 0.89, 0.71, 1.0);

    // TODO: sync to music
    float mask = smoothstep(0.0, 1.0, sin(frame/100.0));

    gl_FragColor = c1*mask + c2*(1.0-mask);
}
