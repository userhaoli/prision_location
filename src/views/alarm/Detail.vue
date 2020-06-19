<template>
  <div class="alarm-detail pop-container">
    <pop-title :title="'轨迹回放'"></pop-title>
    <div class="monitor-content">
      <div class="left-content">
        <div class="content-controller">
          <!--报警详情-->
          <ul class="alarm-info-data">
            <li>
              <span style="width:18%">报警编号：{{ alarmData.id }}</span>
              <span>
                报警等级：
                <span style="color:#00A67B">{{ alarmData.type?alarmData.type.level:''}}</span>
              </span>
              <span>
                报警类型：
                <span style="color:#FF7352">{{ alarmData.type?alarmData.type.name:'' }}</span>
              </span>
            </li>
            <li>
              <span style="width:18%">
                报警时间：
                <span style="color:#FF7352">{{ alarmData.logtime | formatTime }}</span>
              </span>
              <span>所在区域：{{ alarmData.map?alarmData.map.name:'' }}</span>
              <span>
                触发人员：
                <span style="color:#D9354E">{{ alarmData.person?alarmData.person.name:''}}</span>
              </span>
            </li>
          </ul>
        </div>
        <!-- 报警区域 -->
        <div class="alarm-area">
          <img :src="imgSrc" alt ref="mapImg" />
          <span class="icon iconfont pointImg" ref="pointImg" :title="tips">&#xe608;</span>
        </div>
      </div>
      <ul class="right-content" @touchstart="getFirstY" @touchmove="scrollElement" ref="listBar">
        <li class="description">
          <div>
            处理状态：
            <span style="color:#FF7352">{{alarmData.status?"已处理":"未处理"}}</span>
          </div>
          <div v-show="alarmData.status">处理用户：{{alarmData.name}}</div>
          <div>处理时间：{{ staffData.processedtime }}</div>
        </li>
        <li class="right-content-head">
          <button class="common-button height38-button marginR20" @click="checkHistoryTrack">历史轨迹</button>
          <button class="common-button height38-button" @click="findPerson">人员位置</button>
        </li>
        <li class="right-content-head">
          <button class="common-button height38-button marginR20" @click="handleAlarm">立即处理</button>
        </li>
      </ul>
    </div>
    <img
      :src="bigImgSrc"
      alt="what"
      class="big-img"
      @click="hidden"
      @touchstart.stop.prevent="hidden"
      v-show="bigImgShow"
    />
    <div class="img-before" v-show="bigImgShow">
      <span
        class="icon iconfont"
        @click="changeImg(-1)"
        @touchstart.stop.prevent="changeImg(-1)"
      >&#xe641;</span>
    </div>
    <div class="img-next" v-show="bigImgShow">
      <span
        class="icon iconfont"
        @click="changeImg(1)"
        @touchstart.stop.prevent="changeImg(1)"
      >&#xe642;</span>
    </div>
  </div>
</template>
<script>
import PopTitle from "@/components/common/PopTitle.vue";

import params from "@/apis/commonParams.js";
import { getAlarmDetail, handleAlarmData } from "@/apis/interfance.js";
import scrollMixin from "@/mixin/scrollMixin.js";

