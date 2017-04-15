uniform float frame;
uniform float displacement0;
uniform float displacement1;
uniform float displacement2;
uniform float displacement3;
uniform sampler2D tDiffuse;

varying vec2 vUv;

void main() {

    float angle = 0.25;
    vec2 uv = vUv;
    if(uv.x < 0. + uv.y * angle) {
        uv.x += displacement0 * angle;
        if(displacement0 > 0.5) {
          uv.x -= displacement0 * angle;
        }
        uv.y += displacement0;
    } else if(uv.x < 1. / 3. + uv.y * angle) {
        uv.x += displacement1 * angle;
        if(displacement1 > 0.5) {
          uv.x -= displacement1 * angle;
        }
        uv.y += displacement1;
    } else if(uv.x < 2. / 3. + uv.y * angle) {
        uv.x += displacement2 * angle;
        if(displacement2 > 0.5) {
          uv.x -= displacement2 * angle;
        }
        uv.y += displacement2;
    } else {
        uv.x += displacement3 * angle;
        if(displacement3 > 0.5) {
          uv.x -= displacement3 * angle;
        }
        uv.y += displacement3;
    }
    vec4 color = texture2D(tDiffuse, mod(uv, 1.));
    gl_FragColor = color;
}
