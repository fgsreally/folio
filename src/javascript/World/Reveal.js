import { TweenLite } from "gsap/TweenLite";
import EventEmitter from "../Utils/EventEmitter";

export default class Reveal extends EventEmitter {
    constructor() {
        super();
    }
    init(_options) {
        this.physics = _options.physics;
        this.time = _options.time;
        this.shadows = _options.shadows;
        this.sounds = _options.sounds;
        this.controls = _options.controls;
        this.objects = _options.objects;
        this.materials = _options.materials;
        this.matcapsProgress = 0;
        this.floorShadowsProgress = 0;
        this.previousMatcapsProgress = null;
        this.previousFloorShadowsProgress = null;
        return this;
    }

    go() {
        TweenLite.fromTo(
            this,
            3,
            { matcapsProgress: 0 },
            { matcapsProgress: 1 }
        );
        TweenLite.fromTo(
            this,
            3,
            { floorShadowsProgress: 0 },
            { floorShadowsProgress: 1, delay: 0.5 }
        );
        TweenLite.fromTo(
            this.shadows,
            3,
            { alpha: 0 },
            { alpha: 0.5, delay: 0.5 }
        );
        TweenLite.fromTo(
            this.sounds.engine.volume,
            0.5,
            { master: 0 },
            { master: 0.7, delay: 0.3, ease: Power2.easeIn }
        );
        window.setTimeout(() => {
            this.sounds.play("reveal");
        }, 400);

        // Controls
        if (this.controls.touch) {
            window.setTimeout(() => {
                this.controls.touch.reveal();
            }, 400);
        }
        if (this.physics.car) {
            this.physics.car.chassis.body.sleep();
            this.physics.car.chassis.body.position.set(0, 0, 12);

            window.setTimeout(() => {
                this.physics.car.chassis.body.wakeUp();
            }, 300);
        }
        this.time.on("tick", () => {
            // Matcap progress changed
            if (this.matcapsProgress !== this.previousMatcapsProgress) {
                // Update each material
                for (const _materialKey in this.materials.shades.items) {
                    const material = this.materials.shades.items[_materialKey];
                    material.uniforms.uRevealProgress.value =
                        this.matcapsProgress;
                }

                // Save
                this.previousMatcapsProgress = this.matcapsProgress;
            }

            // Matcap progress changed
            if (
                this.floorShadowsProgress !== this.previousFloorShadowsProgress
            ) {
                // Update each floor shadow
                for (const _mesh of this.objects.floorShadows) {
                    _mesh.material.uniforms.uAlpha.value =
                        this.floorShadowsProgress;
                }

                // Save
                this.previousFloorShadowsProgress = this.floorShadowsProgress;
            }
        });
    }
}
