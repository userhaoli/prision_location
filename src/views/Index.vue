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
              <span style="margin-right:2rem">一监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
            </p>
            <p>
              <span style="margin-right:2rem">二监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
            </p>
            <p>
              <span style="margin-right:2rem">三监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
            </p>
            <p>
              <span style="margin-right:2rem">四监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
            </p>
            <p>
              <span style="margin-right:2rem">五监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
            </p>
            <p>
              <span style="margin-right:2rem">六监区:</span> 应到
              <span style="color:#A3C5FF;margin-right:2.5rem">100</span> 实到
              <span style="color:#A3C5FF">95</span>
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
import { init3d, animate, onResize } from "@/utils/three/index.js";

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
      lineList: []
    };
  },
  mounted() {
    this.initAlarm();
    this.initCall();
    this.initEquipment();
    init3d.call(this);
    animate.call(this);
    window.addEventListener("resize", onResize.bind(this));
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
          data: ["紧急", "一般", "危急"],
          textStyle: { color: "#859EED" }
        },
        series: [
          {
            name: "报警等级",
            type: "pie",
            radius: ["30%", "60%"],
            label: {
              position: "outside",
              color: "#859EED"
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "#859EED"
              }
            },
            data: [
              {
                value: 310,
                name: "已处理 310",
                itemStyle: { color: "#3252BA" },
                labelLine: { length: 10, length2: 10 }
              },
              {
                value: 40,
                name: "未处理 10",
                itemStyle: {
                  color: {
                    type: "radial",
                    x: 1,
                    y: 1,
                    r: 3,
                    colorStops: [
                      {
                        offset: 0,
                        color: "rgba(163,185,255,1)" // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: "rgba(50,82,186,1)" // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                },
                labelLine: { length: 10, length2: 10 }
              }
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
          left: "left"
        },
        series: [
          {
            name: "人员分布",
            type: "pie",
            radius: "60%",
            center: ["50%", "50%"],
            data: [
              { value: 335, name: "一监区",label:{color:"#EFBF6F"}, itemStyle: { color: "#EFBF6F" }, },
              { value: 310, name: "一监区",label:{color:"#849DEC"}, itemStyle: { color: "#849DEC" },},
              { value: 234, name: "一厂区",label:{color:"#E65F7F"}, itemStyle: { color: "#E65F7F" } },
              { value: 135, name: "二厂区",label:{color:"#3252BA"}, itemStyle: { color: "#3252BA"} , },
              // { value: 1548, name: "一监舍",label:{color:"#EFBF6F"} }
            ],
            labelLine: { length: 6, length2: 6 },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "#859EED"
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
@hei: 3.8rem;
@pHeight: 2.6rem;

.index {
  color: #fff;
  font-size: 1.6rem;
  position: relative;
  h4 {
    height: @hei;
    line-height: @hei;
    text-indent: 0.6rem;
    font-weight: 400;
    font-size: 2rem;
    color: rgba(61, 209, 255, 1);
    padding: 0 2rem;
    box-sizing: border-box;
  }

  ul {
    display: flex;
    flex-direction: column;
    width: 31rem;
    li {
      font-family: Microsoft YaHei;
      width: 30rem;
      height: 29rem;
      margin: 0 auto;
      margin-top: 1rem;
      background: url("./UI/index_box.png") no-repeat;
      background-position: center;
      background-size: 100% 100%;
      // padding: 0 2rem;
      box-sizing: border-box;
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
    .monitor-key {
      background: url("./UI/important_monitor.png") no-repeat;
      background-position: center;
      background-size: 100% 100%;
    }
    .call-content {
      overflow: hidden;
      padding: 0 2rem;
      box-sizing: border-box;
      p {
        height: 3.6rem;
        line-height: 3.6rem;
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
      padding: 0 2rem;
      box-sizing: border-box;
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