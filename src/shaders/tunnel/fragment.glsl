uniform sampler2D tDiffuse;
uniform float frame;
uniform float throb;
varying vec2 vUv;

#define PI 3.141592653589793


vec4 pattern(vec2 uv) {
    vec4 colorA = vec4(58. / 255., 8. / 255., 52. / 255., 1.);
    vec4 colorB = vec4(38. / 255., 12. / 255., 48. / 255., 1.);
    colorB =  vec4(86. / 255., 15. / 255., 80. / 255., 1.);
    return mix(colorA, colorB, sin(uv.y));
}

void main(void)
{
    vec2 uv = vUv;

    vec2 center = vec2(0.5, 0.75);

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

    vec4 content = texture2D(tDiffuse, vUv);

    gl_FragColor = mix(outp, content, content.a);
}
