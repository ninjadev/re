uniform float frame;
uniform float zoom;
uniform float angle;
uniform vec2 translate;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {
    vec2 uv = (vUv - .5) * 2.;

    uv += translate;
    uv *= zoom;
    uv = vec2(uv.x * cos(angle) - uv.y * sin(angle),
              uv.x * sin(angle) + uv.y * cos(angle));

    vec4 color = texture2D(tDiffuse, mod(uv, 1.));
    gl_FragColor = color;
}
