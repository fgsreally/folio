import * as THREE from "three";
// import * as dat from "dat.gui";

import Sizes from "./Utils/Sizes.js";
import Time from "./Utils/Time.js";
import World from "./World/index.js";
import Resources from "./Resources.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
// import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
// import BlurPass from "./Passes/Blur.js";
// import GlowsPass from "./Passes/Glows.js";
import Camera from "./Camera.js";
import sphere360Destination from "../images/mobile/pano1.png";
import fragment from "../shaders/inner/fragment.js";
import vertex from "../shaders/inner/vertex.js";
import { Pane } from "tweakpane";
export default class Application {
    /**
     * Constructor
     */
    constructor(_options) {
        // Options
        this.$canvas = _options.$canvas;
        this.config = {
            debug: true,
            touch: false,

            ..._options,
        };
        // Set up
        this.time = new Time();
        this.sizes = new Sizes();
        this.hook = {};
        this._setConfig();
        this._setDebug();
        this._setRenderer();
        this.resources = new Resources({
            resources: this.config.resources,
            renderer: this.renderer,
        });

        // console.log(this.resources)
        this._setCamera();
        this._createInnerScene();
        this._createFinalScene();

        this._setPasses();
        this._setWorld();
        // this.setTitle();
    }
    build() {}

    setPasses(cb) {
        typeof cb === "function" && (this.hook.pass = cb);
    }

    setInnerScene(cb) {
        typeof cb === "function" && (this.hook.InnerScene = cb);
    }
    setStartingScreen(cb) {
        typeof cb === "function" && (this.hook.StartingScreen = cb);
    }

    /**
     * Set config
     */
    _setConfig() {
        window.addEventListener(
            "touchstart",
            () => {
                this.config.touch = true;
                this.world.controls.setTouch();
            },
            { once: true }
        );
    }

    /**
     * Set debug
     */
    _setDebug() {
        if (this.config.debug) {
            this.debug = new Pane();
            this.debug.containerElem_.style.width = "320px";
        }
    }