export default {
  mixins: [scrollMixin],
  components: {
    PopTitle
  },
  data() {
    return {
      alarmData: {},
      titleBar: { name: "名称", type: "类型", map: "地图", isShow: "地图显示" },
      staffData: { persons: [] },
      flag: false,
      type: 3,
      typeArr: ["离开触发", "进入触发", "出入触发", "全部"],
      bigImgSrc: "",
      state: true,
      isPlay: false, //播放
      baseUrl: "",
      alarmPicList: [],
      src: "",
      videoArr: [],
      bigImgShow: false,
      index: 0,
      count: 0,
      mapImg: {
        "1": "/images/TianfuSquareNegSecondFloor.png",
        "3": "/images/TianfuSquareMetroLine1.png",
        "4": "/images/TianfuSquareMetroLine2.png"
      },
      imgSrc: "",
      tips: ""
    };
  },
  mounted() {
    this.baseUrl = params.cameraImgUrl;
    getAlarmDetail(this.$route.params.id).then(data => {
      this.alarmData = data;
      this.imgSrc = this.mapImg[data.map.id];
      this.tips = `${data.x}   ${data.y}`;
      this.$refs.mapImg.onload = () => {
        this.$refs.pointImg.style.left =
          (this.$refs.mapImg.width / this.$refs.mapImg.naturalWidth) * data.x -
          15 +
          "px";
        this.$refs.pointImg.style.top =
          (this.$refs.mapImg.height / this.$refs.mapImg.naturalHeight) *
            data.y -
          30 +
          "px";
      };

      // });
    });
  },
  methods: {
    //查看历史图片
    checkImage() {
      // this.$emit("checkImage")
    },
    checkVideo() {
      this.$emit("checkVideo");
    },
    bigImg(index) {
      this.index = index;
      this.bigImgSrc = this.baseUrl + this.alarmPicList[index].imageurl;
      this.bigImgShow = true;
    },
    hidden() {
      this.bigImgSrc = "";
      this.bigImgShow = false;
    },
    changeState(flag) {
      this.isPlay = flag;
    },
    changeVideo(index) {
      this.count = index;
      this.src = this.videoArr[index].videourl;
    },
    backAlarms() {
      this.$emit("backAlarms");
    },
    changeImg(count) {
      let index = this.index + count;
      let maxIndex = this.alarmPicList.length - 1;
      index = index < 0 ? maxIndex : index;
      index = index > maxIndex ? 0 : index;
      this.index = index;
      this.bigImgSrc = this.baseUrl + this.alarmPicList[index].imageurl;
    },
    checkHistoryTrack() {
      if (!this.$store.state.labelData.id) {
        this.$message({
          message: "该人员未绑定标签",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.alarmData.person;
      this.$emit("checkHistoryTrack");
    },
    findPerson() {
      let labelid = this.$store.state.labelData.id;
      if (!this.$store.state.labelData.id) {
        this.$message({
          message: "该人员暂未绑定标签",
          type: "warning"
        });
        return;
      }
      let arr = this.$store.state.persons.filter(value => {
        return parseInt(value.labelId.substring(9, 12)) === labelid;
      });
      if (arr.length === 0) {
        this.$message({
          message: "该人员暂未上线",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.alarmData.person;
      this.$emit("findPerson", arr[0].labelId);
    },
    handleAlarm() {
      this.$confirm("确定处理该报警？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          handleAlarmData(this.alarmData.id)
            .then(() => {
              this.$message.success("处理成功");
              this.$set(this.alarmData, "status", true);
            })
            .catch(() => {
              this.$message.error("处理失败");
            });
        })
        .catch(() => {
          this.$message.error("取消处理");
        });
    }
  },
  filters: {
    formatTime(timestamp) {
      timestamp = parseFloat(timestamp);
      let year = new Date(timestamp).getFullYear();
      let month = new Date(timestamp).getMonth() + 1;
      let day = new Date(timestamp).getDate();
      let hour = new Date(timestamp).getHours();
      let minute = new Date(timestamp).getMinutes();
      let second = new Date(timestamp).getSeconds();
      return `${year}.${month > 9 ? month : "0" + month}.${
        day > 9 ? day : "0" + day
      } ${hour}:${minute > 9 ? minute : "0" + minute}:${
        second > 9 ? second : "0" + second
      }`;
    }
  },
  watch: {
    "$store.state.alarmid": {
      handler(val) {
        getAlarmDetail(val).then(data => {
          this.alarmData = data;
          let timer = setTimeout(() => {
            this.videoArr = data.alarmvideo;
            this.src = this.videoArr[0].videourl;
            clearTimeout(timer);
          }, 300);
          let timer1 = setTimeout(() => {
            this.alarmPicList = data.alarmpicture;
            clearTimeout(timer1);
          }, 600);
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
/*历史图片*/
.history-picList {
  height: 100%;
  font-size: 1.2rem;
  overflow: auto;
  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 0.6rem; /*高宽分别对应横竖滚动条的尺寸*/
  }
  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 0.3rem;
    background: rgba(67, 97, 122, 1);
  }
  li {
    width: 31%;
    float: left;
    img {
      width: 100%;
      cursor: pointer;
    }
    margin-left: 1px;
  }
}

.videoItem-panel {
  width: 100%;
}
.alarm-detail {
  color: #fff;

  .monitor-content {
    display: flex;
    width: 100%;
    height: 95%;
    .left-content {
      width: 75%;
      overflow: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 0.6rem; /*高宽分别对应横竖滚动条的尺寸*/
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0.3rem;
        background: rgba(255, 255, 255, 0.3);
      }
      .alarm-area {
        width: 58rem;
        margin: 0 auto;
        text-align: center;
        position: relative;
        img {
          width: 58rem;
          vertical-align: middle;
        }
        .pointImg {
          font-size: 3rem;
          position: absolute;
          color: #f00;
        }
      }
    }
    .content-controller {
      button {
        font-size: 1.4rem;
        color: #fff;
        border: 0;
        background-color: #152947;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        cursor: pointer;
        padding: 0.4rem 1rem;
      }
      .active {
        // background-image: url(../images/set_hover.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .search-bar {
        flex-grow: 1;
        margin: 0 2rem;
        height: 2.6rem;
        position: relative;
        z-index: 0;
      }
    }
    .check-bar {
      display: flex;
      border-top: 1px solid rgba(178, 223, 255, 0.2);
      padding: 0.6rem 0 0.6rem 1rem;
      .check-type {
        display: flex;
        min-width: 24%;
        align-items: center;
        margin-right: 2rem;
        & > div {
          flex-grow: 1;
        }
      }
      .search-bar {
        flex-grow: 1;
        margin-right: 1rem;
      }
    }
    .alarm-info-data {
      border-bottom: 1px solid rgba(178, 223, 255, 0.2);
      font-size: 1.4rem;
      padding: 0 0 1rem 0;
      li {
        display: flex;
        align-items: center;
        // padding: 0.5rem 0;
        // margin-top: 1.5rem;
        padding: 0.5rem 0;
        cursor: pointer;
        padding-left: 1rem;
        & > span {
          display: inline-block;
          width: 10%;
        }
        & > span:not(.first-item) {
          flex-grow: 1;
        }
      }
      .back-icon {
        padding: 0.4rem 0 0px 1rem;
        font-size: 1.4rem;
        :hover {
          color: #000;
        }
      }
    }
    .right-content {
      width: 25%;
      flex-grow: 2;
      border-left: 1px solid rgba(178, 223, 255, 0.2);
      overflow: auto;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 0.6rem; /*高宽分别对应横竖滚动条的尺寸*/
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0.3rem;
        background: rgba(67, 97, 122, 1);
      }
      .right-content-head {
        border-top: 1px solid rgba(178, 223, 255, 0.2);
        // display:flex;
        // justify-content: space-around;
        & > div {
          margin-top: 2rem;
          margin-right: 2rem;
        }
      }

      .description {
        display: flex;
        flex-direction: column;
        box-sizing: border-box;
        padding-left: 1rem;
        line-height: 3rem;
        button {
          background: 0;
          border: 0;
          width: 8rem;
          cursor: pointer;
          color: #fff;
          &:hover {
            color: #72b2e3;
            text-decoration: underline;
          }
        }
        span {
          width: 40%;
        }
      }
      li {
        cursor: pointer;
        padding: 0.6rem 0;
        display: flex;
        padding-left: 1rem;
        span {
          display: inline-block;
          width: 4%;
        }
        span:first-of-type {
          flex-grow: 1;
        }
      }
    }
  }
}

.big-img {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.img-before {
  position: fixed;
  top: calc(~"50% - 20px");
  left: 2rem;
  span {
    font-size: 8rem;
    cursor: pointer;
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
.img-next {
  position: fixed;
  top: calc(~"50% - 20px");
  right: 0px;
  span {
    font-size: 8rem;
    cursor: pointer;
    &:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.1);
    }
  }
}
</style>