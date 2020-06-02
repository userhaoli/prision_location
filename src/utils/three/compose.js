import EffectComposer from 'three-effectcomposer';
const composer = function (_renderer, _scene, _camera, THREE) {
    console.dir(EffectComposer)
    console.log("222")
    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();
    var composer = new EffectComposer(_renderer);
    var renderPass = new EffectComposer.RenderPass(_scene, _camera);
    var selectedObjects = [];
    composer.addPass(renderPass);
    var outlinePass = new THREE.OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), _scene, _camera);
    outlinePass.edgeStrength = 5; //包围线浓度
    outlinePass.edgeGlow = 0.5; //边缘线范围
    outlinePass.edgeThickness = 2; //边缘线浓度
    outlinePass.pulsePeriod = 2; //包围线闪烁频率
    outlinePass.visibleEdgeColor.set('#ffffff'); //包围线颜色
    outlinePass.hiddenEdgeColor.set('#190a05'); //被遮挡的边界线颜色
    composer.addPass(outlinePass);
    var effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
    effectFXAA.renderToScreen = true;
    composer.addPass(effectFXAA);

    window.addEventListener('click', onMouseClick);

    function onMouseClick(event) {
        var x, y;
        if (event.changedTouches) {
            x = event.changedTouches[0].pageX;
            y = event.changedTouches[0].pageY;
        } else {
            x = event.clientX;
            y = event.clientY;
        }
        mouse.x = (x / window.innerWidth) * 2 - 1;
        mouse.y = -(y / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, _camera);
        var intersects = raycaster.intersectObjects([_scene], true);
        if (intersects.length == 0) {
            return;
        }
        if (intersects[0].object.name == "地面" || (intersects[0].object.name == "") || (intersects[0].object.name == "墙面")) {
            selectedObjects.pop();
        } else {
            selectedObjects.pop();
            selectedObjects.push(intersects[0].object);
            outlinePass.selectedObjects = selectedObjects; //给选中的线条和物体加发光特效
        }
    }
    return composer;
}
export default composer;