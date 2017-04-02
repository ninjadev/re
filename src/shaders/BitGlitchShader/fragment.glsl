uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;
varying vec2 vUv;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv;

    for(float i = 2.; i < 32.; i++) {
        uv.x += 0.01 * rand(10. + vec2(floor(10. * (sin(i * 0.2 + frame * 0.1) + i) * uv.x) * 0.1, 0.));
    }
    
    if(rand(vec2(0., floor((uv.x / 2. + uv.y) * 16.))) < 0.5) {
        uv.x += 0.05; 
    }
    if(rand(vec2(0., floor((uv.y) * 8. * (2. + 2. * cos(frame * 0.01))))) < 0.5) {
        uv.x += 0.5; 
    }

    vec4 color = texture2D(tDiffuse, mod(mix(vUv, uv, amount), 1.));

    gl_FragColor = color + 0.02 * amount * rand(uv * 0.002);
}
