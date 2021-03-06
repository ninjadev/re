uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;

varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec4 textureColor = texture2D(tDiffuse, vUv);
    vec2 uv = (vUv - 0.5) * 2.;
    vec4 color = textureColor * (1. - pow(length(uv / 1.4), 4.));
    color += rand(vUv + frame * 0.001) * 3.5 / 256.;
    gl_FragColor = mix(textureColor, color, amount);
}
