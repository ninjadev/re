uniform float mixer;

uniform sampler2D A;

varying vec2 vUv;

void main() {
    vec2 pos = vec2(vUv.x * 16.0, vUv.y * 9.0);

    gl_FragColor = vec4(1.0) * (1.0 - mixer) + texture2D(A, vUv) * mixer;
}
