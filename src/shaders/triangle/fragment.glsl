uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec4 color = vec4(1.0, 1.0, 1.0, 1.0);

    if(vUv.x <= min(0.5, max(0.0, sin(frame / 80.0))) ||
       vUv.y <= min(0.5, max(0.0, cos(frame / 80.0)))) {
        color.xyz = vec3(0.0, 0.0, 0.0);
    }

    gl_FragColor = color;
}
