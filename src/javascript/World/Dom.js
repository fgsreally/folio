import * as THREE from "three";
export default class Dom {
    constructor(_options) {
        this.name = "dom";
    }
    init(_options) {
        this.time = _options.time;
        this.camera = _options.camera;
        this.scene = _options.scene;
        this.sizes = _options.sizes;
        this.points = _options.points || [];

        const raycaster = new THREE.Raycaster();
        let screenPosition,
            intersects,
            pointDistance,
            translateX,
            translateY,
            intersectionDistance;

        setTimeout(() => {
            this.time.on("tick", () => {
                for (const point of this.points) {
                    screenPosition = point.position.clone();
                    // console.log(screenPosition, this.camera.instance);
                    screenPosition.project(this.camera.instance);

                    raycaster.setFromCamera(
                        screenPosition,
                        this.camera.instance
                    );
                    intersects = raycaster.intersectObjects(
                        this.scene.children,
                        true
                    );
                    intersectionDistance = 1000;
                    for (let i of intersects) {
                        if (i.object.type === "Mesh") {
                            intersectionDistance = i.distance;
                            break;
                        }
                    }
                    if (intersects.length === 0) {
                        point.element.classList.add("visible");
                    } else {
                        // intersectionDistance = intersects[0].distance;
                        pointDistance = point.position.distanceTo(
                            this.camera.instance.position
                        );

                        if (intersectionDistance < pointDistance - 0.1) {
                            point.element.classList.remove("visible");
                        } else {
                            point.element.classList.add("visible");
                        }
                    }

                    translateX = screenPosition.x * this.sizes.width * 0.5;
                    translateY = -screenPosition.y * this.sizes.height * 0.5;

                    point.element.style.transform = `translateX(${translateX}px) translateY(${translateY}px)`;
                }
            });
        }, 3000);
        return this
    }
    add(point) {
        this.points.push(point);
    }
}
