<template>
  <div class="camera-list pop-container">
    <pop-title :title="'摄像头'"></pop-title>
    <div class="monitor-content">
      <div class="left-content">
        <div class="content-controller height77">
          <div class="check-item marginL20">
            <spinner :content="mapArr[mapid]||'地图'" :list="mapArr" @sendValue="getValue"></spinner>
          </div>
          <div class="search-bar marginR20">
            <search-item @valueChange="searchValue" holder="请输入设备编号"></search-item>
          </div>
        </div>
        <div
          class="monitor-grop-list"
          @touchstart="getFirstY"
          @touchmove="scrollElement"
          ref="listBar"
        >
          <div>
            <div class="grop-title list-title" :key="'aaa'">
              <span>编号</span>
              <span>名称</span>
              <span>所在地图</span>
              <span>x坐标</span>
              <span>y坐标</span>
              <span>操作</span>
            </div>
            <div
              v-for="(value,index) in classList"
              :key="value.id"
              :class="count==index?'hover-style':''"
              class="list-item"
            >
              <span>{{ value.camera_id }}</span>
              <span>{{ value.camera_name }}</span>
              <span>{{ value.map.name }}</span>
              <span>{{ value.x }}</span>
              <span>{{ value.y}}</span>
              <span class="play-item">
                <img
                  src="../UI/play.png"
                  alt="播放"
                  title="播放"
                  @click="loadMonitor(value.id)"
                  @touchstart.stop.prevent="loadMonitor(value.id)"
                />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page-check">
      <el-pagination
        background
        layout="total, prev, pager, next"
        :pager-count="5"
        :total="total"
        :page-size="10"
        :current-page="page"
        prev-text="上一页"
        next-text="下一页"
        @current-change="getData"
        @prev-click="getData"
        @next-click="getData"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/common/Spinner.vue";
import SearchItem from "@/components/common/SearchItem.vue";
import PopTitle from "@/components/common/PopTitle.vue";

import {
  getCameraPage,
  getCameraData //lfq
} from "@/apis/interfance.js";
import scrollMixin from "@/mixin/scrollMixin.js";

