import * as THREE from "three";

import Loader from "./Utils/Loader.js";
import EventEmitter from "./Utils/EventEmitter.js";

// Matcaps

// // Egg
// import eggBaseSource from '../models/egg/base.glb'
// import eggCollisionSource from '../models/egg/collision.glb'

export default class Resources extends EventEmitter {
    constructor(_options) {
        super();
        this.renderer = _options.renderer;
        this.loader = new Loader(this.renderer);
        this.items = {};
        this.resources = [];
        if (_options.resources) {
            this.resources = _options.resources;
        }
        this.loader.load([
            // Matcaps
            ...this.resources,
        ]);

        this.loader.on("fileEnd", (_resource, _data) => {
            this.items[_resource.name] = _data;

            // Texture
            if (_resource.type === "texture") {
                const texture = new THREE.Texture(_data);
                texture.needsUpdate = true;

                this.items[`${_resource.name}Texture`] = texture;
            }

            // Trigger progress
            this.trigger("progress", [this.loader.loaded / this.loader.toLoad]);
        });

        this.loader.on("end", () => {
            // Trigger ready
            this.trigger("ready");
        });
    }
}
