import * as THREE from "three";
import FloorShadowMaterial from "../Materials/FloorShadow.js";
import MatcapMaterial from "../Materials/Matcap.js";

export default class Materials {
    constructor(_options) {
        // Options
        this.resources = _options.resources;
        this.debug = _options.debug;
        this.config = _options.config;

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "materials",
                expanded: false,
            });
        }

        // Set up
        this.items = {};

        this.setPures();

        this.setShades();

        this.setFloorShadow();
    }

    setPures() {
        // Setup
        this.pures = {};
        this.pures.items = {};
        this.config.pures &&
            this.config.pures.forEach((item) => {
                this.createPure(item.key, item.name, item.resource);
            });
    }
    createPure(key, name, resource) {
        this.pures.items[key] = resource;
        this.pures.items[key].name = name;
    }
    createShade(key, name, resource) {
        this.shades.items[key] = new MatcapMaterial();
        this.shades.items[key].name = name;
        this.shades.items[key].uniforms.matcap.value = resource;
        this.items[key] = this.shades.items[key];
    }
    setShades() {
        // Setup
        this.shades = {};
        this.shades.items = {};
        this.shades.indirectColor = this.config.indirectColor || "#d04500";

        this.shades.uniforms = {
            uRevealProgress: 0,
            uIndirectDistanceAmplitude: 1.75,
            uIndirectDistanceStrength: 0.5,
            uIndirectDistancePower: 2.0,
            uIndirectAngleStrength: 1.5,
            uIndirectAngleOffset: 0.6,
            uIndirectAnglePower: 1.0,
            uIndirectColor: null,
        };
        // let that = this;
        // White
        this.config?.shades &&
            this.config.shades.forEach((item) => {
                this.createShade(
                    item.key,
                    item.name,
                    typeof item.resource === "string"
                        ? this.resources.items[item.resource]
                        : item.resource
                );
            });
        // Update materials uniforms
        this.shades.updateMaterials = () => {
            this.shades.uniforms.uIndirectColor = new THREE.Color(
                this.shades.indirectColor
            );

            // Each uniform
            for (const _uniformName in this.shades.uniforms) {
                const _uniformValue = this.shades.uniforms[_uniformName];

                // Each material
                for (const _materialKey in this.shades.items) {
                    const material = this.shades.items[_materialKey];
                    material.uniforms[_uniformName].value = _uniformValue;
                }
            }
        };

        this.shades.updateMaterials();

        // // Debug
        if (this.debug) {
            const folder = this.debugFolder.addFolder({
                title: "shades",
                expanded: false,
            });
            // folder.open()
            folder
                .addInput(this.shades.uniforms, "uIndirectDistanceAmplitude", {
                    label: "uIndirectDistanceAmplitude",
                    min: 0,
                    max: 3,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades.uniforms, "uIndirectDistanceStrength", {
                    label: "uIndirectDistanceStrength",
                    min: 0,
                    max: 2,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades.uniforms, "uIndirectDistancePower", {
                    label: "uIndirectDistancePower",
                    min: 0,
                    max: 5,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades.uniforms, "uIndirectAngleStrength", {
                    label: "uIndirectAngleStrength",
                    min: 0,
                    max: 2,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades.uniforms, "uIndirectAngleOffset", {
                    label: "uIndirectAngleOffset",
                    min: -2,
                    max: 2,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades.uniforms, "uIndirectAnglePower", {
                    label: "uIndirectAnglePower",
                    min: 0,
                    max: 5,
                })
                .on("change", this.shades.updateMaterials);
            folder
                .addInput(this.shades, "indirectColor", {
                    view: "color",
                })
                .on("change", this.shades.updateMaterials);
        }
    }

    setFloorShadow() {
        this.items.floorShadow = new FloorShadowMaterial();
        this.items.floorShadow.depthWrite = false;
        this.items.floorShadow.shadowColor = this.config.shadow || "#0045ff";
        this.items.floorShadow.uniforms.uShadowColor.value = new THREE.Color(
            this.items.floorShadow.shadowColor
        );
        this.items.floorShadow.uniforms.uAlpha.value = 0;

        this.items.floorShadow.updateMaterials = () => {
            this.items.floorShadow.uniforms.uShadowColor.value =
                new THREE.Color(this.items.floorShadow.shadowColor);

            for (const _item of this.objects.items) {
                for (const _child of _item.container.children) {
                    if (_child.material instanceof THREE.ShaderMaterial) {
                        if (_child.material.uniforms.uShadowColor) {
                            _child.material.uniforms.uShadowColor.value =
                                new THREE.Color(
                                    this.items.floorShadow.shadowColor
                                );
                        }
                    }
                }
            }
        };

        // Debug
        if (this.debug) {
            const folder = this.debugFolder.addFolder({ title: "floorShadow" });
            // folder.open()
            folder
                .addInput(this.items.floorShadow, "shadowColor", {
                    label: "shadowColor",
                })
                .on("change", this.items.floorShadow.updateMaterials);
            // folder.addColor(this.items.floorShadow, 'shadowColor').onChange(this.items.floorShadow.updateMaterials)
        }
    }
}
