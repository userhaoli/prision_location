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
          <span class="icon iconfont">&#xe600;</span>
        </div>
        <ul class="nav-items">
          <li @click="linkPage(0)" :class="classArr[0]">
            <span class="icon iconfont">&#xe61d;</span>
            <p>主页</p>
          </li>
          <li @click="linkPage(1)" :class="classArr[1]">
            <span class="icon iconfont">&#xe61e;</span>
            <p>轨迹回放</p>
          </li>
          <li @click="linkPage(2)" :class="classArr[2]">
            <span class="icon iconfont">&#xe638;</span>
            <p>电子考勤</p>
          </li>
          <li @click="linkPage(3)" :class="classArr[3]">
            <span class="icon iconfont">&#xe61a;</span>
            <p>电子围栏</p>
          </li>
          <li @click="linkPage(4)" :class="classArr[4]">
            <span class="icon iconfont">&#xe62e;</span>
            <p class="name">数据分析</p>
          </li>
          <li @click="linkPage(5)" :class="classArr[5]">
            <span class="icon iconfont">&#xe63d;</span>
            <p class="name">警力部署</p>
          </li>
          <li @click="linkPage(6)" :class="classArr[6]">
            <span class="icon iconfont">&#xe603;</span>
            <p class="name">设备管理</p>
          </li>
          <li @click="linkPage(7)" :class="classArr[7]">
            <span class="icon iconfont">&#xe624;</span>
            <p class="name">报警信息</p>
          </li>
          <li @click="linkPage(8)" :class="classArr[8]">
            <span class="icon iconfont">&#xe6d8;</span>
            <p class="name">人员信息</p>
          </li>
          <li @click="linkPage(9)" :class="classArr[9]">
            <span class="icon iconfont">&#xe60d;</span>
            <p class="name">互监组</p>
          </li>
          <li @click="linkPage(10)" :class="classArr[10]">
            <span class="icon iconfont">&#xe7e8;</span>
            <p class="name">摄像头</p>
          </li>
          <li @click="linkPage(11)" :class="classArr[11]">
            <span class="icon iconfont">&#xe627;</span>
            <p class="name">系统设置</p>
          </li>
        </ul>
        <div class="nav-check">
          <span class="icon iconfont">&#xe602;</span>
        </div>
      </div>
    </div>
    <!-- 摄像头右键操作面板 -->
    <div class="camera-menu" v-show="cameraMenu" ref="cameraMenu">
      <div>
        <button @click="viewVideo" @touchstart.stop.prevent="viewVideo">查看实时视频</button>
      </div>
      <div>
        <!-- 282828 -->
        <button
          @click="showEquipPanel({flag:'camera',id:cameraid})"
          @touchstart.stop.prevent="showEquipPanel({flag:'camera',id:cameraid})"
        >查看详情</button>
      </div>
    </div>
    <!-- 左侧信息栏 -->
    <div class="aside-left">
      <div class="first-item">一监区 一楼 302监舍</div>
      <div class="second-item"></div>
      <div class="third-item"></div>
      <div class="fourth-item"></div>
      <div class="fifth-item"></div>
    </div>
    <!-- 右侧报警处理 -->
    <div class="aside-right">
      <transition name="slide-fade">
        <handle v-if="rightFlag" @getDetail="showDetail"></handle>
      </transition>
      <div class="title" @click="rightBar" @touchstart.stop.prevent="rightBar">
        <p>警报处理</p>
      </div>
    </div>
    <!-- 小地图 -->
    <transition name="slide-fade">
      <div class="little-map" v-show="!mapHidden" ref="littleMap">
        <div class="map-nav">
          <div calss="map-name">小地图</div>
        </div>
        <div class="container">
          <canvas ref="littleCanvas" id="littleCanvas" width="280" height="140">
            <P>你的浏览器不支持"canvas"!请升级浏览器!</P>
          </canvas>
          <canvas id="innerCanvas" ref="innerCanvas" width="280" height="140"></canvas>
        </div>
      </div>
    </transition>
    <!-- 报警信息 -->
    <div class="alarm-item" v-show="true">2020-06-17 18:12:51 <span style="color:#f00">[危急]</span>  一监区 32号监舍发生越界报警越界报...</div>
  </div>
