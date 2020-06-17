import * as THREE from "three";
import {
    OrbitControls
} from "three/examples/jsm/controls/OrbitControls.js";
import {
    MTLLoader
} from "three/examples/jsm/loaders/MTLLoader.js";
import {
    OBJLoader
} from "three/examples/jsm/loaders/OBJLoader.js";
import {
    Water
} from "three/examples/jsm/objects/Water2.js";
import {
    Line2
} from "three/examples/jsm/lines/Line2.js";
import {
    LineMaterial
} from "three/examples/jsm/lines/LineMaterial.js";
let scene, renderer, camera, lineList = [],
    linePos = [
        [
            [-200, 5, -100],
            [100, 5, -90],
            [120, 5, 200]
        ],
        [
            [200, 12, 110],
            [-90, 12, 90],
            [-110, 12, -180]
        ]
    ];
const callbackObj = function () {
    let  resolution = new THREE.Vector2(
        this.$refs.container.offsetWidth,
        this.$refs.container.offsetHeight)
    const getLineGeo = list => {
        const l = [];
        for (let i = 0; i < list.length; i++) {
            l.push(new THREE.Vector3(list[i][0], list[i][1], list[i][2]));
        }
        const cat = new THREE.CatmullRomCurve3(l); //曲线路径
        const points = cat.getPoints(50); //曲线分五十段，也就是取 101个点

        // const geometry = new THREE.Geometry()//创建一个几何
        // for(let i =0;i < points.length;i++){
        //     geometry.vertices.push( new THREE.Vector3(points[i].x,points[i].y,points[i].z))
        // }
        return new THREE.Geometry().setFromPoints(points);
    };
    let textureLoader = new THREE.TextureLoader();
    textureLoader.load("/images/red_line.png", (texture) => {
        textureLoader.load("/images/green_line.png", (texture2) => {
            linePos.forEach((e, i) => {
                const meshLine = new Line2();
                meshLine.geometry.vertices = getLineGeo(e).vertices;
                const line = new THREE.Mesh(
                    meshLine.geometry,
                    new LineMaterial({
                        color: i % 2 === 0 ? "red" : "green",
                        map: i % 2 === 0 ? texture : texture2,
                        useMap: true,
                        lineWidth: 10,
                        resolution: resolution,
                        dashArray: 0.8, // 破折号之间的长度和间距。(0 -无破折号)
                        dashRatio: 0.4, // 定义可见和不可见之间的比率(0 -更可见，1 -更不可见)。
                        dashOffset: 0,
                        transparent: true,
                        sizeAttenuation: 1, //使线宽不变，不管距离(1个单位是屏幕上的1px)(0 -衰减，1 -不衰减)
                        side: THREE.DoubleSide,
                        depthTest: false,
                        blending: THREE.AdditiveBlending,
                        near: camera.near,
                        far: camera.far
                    })
                );
                scene.add(line);
                line.position.y = 2;
                lineList.push(line);
                //
                // addFlyLine(texture, texture2);
                //
                // add3DLabels();
                //
                // addStander(texture, texture2);
                //
                // addHomeLabel();
                //
                // loadingDom.remove();
            });
        });
    });
};
const init3d = function () {
    let control;
    let width = this.$refs.container.offsetWidth,
        height = this.$refs.container.offsetHeight;
    scene = new THREE.Scene();
    scene.add(new THREE.AmbientLight(0xffffff));

    camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 60000);
    camera.position.set(0, 600, 600);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0x00071d);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearAlpha(0.5);
    renderer.shadowMap.enabled = true;
    //添加灯光
    const directionalLight = new THREE.DirectionalLight("#fff", 1);
    directionalLight.position.set(0, 100, 0);
    directionalLight.castShadow = true;

    const pointLight = new THREE.PointLight("yellow", 2);
    pointLight.position.set(100, 30, 100);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight("blue", 2);
    pointLight2.position.set(-100, 30, -100);
    pointLight2.castShadow = true;
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight("#fff", 2);
    pointLight3.position.set(300, 200, -300);
    pointLight3.castShadow = true;
    scene.add(pointLight3);
    scene.add(new THREE.PointLightHelper(pointLight3, 1));

    const pointLight4 = new THREE.PointLight("#red", 2);
    pointLight4.position.set(0, 100, 0);
    pointLight4.castShadow = true;
    scene.add(pointLight4);

    const ambientLight = new THREE.AmbientLight("#fff", 1); // obj 唯一 id
    scene.add(ambientLight);

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("/images/liti.png", (groundTexture) => {
        textureLoader.load("/images/road.png", (road) => {
            new MTLLoader()
                .setPath("/models/obj/city/")
                .load("city.mtl", (materials) => {
                    new OBJLoader()
                        .setPath("/models/obj/city/")
                        .setMaterials(materials)
                        .load("city.obj", (object) => {
                            console.log(object);
                            object.traverse(child => {
                                // groundTexture.wrapS = THREE.RepeatWrapping;
                                // groundTexture.wrapT = THREE.RepeatWrapping;
                                // groundTexture.repeat.set(2, 2);
                                if (child.name === "mesh105") {
                                    child.material = new THREE.MeshStandardMaterial({
                                        transparent: true,
                                        opacity: 0
                                    });
                                    // water
                                    const params = {
                                        color: "#fff",
                                        scale: 3,
                                        flowX: 1,
                                        flowY: 1
                                    };
                                    const waterGeometry = new THREE.PlaneGeometry(600, 600);
                                    const water = new Water(waterGeometry, {
                                        color: params.color,
                                        scale: params.scale,
                                        flowDirection: new THREE.Vector2(
                                            params.flowX,
                                            params.flowY
                                        ),
                                        textureWidth: 1024,
                                        textureHeight: 1024,
                                        waterPath: [
                                            "/images/Water_1_M_Normal.jpg",
                                            "/images/Water_2_M_Normal.jpg"
                                        ]
                                    });
                                    water.position.set(0, 1.5, 0);
                                    water.rotation.x = Math.PI * -0.5;
                                    scene.add(water);
                                    //平面
                                    const planeGeometry = new THREE.PlaneGeometry(600, 600);
                                    let plane = new THREE.Mesh(planeGeometry);
                                    //水平面旋转并且设置位置
                                    plane.rotation.x = -0.5 * Math.PI;
                                    plane.material.update = true;
                                    plane.position.set(0, 1, 0);
                                    scene.add(plane);
                                    plane.name = "plane";
                                    plane.material = new THREE.MeshStandardMaterial({
                                        // color:'#2d68be',
                                        map: groundTexture,
                                        transparent: true,
                                        opacity: 0.9
                                    });
                                    plane.receiveShadow = true;
                                } else if (
                                    ["mesh01", "mesh02"].indexOf(child.name) !== -1
                                ) {
                                    //road
                                    child.material = new THREE.MeshStandardMaterial({
                                        map: road,
                                        transparent: true,
                                        opacity: 0.9
                                    });
                                } else if (["mesh04"].indexOf(child.name) !== -1) {
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: "#78F8FF",
                                        transparent: true,
                                        opacity: 0.9
                                    });
                                    child.scale.set(2, 2, 2);
                                    child.castShadow = true;
                                    child.name = "国创大楼";
                                } else {
                                    child.material = new THREE.MeshStandardMaterial({
                                        color: "#1759AA",
                                        transparent: true,
                                        opacity: 0.8
                                    });
                                    child.castShadow = true;
                                }
                                child.updateMatrix();
                            });
                            scene.add(object);
                            callbackObj.call(this);
                        });
                });
        });
    });

    this.$refs.container.appendChild(renderer.domElement);
    control = new OrbitControls(camera, renderer.domElement);
    control.minDistance = 1;
};
const render = function () {
    renderer.render(scene, camera);
};
const animate = function () {
    this.timer = requestAnimationFrame(animate.bind(this));
    // lineList.forEach(line => {
    //     line.material.uniforms.dashOffset.value -= 0.01
    // })
    render();
};
const onResize = function () {
    var width = this.$refs.container.offsetWidth;
    var height = this.$refs.container.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
}

export {
    callbackObj,
    init3d,
    animate,
    onResize
}