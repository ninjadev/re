uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;

varying vec2 vUv;

const float PI = 3.1415926535;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

vec4 scene(vec2 uv) {

    //float amount = max(0., min(1., mix(0., 1., (frame - 4583.) / 36. / 2.)));

    vec2 xy = 2.0 * uv - 1.0;
    float d = length(xy) * amount;
    xy += xy * d * .5;
    xy *= .75;
    uv = (xy + 1.) * .5;
    uv.x += 0.005 * sin( frame / 54.) * sin(frame / 194.) * sin(frame / 17. / 2.) * sin(frame / 19. / 2.) * cos(frame / 7. / 2.);
    uv.y += 0.005 * sin(frame / 23. / 2.) * sin(frame / 20. / 2.) * cos(frame / 16. / 2.);

    uv.x += sin(uv.y * PI * 2. * 240.) * .0003;
    vec4 color = texture2D(tDiffuse, uv);
    color = mix(color, color * (2. - d * d), vec4(amount));
    if(uv.x > 1. || uv.y > 1. || uv.x < 0. || uv.y < 0.) {
        color = vec4(0.025);    
    } else {
        color = mix(color, color * (0.5 + 0.5 * (0.5 + 0.5 * sin(uv.y * PI * 2. * 240.))), amount);
        color = mix(color, color * (0.9 + 0.1 * (0.5 + 0.5 * sin(uv.y * PI * 2. * 2. - frame * 0.1))), amount);
        float dd = length(xy - vec2(0., 4.));
            vec4 additional = mix(.1 + vec4(.3) * xy.y,
                         vec4(0.),
                         max(0., (dd - 2.) / 4.));
        color = mix(color, color + additional, amount);
    }
    color = mix(color, color * (1. + 0.2 * rand(uv + vec2(frame * 0.001))), amount);
    return color;
}

void main() {
    vec2 uv = vUv;
    vec4 colorOriginal = scene(vUv);
    vec4 color = vec4(
        0.1 + scene( vUv + 0.002 * vec2(cos(PI / 2. + uv.x * PI * 0.5),
                                0)).r,
        scene(vUv + 0.002 * vec2(cos(uv.x * PI * 0.5),
                                -cos(uv.y * PI * 0.5)) / 1.414).g,
        0.1 + scene(vUv + 0.002 * vec2(cos(uv.x * PI * 0.5),
                                cos(uv.y * PI * 0.5)) / 1.414).b,
        1.);
    gl_FragColor = mix(colorOriginal, color, amount);
}
