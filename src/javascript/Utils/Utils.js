import * as THREE from "three";
export function randomAnimated(model, cb1 = () => {}, cb2 = () => {}) {
    //集合中分两部分做不同行为、动画
    const group1 = [];
    const group2 = [];

    for (const item of model) {
        if (Math.random() < 0.5) {
            group1.push(item);
        } else {
            group2.push(item);
        }
    }
    let i = 0;
    for (const item of group1) {
        cb1(item, i);
        i++;
    }

    let j = 0;
    for (const item of group2) {
        cb2(item, j);

        j++;
    }
}

export function alphaMap(model, color, texture) {
    const item = {};

    item.color = color;
    item.texture = texture;
    item.material = new THREE.MeshBasicMaterial({
        color: item.color,
        transparent: true,
        alphaMap: texture,
    });

    item.mesh = model;
    item.mesh.material = item.material;

    return item;
}

export function moveAnimated(ways, limits, speed) {
    //三维框中运动，遇壁反弹
    animations = {};
    animations.x = 0;
    animations.z = 0;
    animations.y = 0;

    animations.limits = limits;
    animations.speed = speed;

    return function (model, delta) {
        try {
            if (ways.x) {
                animations.x += animations.speed.x * delta;
                if (animations.x > animations.limits.x.max) {
                    animations.x = animations.limits.x.max;
                    animations.speed.x *= -1;
                }
                if (animations.x < animations.limits.x.min) {
                    animations.x = animations.limits.x.min;
                    animations.speed.x *= -1;
                }
                model.mesh.position.x = animations.x;
            }
            if (ways.y) {
                animations.y += animations.speed.y * delta;

                if (animations.y > animations.limits.y.max) {
                    animations.y = animations.limits.y.max;
                    animations.speed.y *= -1;
                }
                if (animations.y < animations.limits.y.min) {
                    animations.y = animations.limits.y.min;
                    animations.speed.y *= -1;
                }
                model.mesh.position.y = animations.y;
            }
            if (ways.z) {
                animations.z += animations.speed.z * delta;

                if (animations.z > animations.limits.z.max) {
                    animations.z = animations.limits.z.max;
                    animations.speed.z *= -1;
                }
                if (animations.z < animations.limits.z.min) {
                    animations.z = animations.limits.z.min;
                    animations.speed.z *= -1;
                }
                model.mesh.position.z = animations.z;
            }
        } catch (e) {
            console.error(e);
        }
    };
}

export function transform( //生成阵列
    start,
    delta,
    interDistance,
    positionRandomess,
    rotationRandomess
) {
    const tilePath = {};
    tilePath.start = start;
    tilePath.delta = delta;

    tilePath.distance = tilePath.delta.length();
    tilePath.count = Math.floor(tilePath.distance / interDistance);
    tilePath.directionVector = tilePath.delta.clone().normalize();
    tilePath.interVector = tilePath.directionVector
        .clone()
        .multiplyScalar(interDistance);
    tilePath.centeringVector = tilePath.delta
        .clone()
        .sub(tilePath.interVector.clone().multiplyScalar(tilePath.count));
    tilePath.tangentVector = tilePath.directionVector
        .clone()
        .rotateAround(new THREE.Vector2(0, 0), Math.PI * 0.5)
        .multiplyScalar(tangentDistance);
    tilePath.angle = tilePath.directionVector.angle();
    const ret = [];
    // Create tiles
    for (let i = 0; i < tilePath.count; i++) {
        // Position
        const position = tilePath.start
            .clone()
            .add(tilePath.interVector.clone().multiplyScalar(i))
            .add(tilePath.centeringVector);
        position.x += (Math.random() - 0.5) * positionRandomess;
        position.y += (Math.random() - 0.5) * positionRandomess;
        const tangent = tilePath.tangentVector;

        if (i % 1 === 0) {
            tangent.negate();
        }

        position.add(tangent);

        // Rotation
        let rotation = tilePath.angle;
        rotation += (Math.random() - 0.5) * rotationRandomess;
        rotation += (model.rotationIndex / 4) * Math.PI * 2;

        ret.push({ position, rotation });
    }
    return ret;
}
