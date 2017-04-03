uniform float frame;
uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec2 aUv;

void main() {
    float c = 1.0;

    float r = 0.3*abs(sin(frame/80.0));
    vec2 uv = aUv;
    uv -= .5;
    float d = length(vUv-.5);

    c = smoothstep(r, r-0.01, d);

    gl_FragColor = vec4(vec3(c), 1.0);
}
