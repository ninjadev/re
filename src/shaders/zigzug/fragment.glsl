uniform float frame;
uniform float amount;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.141592653589793


float triangle(float t) {
    return .5 - abs(mod(t, 1.) - .5);
}


void main() {

    vec4 color = vec4(27. / 255., 9. / 255., 34. / 255., 1.);
    vec2 uv = vUv;

    if (uv.x < uv.y) {
        float x = uv.x;
        uv.x = uv.y;
        uv.y = x; 
    }

    if (uv.x + uv.y < 1.0) {
        float x = uv.x;
        uv.x = .5 - uv.y;
        uv.y = .5 - x;
    }

    uv.y -= frame * 0.002;

   float musicbeat = mod(0.1 + frame * 8. / 60. / 60. * 130. / 2., 16.);
   float flipper = 1.;
   if(musicbeat > 14.) {
     flipper = -1.;
   } else if(musicbeat >= 11.) {
     flipper = 1.;
   } else if (musicbeat >= 8.) {
     flipper = -1.;
   } else if (musicbeat >= 6.) {
     flipper = 1.;
   } else if (musicbeat >= 3.) {
     flipper = -1.;
   }

    float modulator = mod(
        uv.x * 16. +
        0.3 * flipper * triangle(uv.y * 16.), 1.);
    float thickness = clamp(0., 1., 8. * amount - vUv.y * 8.);
    if(modulator < 0.25 * thickness) {
        color *= 1.1;
    }
    if(modulator > 1. - 0.25 * thickness) {
        color /= 1.1;
    }

    gl_FragColor = color;
}
