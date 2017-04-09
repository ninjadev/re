uniform float mixerOne;
uniform float mixerTwo;
uniform float mixerThree;

uniform sampler2D A;
uniform sampler2D B;

varying vec2 vUv;

void main() {
    vec2 pos = vec2(vUv.x * 16.0, vUv.y * 9.0);

    gl_FragColor = texture2D(A, vUv);


    if (pos.y > 6.5) {
        if (pos.x < mixerOne) {
            gl_FragColor = texture2D(B, vUv);
        }
    } else if (pos.y < 2.5) {
        if (pos.x > mixerTwo) {
            gl_FragColor = texture2D(B, vUv);
        }
    } else {
        if (pos.x < mixerThree) {
            gl_FragColor = texture2D(B, vUv);
        }
    }
}