</template>

<script>
const Handle = () => import("@/views/index/Handle.vue");

import getBuffer from "@/utils/buffer_canvas.js";
import Person from "@/utils/person.js";
import mapScale from "@/utils/map_scale.js";
import mapDrag from "@/utils/map_drag.js";
import interval from "@/utils/interval.js";
import { getAllLabel, getCameraData } from "@/apis/interfance.js";
export default {
  components: {
    Handle
  },
  data() {
    return {
      canvas: null,
      ctx: null,
      buffer: null,
      mapImg: null, //地图
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
      trackBackFlag: false, //轨迹回放标识
      mousePos: null,
      cameraMenu: false, //右键摄像头菜单栏
      pathArr: [
        "/home",
        "/home/tracklist",
        "/attendance",
        "/home/defencelist",
        "/home/analysis",
        "/policelocation",
        "/home/equipmentlist",
        "/home/alarmlist",
        "/home/personlist",
        "/home/hjzlist",
        "/home/cameralist",
        "/home/set"
      ],
      classArr: [],
      rightFlag: false,
      mapHidden: false
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
      this.cameraMenu = false;
      if (e.target !== canvas) return;
      this.isDrag = true;
      this.mousePos = {
        x: e.clientX,
        y: e.clientY
      };
    });
    window.addEventListener("mousemove", this.moveHandler);
    window.addEventListener("mouseup", this.upHandler);
    //摄像头面板
    canvas.addEventListener("contextmenu", e => {
      e.preventDefault();
      if (this.$store.state.isShowCamera === false) return;
      this.$store.state.camera.forEach(value => {
        if (value.mapid === this.$store.state.mapid) {
          let pos = this.imageToCanvas([value.startX, value.startY]);
          let minX = pos[0] - (value.width * this.scale) / 2,
            maxX = pos[0] + (value.width * this.scale) / 2,
            // minY = pos[1] - value.height,
            minY = pos[1] - value.height * this.scale,
            maxY = pos[1];

          if (
            e.clientX >= minX &&
            e.clientX <= maxX &&
            e.clientY >= minY &&
            e.clientY <= maxY
          ) {
            let el = this.$refs.cameraMenu;
            el.style.left = e.clientX + "px";
            el.style.top = e.clientY + "px";
            this.cameraMenu = true;
            this.cameraid = value.id;
          }
        }
      });
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
        defenceImgArr: this.$store.state.defenceImgArr,
        groupPointArr: null,
        trackBackPerson: null, //轨迹回放人物实例
        trackBackFlag: false, //轨迹回放标识
        trackBackArr: null, //
        forwardArr: null, //
        resetFlag: false,
        stopFlag: false,
        imgStatus: {
          isShowPerson: true,
          isShowStation: this.$store.state.isShowStation,
          isShowCamera: this.$store.state.isShowCamera,
          isShowTrack: this.$store.state.isShowTrack,
          isShowDefenceImg: this.$store.state.isShowDefenceImg,
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
    //页面大小变化
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
    //鼠标移动
    moveHandler(e) {
      mapDrag.call(this, e, getBuffer);
    },
    upHandler() {
      this.isfollowing = true;
      this.litMapflag = false;
      this.isDrag = false;
      this.littleDrag = false;
      this.mousePos = {
        x: undefined,
        y: undefined
      };
    },
    linkPage(index) {
      let path = this.pathArr[index];
      if (this.$route.path === path) {
        return;
      }
      this.$router.push(path);
    },
    //观看视频
    viewVideo() {
      this.popMonitorVideo(this.cameraid);
      this.cameraMenu = false;
    },
    //调取实时监控
    popMonitorVideo(id) {
      getCameraData(id)
        .then(data => {
          let vId = data.id;
          let name = data.camera_name;
          let player = data.id;
          let rtsp = data.url;
          let active = false;
          let newMonitorList = [
            { id: vId, name: name, rtsp: rtsp, player: player, active: active }
          ]; //要调取的监控

          this.$store.commit("changeNewMonitorList", newMonitorList);
          this.$store.state.monitorListFlag = true;
        })
        .catch(() => {
          this.$message.error("调取监控失败");
        });
    },
    rightBar() {
      this.rightFlag = !this.rightFlag;
    },
    //显示报警详情页
    showDetail() {
      this.$router.push("/home/detail");
    }
  },
  beforeDestroy() {
    this.stopAnimate = true;
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.moveHandler);
    window.removeEventListener("mouseup", this.upHandler);
  },
  watch: {
    $route: {
      handler(val) {
        this.classArr = [];
        if (val.name === "Main" || val.name === "Home") {
          this.popupShow = false;
          this.classArr[0] = "active";
        } else {
          this.popupShow = true;
          this.pathArr.forEach((value, index) => {
            if (value === val.path) {
              this.classArr[index] = "active";
            }
          });
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
  position: relative;
  .canvas {
    width: 100%;
    height: 100%;
  }
  .nav-container {
    position: fixed;
    bottom: 2rem;
    left: 0rem;
    width: 100%;
    font-size: 1.4rem;
    .main-nav {
      width: 124rem;
      height: 8rem;
      background: url("./UI/nav.png");
      display: flex;
      align-items: center;
      justify-content: space-around;
      color: rgba(91, 169, 233, 0.8);
      margin: 0 auto;
      border-radius: 4px;
      .nav-check {
        .icon {
          font-size: 3rem;
          opacity: 0.8;
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
        .active {
          color: #33eaff;
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
  //摄像头菜单
  .camera-menu {
    position: fixed;
    left: 50%;
    top: 50%;
    background: rgba(16, 30, 51, 1);
    opacity: 0.85;
    border-radius: 0px 0.3rem 0.3rem 0px;
    box-shadow: 0.4rem 0.3rem 1rem 0px rgba(4, 0, 0, 0.6);
    & > div {
      // padding: 5px 5px;
      border-bottom: 1px solid rgba(178, 223, 255, 0.2);
      button {
        background: 0;
        border: 0;
        color: #fff;
        font-size: 1.4rem;
        padding: 0.6rem 0.5rem;
        width: 100%;
        &:hover {
          background: rgba(0, 0, 0, 0.5);
          color: #86d0ff;
        }
      }
    }
  }
  // 左侧栏
  .aside-left {
    width: 27rem;
    height: 54rem;
    // background: rgba(8, 29, 79, 1);
    background: url("./UI/left_color.png");
    // border: 1px solid rgba(30, 159, 255, 1);
    box-shadow: 0px 9px 21px 0px rgba(12, 7, 4, 0.35);
    opacity: 0.95;
    position: absolute;
    top: 3.2rem;
    left: 1rem;
    .first-item {
      height: 7rem;
    }
    .second-item {
      height: 7.9rem;
    }
    .third-item {
      height: 8.2rem;
    }
    .fourth-item {
      height: 14.3rem;
    }
    .fifth-item {
      height: 16rem;
    }
  }
  //右侧边栏
  .aside-right {
    height: calc(~"100% - 5.5rem");
    position: fixed;
    right: 0;
    top: 5.5rem;
    z-index: 10;
    .title {
      width: 2.7rem;
      height: 20rem;
      font-size: 1.4rem;
      color: rgba(255, 255, 255, 1);
      text-align: center;
      display: flex;
      align-items: center;
      position: absolute;
      left: -2.6rem;
      top: calc(~"50% - 10rem");
      background: url(./UI/right.png) no-repeat;
      background-position: center;
      p {
        text-align: center;
        cursor: pointer;
      }
    }
  }
  //小地图  77777
  .little-map {
    position: fixed;
    left: 1rem;
    bottom: 1rem;
    border: 1px solid rgba(178, 223, 255, 0.3);
    color: rgba(255, 255, 255, 1);
    font-size: 1.3rem;
    text-align: center;
    // position: relative;
    .map-nav {
      display: flex;
      background: rgba(42, 72, 137, 1);
      line-height: 3rem;
      div {
        color: #86d0ff;
        margin-left: 0.8rem;
        margin-right: 3rem;
      }
      ul {
        flex-grow: 5;
        display: flex;
        justify-content: space-around;
        align-items: center;
        li {
          cursor: pointer;
        }
        & > .line {
          width: 1px;
          height: 1rem;
          background: #ffffff;
          opacity: 0.2;
          margin: 0 0.4rem;
        }
      }
      span {
        padding: 0.2rem 0.3rem;
        box-sizing: border-box;
      }
      span:hover {
        // color: #86d0ff;
        box-sizing: border-box;
        background: rgba(0, 0, 0, 0.3);
        // border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 0.3rem;
      }
    }
    .container {
      position: relative;
      background: rgba(0, 31, 98, 0.85);
      box-sizing: border-box;
      // background:#fff;
    }
    #littleCanvas {
      cursor: pointer;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      margin: auto;
    }
    #innerCanvas {
      margin: 2rem 0;
      // background: url(./UI/min_map_back.png) no-repeat;
      background-repeat: no-repeat;
      background-size: 100% 100%;
    }
    .switch-btn {
      position: relative;
      //地图切换
      .map-switch {
        width: 32.3rem;
        box-sizing: border-box;
        overflow: auto;
        display: flex;
        justify-content: flex-start;
        position: absolute;
        bottom: 3rem;
        left: -23rem;

        &::-webkit-scrollbar {
          width: 20%;
          height: 1rem;
        }

        &::-webkit-scrollbar-thumb {
          background-color: #3b68b6;
          border-radius: 0.4rem;
        }

        li {
          box-sizing: border-box;
          width: 8rem;
          & > div {
            width: 7rem;
            height: 6rem;
            border: 1px solid rgba(178, 223, 255, 0.3);
            margin-top: 6px;
            border-radius: 3px;
            padding: 4px;
            box-sizing: border-box;
            background: rgba(16, 30, 51, 0.85);
            &:hover {
              box-shadow: 0px 0px 0.4rem rgb(61, 14, 190);
            }
          }
          .active {
            border: 2px solid rgb(150, 35, 40);
            box-shadow: 0px 0px 0.4rem rgba(33, 71, 128, 1);
          }
        }
        img {
          width: 100%;
          height: 100%;
        }
      }
      &:hover > .map-switch {
        top: -8.2rem;
        display: flex;
      }
    }
    .set {
      position: relative;
      .set-display {
        font-size: 1.2rem;
        padding-top: 0.6rem;
        width: 10rem;
        position: absolute;
        bottom: 3rem;
        left: -2rem;
        display: block;
        flex-direction: column;
        background: rgba(27, 63, 132, 0.9);
        padding-left: 0.8rem;
        line-height: 3rem;
        li {
          display: flex;
          height: 25px;
          align-items: center;
          .el-checkbox {
            color: #fff;
          }
        }
      }
      &:hover .set-display {
        display: block;
      }
    }
  }
  //报警信息
  .alarm-item {
    position: absolute;
    top: 5rem;
    left: calc(~"50% - 37rem");
    width: 74rem;
    height: 5rem;
    line-height: 5rem;
    font-size: 1.6rem;
    background: url("./UI/alarm.png") no-repeat;
    background-size: 100% 100%;
    text-align: center;
  }
}

//过渡动画
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.6s ease;
}
.slide-fade-leave-active {
  transition: all 0.6s cubic-bezier(1, 0.5, 0.8, 1);
}
</style>

