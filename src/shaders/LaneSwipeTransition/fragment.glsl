uniform float frame;
uniform float one;
uniform float two;
uniform float three;
uniform float four;
uniform float five;
uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);
    vec4 color = colorA;
    float offset = 0.;
    vec2 uv = vUv;
    if(uv.x > 0.5) {
        uv.x = 1. - uv.x;
    }
    if(frame > one &&
       uv.x >= 0. &&
       uv.x < 0.125 &&
       uv.y < (frame - one) / (two - one)) {
        color = colorB; 
    }
    if(frame > two &&
       uv.x >= 0.125 &&
       uv.x < 0.25 &&
       uv.y > 1. - (frame - two) / (three - two)) {
        color = colorB; 
    }
    if(frame > three &&
       uv.x >= 0.25 &&
       uv.x < 0.375 &&
       uv.y < (frame - three) / (four - three)) {
        color = colorB; 
    }
    uv = vUv;
    float t = (frame - four) / (five - four);
    if(frame > three &&
       uv.x >= 0.375 &&
       uv.x < 1. &&
       uv.x < 0.375 + 0.25 * t &&
       uv.y / 4. + uv.x < 0.375 + 0.25 * t) {
        color = colorB; 
    }
    uv = 1.  -uv;
    if(frame > three &&
       uv.x >= 0.375 &&
       uv.x < 1. &&
       uv.x < 0.375 + 0.25 * t &&
       uv.y / 4. + uv.x < 0.375 + 0.25 * t) {
        color = colorB; 
    }
    gl_FragColor = color;
}
