uniform float frame;
uniform sampler2D A;
uniform sampler2D B;
uniform vec2 resolution;

uniform float big;
uniform float extra;
uniform float shift;

varying vec2 vUv;
varying vec2 aUv;

#define EPS 0.01
#define FAR 10.0
#define STEPS 64


float map(vec3 p) {
    float v = frame / 60.;
    float r = max((0.9*big + 1.0*extra), 0.5) +
               0.35*cos(8.3*p.y + v) +
               0.35*cos(2.3*p.x + v);
    return length(p) - r;
}

float map_black(vec3 p) {
    return map(p) - 0.05;
}

vec3 calcNormal(in vec3 pos) {
    vec2 e = vec2(1.0,-1.0)*0.5773*0.0005;
    return normalize(
        e.xyy*map(pos + e.xyy) +
        e.yyx*map(pos + e.yyx) +
        e.yxy*map(pos + e.yxy) +
        e.xxx*map(pos + e.xxx)
    );
}

vec3 shade(vec4 color, vec2 uv, vec3 rd, vec3 ro, float multiplier) {
    float l = length(uv);
    float t = frame / 60.;

    vec3 norm = calcNormal(rd);
    vec3 refd = refract(rd, norm, 1.0/1.33);

    vec3 light = vec3(1.0, 1.0, -1.0);
    float diffusion = clamp(dot(norm, light), 0.0, 1.0);

    vec3 cam = ro+rd*multiplier;
    vec2 point = vec2(refd.x + cam.x, refd.y + cam.y);
    vec4 col = texture2D(B, mod(0.35*point+.5,1.));

    col = vec4(.35*diffusion) + .65*col;

    // post processing
    col = smoothstep(0.0, 1.0, col);
    vec3 res = pow(col.xyz, vec3(0.45));
    return col.xyz;
}

void main() {
    vec4 colorA = texture2D(A, vUv);
    vec4 colorB = texture2D(B, vUv);

    vec2 uv = -1.0 + 2.0 * vUv;
    uv.x *= 16.0/9.0;
    vec3 ro = vec3(0.0, 0.0, 2.5);
    vec3 rd = normalize(vec3(uv, -1.0));

    float t = 0.0;
    float d = EPS;

    // background
    vec3 c = mix(vec3(0.0), colorB.xyz, 2.0 - length(uv));

    // black outline
    for(int i = 0; i < STEPS; ++i) {
        d = map_black(ro + t*rd);
        if(d < EPS || t > FAR) break;
        t += d;
    }

    if(d < EPS) {
        c = vec3(0.0);
    }

    // blob
    t = 0.0;
    d = EPS;
    for(int i = 0; i < STEPS; ++i) {
        d = map(ro + t*rd);
        if(d < EPS || t > FAR) break;
        t += d;
    }

    if(d < EPS) {
        c = shade(colorA, vUv, rd, ro, t);
    }

    gl_FragColor = vec4(c, 1.0);
}
