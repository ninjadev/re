attribute vec2 aUV;

uniform sampler2D tDiffuse;

varying vec2 vUv;
varying vec2 aUv;

void main() {
    vUv = uv;
    aUv = aUV;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
