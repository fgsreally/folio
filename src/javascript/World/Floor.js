import * as THREE from "three";
import FloorMaterial from "../Materials/Floor.js";

export default class Floor {
    constructor(_options) {
        // Options
        this.debug = _options.debug;
        this.config = _options.config;
        // Container
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;

        // Geometry
        this.geometry = new THREE.PlaneBufferGeometry(2, 2, 10, 10);

        // Colors
        this.colors = {};
        this.colors.topLeft = "#f5883c";
        this.colors.topRight = "#ff9043";
        this.colors.bottomRight = "#fccf92";
        this.colors.bottomLeft = "#f5aa58"; //"#f5aa58";
        this.colors = { ...this.colors, ...this.config?.colors };
        // Material
        this.material = new FloorMaterial();

        this.updateMaterial = () => {
            let cornerColor = [
                new THREE.Color(this.colors.bottomLeft),
                new THREE.Color(this.colors.bottomRight),
                new THREE.Color(this.colors.topLeft),
                new THREE.Color(this.colors.topRight),
            ];
            const data = new Uint8Array(16);
            function convertColor(color) {
                return [
                    Math.round(color.r * 255),
                    Math.round(color.g * 255),
                    Math.round(color.b * 255),
                ];
            }
            for (let i = 0; i < 16; i += 4) {
                let colorPix = convertColor(cornerColor[i / 4]);
                data[i] = colorPix[0];
                data[i + 1] = colorPix[1];
                data[i + 2] = colorPix[2];
                data[i + 3] = 255;
            }
            // const data = new Uint8Array([
            //     Math.round(bottomLeft.r * 255),
            //     Math.round(bottomLeft.g * 255),
            //     Math.round(bottomLeft.b * 255),
            //     Math.round(bottomRight.r * 255),
            //     Math.round(bottomRight.g * 255),
            //     Math.round(bottomRight.b * 255),
            //     Math.round(topLeft.r * 255),
            //     Math.round(topLeft.g * 255),
            //     Math.round(topLeft.b * 255),
            //     Math.round(topRight.r * 255),
            //     Math.round(topRight.g * 255),
            //     Math.round(topRight.b * 255),
            // ]);

            this.backgroundTexture = new THREE.DataTexture(
                data,
                2,
                2,
                THREE.RGBAFormat
            );
            this.backgroundTexture.magFilter = THREE.LinearFilter;
            this.backgroundTexture.needsUpdate = true;

            this.material.uniforms.tBackground.value = this.backgroundTexture;
        };

        this.updateMaterial();
        console.log(this.backgroundTexture);

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.frustumCulled = false;
        this.mesh.matrixAutoUpdate = false;
        this.mesh.updateMatrix();
        this.container.add(this.mesh);

        // Debug
        if (this.debug) {
            const folder = this.debug.addFolder({
                title: "floor",
                expanded: false,
            });
            // folder.open()
            folder
                .addInput(this.colors, "topLeft")
                .on("change", this.updateMaterial);
            folder
                .addInput(this.colors, "topRight")
                .on("change", this.updateMaterial);
            folder
                .addInput(this.colors, "bottomRight")
                .on("change", this.updateMaterial);
            folder
                .addInput(this.colors, "bottomLeft")
                .on("change", this.updateMaterial);
            // folder.addColor(this.colors, 'topLeft').onChange(this.updateMaterial)
            // folder.addColor(this.colors, 'topRight').onChange(this.updateMaterial)
            // folder.addColor(this.colors, 'bottomRight').onChange(this.updateMaterial)
            // folder.addColor(this.colors, 'bottomLeft').onChange(this.updateMaterial)
        }
    }
}
