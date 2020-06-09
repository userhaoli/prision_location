<template>
  <div class="home root-element">
    <canvas class="canvas" ref="canvas"></canvas>
    <div class="main-nav">
      <button>人员信息</button>
      <button>电子围栏</button>
      <button>设备管理</button>
    </div>
    <div class="popup" v-show="popupShow">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import getBuffer from "@/utils/buffer_canvas.js";
import Person from "@/utils/person.js";
import mapScale from "@/utils/map_scale.js";
import mapDrag from "@/utils/map_drag.js";

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
      popupShow: false //弹框显示标识
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
  },
  methods: {
    //获取缓冲画布
    getBufferData(flag, point) {
      return getBuffer({
        width: this.canvas.width,
        height: this.canvas.height,
        bgImg: this.mapImg,
        cla: Person,
        sx: this.sx,
        sy: this.sy,
        person: null,
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
          isShowPerson: false,
          isShowStation: false,
          isShowCamera: false,
          isShowTrack: false,
          isShowDefenceImg: false,
          waterFlag: false
        }
      });
    },
    drawImage() {
      let { ctx, canvas, buffer } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0);
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
    }
  },
  beforeDestroy() {},
  watch: {
    // $route(to, from) {
    //   console.log(to.path);
    //   console.log(from.path);
    // }
    $route: {
      handler(val) {
        console.log(val)
        if(val.name === "Main" || val.name === "Home"){
          this.popupShow = false;
        }else{
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
  .main-nav {
    position: fixed;
    top: 100px;
    left: 100px;
    button {
      color: #ffffff;
    }
  }
  .popup {
    position:fixed;
    top:8rem;
    left:0;
    width: 100%;
    height: 100%;
  }
}
</style>

