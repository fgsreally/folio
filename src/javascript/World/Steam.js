import * as THREE from "three";

import vertexShader from "../../shaders/coffeeSteam/vertex.glsl";
import fragmentShader from "../../shaders/coffeeSteam/fragment.glsl";

export default class CoffeeSteam {
    constructor() {
        //color = "#d2958a"
        this.color = "#0000ff";
        this.effectGroup = new THREE.Group();
        this.name='steam'
    }

    init(_options) {
        this.resources = _options.resources;
        this.debug = _options.debug;
        this.container = _options.container;
        this.time = _options.time;
        this.container.add(this.effectGroup);
        return this
    }

    add(opts) {
        let {
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
            scale = {
                x: 5,
                y: 5,
                z: 5,
            },
        } = opts;
        let model = {};

        model.color = this.color;

        // Material
        model.material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            vertexShader,
            fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uTimeFrequency: { value: 0.0004 },
                uUvFrequency: { value: new THREE.Vector2(4, 5) },
                uColor: { value: new THREE.Color(model.color) },
            },
        });
        model.material.uniforms.uTime = this.time;
        // Mesh
        model.mesh = this.resources.items.coffeeSteamModel.scene.children[0];
        model.mesh.material = model.material;
        model.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        model.mesh.scale.set(scale.x, scale.y, scale.z);
        model.mesh.position.copy(position);
        this.effectGroup.add(model.mesh);
    }
}
