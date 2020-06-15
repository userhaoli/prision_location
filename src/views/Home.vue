<template>
  <div class="home root-element">
    <canvas class="canvas" ref="canvas"></canvas>
    <!-- 弹窗 -->
    <div class="popup" v-show="popupShow">
      <router-view></router-view>
    </div>
    <!-- 导航栏 -->
    <div class="nav-container">
      <div class="main-nav">
        <div class="nav-check">
          <span class="icon iconfont">&#xe61c;</span>
        </div>
        <ul class="nav-items">
          <li @click="linkPage(0)">
            <span class="icon iconfont">&#xe61d;</span>
            <p>主页</p>
          </li>
          <li @click="linkPage(1)">
            <span class="icon iconfont">&#xe61e;</span>
            <p>轨迹回放</p>
          </li>
          <li @click="linkPage(2)">
            <span class="icon iconfont">&#xe638;</span>
            <p>电子考勤</p>
          </li>
          <li @click="linkPage(3)">
            <span class="icon iconfont">&#xe61a;</span>
            <p>电子围栏</p>
          </li>
          <li @click="linkPage(4)">
            <span class="icon iconfont">&#xe62e;</span>
            <p class="name">数据分析</p>
          </li>
          <li @click="linkPage(5)">
            <span class="icon iconfont">&#xe63d;</span>
            <p class="name">警力部署</p>
          </li>
          <li @click="linkPage(6)">
            <span class="icon iconfont">&#xe603;</span>
            <p class="name">设备管理</p>
          </li>
          <li @click="linkPage(7)">
            <span class="icon iconfont">&#xe624;</span>
            <p class="name">报警信息</p>
          </li>
          <li @click="linkPage(8)">
            <span class="icon iconfont">&#xe6d8;</span>
            <p class="name">人员信息</p>
          </li>
          <li @click="linkPage(9)">
            <span class="icon iconfont">&#xe60d;</span>
            <p class="name">互监组</p>
          </li>
          <li @click="linkPage(10)">
            <span class="icon iconfont">&#xe627;</span>
            <p class="name">系统设置</p>
          </li>
        </ul>
        <div class="nav-check">
          <span class="icon iconfont">&#xe61b;</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getBuffer from "@/utils/buffer_canvas.js";
