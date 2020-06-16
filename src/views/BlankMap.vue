<template>
  <div class="root-element blank-map">
    <canvas ref="canvas"></canvas>
    <!-- 绘制区域选择栏  -->
    <ul class="context-menu" ref="context_menu" v-show="isDrawDefence">
      <li
        @click="checkLineStyle('line')"
        @touchstart.stop.prevent="checkLineStyle('line')"
        :class="isBeginDraw ? 'active' : ''"
      >
        <span class="icon iconfont">&#xe653;</span> 绘制
      </li>
      <li @click="checkLineStyle('back')" @touchstart.stop.prevent="checkLineStyle('back')">
        <span class="icon iconfont">&#xe620;</span> 重新绘制
      </li>
      <li @click="checkLineStyle('cancel')" @touchstart.stop.prevent="checkLineStyle('cancel')">
        <span class="icon iconfont">&#xe61f;</span> 取消
      </li>
      <li @click="checkLineStyle('confirm')" @touchstart.stop.prevent="checkLineStyle('confirm')">
        <span class="icon iconfont">&#xe606;</span> 完成
      </li>
    </ul>
  </div>
</template>

<script>
import getBuffer from "@/utils/buffer_canvas.js";
import mapScale from "@/utils/map_scale.js";
import mapDrag from "@/utils/map_drag.js";
import Person from "@/utils/person.js";

export default {
  data() {
    return {
      mousePos: null,
      isDrag: false,
      isDrawDefence: true,
      isBeginDraw: true,
      clickPoint: [],
      timer: null,
      isShowTrack: true
    };
  },
  mounted() {
    console.log(this.$route.params.oper);
    if (this.$route.params.oper !== "fence") {
      this.isDrawDefence = false;
      this.isBeginDraw = false;
    }
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
      if (e.target !== canvas) return;
      this.isDrag = true;
      this.mousePos = {
        x: e.clientX,
        y: e.clientY
      };
    });
    window.addEventListener("mousemove", this.moveHandler);
    window.addEventListener("mouseup", this.upHandler);
    window.addEventListener("resize", this.onResize);

    //绘制围栏
    canvas.addEventListener("mousedown", e => {
      if (this.isDrawDefence === false || this.isBeginDraw === false) return;
      this.isDown = true;
      if (this.$store.state.chartArr.length === 0) {
        this.$store.state.chartArr.push(this.clickPoint);
      }
      if (this.$store.state.chartArr.length > 1) {
        this.$store.state.chartArr = [];
        this.$store.state.chartArr.push(this.clickPoint);
      }
      //99999
      this.clickPoint.splice(
        this.pointLen,
        1,
        this.canvasToImage([e.clientX, e.clientY])
      ); //采集的是图像上的点
      this.pointLen = this.clickPoint.length;
      this.drawImage();
    });
    canvas.addEventListener("mousemove", e => {
      if (
        this.isDrawDefence === false ||
        this.isBeginDraw === false ||
        this.isDown === false
      )
        return;
      this.clickPoint.splice(
        this.pointLen,
        1,
        this.canvasToImage([e.clientX, e.clientY])
      ); //采集的是图像上的点
    });
    canvas.addEventListener("contextmenu", e => {
      e.preventDefault();
      this.isDown = false;
      this.order = "line";
      if (this.clickPoint.length < 3) return;
      this.clickPoint.splice(this.pointLen - 1, 2, this.clickPoint[0]);
      this.clickPoint = [];
    });
    this.animate();
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
    //偏移量计算
    getOffset(canvasPos, imgPos) {
      return {
        x: canvasPos.x - imgPos.x * this.scale,
        y: canvasPos.y - imgPos.y * this.scale
      };
    },
    drawImage() {
      let { ctx, canvas, buffer } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(buffer, 0, 0);
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
    //选择围栏操作
    checkLineStyle(order) {
      this.order = order;
      switch (order) {
        case "line":
          this.isBeginDraw = !this.isBeginDraw;
          break;
        case "back":
          this.clickPoint = [];
          this.$store.state.chartArr = [];
          this.isDown = false;
          break;
        case "cancel":
          this.clickPoint = [];
          this.$store.state.chartArr = [];
          this.isDown = false;
          this.isBeginDraw = false;
          this.$store.state.chartArr = [];
          this.$router.back();
          break;
        case "confirm":
          this.isDown = false;
          this.order = "line";
          if (
            !this.$store.state.chartArr[0] ||
            this.$store.state.chartArr[0].length < 3
          )
            return;
          if (this.$store.state.isiPad) {
            this.$store.state.chartArr[0].push(
              this.$store.state.chartArr[0][0]
            );
          } else {
            this.$store.state.chartArr[0].splice(
              this.$store.state.chartArr[0].length - 1,
              1,
              this.$store.state.chartArr[0][0]
            );
          }
          this.clickPoint = [];
          this.$store.state.defenceActive = 5; // lfq
          this.$router.back();
          break;
        default:
          break;
      }
    },
    canvasToImage(pos) {
      return [
        (pos[0] - this.sx) / this.scale,
        (pos[1] -
          this.sy -
          8 * parseInt(document.documentElement.style.fontSize)) /
          this.scale
      ];
    },
    animate() {
      this.timer = requestAnimationFrame(this.animate);
      this.buffer = this.getBufferData(
        {
          isShowTrack: this.isShowTrack,
          isShowDefence: true
        },
        this.$store.state.chartArr
      );
      this.drawImage();
    }
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("mousemove", this.moveHandler);
    window.removeEventListener("mouseup", this.upHandler);
    cancelAnimationFrame(this.animate);
  }
};
</script>

<style lang="less">
.blank-map {
  position: relative;
  //绘制围栏菜单栏
  .context-menu {
    position: absolute;
    left: 0;
    top: 2rem;
    cursor: pointer;
    background: rgba(27, 63, 132, 1);
    box-shadow: 1px 1px 1rem 0px rgba(4, 0, 0, 0.8);
    border-radius: 0.3rem;
    color: #fff;
    font-size: 1.4rem;
    padding: 0.5rem 0.5rem 0 0.5rem;
    li {
      padding: 0.4rem 0.6rem;
      background: rgba(54, 114, 195, 1);
      border-radius: 0.3rem;
      margin-bottom: 0.5rem;
      line-height: 2.2rem;
      box-sizing: border-box;
      &:hover {
        background: rgba(61, 209, 255, 1);
      }
      span {
        margin-right: 0.6rem;
      }
    }
    .active {
      background: rgba(30, 42, 66, 0.8);
    }
  }
}
</style>