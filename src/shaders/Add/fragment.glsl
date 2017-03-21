uniform sampler2D A;
uniform sampler2D B;
uniform float opacity;

varying vec2 vUv;

void main() {
    gl_FragColor = vec4(texture2D(A, vUv).rgb + texture2D(B, vUv).rgb * opacity, 1.);
}
