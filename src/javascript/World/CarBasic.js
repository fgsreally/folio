import * as THREE from "three";

export default class carBasic {
    constructor() {
        this.name = "car";
    }
    _init(_options) {
        // Options
        this.time = _options.time;
        this.resources = _options.resources;
        this.objects = _options.objects;
        this.physics = _options.physics;
        this.shadows = _options.shadows;
        this.materials = _options.materials;
        this.controls = _options.controls;
        this.sounds = _options.sounds;
        this.renderer = _options.renderer;
        this.camera = _options.camera;
        this.debug = _options.debug;
        this.config = _options.config;

        // Set up
        this.container = new THREE.Object3D();
        this.position = new THREE.Vector3();

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "car",
                expanded: false,
            });
        }
        _options.container.add(this.container);
    }
}
