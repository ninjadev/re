uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = (vUv - 0.5) * 2.;
    vec4 color = texture2D(tDiffuse, vUv);
    color = clamp(color, 0.2, 1.);
    color += pow(uv.x, 8.) * 0.2;
    color += pow(uv.y, 8.) * 0.2;
    color *= 1.6;
    float opacity = color.r;
    color *= vec4(.4, 0.5725, 0.866, 1.);
    gl_FragColor = vec4(color.rgb, opacity);
}
