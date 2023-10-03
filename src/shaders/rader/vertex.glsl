varying vec2 v_position;

void main() {
    v_position = vec2(position.x, position.y);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}