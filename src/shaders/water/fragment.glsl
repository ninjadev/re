uniform float frame;

#define PI 3.1415926535897932384626433832795

varying vec2 vUv;


float plasma(float time) {
    float v = 0.0;
    float u_k = 16.;
    vec2 c = vUv * u_k - u_k/2.0;
    v += sin((c.x+time));
    v += sin((c.y+time)/2.0);
    v += sin((c.x+c.y+time)/2.0);
    c += u_k/2.0 * vec2(sin(time/3.0), cos(time/2.0));
    v += sin(sqrt(c.x*c.x+c.y*c.y+1.0)+time);
    v = v/2.0;
    return v;
}

void main() {

    float v = plasma(frame / 60.);
    float v2 = plasma(frame / 60. + PI);

    vec3 color = vec3(73. / 255., 195. / 255., 239. / 255.);
    if(v > 0.3 && v < 0.7) {
        color *= 1.2;
    }
    if(v2 > 0.3 && v2 < 0.7) {
        color *= 1.2;
    }
    gl_FragColor = vec4(color, 1);
}
