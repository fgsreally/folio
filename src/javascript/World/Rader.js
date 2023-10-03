import fragmentShader from "../../shaders/rader/fragment.glsl";
import vertexShader from "../../shaders/rader/vertex.glsl";
import * as THREE from "three";
export default class Rader {
    constructor(_options) {
        this.name = "rader";
        this.effectGroup = new THREE.Group();
    }
    init(_options) {
        this.config = _options.config;
        this.container = _options.container;
        this.time = _options.time;
        this.container.add(this.effectGroup);
        return this
    }
    add(opts) {
        const {
            radius = 50,
            color = "#ffffff",
            speed = 1,
            opacity = 1,
            angle = Math.PI,
            border = 5,
            position = {
                x: 0,
                y: 0,
                z: 0,
            },
            rotation = {
                x: 0,
                y: 0,
                z: 0,
            },
        } = opts;

        const width = radius * 2;

        const geometry = new THREE.PlaneBufferGeometry(width, width, 1, 1);

        const material = new THREE.ShaderMaterial({
            uniforms: {
                u_radius: {
                    value: radius,
                },
                u_speed: {
                    value: speed,
                },
                u_opacity: {
                    value: opacity,
                },
                u_width: {
                    value: angle,
                },
                u_color: {
                    value: new THREE.Color(color),
                },
                u_border: { value: border },
                time: {
                    value: 0,
                },
            },
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const mesh = new THREE.Mesh(geometry, material);

        mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        mesh.position.copy(position);
        mesh.material.uniforms.time = this.time;

        this.effectGroup.add(mesh);
        return mesh;
    }
}
