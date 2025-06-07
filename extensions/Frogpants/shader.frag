precision mediump float;

varying vec3 vNormal;
uniform vec3 lightDir;
uniform vec3 baseColor;

void main() {
    vec3 N = normalize(vNormal);
    vec3 L = normalize(lightDir);

    float diff = max(dot(N, L), 0.0);

    vec3 shadedColor = baseColor * diff;

    gl_FragColor = vec4(shadedColor, 1.0);
}