    /**
     * Set renderer
     */
    _setRenderer() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene360Destination = new THREE.Scene();
        this.sceneFinal = new THREE.Scene();
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.$canvas,
            alpha: true,
            antialias: true,
        });
        // this.renderer.setClearColor(0x414141, 1)
        this.renderer.setClearColor(this.config.clearColor || 0x000000, 1);
        // this.renderer.setPixelRatio(Math.min(Math.max(window.devicePixelRatio, 1.5), 2))
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(
            this.sizes.viewport.width,
            this.sizes.viewport.height
        );
        this.renderer.physicallyCorrectLights = true;
        // this.renderer.gammaFactor = 2.2;
        this.renderer.gammaOutPut = true;
        this.sizes.on("resize", () => {
            this.renderer.setSize(
                this.sizes.viewport.width,
                this.sizes.viewport.height
            );
        });
    }
    _setCamera() {
        this.camera = new Camera({
            time: this.time,
            sizes: this.sizes,
            renderer: this.renderer,
            debug: this.debug,
            config: this.config,
        });

        this.innerCamera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );
        var frustumSize = 1;

        this.finalCamera = new THREE.OrthographicCamera(
            frustumSize / -2,
            frustumSize / 2,
            frustumSize / 2,
            frustumSize / -2,
            -1000,
            1000
        );
        this.innerCamera.position.set(-2, 0, 0);
        this.controlssdadr = new OrbitControls(
            this.innerCamera,
            this.renderer.domElement
        );

        this.scene.add(this.camera.container);

        this.time.on("tick", () => {
            if (this.world && this.world.car) {
                this.camera.target.x = this.world.car.chassis.object.position.x;
                this.camera.target.y = this.world.car.chassis.object.position.y;
            }
        });
        this.sizes.on("resize", () => {
            this.innerCamera.aspect = this.$canvas.width / this.$canvas.height;
            this.innerCamera.updateProjectionMatrix();
        });
    }

    _createInnerScene() {
        this.hook.InnerScene?.(this);
        // this.geometry =
        //     this.config?.innerGeometry ||
        //     new THREE.SphereBufferGeometry(10, 30, 30);
        // this.innerTexture = new THREE.TextureLoader().load(
        //     sphere360Destination
        // );
        // this.innerTexture.wrapS = THREE.RepeatWrapping;
        // this.innerTexture.repeat.x = -1;
        // this.sphere = new THREE.Mesh(
        //     this.geometry,
        //     this.config?.innerMaterials ||
        //         new THREE.MeshBasicMaterial({
        //             map: this.innerTexture,
        //             side: THREE.BackSide,
        //         })
        // );
        // this.scene360Destination.add(this.sphere);
        // this.scene360Text = new Text();
        // this.scene360Destination.add(this.scene360Text);
        // // Set properties to configure:
        // this.scene360Text.position.set(2, -1, 0);
        // this.scene360Text.rotation.set(0, -1.57, 0);
        // // Update the rendering:
        // this.scene360Text.sync();
    }

    _createFinalScene() {
        this.texture360Destination = new THREE.WebGLRenderTarget(
            this.$canvas.width,
            this.$canvas.height,
            {
                format: THREE.RGBAFormat,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
            }
        );

        this.texture360Origin = new THREE.WebGLRenderTarget(
            this.$canvas.width,
            this.$canvas.height,
            {
                format: THREE.RGBAFormat,
                minFilter: THREE.LinearFilter,
                magFilter: THREE.LinearFilter,
            }
        );

        this.finalMaterial =
            this.config?.PassingShader ||
            new THREE.ShaderMaterial({
                extensions: {
                    derivatives:
                        "#extension GL_OES_standard_derivatives : enable",
                },
                side: THREE.DoubleSide,
                uniforms: {
                    progress: { value: 0 },
                    scene360Origin: { value: null },
                    scene360Destination: { value: null },
                },
                vertexShader: vertex,
                fragmentShader: fragment,
            });

        let geo = new THREE.PlaneBufferGeometry(1, 1);
        let mesh = new THREE.Mesh(geo, this.finalMaterial);
        this.sceneFinal.add(mesh);
    }

    /**
     * Set camera
     */

    _setPasses() {
        this.passes = {};

        // Debug
        if (this.debug) {
            this.passes.debugFolder = this.debug.addFolder({
                title: "postprocess",
                expanded: false,
            });
            // this.passes.debugFolder.open()
        }

        this.passes.composer = new EffectComposer(
            this.renderer,
            this.texture360Origin
        );
        this.passes.composer.renderToScreen = false;
        this.passes.composer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
        this.passes.composer.setSize(this.sizes.width, this.sizes.height);
        // Create passes
        this.passes.renderPass = new RenderPass(
            this.scene,
            this.camera.instance
        );

        // // Add passes
        this.passes.composer.addPass(this.passes.renderPass);

        this.settingsProgress = {
            progress: 0,
        };

        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "progrx",
                expanded: false,
            });

            this.debugFolder.addInput(this.settingsProgress, "progress", {
                label: "progrx",
                min: 0,
                max: 1,
            });
        }

        // Resize event
        this.sizes.on("resize", () => {
            this.renderer.setSize(
                this.sizes.viewport.width,
                this.sizes.viewport.height
            );
            this.passes.composer.setSize(
                this.sizes.viewport.width,
                this.sizes.viewport.height
            );
        });
        this.hook.pass?.(this);
    }

    /**
     * Set world
     */
    _setWorld() {
        this.world = new World(this);
        this.scene.add(this.world.container);
    }

    reset() {
        this.scene.remove(this.world.container);
        this.world = null;
        this._setWorld;
    }
    start() {
        this.resources.on("ready", () => {
            this.world.setStartingScreen();
        });
        this.time.on("tick", () => {
            this.passes.composer.render();
            this.renderer.setRenderTarget(this.texture360Destination);
            this.renderer.render(this.scene360Destination, this.innerCamera);
            this.finalMaterial.uniforms.scene360Destination.value =
                this.texture360Destination.texture;
            this.finalMaterial.uniforms.scene360Origin.value =
                this.passes.composer.readBuffer;
            this.finalMaterial.uniforms.progress.value =
                this.settingsProgress.progress;

            this.renderer.setRenderTarget(null);
            this.renderer.render(this.sceneFinal, this.finalCamera);
        });
    }
    /**
     * Destructor
     */
    destructor() {
        this.time.off("tick");
        this.sizes.off("resize");

        this.camera.orbitControls.dispose();
        this.renderer.dispose();
        this.debug.destroy();
    }
}
