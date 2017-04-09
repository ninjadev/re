uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = (vUv - 0.5) * 2.;
    vec4 color = texture2D(tDiffuse, vUv);
    color = clamp(color, 0.2, 1.);
    color += pow(uv.x, 8.) * 0.2;
    color += pow(uv.y, 8.) * 0.2;
    color *= vec4(1., 162. / 255., 1., 1.);
    color *= 1.3;
    gl_FragColor = vec4(color.rgb, color.r);
}