import Person from "@/utils/person.js";
import mapScale from "@/utils/map_scale.js";
import mapDrag from "@/utils/map_drag.js";
import interval from "@/utils/interval.js";
import { getAllLabel } from "@/apis/interfance.js";
export default {
  data() {
    return {
      canvas: null,
      ctx: null,
      buffer: null,
      mapImg: null,
      sx: 0,
      sy: 0,
      scale: 1.0,
      minScale: 0.6,
      isDrag: false, //地图拖动标识
      popupShow: false, //弹框显示标识
      personTimer: null, //获取人员数据计时器
      stopAnimate: false, //停止绘制图形标识
      time: 100,
      pos: [],
      trackBackFlag: false
    };
  },
  mounted() {
    let canvas = this.$refs.canvas;
    this.canvas = this.$refs.canvas;
    this.ctx = this.canvas.getContext("2d");
    this.mapImg = new Image();
    this.mapImg.src = "/images/TianfuSquareMetroLine1.png";
    this.mapImg.onload = () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 80;
      this.minScale = window.innerWidth / this.mapImg.width;
      this.scale = this.minScale;
      this.sx = this.getOffset(
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ).x;
      this.sy = this.getOffset(
        {
          x: 0,
          y: 80
        },
        {
          x: 0,
          y: 0
        }
      ).y;
      this.buffer = this.getBufferData(
        {
          isShowTrack: null,
          isShowDefence: false
        },
        null
      );
      this.drawImage();
    };
    this.imgInit();
    getAllLabel().then(data => {
      data = data.results;
      let obj = {};
      data.forEach(value => {
        obj[value.id] = value.person;
      });
      this.$store.state.personList = obj;
      this.personTimer = interval.call(this, Person, this.$store.state.mapid);
    });
    //地图缩放
    canvas.addEventListener(
      "mousewheel",
      e => {
        mapScale.call(this, e, getBuffer);
        // littleMapFollow.call(this);
      },
      { passive: false }
    );
    //地图拖动
    canvas.addEventListener("mousedown", e => {
      // this.cameraMenu = false;
      if (e.target !== canvas) return;
      this.isDrag = true;
      this.mousePos = {
        x: e.clientX,
        y: e.clientY
      };
    });
    window.addEventListener("mousemove", e => {
      mapDrag.call(this, e, getBuffer);
      // littleMapFollow.call(this);
    });
    window.addEventListener("mouseup", () => {
      this.isfollowing = true;
      this.litMapflag = false;
      this.isDrag = false;
      this.littleDrag = false;
      this.mousePos = {
        x: undefined,
        y: undefined
      };
    });
    window.addEventListener("resize", this.onResize);
    this.animate();
  },
  methods: {
    animate() {
      let timer = setTimeout(() => {
        this.pos = [];
        this.time = 100;
        this.$store.state.persons.forEach(value => {
          let steps = value.steps;
          if (steps.length > 0) {
            value.update(
              steps[0].pos[0],
              steps[0].pos[1],
              steps[0].direction,
              this.scale,
              this.sx,
              this.sy,
              steps[0].map_id
            );
            // if (value.isFirst && value.follow) {
            //   this.popMonitorVideo(steps[0].cameras[0]);
            //   value.isFirst = false;
            // }
            if (steps.length > 1) {
              (value.track || value.follow) &&
                value.trackArr.push([
                  steps[0].pos[0],
                  steps[0].pos[1],
                  steps[0].map_id
                ]);
              // if (value.follow && steps[0].cameras[0] !== steps[1].cameras[0]) {
              //   this.popMonitorVideo(steps[1].cameras[0]);
              // }
              steps.shift();
            }
            if (steps.length > 40) {
              let time = 30;
              this.time = this.time < time ? this.time : time;
            } else if (steps.length > 30) {
              let time = 40;
              this.time = this.time < time ? this.time : time;
            } else if (steps.length > 20) {
              let time = 50;
              this.time = this.time < time ? this.time : time;
            } else if (steps.length > 10) {
              let time = 60;
              this.time = this.time < time ? this.time : time;
            }
            steps[0].map_id === this.$store.state.mapid &&
              this.pos.push([
                steps[0].pos[0],
                steps[0].pos[1],
                steps[0].map_id
              ]);
          }
          // if (value.follow) {
          //   personFollow.call(this, value.startX, value.startY, value.follow);
          //   value.mapid !== this.$store.state.mapid &&
          //     this.changeMap(undefined, value.mapid);
          // }
        });
        if (this.trackBackFlag === false) {
          this.buffer = this.getBufferData(
            {
              isShowTrack: this.isShowTrack,
              isShowDefence: false
            },
            this.$store.state.chartArr
          );
          this.drawImage();
        }
        // littleMapFollow.call(this);
        // this.chartFlag && this.drawHeatChart(this.chartFlag);
        clearTimeout(timer);
        // console.log(+new Date() - time);
        if (this.stopAnimate == false) {
          this.animate();
          console.log("111");
        } else {
          return;
        }
      }, this.time);
    },
    //获取缓冲画布
    getBufferData(flag, point) {
      return getBuffer({
        width: this.canvas.width,
        height: this.canvas.height,
        bgImg: this.mapImg,
        cla: Person,
        sx: this.sx,
        sy: this.sy,
        person: this.$store.state.persons,
        baseStation: null,
        camera: null,
        scale: this.scale,
        mapid: 3,
        flag: flag,
        point: point,
        defenceImgArr: null,
        groupPointArr: null,
        trackBackPerson: null, //轨迹回放人物实例
        trackBackFlag: false,
        trackBackArr: null,
        forwardArr: null,
        resetFlag: false,
        stopFlag: false,
        imgStatus: {
          isShowPerson: true,
          isShowStation: false,
          isShowCamera: false,
          isShowTrack: false,
          isShowDefenceImg: false,
          waterFlag: true
        }
      });
    },
    drawImage() {
      let { ctx, canvas, buffer } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0);
    },
    //图片初始化
    imgInit() {
      let staff_unchecked = [];

      let police_unchecked = new Image();
      police_unchecked.src = "/images/police_unchecked.png";

      for (let i = 0; i < 4; i++) {
        staff_unchecked[i] = new Image();
        staff_unchecked[i].src = "/images/staff_unchecked" + i + ".png";
      }
      Person.prototype.waterShape = {
        staff_unchecked,
        police_unchecked
      };
    },
    //偏移量计算
    getOffset(canvasPos, imgPos) {
      return {
        x: canvasPos.x - imgPos.x * this.scale,
        y: canvasPos.y - imgPos.y * this.scale
      };
    },
    onResize() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight - 80;
      this.minScale = window.innerWidth / this.mapImg.width;
      this.scale = this.minScale;
      this.sx = this.getOffset(
        {
          x: 0,
          y: 0
        },
        {
          x: 0,
          y: 0
        }
      ).x;
      this.sy = this.getOffset(
        {
          x: 0,
          y: 80
        },
        {
          x: 0,
          y: 0
        }
      ).y;
      this.buffer = this.getBufferData(
        {
          isShowTrack: null,
          isShowDefence: false
        },
        null
      );
      this.drawImage();
    },
    linkPage(index) {
      let path;
      switch (index) {
        case 0:
          path = "/home";
          break;
        case 1:
          path = "/home/tracklist";
          break;
        case 2:
          path = "/attendance";
          break;
        case 3:
          path = "/home/defencelist";
          break;
        case 4:
          path = "/home/tracklist";
          break;
        case 5:
          path = "/policelocation";
          break;
        case 6:
          path = "/home/equipmentlist";
          break;
        case 7:
          path = "/home/alarmlist";
          break;
        case 8:
          path = "/home/personlist";
          break;
        case 9:
          path = "/home/hjzlist";
          break;
        case 10:
          path = "/home/set";
          break;
        default:
          break;
      }
      if (this.$route.path === path) {
        return;
      }
      this.$router.push(path);
    }
  },
  beforeDestroy() {
    this.stopAnimate = true;
    window.removeEventListener("resize", this.onResize);
  },
  watch: {
    $route: {
      handler(val) {
        if (val.name === "Main" || val.name === "Home") {
          this.popupShow = false;
        } else {
          this.popupShow = true;
        }
      },
      immediate: true,
      deep: true
    }
  }
};
</script>

<style lang="less">
.home {
  .canvas {
    width: 100%;
    height: 100%;
  }
  .nav-container {
    position: fixed;
    bottom: 0rem;
    left: 0rem;
    width: 100%;
    font-size: 1.4rem;
    // background: rgba(36, 48, 87, 0.9);
    .main-nav {
      width: 100rem;
      display: flex;
      align-items: center;
      justify-content: space-around;
      // color: #33eaff;
      color: rgba(91, 169, 233, 0.8);
      margin: 0 auto;
      border-radius: 4px;
      .nav-check {
        .icon {
          font-size: 5rem;
        }
        &:hover {
          color: #33eaff;
        }
      }
      .nav-items {
        display: flex;
        width: 80rem;
        text-align: center;
        li {
          width: 10rem;
          &:hover {
            color: #33eaff;
          }
        }
      }
      .icon {
        font-size: 2.4rem;
      }
    }
  }

  .popup {
    position: fixed;
    top: 8rem;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>

