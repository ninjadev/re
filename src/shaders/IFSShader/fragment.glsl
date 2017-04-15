uniform float frame;
uniform float colorSwitch;
uniform sampler2D tDiffuse;

#define PI 3.14159265358979323846
varying vec2 vUv;

const int depth = 128;

vec2 complexMult(vec2 a, vec2 b) {
    float real = a.x * b.x - a.y * b.y;
    float complex = a.y * b.x + a.x * b.y;
    return vec2(real, complex);
}

float mandelbrot(vec2 z, vec2 c) {
    int depth_reached = depth;
    for (int i=0; i<depth; i++) {
        if (dot(z, z) > 4.0) {
            depth_reached = i;
            break;
        }
        z = complexMult(z, z) + c;
    }
    return float(depth_reached) / float(depth);
}


void main(void) {
    float time = (frame - 8300.) / 60.;
    vec2 uv = (vUv - 0.5) * 2.;
    vec2 translate = vec2(0.);
    float scale = time * 1.;
    uv /= scale;
    //uv += translate / scale;
    float center = mandelbrot(uv, vec2(-0.70176 + time * 0.12, -0.3842 - time * 0.1));
    vec4 color = vec4(vec3(center), 1.) * mix(
            vec4(0.9, 0.2, 0.4, 1.),
            vec4(0.1, 0.63, .8, 1.),
            colorSwitch);
    gl_FragColor = color; 
}
