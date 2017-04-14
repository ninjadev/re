uniform float radius;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 bg = texture2D(tDiffuse, vUv);
    vec2 uv = -1.0 + 2.0 * vUv;
    uv.x *= 16.0/9.0;

    if (length(uv) > radius) {
        bg = vec4(0.125, 0.859, 0.478, 1.0);
        vec3 c = mix(vec3(0.0), bg.xyz, 2.0 - length(uv));
        bg = vec4(c, 1.);
    }

    gl_FragColor = bg;
}
