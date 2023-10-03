import { GLTF } from "three/examples/jsm/loaders/gltfloader";
import type { Vector2, Euler } from "three";
export interface Control {
    setKeyboard(): void;
    setTouch(): void;
}

export interface Areas {
    add(option: { halfExtents: Vector2; position: Vector2 }): void;
}

export interface Object {
    add(option: {
        base: GLTF;
        collision: GLTF;
        offset: Vector3;
        rotation: Euler;
        duplicated: true;
        shadow: {
            sizeX: number;
            sizeY: number;
            offsetZ: number;
            alpha: number;
        };
        mass: number;
        soundName: string;
        sleep: boolean;
    });
}

export interface Shadow {
    add(
        _reference: Object3D,
        _option: {
            sizeX: number;
            sizeY: number;
            offsetZ: number;
            alpha: number;
        }
    );
}

export interface Sound {
    add(option: {});
}

export interface Zones {
    add(option: {
        halfExtents: { x: number; y: number };
        position: { x: number; y: number };
    });
}
