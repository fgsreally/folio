import * as THREE from "three";
export default class Debug {
    constructor() {
        this.name = "debug";
    }
    init(_options) {
        
        let mouse = new THREE.Vector2();
        let camera = _options.camera.instance;
        let scene = _options.scene.children;
        window.addEventListener("click", (e) => onDocumentMouseDown(e));
        function onDocumentMouseDown(e) {
            

            mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

            var raycaster = new THREE.Raycaster();
            raycaster.setFromCamera(mouse, camera);
            //射线和模型求交，选中一系列直线
            var intersects = raycaster.intersectObjects(scene,true);
            console.log(intersects);

            if (intersects.length > 0) {
                //选中第一个射线相交的物体
               
                console.log(intersects[0].object);
            }
        }

        return this;
    }
}
