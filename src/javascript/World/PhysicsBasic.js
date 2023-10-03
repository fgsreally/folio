import CANNON from "cannon";
import * as THREE from "three";

export default class physicsBasic {
    constructor() {
        this.name = "physics";
    }
    _init(_options) {
        this.config = _options.config;
        this.debug = _options.debug;
        this.time = _options.time;
        this.sizes = _options.sizes;
        this.controls = _options.controls;
        this.sounds = _options.sounds;
        this.container = _options.container;

        // Set up
        if (this.debug) {
            this.debugFolder = this.debug.addFolder({
                title: "physics",
                expanded: false,
            });
        }

        this.setWorld();
        this.setModels();
        this.setFloor();

        this.time.on("tick", () => {
            this.world.step(1 / 60, this.time.delta, 3);
        });
        _options.container.add(this.models.container);
        return this;
    }

    setWorld() {
        this.world = new CANNON.World();
        this.world.gravity.set(0, 0, -3.25);
        this.world.allowSleep = true;
        // this.world.gravity.set(0, 0, 0)
        // this.world.broadphase = new CANNON.SAPBroadphase(this.world)
        this.world.defaultContactMaterial.friction = 0;
        this.world.defaultContactMaterial.restitution = 0.2;

        //Debug
        if (this.debug) {
            this.debugFolder.addInput(this.world.gravity, "z", {
                label: "gravity",
                min: -20,
                max: 20,
            });
        }
    }

