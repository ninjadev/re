uniform float radius;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 bg = texture2D(tDiffuse, vUv);
    vec2 uv = -1.0 + 2.0 * vUv;
    uv.x *= 16.0/9.0;

    if (length(uv) > radius) {
      gl_FragColor = vec4(0.125, 0.859, 0.478, 1.0);
    } else {
      gl_FragColor = bg;
    }
}
