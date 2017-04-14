uniform float r;
uniform float g;
uniform float b;
uniform float variant;
uniform sampler2D tDiffuse;

varying vec2 vUv;

#define PI 3.1415926535897932384626433832795

void main() {
	vec2 uv = mod(vUv * 8., 1.);
    float intensity;

    vec3 color = vec3(uv.y, uv.y, uv.y);

    color = vec3(r, g, b);

    gl_FragColor = vec4(color, 1.);
}
