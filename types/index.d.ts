import { MeshBasicMaterial } from "three";
import { GLTF } from "three/examples/jsm/loaders/gltfloader";

interface resource {
    name: string;
    type?: "texture";
    source: GLTF | string; //texture import;
}

interface sound {
    name: string;
    sounds: string[]; //mp3 import
    minDelta: number;
    velocityMin: number;
    velocityMultiplier: number;
    volumeMin: number;
    volumeMax: number;
    rateMin: number;
    rateMax: number;
}

interface configType {
    $canvas: HTMLElement;
    plugins: any[];
    media: sound[];
    resource: resource[];
    shades: {
        key: string;
        name: string;
        resource: string | MeshBasicMaterial;
    }[];
    pures?: {
        key: string;
        name: string;
        resource: MeshBasicMaterial;
    }[];
    colors?: {
        topLeft?: string;
        topRight?: string;
        bottomLeft?: string;
        bottomRight?: string;
    };
    useComposer?: boolean;
}

export class Application {
    constructor(config: configType);
    setPasses(cb: Function): void;
    setStartingScreen(cb: Function): void;
    setInnerScene(cb: Function): void;
    build(): void;
    start(): void;
    reset(): void;
}
