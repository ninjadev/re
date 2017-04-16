uniform float frame;
uniform float bounceSpeedMultiplier;
uniform float disformationAmount;
uniform sampler2D A;
#define PI 3.141592653589793

varying vec2 vUv;

float sphere(vec3 position, vec3 sphere, float radius) {
    return length(position - sphere) - radius;
}

float box(vec3 p, vec3 b) {
    vec3 d = abs(p) - b;
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float torus(vec3 p, vec2 t) {
    vec2 q = vec2(length(p.xz) - t.x, p.y);
    return length(q) - t.y;
}

float displacement(vec3 p) {
    return 1.5 * sin(frame / 9. + .9 * p.x) * sin(.5 * p.y) * sin(.9 * p.z);
}

float cylinder( vec3 p, vec2 h ) {
    vec2 d = abs(vec2(length(p.xz),p.y)) - h;
    return min(max(d.x,d.y),0.0) + length(max(d,0.0));
}


float smin(float a, float b, float k) {
    float res = exp(-k * a) + exp(-k * b);
    return -log(res) / k;
}

float map(vec3 p) {
    float timer = 2. * PI * frame / 60. / 60. * 130. * bounceSpeedMultiplier;
    float s = sphere(p, vec3(2. * sin(timer / 2.), -5. * sin(timer), 2. * sin(timer)), 4.);
    s = smin(s, sphere(p, vec3(-2. * sin(timer / 2.), 5. * sin(timer), .0), 4.), .5);
    float t = torus(p, vec2(5., 1.));
    s += disformationAmount * displacement(p);
    return s;
}

float castRay(vec3 ro, vec3 rd, float sizeChange) {
    float totalDistance = 0.0;
    const int maxSteps = 128;

    for(int i = 0; i < maxSteps; ++i) {
        vec3 p = ro + rd * totalDistance;
        float d = map(p*(1. + sizeChange));
        if(d < 0.001 || totalDistance >= 40.0) {
            break;
        }

        totalDistance += d;
    }
    return totalDistance;
}

vec3 calculateNormal(vec3 pos) {
    vec3 eps = vec3(0.001, 0.0, 0.0);
    vec3 normal = vec3(
            map(pos + eps.xyy) - map(pos - eps.xyy),
            map(pos + eps.yxy) - map(pos - eps.yxy),
            map(pos + eps.yyx) - map(pos - eps.yyx));
    return normalize(normal);
}

void main() {
    float x = (vUv.x * 16.0) - 8.0;
    float y = (vUv.y * 9.0) - 4.5;
    float fov = 18.0;

    vec3 eye = vec3(0., 0., 50.);
    vec3 forward = vec3(0., 0., -1.);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = cross(forward, up);

    vec3 rayOrigin = eye + (right * x) + (up * y) + (forward * fov);
    vec3 rayDestination = normalize(rayOrigin - eye);

    vec3 light = normalize(vec3(1., 1., 1.));

    float farClippingPlane = 40.0;

    float blackColDistance = castRay(rayOrigin, rayDestination, -0.03);;
    vec4 blackCol = vec4(0.);

    float totalDistance = castRay(rayOrigin, rayDestination, 0.0);
    vec4 color = vec4(1.);
    vec3 pos = rayOrigin + forward * totalDistance;
    vec3 surfaceNormal = calculateNormal(pos);
    float diffusion = 1.5 * clamp(dot(surfaceNormal, light), 0.0, 1.0);

    vec3 refracted = refract(normalize(pos - eye), surfaceNormal, 1.33);
    vec4 refractedColor = texture2D(A, mod(refracted.xy - 0.5, 1.));

    if(blackColDistance < farClippingPlane) {
        color = vec4(.1, 0., .1, 1.);
    }

    if(totalDistance < farClippingPlane) {
        color = diffusion * vec4(0.4, 0.1, 0.4, 1.) * .8 + refractedColor * 0.4;
    }
    //color = vec4(surfaceNormal, 1.);

    if(blackColDistance > farClippingPlane) {
        color = texture2D(A, vUv);
    }

    gl_FragColor = color;
}
