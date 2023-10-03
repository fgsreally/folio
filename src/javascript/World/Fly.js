import * as THREE from "three";
import vertexShader from "../../shaders/fly/vertex.glsl";
import fragmentShader from "../../shaders/fly/fragment.glsl";

export default class Fly {
    constructor(options) {
        // this.container = options.container;
        // this.time = options.time;
        this.effectGroup = new THREE.Group();
        // this.container.add(this.effectGroup);
        this.name = "fly";
    }
    init(options) {
        this.container = options.container;
        this.time = options.time;
        this.container.add(this.effectGroup);
        return this
    }
    add(opts) {
        const {
            source = {
                x: 0,
                y: 0,
                z: 0,
            },
            target = {
                x: 5,
                y: 4,
                z: 3,
            },
            range = 12,
            height = 10,
            color = "#ffff00",
            speed = 1,
            size = 0.5,
        } = opts;
        const positions = [];
        const attrPositions = [];
        const attrCindex = [];
        const attrCnumber = [];

        const _source = new THREE.Vector3(source.x, source.y, source.z);
        const _target = new THREE.Vector3(target.x, target.y, target.z);
        const _center = _target.clone().lerp(_source, 0.5);
        _center.y += height;

        const number =
            20 *
            parseInt(_source.distanceTo(_center) + _target.distanceTo(_center));

        const curve = new THREE.QuadraticBezierCurve3(
            _source,
            _center,
            _target
        );
        const points = curve.getPoints(number);

        // 粒子位置计算

        points.forEach((elem, i) => {
            const index = i / (number - 1);
            positions.push({
                x: elem.x,
                y: elem.y,
                z: elem.z,
            });
            attrCindex.push(index);
            attrCnumber.push(i);
        });

        positions.forEach((p) => {
            attrPositions.push(p.x, p.y, p.z);
        });

        const geometry = new THREE.BufferGeometry();

        geometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(attrPositions, 3)
        );
        // 传递当前所在位置
        geometry.setAttribute(
            "index",
            new THREE.Float32BufferAttribute(attrCindex, 1)
        );
        geometry.setAttribute(
            "current",
            new THREE.Float32BufferAttribute(attrCnumber, 1)
        );

        const shader = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            depthTest: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uColor: {
                    value: new THREE.Color(color), // 颜色
                },
                uSpeed: {
                    value: speed, // 速度
                },
                uRange: {
                    value: range || 100, // 显示当前范围的个数
                },
                uSize: {
                    value: size, // 粒子大小
                },
                uTotal: {
                    value: number, // 当前粒子的所有的总数
                },
                time: {
                    value: 0, //
                },
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
        });

        const point = new THREE.Points(geometry, shader);
        point.material.uniforms.time = this.time;
        point.renderOrder = 10;
        this.effectGroup.add(point);
        return point;
    }
}
