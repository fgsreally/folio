import { Howl, Howler } from "howler";

import revealSound from "../../sounds/reveal/reveal-1.mp3";

import engineSound from "../../sounds/engines/1/low_off.mp3";

export default class Sounds {
    constructor(_options) {
        // Options
        this.time = _options.time;
        this.debug = _options.debug;
        this.media = _options.config.media || [];

        // Debug
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "sounds",
                expanded: false,
            });
        }

        // Set up
        this.items = [];

        this.setSettings();
        this.setMasterVolume();
        this.setMute();
        this.setEngine();
    }

    setSettings() {
        this.settings = this.media;

        for (const _settings of this.settings) {
            this.add(_settings);
        }
    }

    setMasterVolume() {
        // Set up
        this.masterVolume = 0.5;
        Howler.volume(this.masterVolume);

        window.requestAnimationFrame(() => {
            Howler.volume(this.masterVolume);
        });

        // Debug
        if (this.debug) {
            this.debugFolder
                .addInput(this, "masterVolume", {
                    label: "uLightDeskStrength",
                    min: 0,
                    max: 1,
                })
                .on("change", () => {
                    Howler.volume(this.masterVolume);
                });

            // this.debugFolder
            //     .add(this, "masterVolume")
            //     .step(0.001)
            //     .min(0)
            //     .max(1)
            //     .onChange(() => {
            //         Howler.volume(this.masterVolume);
            //     });
        }
    }

    setMute() {
        // Set up
        this.muted = typeof this.debug !== "undefined";
        Howler.mute(this.muted);

        // M Key
        window.addEventListener("keydown", (_event) => {
            if (_event.key === "m") {
                this.muted = !this.muted;
                Howler.mute(this.muted);
            }
        });

        // Tab focus / blur
        document.addEventListener("visibilitychange", () => {
            if (document.hidden) {
                Howler.mute(true);
            } else {
                Howler.mute(this.muted);
            }
        });

        // Debug
        if (this.debug) {
            this.debugFolder
                .addInput(this, "muted", { view: "muted" })
                .on("change", () => {
                    Howler.mute(this.muted);
                });
        }
    }

    setEngine() {
        // Set up
        this.engine = {};

        this.engine.progress = 0;
        this.engine.progressEasingUp = 0.3;
        this.engine.progressEasingDown = 0.15;

        this.engine.speed = 0;
        this.engine.speedMultiplier = 2.5;
        this.engine.acceleration = 0;
        this.engine.accelerationMultiplier = 0.4;

        this.engine.rate = {};
        this.engine.rate.min = 0.4;
        this.engine.rate.max = 1.4;

        this.engine.volume = {};
        this.engine.volume.min = 0.4;
        this.engine.volume.max = 1;
        this.engine.volume.master = 0;

        this.engine.sound = new Howl({
            src: [engineSound],
            loop: true,
        });

        this.engine.sound.play();

        // Time tick
        this.time.on("tick", () => {
            let progress =
                Math.abs(this.engine.speed) * this.engine.speedMultiplier +
                Math.max(this.engine.acceleration, 0) *
                    this.engine.accelerationMultiplier;
            progress = Math.min(Math.max(progress, 0), 1);

            this.engine.progress +=
                (progress - this.engine.progress) *
                this.engine[
                    progress > this.engine.progress
                        ? "progressEasingUp"
                        : "progressEasingDown"
                ];

            // Rate
            const rateAmplitude = this.engine.rate.max - this.engine.rate.min;
            this.engine.sound.rate(
                this.engine.rate.min + rateAmplitude * this.engine.progress
            );

            // Volume
            const volumeAmplitude =
                this.engine.volume.max - this.engine.volume.min;
            this.engine.sound.volume(
                (this.engine.volume.min +
                    volumeAmplitude * this.engine.progress) *
                    this.engine.volume.master
            );
        });

        // Debug
        if (this.debug) {
            const folder = this.debugFolder.addFolder({ title: "engine" });
            // folder.open();

            folder.addInput(this.engine, "progressEasingUp", {
                label: "progressEasingUp",
                min: 0,
                max: 1,
            });
            folder.addInput(this.engine, "progressEasingDown", {
                label: "progressEasingDown",
                min: 0,
                max: 1,
            });

            folder.addInput(this.engine.rate, "min", {
                label: "min",
                min: 0,
                max: 4,
            });

            folder.addInput(this.engine.rate, "max", {
                label: "max",
                min: 0,
                max: 4,
            });

            folder.addInput(this.engine, "speedMultiplier", {
                label: "speedMultiplier",
                min: 0,
                max: 5,
            });

            folder.addInput(this.engine, "accelerationMultiplier", {
                label: "accelerationMultiplier",
                min: 0,
                max: 100,
            });

            folder.addInput(this.engine, "progress", {
                label: "progress",
                min: 0,
                max: 1,
            });
        }
    }

    add(_options) {
        const item = {
            name: _options.name,
            minDelta: _options.minDelta,
            velocityMin: _options.velocityMin,
            velocityMultiplier: _options.velocityMultiplier,
            volumeMin: _options.volumeMin,
            volumeMax: _options.volumeMax,
            rateMin: _options.rateMin,
            rateMax: _options.rateMax,
            lastTime: 0,
            sounds: [],
        };

        for (const _sound of _options.sounds) {
            const sound = new Howl({ src: [_sound] });

            item.sounds.push(sound);
        }

        this.items.push(item);
    }

    play(_name, _velocity) {
        const item = this.items.find((_item) => _item.name === _name);
        const time = Date.now();
        const velocity = typeof _velocity === "undefined" ? 0 : _velocity;

        if (
            item &&
            time > item.lastTime + item.minDelta &&
            (item.velocityMin === 0 || velocity > item.velocityMin)
        ) {
            // Find random sound
            const sound =
                item.sounds[Math.floor(Math.random() * item.sounds.length)];

            // Update volume
            let volume = Math.min(
                Math.max(
                    (velocity - item.velocityMin) * item.velocityMultiplier,
                    item.volumeMin
                ),
                item.volumeMax
            );
            volume = Math.pow(volume, 2);
            sound.volume(volume);

            // Update rate
            const rateAmplitude = item.rateMax - item.rateMin;
            sound.rate(item.rateMin + Math.random() * rateAmplitude);

            // Play
            sound.play();

            // Save last play time
            item.lastTime = time;
        }
    }
}
