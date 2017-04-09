uniform sampler2D tDiffuse;
uniform sampler2D textCanvas;
uniform float frame;
uniform float throb;
varying vec2 vUv;

#define PI 3.141592653589793


vec4 pattern(vec2 uv) {
    vec4 colorA = vec4(150. / 255., 8. / 255., 52. / 255., 1.);
    vec4 colorB =  vec4(86. / 255., 15. / 255., 20. / 255., 1.);
    return mix(colorA, colorB, sin(uv.y));
}

float dots(vec2 uv, float radius) {
    float frequency = 10.0;
    vec2 uv2 = mat2(0.707, -0.707, 0.707, 0.707) * uv;
    vec2 nearest = 2.0*fract(frequency * uv2) - 1.0;
    float dist = length(nearest);
    if(radius > dist) {
        return 0.;
    }
    return 1.;
}

void main(void) {
    vec2 uv = vUv;

    vec2 windowCoords = uv * 3. / 2.;

    uv = windowCoords;

    vec2 center = vec2(0.5, 0.85);

    center.x += .02 * sin(frame * 0.017);
    center.y += .02 * cos(frame * 0.015);

    vec2 dist = (uv - center);
    dist.x *= 16.;
    dist.y *= 9.;
    float radius = 9. / length(dist) + frame * 0.1;
    uv = mod(vec2(6. / 3.1415926535 / 2. * atan(dist.y / 16., dist.x / 16.) + 2. * sin(frame * 0.05) / length(dist) + frame * 0.02, radius), 1.);

    vec2 tiles = vec2(3., 2.);

    vec4 wallDiffuse = pattern(uv);
    vec4 diffuse = vec4(.0);
    float p = 1.0 - (diffuse.r + diffuse.g + diffuse.b) / 3.;
    p = min(max(p * 3.0 - 1.8, 0.1), 10.0);
    p = 1.;
    
    vec2 r = mod(uv * tiles, 1.0);
    r = vec2(pow(r.x - 0.5, 2.0), pow(r.y - 0.5, 2.0));
    p *= 1.5 - pow(min(1.0, 12.0 * dot(r, r)), 2.0);
    wallDiffuse *= p;
    wallDiffuse *= throb;
    wallDiffuse *= 1. + 0.5 * sin(PI * 2. * (uv.y * 100. - throb * 200.) * 0.005);
    wallDiffuse *= .5;

    float lighting = 1. - 4. * pow(length(dist) / 16. - 0.5, 2.);
    lighting = clamp(0., 1., lighting);

    p = p * lighting;

    float centerDarkener = length(dist * 4.) / length(center * 16.);

    centerDarkener = sqrt(centerDarkener);

    vec4 black = vec4(vec3(0.), 1);

    vec4 outp = diffuse * p + wallDiffuse * centerDarkener;
    outp += vec4(86. / 255., 15. / 255., 80. / 255., 0.) / 4.;

    vec4 content = texture2D(tDiffuse, windowCoords - vec2(0., .1));

    if(windowCoords.x > 1. || windowCoords.x < 0.0 || windowCoords.y < 0.05 * 16. / 9. || windowCoords.y > 1. * 3. / 2. - 0.05 * 16. / 9. ) {
        outp = vec4(0.05, 0., 0.05, 1.);
    } else {
        outp = mix(outp, content, content.a);
    }

    float dotAmount = clamp(((vUv.x - 0.05) / 0.05), 0., 1.);
    dotAmount *= clamp(((2./ 3. - 0.05 - vUv.x) / 0.05), 0., 1.);
    dotAmount *= clamp(((0.80 - vUv.y  + 0.15 * vUv.x) / 0.1), 0., 1.);
    dotAmount *= clamp(((vUv.y - 0.05  - vUv.x * 0.15) / 0.1), 0., 1.);
    float dotPattern = dots(vec2(frame * 0.003, frame * 0.006) + vUv * vec2(16. / 9., 1.) * 3., 1.5 * dotAmount);
    //dotPattern *= 1.5 + 1.5 * sin(frame / 60. / 60. * 130.);
    outp = mix(outp, vec4(0.05, 0., 0.05, 1.), dotPattern);

    if(windowCoords.x > .95) {
        vec4 text = texture2D(textCanvas, (vUv - vec2(0.95 * 2. / 3., 0.)) * vec2(16. / 6., 1.));
        outp = mix(outp, text, text.a);
    }

    gl_FragColor = outp;
}
