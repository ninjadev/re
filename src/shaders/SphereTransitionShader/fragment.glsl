uniform float mixer;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    vec2 pos = vec2(vUv.x * 16.0 - 8.0, vUv.y * 9.0 - 4.5);
    float r = sqrt(pow(pos.x, 2.0) + pow(pos.y, 2.0));

    if (r < 10.0 * mixer) {
        gl_FragColor = texture2D(A, vUv);
    } else {
        gl_FragColor = texture2D(B, vUv);
    }
}
