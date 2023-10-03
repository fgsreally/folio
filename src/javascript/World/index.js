import * as THREE from "three";
import Materials from "./Materials.js";
import Floor from "./Floor.js";
import Shadows from "./Shadows.js";
import Zones from "./Zones.js";
import Objects from "./Objects.js";
import Controls from "./Controls.js";
import Sounds from "./Sounds.js";

export default class {
    constructor(_options) {
        // Options
        this.config = _options.config;
        this.debug = _options.debug;
        this.resources = _options.resources;
        this.time = _options.time;
        this.sizes = _options.sizes;
        this.camera = _options.camera;
        this.renderer = _options.renderer;
        this.passes = _options.passes;
        this.scene = _options.scene;
        this.hook = _options.hook;
        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "world",
                expanded: false,
            });
        }

        // Set up
        this.container = new THREE.Object3D();
        this.container.matrixAutoUpdate = false;
        this.setSounds();
        this.setControls();
        this.setFloor();
        this.startBuild();
    }

    startBuild() {
        this.resources.on("ready", () => {
            this.setMaterials();
            this.setShadows();
            this.setPhysics();
            this.setObjects();
            this.setPre();
            this.setZones();
            this.setReveal();
            this.setPlugin();
            this.setSections();
        });
    }

    setReveal() {
        if (!this.config.reveal) {
            throw new Error("不存在reveal启动模块");
        }
        this.reveal = this.config.reveal.init(this);
    }
    setPhysics() {
        if (!this.config.physics) throw new Error("不存在物理模块");
        this.physics = this.config.physics.init(this);
    }

    setStartingScreen() {
        this.hook.StartingScreen && this.hook.StartingScreen(this);
        this.reveal.go();
    }

    setSounds() {
        this.sounds = new Sounds(this);
    }

    setControls() {
        this.controls = new Controls(this);
    }

    setMaterials() {
        this.materials = new Materials(this);
    }

    setFloor() {
        this.floor = new Floor(this);

        this.container.add(this.floor.container);
    }

    setShadows() {
        this.shadows = new Shadows(this);
        this.container.add(this.shadows.container);
    }

    setPre() {
        if (this.config.pre) {
            this.config.pre.forEach((item) => {
                let newItem = item.init(this);
                if (!newItem.name) throw new Error("pre plugin need a name");
                this[newItem.name] = newItem;
            });
        }
    }

    setZones() {
        this.zones = new Zones(this);
        this.container.add(this.zones.container);
    }

    setPlugin() {
        if (this.config?.plugins) {
            this.config.plugins.forEach((item) => {
                let newItem = item.init(this);
                if (!newItem.name) throw new Error("plugin need a name");
                this[newItem.name] = newItem;
            });
        }
    }
    setObjects() {
        this.objects = new Objects(this);
        this.container.add(this.objects.container);
    }

    setSections() {
        this.sections = {};

        this.config.sections?.forEach((item) => {
            
            this.addSection(item);
        });
    }

    removeSection() {
        this.container.remove(this.sections[section.name].container);
        this.sections[section.name] = undefined;
    }

    addSection(item) {
        let section = new item(this);
        if (!section.name) {
            throw new Error("每个地区应有一个name");
        }
        this.container.add(section.container);
        this.sections[section.name] = section;
    }
}
