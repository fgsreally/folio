import { Vector2, Vector3 } from "three";

export interface DomParam {
    element: HTMLElement;
    position: Vector3;
}

export interface DomPlugin {
    dom: { add(option: DomParam): void };
}

export interface WallParam {}

export interface WallPlugin {
    wall: { add(option: WallParam): void };
}

export interface FlyParam {
    source?: { x: number; y: number; z: number };
    target?: { x: number; y: number; z: number };
    range?: number;
    height?: number;
    color?: string;
    speed?: number;
    size?: number;
}

export interface FlyPlugin {
    fly: { add(option: FlyParam): void };
}

interface RaderParam {
    radius: number;
    color: string;
    speed: number;
    opacity: number;
    angle: number;
    border: number;
    position: {
        x: number;
        y: number;
        z: number;
    };
    rotation: {
        x: number;
        y: number;
        z: number;
    };
}

export interface RaderPlugin {
    rader: { add(option: RaderParam): void };
}

interface SteamPlugin {
    color?: string;
    position?: {
        x: number;
        y: number;
        z: number;
    };
    rotation?: {
        x: number;
        y: number;
        z: number;
    };
    scale?: {
        x: number;
        y: number;
        z: number;
    };
}

export interface SteamPlugin {
    steam: { add(option: SteamParam): void };
}

interface TileParam {
    start: Vector2;
    delta: Vector2;
}

export interface TilesPlugin {
    tiles: { add(option: TileParam): void };
}
