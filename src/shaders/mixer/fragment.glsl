uniform float frame;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    float c = 1.0;

    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);
    vec4 res = vec4(1.0, 1.0, 1.0, 1.0);

    float X = 0.5;
    float Y = 0.5;

    c = smoothstep(X, X-0.001, vUv.x);
    c += smoothstep(Y, Y-0.001, vUv.y);

    res = colorA*c + colorB*(0.9-c);

    gl_FragColor = res;
}
