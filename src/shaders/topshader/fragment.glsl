uniform float start1;
uniform float stop1;
uniform float start2;
uniform float stop2;
uniform float start3;
uniform float stop3;
uniform float start4;
uniform float stop4;
uniform float tiles;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {
	vec2 uv = mod(vUv * tiles, 1.);

    float dist_center = max( abs( uv.x - 0.5 ), abs( uv.y - 0.5 ));
    float color = floor( dist_center * 2. + start1 );
    color += 1. - floor( dist_center * 2. + stop1 );
    float color2 = floor( dist_center * 2. + start2 );
    color2 += 1. - floor( dist_center * 2. + stop2 );
    float color3 = floor( dist_center * 2. + start3 );
    color3 += 1. - floor( dist_center * 2. + stop3 );
    float color4 = floor( dist_center * 2. + start4 );
    color4 += 1. - floor( dist_center * 2. + stop4 );

    color += color2;
    color = floor(color / 2.0);
    color += color3;
    color = floor(color / 2.0);
    color += color4;
    color = floor(color / 2.0);

    gl_FragColor = vec4(min(color + .9, 1.), min(color + 0.2, 1.), min(color + .4, 1.), 1.);
}