    setModels() {
        this.models = {};
        this.models.container = new THREE.Object3D();
        this.models.container.visible = false;
        this.models.materials = {};
        this.models.materials.static = new THREE.MeshBasicMaterial({
            color: 0x0000ff,
            wireframe: true,
        });
        this.models.materials.dynamic = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            wireframe: true,
        });
        this.models.materials.dynamicSleeping = new THREE.MeshBasicMaterial({
            color: 0xffff00,
            wireframe: true,
        });

        // Debug
        if (this.debug) {
            this.debugFolder.addInput(this.models.container, "visible", {
                label: "modelsVisible",
            });
        }
    }

    addObjectFromThree(_options) {
        // Set up
        const collision = {};

        collision.model = {};
        collision.model.meshes = [];
        collision.model.container = new THREE.Object3D();
        this.models.container.add(collision.model.container);

        collision.children = [];

        // Material
        const bodyMaterial = this.materials.items.dummy;

        // Body
        collision.body = new CANNON.Body({
            position: new CANNON.Vec3(
                _options.offset.x,
                _options.offset.y,
                _options.offset.z
            ),
            mass: _options.mass,
            material: bodyMaterial,
        });
        collision.body.allowSleep = true;
        collision.body.sleepSpeedLimit = 0.01;
        if (_options.sleep) {
            collision.body.sleep();
        }

        this.world.addBody(collision.body);

        // Rotation
        if (_options.rotation) {
            const rotationQuaternion = new CANNON.Quaternion();
            rotationQuaternion.setFromEuler(
                _options.rotation.x,
                _options.rotation.y,
                _options.rotation.z,
                _options.rotation.order
            );
            collision.body.quaternion =
                collision.body.quaternion.mult(rotationQuaternion);
        }

        // Center
        collision.center = new CANNON.Vec3(0, 0, 0);

        // Shapes
        const shapes = [];

        // Each mesh
        for (let i = 0; i < _options.meshes.length; i++) {
            const mesh = _options.meshes[i];

            // Define shape
            let shape = null;

            if (mesh.name.match(/^cube_?[0-9]{0,3}?|box[0-9]{0,3}?$/i)) {
                shape = "box";
            } else if (mesh.name.match(/^cylinder_?[0-9]{0,3}?$/i)) {
                shape = "cylinder";
            } else if (mesh.name.match(/^sphere_?[0-9]{0,3}?$/i)) {
                shape = "sphere";
            } else if (mesh.name.match(/^center_?[0-9]{0,3}?$/i)) {
                shape = "center";
            }

            // Shape is the center
            if (shape === "center") {
                collision.center.set(
                    mesh.position.x,
                    mesh.position.y,
                    mesh.position.z
                );
            }

            // Other shape
            else if (shape) {
                // Geometry
                let shapeGeometry = null;

                if (shape === "cylinder") {
                    shapeGeometry = new CANNON.Cylinder(
                        mesh.scale.x,
                        mesh.scale.x,
                        mesh.scale.z,
                        8
                    );
                } else if (shape === "box") {
                    const halfExtents = new CANNON.Vec3(
                        mesh.scale.x * 0.5,
                        mesh.scale.y * 0.5,
                        mesh.scale.z * 0.5
                    );
                    shapeGeometry = new CANNON.Box(halfExtents);
                } else if (shape === "sphere") {
                    shapeGeometry = new CANNON.Sphere(mesh.scale.x);
                }

                // Position
                const shapePosition = new CANNON.Vec3(
                    mesh.position.x,
                    mesh.position.y,
                    mesh.position.z
                );

                // Quaternion
                const shapeQuaternion = new CANNON.Quaternion(
                    mesh.quaternion.x,
                    mesh.quaternion.y,
                    mesh.quaternion.z,
                    mesh.quaternion.w
                );
                if (shape === "cylinder") {
                    // Rotate cylinder
                    // shapeQuaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), - Math.PI * 0.5)
                }

                // Save
                shapes.push({ shapeGeometry, shapePosition, shapeQuaternion });

                // Create model object
                let modelGeometry = null;
                if (shape === "cylinder") {
                    modelGeometry = new THREE.CylinderBufferGeometry(
                        1,
                        1,
                        1,
                        8,
                        1
                    );
                    modelGeometry.rotateX(Math.PI * 0.5);
                } else if (shape === "box") {
                    modelGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
                } else if (shape === "sphere") {
                    modelGeometry = new THREE.SphereBufferGeometry(1, 8, 8);
                }

                const modelMesh = new THREE.Mesh(
                    modelGeometry,
                    this.models.materials[
                        _options.mass === 0 ? "static" : "dynamic"
                    ]
                );
                modelMesh.position.copy(mesh.position);
                modelMesh.scale.copy(mesh.scale);
                modelMesh.quaternion.copy(mesh.quaternion);

                collision.model.meshes.push(modelMesh);
            }
        }

        // Update meshes to match center
        for (const _mesh of collision.model.meshes) {
            _mesh.position.x -= collision.center.x;
            _mesh.position.y -= collision.center.y;
            _mesh.position.z -= collision.center.z;

            collision.model.container.add(_mesh);
        }

        // Update shapes to match center
        for (const _shape of shapes) {
            // Create physic object
            _shape.shapePosition.x -= collision.center.x;
            _shape.shapePosition.y -= collision.center.y;
            _shape.shapePosition.z -= collision.center.z;

            collision.body.addShape(
                _shape.shapeGeometry,
                _shape.shapePosition,
                _shape.shapeQuaternion
            );
        }

        // Update body to match center
        collision.body.position.x += collision.center.x;
        collision.body.position.y += collision.center.y;
        collision.body.position.z += collision.center.z;

        // Save origin
        collision.origin = {};
        collision.origin.position = collision.body.position.clone();
        collision.origin.quaternion = collision.body.quaternion.clone();
        collision.origin.sleep = _options.sleep;

        // Time tick update
        this.time.on("tick", () => {
            collision.model.container.position.set(
                collision.body.position.x,
                collision.body.position.y,
                collision.body.position.z
            );
            collision.model.container.quaternion.set(
                collision.body.quaternion.x,
                collision.body.quaternion.y,
                collision.body.quaternion.z,
                collision.body.quaternion.w
            );

            if (this.models.container.visible && _options.mass > 0) {
                for (const _mesh of collision.model.container.children) {
                    _mesh.material =
                        collision.body.sleepState === 2
                            ? this.models.materials.dynamicSleeping
                            : this.models.materials.dynamic;
                }
            }
        });

        // Reset
        collision.reset = () => {
            collision.body.position.copy(collision.origin.position);
            collision.body.quaternion.copy(collision.origin.quaternion);

            if (collision.origin.sleep) {
                collision.body.sleep();
            }
        };

        return collision;
    }
}
