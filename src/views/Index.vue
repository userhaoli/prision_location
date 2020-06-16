<template>
  <div class="index root-element" ref="container">
    <div class="content">
      <ul class="left-bar">
        <li class="monitor-key">
          <h4>重点监控</h4>
          <div>
            <video src poster="/images/u23.png"></video>
          </div>
        </li>
        <li class="statistics-alarm">
          <h4>报警统计</h4>
          <div ref="statistics"></div>
        </li>
        <li class="electronic-call">
          <h4>电子点名</h4>
          <div class="call-content">
            <p>
              <span style="color:#f00">一监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">二监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">三监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">四监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">五监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">六监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">七监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
            <p>
              <span style="color:#f00">八监区</span> 应到
              <span style="color:#61a0a8">100</span> 实到
              <span style="color:#d48265">95</span>
            </p>
          </div>
        </li>
      </ul>
      <ul class="right-bar">
        <li class="distribution-person">
          <h4>人员分布</h4>
          <div ref="distribution"></div>
        </li>
        <li class="equipment-data">
          <h4>设备信息</h4>
          <div ref="equipment"></div>
        </li>
        <li class="alarm-data">
          <h4>报警信息</h4>
          <div class="alarm-content">
            <p>
              <span style="color:#f00">2020-06-05</span>
              <span style="color:#61a0a8">张三</span> 在
              <span style="color:#d48265">一监区厕所</span>发生
              <span style="color:#d48265">sos主动报警[危急]</span>
            </p>
            <p>
              <span style="color:#f00">2020-06-05</span>
              <span style="color:#61a0a8">张三</span> 在
              <span style="color:#d48265">一监区厕所</span>发生
              <span style="color:#d48265">sos主动报警[危急]</span>
            </p>
            <p>
              <span style="color:#f00">2020-06-05</span>
              <span style="color:#61a0a8">张三</span> 在
              <span style="color:#d48265">一监区厕所</span>发生
              <span style="color:#d48265">sos主动报警[危急]</span>
            </p>
            <p>
              <span style="color:#f00">2020-06-05</span>
              <span style="color:#61a0a8">张三</span> 在
              <span style="color:#d48265">一监区厕所</span>发生
              <span style="color:#d48265">sos主动报警[危急]</span>
            </p>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { Water } from "three/examples/jsm/objects/Water2.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js"

let echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/pie");
// 引入提示框和title组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      timer: null,
      renderer1: null,
      composer: null,
      linePos: [
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
      ],
      resolution:undefined,
      lineList:[],
    };
  },
  mounted() {
    this.resolution = new THREE.Vector2(this.$refs.container.offsetWidth, this.$refs.container.offsetHeight),
    this.initAlarm();
    this.initCall();
    this.initEquipment();
    this.init3d();
    this.animate();
    window.addEventListener("resize", this.onResize);
  },
  methods: {
    initAlarm() {
      let myChart = echarts.init(this.$refs.statistics);
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["紧急", "一般", "危急"]
        },
        series: [
          {
            name: "处理情况",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            label: {
              position: "inner"
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 679, name: "未处理 679" },
              { value: 1548, name: "已处理 1548" }
            ]
          },
          {
            name: "报警等级",
            type: "pie",
            radius: ["45%", "80%"],
            label: {
              position: "inner"
            },
            data: [
              { value: 310, name: "紧急 310" },
              { value: 234, name: "一般 234" },
              { value: 135, name: "危急 135" }
            ]
          }
        ]
      });
    },
    initCall() {
      let myChart = echarts.init(this.$refs.distribution);
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: "left",
          data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
        },
        series: [
          {
            name: "人员分布",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "一监区" },
              { value: 310, name: "一监区" },
              { value: 234, name: "一厂区" },
              { value: 135, name: "二厂区" },
              { value: 1548, name: "一监舍" }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      });
    },
    initEquipment() {
      let myChart = echarts.init(this.$refs.equipment);
      myChart.setOption({
        tooltip: {
          trigger: "item",
          formatter: "{a} <br/>{b}: {c} ({d}%)"
        },
        legend: {
          orient: "vertical",
          left: 10,
          data: ["基站", "摄像头", "标签"]
        },
        series: [
          {
            name: "设备状态",
            type: "pie",
            selectedMode: "single",
            radius: [0, "30%"],
            label: {
              position: "inner"
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 679, name: "良好 679" },
              { value: 20, name: "故障 10" }
            ]
          },
          {
            name: "设备数量",
            type: "pie",
            radius: ["45%", "80%"],
            label: {
              position: "inner"
            },
            data: [
              { value: 310, name: "基站 310" },
              { value: 234, name: "标签 234" },
              { value: 135, name: "摄像头 135" }
            ]
          }
        ]
      });
    },
    init3d() {
      console.log(THREE);
      let control;
      let width = this.$refs.container.offsetWidth,
        height = this.$refs.container.offsetHeight;
      this.scene = new THREE.Scene();
      let scene = this.scene;
      this.scene.add(new THREE.AmbientLight(0xffffff));

      this.camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 60000);
      this.camera.position.set(0, 600, 600);
      this.camera.lookAt(0, 0, 0);

      this.renderer = new THREE.WebGLRenderer({ antialias: true });
      this.renderer.setSize(width, height);
      this.renderer.setClearColor(0x00071d);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.setClearAlpha(0.5);
      this.renderer.shadowMap.enabled = true;
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
      textureLoader.load("/images/liti.png", (groundTexture)=> {
        textureLoader.load("/images/road.png", (road)=> {
          new MTLLoader()
            .setPath("/models/obj/city/")
            .load("city.mtl", (materials)=> {
              new OBJLoader()
                .setPath("/models/obj/city/")
                .setMaterials(materials)
                .load("city.obj", (object)=> {
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

                  this.callbackObj();
                });
            });
        });
      });

      this.$refs.container.appendChild(this.renderer.domElement);
      control = new OrbitControls(this.camera, this.renderer.domElement);
      control.minDistance = 1;
    },
    callbackObj() {
      let scene = this.scene;
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
          this.linePos.forEach((e, i) => {
            const meshLine = new Line2();
            meshLine.geometry.vertices = getLineGeo(e).vertices;
            console.log(getLineGeo(e))
            const line = new THREE.Mesh(
              meshLine.geometry,
              new 
              new LineMaterial({
                color: i % 2 === 0 ? "red" : "green",
                map: i % 2 === 0 ? texture : texture2,
                useMap: true,
                lineWidth: 10,
                resolution: this.resolution,
                dashArray: 0.8, // 破折号之间的长度和间距。(0 -无破折号)
                dashRatio: 0.4, // 定义可见和不可见之间的比率(0 -更可见，1 -更不可见)。
                dashOffset: 0,
                transparent: true,
                sizeAttenuation: 1, //使线宽不变，不管距离(1个单位是屏幕上的1px)(0 -衰减，1 -不衰减)
                side: THREE.DoubleSide,
                depthTest: false,
                blending: THREE.AdditiveBlending,
                near: this.camera.near,
                far: this.camera.far
              })
            );
            scene.add(line);
            line.position.y = 2;
            this.lineList.push(line);
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
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    animate() {
      this.timer = requestAnimationFrame(this.animate);
      this.render();
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
@hei: 3.4rem;
@pHeight: 2.6rem;

.index {
  color: #fff;
  font-size: 1.6rem;
  position: relative;
  h4 {
    height: @hei;
    line-height: @hei;
    text-indent: 0.6rem;
  }

  ul {
    display: flex;
    flex-direction: column;
    width: 30rem;
    li {
      width: 26rem;
      height: 26rem;
      margin: 0 auto;
      margin-top: 1rem;
      border: 1px solid #fff;
      & > div {
        height: calc(~"100% - @{hei}");
      }
    }
  }
  .left-bar {
    position: absolute;
    left: 0;
    top: 0;
    & > li {
      video {
        display: block;
        width: 90%;
        height: 98%;
        margin: 0 auto;
      }
    }
    .call-content {
      overflow: hidden;
      p {
        height: @pHeight;
        line-height: @pHeight;
        text-indent: 1rem;
      }
    }
  }
  .right-bar {
    position: absolute;
    right: 0;
    top: 0;
    .alarm-content {
      overflow: hidden;
      p {
        height: 4rem;
        text-indent: 1rem;
        margin-top: 0.4rem;
        margin-left: 0.4rem;
      }
    }
  }
}
</style>