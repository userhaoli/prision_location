<template>
  <div class="alarm-detail root-element" ref="container">
    <div class="right-bar">
      <div class="tab-btn">
        <button>报警图片</button>
        <button>报警视频</button>
      </div>
      <div class="items">
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
      </div>
      <div class="items" v-show="false">
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
        <img src="/images/u23.png" alt />
      </div>
    </div>
    <!-- <div>
      <h3>报警详情</h3>
    </div>-->
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      timer: null,
      plane: null,
      cone: null,
      geometry: null,
      oldTime: undefined,
      Shader: {
        vertexShader: `
            varying vec3 vp; 
                void main(){     
                vp = position;   
                gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } 
        `,
        fragmentShader: `
            varying vec3 vp;
                uniform vec3 u_position;
                uniform vec3 u_color;
                uniform vec3 u_tcolor;
                uniform float u_r;
                uniform float u_length;
                uniform float u_max;
                float getLeng(float x, float y){
                    return  sqrt((x-0.0)*(x-0.0)+(y-0.0)*(y-0.0));
                }
                void main(){ 
                    // vec3 vd = vec3(vp.x-u_position.x,vp.y-u_position.y,vp.z-u_position.z);
                    vec3 vd = vp-u_position;
                    float uOpacity = 0.4; 
                    vec3 vColor = u_color;
                    float uLength = getLeng(vd.x,vd.z);
                    if ( uLength <= u_r && uLength > u_r - u_length ) { 
                        float op = sin( (u_r - uLength) / u_length ) * 0.6 + 0.3 ;
                        uOpacity = op; 
                        if( vd.y<0.0){
                            // vColor  = u_tcolor * 0.6; 
                            vColor = u_tcolor * (- vd.y ) * 0.3;
                        }else{ 
                            // vColor = u_tcolor;
                            vColor = u_tcolor *  vd.y * 0.3;
                        }; 
                        gl_FragColor = vec4(vColor,0.8);
                    } 
                    gl_FragColor = vec4(vColor,uOpacity);
                }
            `
      },
      uniform: {
        u_color: {
          value: new THREE.Color(0x5588aa)
        },
        u_tcolor: {
          value: new THREE.Color(0xff0000)
        },
        u_r: {
          value: 0.0
        },
        u_length: {
          value: 10
        }, //扫过区域
        u_max: {
          value: 300
        }, //扫过最大值
        u_position: {
          value: new THREE.Vector3(0, 0, 0)
        }
      },
      Shader1: {
        vertexShader: `
            varying vec3 vp; 
                void main(){     
                vp = position;   
                gl_Position	= projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                } 
        `,
        fragmentShader: `
                varying vec3 vp;
                uniform vec3 color;
                uniform float max_height;
                void main(){ 
                    float uOpacity = 1.0;
                    if( vp.y >= 0.0 ){
                       uOpacity = 20.0 / (max_height / 2.0 + vp.y);
                    }else{
                      uOpacity = 10.0 / (max_height / 2.0 + vp.y);
                    }
                    gl_FragColor = vec4(color,uOpacity);
                }
            `
      },
      uniform1: {
        color: {
          value: new THREE.Color(0xffffff)
        },
        max_height: {
          value: 1000.0
        }
      }
    };
  },
  mounted() {
    this.init();
    this.animate();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    init() {
      let container = this.$refs.container;
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        60,
        container.offsetWidth / container.offsetHeight,
        0.1,
        9000
      );
      this.camera.position.set(0, 400, 400);
      this.camera.lookAt(0, 0, 0);

      // let helper = new THREE.AxesHelper(200);
      // this.scene.add(helper);

      this.scene.add(new THREE.AmbientLight(0xffffff));
      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(container.offsetWidth, container.offsetHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      container.appendChild(this.renderer.domElement);
      let controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.minDistance = 1;

      let urls = [
        "/images/cube/dark-s_px.jpg",
        "/images/cube/dark-s_nx.jpg",
        "/images/cube/dark-s_py.jpg",
        "/images/cube/dark-s_ny.jpg",
        "/images/cube/dark-s_pz.jpg",
        "/images/cube/dark-s_nz.jpg"
      ];
      let textureCube = new THREE.CubeTextureLoader().load(urls);
      textureCube.encoding = THREE.sRGBEncoding;
      this.scene.background = textureCube;
      console.log(this.scene);

      this.createCone();
      this.createSprite();
      this.createCylinder();
      this.createPoints();
      let geometry = new THREE.BoxBufferGeometry(600, 10, 600);
      let material = new THREE.ShaderMaterial({
        vertexShader: this.Shader.vertexShader,
        fragmentShader: this.Shader.fragmentShader,
        side: THREE.DoubleSide,
        uniforms: this.uniform,
        transparent: true,
        depthWrite: false
      });
      this.plane = new THREE.Mesh(geometry, material);
      this.scene.add(this.plane);
    },
    createCone() {
      var geometry = new THREE.ConeBufferGeometry(8, 16, 4);
      var material1 = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5
      });
      this.cone = new THREE.Mesh(geometry, material1);
      this.cone.rotation.x = -Math.PI;
      this.cone.position.x = 0;
      this.cone.position.y += 12;
      var lineMaterial = new THREE.LineBasicMaterial({
        // 线的颜色
        color: 0xfffffe,
        transparent: true,
        opacity: 0.5,
        depthFunc: THREE.AlwaysDepth
      });
      this.cone.add(new THREE.LineSegments(geometry, lineMaterial));
      this.scene.add(this.cone);
    },
    createSprite() {
      let canvas = document.createElement("canvas");
      let context = canvas.getContext("2d");
      context.beginPath();
      context.font = `bold 60px Arial`;
      context.fillStyle = "#ff0000";
      context.textAlign = "center";
      context.fillText("报警地", canvas.width / 2, canvas.height / 2);
      context.closePath();
      var spriteMap = new THREE.CanvasTexture(canvas);
      var spriteMaterial = new THREE.SpriteMaterial({
        map: spriteMap,
        color: 0xffffff,
        depthTest:false,
      });
      var sprite = new THREE.Sprite(spriteMaterial);
      sprite.updateMatrix();
      sprite.position.set(0, 30, 0);
      sprite.scale.set(20, 20, 20);
      this.scene.add(sprite);
    },
    createCylinder() {
      var geometry = new THREE.CylinderBufferGeometry(
        100,
        100,
        1000,
        128,
        8,
        1,
        true
      );
      // var texture = new THREE.TextureLoader().load(
      //   "/images/lightray_yellow.jpg"
      // );
      // var material = new THREE.MeshBasicMaterial({
      //   // transparent: true,
      //   // opacity: 0.6,
      //   map: texture,
      //   side:THREE.DoubleSide
      // });
      let material = new THREE.ShaderMaterial({
        vertexShader: this.Shader1.vertexShader,
        fragmentShader: this.Shader1.fragmentShader,
        side: THREE.DoubleSide,
        uniforms: this.uniform1,
        transparent: true,
        depthWrite: false
      });
      var cylinder = new THREE.Mesh(geometry, material);
      cylinder.position.set(0, 500, 0);
      this.scene.add(cylinder);
    },
    createLightMateria() {
      let canvasDom = document.createElement("canvas");
      canvasDom.width = 16;
      canvasDom.height = 16;
      let ctx = canvasDom.getContext("2d");
      //根据参数确定两个圆的坐标，绘制放射性渐变的方法，一个圆在里面，一个圆在外面
      let gradient = ctx.createRadialGradient(
        canvasDom.width / 2,
        canvasDom.height / 2,
        0,
        canvasDom.width / 2,
        canvasDom.height / 2,
        canvasDom.width / 2
      );
      gradient.addColorStop(0, "rgba(6,6,23,1)");
      gradient.addColorStop(0.005, "rgba(0,133,255,1.0)");
      gradient.addColorStop(0.4, "rgba(31,43,81,1.0)");
      gradient.addColorStop(1, "rgba(0,0,0,1)");
      //设置ctx为渐变色
      ctx.fillStyle = gradient;
      //绘图
      ctx.fillRect(0, 0, canvasDom.width, canvasDom.height);

      //贴图使用
      let texture = new THREE.Texture(canvasDom);
      texture.needsUpdate = true; //使用贴图时进行更新
      return texture;
    },
    random() {
      this.geometry.verticesNeedUpdate = true;
      this.geometry.vertices = [];
      for (let i = 0; i < 200; i++) {
        this.geometry.vertices.push(
          new THREE.Vector3(
            Math.random() * 200 - 100,
            Math.random() * 1000,
            Math.random() * 200 - 100
          )
        );
      }
    },
    createPoints() {
      let material = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 200,
        map: this.createLightMateria(),
        depthTest: false,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      this.geometry = new THREE.Geometry();

      for (let i = 0; i < 200; i++) {
        this.geometry.vertices.push(
          new THREE.Vector3(
            Math.random() * 200 - 100,
            Math.random() * 1000,
            Math.random() * 200 - 100
          )
        );
      }
      let points = new THREE.Points(this.geometry, material);
      this.scene.add(points);
    },
    animate() {
      this.timer = requestAnimationFrame(this.animate);
      this.cone.rotation.y += 0.02;
      let material = this.plane.material;
      material.uniforms.u_r.value += 1;
      if (material.uniforms.u_r.value >= 100) {
        material.uniforms.u_r.value = 0;
      }
      let disTime;
      if (this.oldTime === undefined) {
        this.oldTime = +new Date();
      }
      disTime = +new Date() - this.oldTime;
      if (disTime > 300) {
        this.random(disTime);
        this.oldTime = +new Date();
      }
      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    onResize() {
      var width = this.$refs.container.offsetWidth;
      var height = this.$refs.container.offsetHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.cancelAnimationFrame(this.timer);
  }
};
</script>

<style lang="less">
@btn_height: 3rem;
.alarm-detail {
  position: relative;
  color: #fff;
  .right-bar {
    width: 30rem;
    position: absolute;
    right: 0;
    top: 0;
    border: 1px solid #fff;
    height: 100%;
    box-sizing: border-box;
    .tab-btn {
      height: @btn_height;
      line-height: @btn_height;
      button {
        color: #fff;
      }
    }
    .items {
      height: calc(~"100% - @{btn_height}");
      overflow: hidden;
      box-sizing: border-box;
      img {
        display: block;
        width: 100%;
        margin-top: 1rem;
      }
    }
  }
}
</style>