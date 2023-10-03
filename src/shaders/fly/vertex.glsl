attribute float index;
attribute float current;
uniform float time;
uniform float uSpeed;
uniform float uSize;
uniform float uRange; // 展示区间
uniform float uTotal; // 粒子总数
uniform vec3 uColor;
varying vec3 vColor;
varying float vOpacity;
void main() {
            // 需要当前显示的索引
    float size = uSize;
    float showNumber = uTotal * mod(time*uSpeed, 1.1);
    if(showNumber > current && showNumber < current + uRange) {
        float uIndex = ((current + uRange) - showNumber) / uRange;
        size *= uIndex;
        vOpacity = 1.0;
    } else {
        vOpacity = 0.0;
    }

            // 顶点着色器计算后的Position
    vColor = uColor;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition; 
            // 大小
    gl_PointSize = size * 300.0 / (-mvPosition.z);
}