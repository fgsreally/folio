precision mediump float;

float atan2(float y, float x) {
    float t0, t1, t2, t3, t4;
    t3 = abs(x);
    t1 = abs(y);
    t0 = max(t3, t1);
    t1 = min(t3, t1);
    t3 = float(1) / t0;
    t3 = t1 * t3;
    t4 = t3 * t3;
    t0 = -float(0.013480470);
    t0 = t0 * t4 + float(0.057477314);
    t0 = t0 * t4 - float(0.121239071);
    t0 = t0 * t4 + float(0.195635925);
    t0 = t0 * t4 - float(0.332994597);
    t0 = t0 * t4 + float(0.999995630);
    t3 = t0 * t3;
    t3 = (abs(y) > abs(x)) ? float(1.570796327) - t3 : t3;
    t3 = (x < 0.0) ? float(3.141592654) - t3 : t3;
    t3 = (y < 0.0) ? -t3 : t3;
    return t3;
}
// 计算距离
float distanceTo(vec2 src, vec2 dst) {
    float dx = src.x - dst.x;
    float dy = src.y - dst.y;
    float dv = dx * dx + dy * dy;
    return sqrt(dv);
}

#define PI 3.14159265359
#define PI2 6.28318530718

uniform vec3 u_color;
uniform float time;
uniform float u_opacity;
uniform float u_radius;
uniform float u_width;
uniform float u_speed;
uniform float u_border;
varying vec2 v_position;

void main() {
    float d_time = u_speed * time;

    float angle = atan2(v_position.x, v_position.y) + PI;

    float angleT = mod(angle + d_time, PI2);

    float width = u_width;

    float d_opacity = 0.0;

        // 当前位置离中心位置
    float length = distanceTo(vec2(0.0, 0.0), v_position);

    if(length < u_radius && length > u_radius - u_border) {
        float o = (length - (u_radius - u_border)) / u_border;
        d_opacity = sin(o * PI);
    }

    if(length < u_radius - u_border / 1.1) {
        d_opacity = 1.0 - angleT / PI * (PI / width);
    }

    if(length > u_radius) {
        d_opacity = 0.0;
    }

    gl_FragColor = vec4(u_color, d_opacity * u_opacity);
}