export default {
  components: {
    Spinner,
    SearchItem,
    PopTitle
  },
  data() {
    return {
      page: 1,
      total: 0,
      classList: [],
      mapid: "",
      mapArr: [
        "天府广场中间圆形区域",
        "",
        "天府广场负三楼一号线",
        "天府广场负四楼二号线"
      ],
      count:0,
    };
  },
  mixins: [scrollMixin],
  mounted() {
    getCameraPage(this.page).then(data => {
      this.total = data.count;
      this.classList = data.results;
    });
  },
  methods: {
    //调取监控视频播放 lfq
    loadMonitor(id) {
      getCameraData(id).then(data => {
        let vId = data.id;
        let name = data.camera_name;
        let player = data.id;
        let rtsp = data.url;
        // let rtsp = "rtsp://" + data.username + ":" + data.password + "@" + data.ip;
        //  let rtsp = "rtsp://admin:admin@192.168.1.168:554/cam/realmonitor?channel=1&subtype=1";
        let active = false;
        let newMonitorList = [
          { id: vId, name: name, rtsp: rtsp, player: player, active: active }
        ]; //要调取的监控
        this.$store.commit("changeNewMonitorList", newMonitorList);
      });
      this.$emit("popVideo", id);
    },
    //分页
    getData(page) {
      this.page = page;
      let mapid = this.mapid === "" ? "" : this.mapid + 1;
      getCameraPage(page, mapid).then(data => {
        this.classList = data.results;
      });
    },
    //选择设备
    checkEquip(id) {
      this.$emit("dblclicked", { id, flag: "camera" });
    },
    rowStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    cellStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    headerCellStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    headerRowStyle() {
      return "background-color: transparent;color: rgba(255, 255, 255, 1);border-none;border-color:rgba(134, 208, 255, 0.1);";
    },
    getValue(value, index) {
      this.mapid = index;
      this.page = 1;
      // console.log(value, index);
      getCameraPage(this.page, index + 1).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    },
    searchValue(value) {
      this.page = 1;
      getCameraPage(this.page, this.mapid, value).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    }
  }
};
</script>
<style lang="less">
.camera-list {
  .monitor-content {
    display: flex;
    height: 86%;
    .left-content {
      flex-grow: 1;
    }
    .content-controller {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #fff;
      box-sizing: border-box;
      .check-item {
        display: flex;
        align-items: center;
        font-size: 1.4rem;
        margin-right: 1rem;
        // opacity: 0.8;
        .item {
          width: 15rem;
        }
      }
      .active {
        // background-image: url(../images/set_hover.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
      .search-bar {
        width: 28rem;
        margin-left: 0.6rem;
        position: relative;
        z-index: 0;
      }
    }
    .monitor-grop-list {
      height: 74%;
      overflow: auto;
      color: #fff;
      border-radius: 0.5rem;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0.3rem;
        background: rgba(134, 208, 255, 0.3);
      }
      & > div > div {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 1rem;
        .photo {
          width: 12%;
          display: flex;
          align-items: center;
        }
        img {
          height: 3.2rem;
        }
        .play-item{
          line-height: 0;
        }
        span {
          display: inline-block;
          width: 32%;
          flex-grow: 1;
        }
      }
    }
    .right-content {
      margin-top: 0.6rem;
      color: #fff;
      width: 42%;
      border-left: 1px solid rgba(178, 223, 255, 0.2);
      padding: 0.8rem;
      background: rgba(178, 223, 255, 0.1);
      border-radius: 0.5rem;
      margin-left: 1rem;
      .tips {
        font-size: 1.8rem;
      }
      .msg-head {
        display: flex;
        flex-direction: column;
        // align-items: center;
        .msg-back {
          padding-bottom: 0.6rem;
          text-align: right;
          font-size: 2rem;
          display: inline-block;
          cursor: pointer;
          &:hover {
            color: #598dcc;
          }
        }
        .msgs-top {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
          & > div {
            display: flex;
            flex-direction: column;
            span {
              border-bottom: 1px solid rgb(72, 108, 144);
              margin-bottom: 0.6rem;
            }
          }
        }
        img {
          width: 11rem;
          height: 16.5rem;
        }
        li {
          margin-top: 1rem;
          border-bottom: 1px solid rgb(72, 108, 144);
        }
      }
      .person-desc {
        line-height: 1.8rem;
        h4 {
          margin: 0.6rem 0;
        }
        p {
          height: 12rem;
          margin: 0.6rem 0;
        }
      }
      .person-oper {
        display: flex;
        margin-top: 9rem;
        padding-left: 1rem;
        & > div {
          width: 40%;
        }
      }
    }
  }
}
* {
  box-sizing: border-box;
}
:after,
:before {
  box-sizing: border-box;
}
/*lfq*/
.data-box {
  width: 100%;
  box-sizing: border-box;
  border: 1px solid #619eff;
  position: relative;
  box-shadow: 0 0 1rem #619eff;
}
.data-box .line-box i.t-l-line {
  height: 0.4rem;
  width: 2.6rem;
  left: -0.3rem;
  top: -0.3rem;
}
.data-box .line-box i.t-l-line {
  height: 0.4rem;
  width: 2.6rem;
  left: -0.3rem;
  top: -0.3rem;
}
.data-box .line-box i.l-t-line {
  width: 0.4rem;
  height: 2.4rem;
  left: -0.3rem;
  top: -0.3rem;
}
.data-box .line-box i.t-r-line {
  height: 0.4rem;
  width: 2.6rem;
  right: -0.3rem;
  top: -0.3rem;
}
.data-box .line-box i.r-t-line {
  width: 0.4rem;
  height: 2.4rem;
  right: -0.3rem;
  top: -0.3rem;
}
.data-box .line-box i.l-b-line {
  width: 0.4rem;
  height: 2.4rem;
  left: -0.3rem;
  bottom: -0.3rem;
}
.data-box .line-box i.b-l-line {
  height: 0.4rem;
  width: 2.6rem;
  left: -0.3rem;
  bottom: -0.3rem;
}
.data-box .line-box i.r-b-line {
  width: 0.4rem;
  height: 2.4rem;
  right: -0.3rem;
  bottom: -0.3rem;
}
.data-box .line-box i.b-r-line {
  height: 0.4rem;
  width: 2.6rem;
  right: -0.3rem;
  bottom: -0.3rem;
}
.data-box .line-box i {
  background-color: #4788fb;
  box-shadow: 0 0 1rem #619eff;
  position: absolute;
}
.data-box .line-box {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
}
em,
i,
strong {
  font-style: normal;
}
.el-pagination__total {
  color: #fff;
}
</style>