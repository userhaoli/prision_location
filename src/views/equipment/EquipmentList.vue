<template>
  <div class="equip-manage pop-container" @click="cancelAll">
    <div class="pop-title">数据分析</div>
    <div class="content-controller">
      <div class="select-bar type-item">
        <button
          :class="checkedArr[0]"
          @click="checkType(0)"
          @touchstart.stop.prevent="checkType(0)"
        >基站</button>
        <button
          :class="checkedArr[1]"
          @click="checkType(1)"
          @touchstart.stop.prevent="checkType(1)"
        >摄像头</button>
        <button
          :class="checkedArr[2]"
          @click="checkType(2)"
          @touchstart.stop.prevent="checkType(2)"
        >标签</button>
        <button
          :class="checkedArr[3]"
          @click="checkType(3)"
          @touchstart.stop.prevent="checkType(3)"
        >基站组</button>
        <button
          :class="checkedArr[4]"
          @click="checkType(4)"
          @touchstart.stop.prevent="checkType(4)"
        >协调器</button>
      </div>
      <lh-button
        content="新增"
        @click.native="addEquipment"
        @touchstart.native.stop.prevent="addEquipment"
      ></lh-button>
      <lh-button
        content="编辑"
        @click.native="updateEquipment"
        @touchstart.native.stop.prevent="updateEquipment"
      ></lh-button>
      <lh-button
        content="删除"
        @click.native="deleteEquipment"
        @touchstart.native.stop.prevent="deleteEquipment"
      ></lh-button>
      <div style="width:25%;"></div>
    </div>
    <div class="equip-oper" v-show="type===0||type===1">
      <spinner :content="mapArr[mapid]||'地图'" :list="mapArr" @sendValue="getValue"></spinner>
      <search-item holder="请输入设备编号或IP" @valueChange="searchValue"></search-item>
    </div>
    <!-- 基站 -->
    <div class="station" v-show="stationShow">
      <div class="station-tips">
        <span class="icon iconfont" :style="style[1]">&#xe6a0;</span>自检失败
        <span class="icon iconfont" :style="style[2]">&#xe6a0;</span>读ID成功
        <span class="icon iconfont" :style="style[3]">&#xe6a0;</span>自检成功
        <span class="icon iconfont" :style="style[4]">&#xe6a0;</span>设备功能关闭
        <span class="icon iconfont" :style="style[5]">&#xe6a0;</span>运行过程检测ID失败
        <span class="icon iconfont" :style="timeTipsStyle[0]">&#xe703;</span>有效
        <span class="icon iconfont" :style="timeTipsStyle[1]">&#xe703;</span>
        失效
      </div>
      <transition-group
        tag="div"
        class="station-list clearfix"
        @touchstart="getFirstY"
        @touchmove="scrollElement"
        ref="listBar"
      >
        <div v-for="(item,index) in stationList" :key="item.ip">
          <div
            :class="'station-item '+ (item.is_selected?'checked':'')"
            @dblclick="checkEquip(item.id)"
            @click="selectStation(item.is_selected,index)"
          >
            <div class="item-square" :style="timeStyle[styleFilter(item)]">
              <span class="icon iconfont" :style="style[item.uwb]" title="uwb">&#xe6a0;</span>
              <span class="icon iconfont" :style="style[item.rfid]" title="rfid">&#xe7c3;</span>
            </div>
            <p :title="item.ip">{{item.ip}}</p>
            <p :title="item.soft_version">{{item.soft_version}}</p>
          </div>
        </div>
      </transition-group>
    </div>
    <!-- 摄像头 -->
    <transition-group
      tag="ul"
      v-show="cameraShow"
      @touchstart="getFirstY"
      @touchmove="scrollElement($event,'cameraBar')"
      ref="cameraBar"
    >
      <li class="grop-title" :key="titleBar.ip">
        <div class="first-item" style="width:5%">
          <lh-checkbox @sendCheckMsg="selectAll" :isChecked="isAll"></lh-checkbox>
        </div>
        <div style="width:18%">摄像头编号</div>
        <div style="width:28%">设备名称</div>
        <div style="width:10%">所在站点</div>
        <div style="width:22%">所在地图</div>
        <div style="width:15%">{{ titleBar.other }}</div>
      </li>
      <li v-for="(value, index) in classList" :key="index">
        <div class="first-item" style="width:5%">
          <lh-checkbox @sendCheckMsg="selectItem($event, index)" :isChecked="value.is_selected"></lh-checkbox>
        </div>
        <div style="width:18%">{{ value.camera_id }}</div>
        <div style="width:28%">{{ value.camera_name }}</div>
        <div style="width:10%">{{ value.map ? value.map.station.name : "" }}</div>
        <div style="width:22%">{{ value.map ? value.map.name : "" }}</div>
        <div class="check-detail" style="width:15%">
          <div class="content-controller play-icon">
            <img
              src
              alt="播放"
              title="播放"
              @click="loadMonitor(value.id)"
              @touchstart.stop.prevent="loadMonitor(value.id)"
            />
            <!--播放视频 lfq-->
          </div>
          <span
            @click="checkEquip(value.id)"
            @touchstart.stop.prevent="checkEquip(value.id)"
            title="查看详情"
          >查看</span>
        </div>
      </li>
    </transition-group>
    <!-- 标签 -->
    <transition-group
      tag="ul"
      class="monitor-grop-list"
      v-show="labelShow"
      @touchstart="getFirstY"
      @touchmove="scrollElement($event,'labelBar')"
      ref="labelBar"
    >
      <li class="grop-title" :key="'groptitle'">
        <div>{{ titleBar.num }}</div>
        <div>激活状态</div>
        <div>绑定人员</div>
        <div>人员编号</div>
        <!--lfq-->
        <div>职务</div>
        <div>电话</div>
      </li>
      <li v-for="(value) in classList" :key="value.id">
        <div>{{ value.id }}</div>
        <div>{{ value.status }}</div>
        <div>{{ value.person?value.person.name:''}}</div>
        <div>{{ value.person?value.person.pid:''}}</div>
        <div>{{ value.person?value.person.job:''}}</div>
        <div>{{ value.person?value.person.tel:''}}</div>
      </li>
    </transition-group>
    <!-- 协调器 -->
    <div class="station" v-show="xietiaoShow">
      <div class="station-tips">
        <span class="icon iconfont" :style="style[1]">&#xe6a0;</span>自检失败
        <span class="icon iconfont" :style="style[2]">&#xe6a0;</span>读ID成功
        <span class="icon iconfont" :style="style[3]">&#xe6a0;</span>自检成功
        <span class="icon iconfont" :style="style[4]">&#xe6a0;</span>设备功能关闭
        <span class="icon iconfont" :style="style[5]">&#xe6a0;</span>运行过程检测ID失败
        <span class="icon iconfont" :style="timeTipsStyle[0]">&#xe703;</span>有效
        <span class="icon iconfont" :style="timeTipsStyle[1]">&#xe703;</span>
        失效
      </div>
      <transition-group
        tag="div"
        class="station-list clearfix"
        @touchstart="getFirstY"
        @touchmove="scrollElement"
        ref="listBar"
      >
        <div v-for="(item,index) in xieArr" :key="index">
          <div
            :class="'station-item '+ (item.is_selected?'checked':'')"
            @click="selectStation(item.is_selected,index)"
          >
            <div class="item-square" :style="timeStyle[0]">
              <span class="icon iconfont" :style="style[2]" title="uwb">&#xe6a0;</span>
              <span class="icon iconfont" :style="style[2]" title="rfid">&#xe7c3;</span>
            </div>
            <p :title="item.ip">{{item.ip}}</p>
            <!-- <p :title="item.soft_version">{{item.soft_version}}</p> -->
          </div>
        </div>
      </transition-group>
    </div>
    <div class="page-check" v-show="stationShow">共{{" "+total+" "}}条</div>
    <div class="page-check" v-show="!stationShow">
      <el-pagination
        background
        layout="total, prev, pager, next"
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
import LhButton from "@/components/common/LhButton.vue";
import LhCheckbox from "@/components/common/LhCheckbox.vue";
import scrollMixin from "@/mixin/scrollMixin.js";

import {
  screenStation,
  deleteStation,
  getAllBaseStation,
  getCameraPage,
  deleteCamera,
  getAllCamera,
  getCameraData, //lfq
  getLabel
} from "@/apis/interfance.js";
export default {
  components: {
    Spinner,
    SearchItem,
    LhButton,
    LhCheckbox
  },
  mixins: [scrollMixin],
  props: {
    titleBar: {
      type: Object,
      default: () => {
        return {
          num: "设备编号",
          ip: "IP",
          map: "所在地图",
          type: "基站类型",
          other: "其他"
        };
      }
    }
  },
  data() {
    return {
      classList: [],
      stationList: [],
      operations: [],
      total: 0,
      stationShow: true,
      cameraShow: false,
      labelShow: false,
      xietiaoShow: false,
      checkedArr: ["active", "", "", ""],
      id: 0, //设备id,
      type: 0,
      isAll: false,
      page: 1,
      style: [
        {
          color: "#666600"
        },
        {
          color: "#FF0000"
        },
        {
          color: "#00FF00"
        },
        {
          color: "#0000FF"
        },
        {
          color: "#FFFF00"
        },
        {
          color: "#00FFFF"
        },
        {
          color: "#FF00FF"
        }
      ],
      timeStyle: [
        {
          background: "#0066ff"
        },
        {
          background: "#707070"
        }
      ],
      timeTipsStyle: [
        {
          color: "#0066ff"
        },
        {
          color: "#707070"
        }
      ],
      isKeyDown: false,
      mapid: "",
      mapArr: [
        "天府广场中间圆形区域",
        "",
        "天府广场负三楼一号线",
        "天府广场负四楼二号线",
        "全部"
      ],
      xieArr: [
        {
          is_selected: false,
          ip: "10.106.200.200",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.201",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.202",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.203",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.204",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.205",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.206",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        },
        {
          is_selected: false,
          ip: "10.106.200.207",
          uwb: "20.6.58.2",
          rfid: "19.3.9.6.2",
          soft_version: "v0.6.2.3"
        }
      ]
    };
  },
  mounted() {
    this.getStation();
    window.addEventListener("keydown", e => {
      if (e.keyCode != 17) return;
      this.isKeyDown = true;
    });
    window.addEventListener("keyup", e => {
      if (e.keyCode != 17) return;
      this.isKeyDown = false;
    });
  },
  methods: {
    //选择设备
    checkEquip(id) {
      let flag;
      if (this.stationShow === true) {
        flag = "station";
      } else if (this.cameraShow === true) {
        flag = "camera";
      } else if (this.labelShow === true) {
        flag = "label";
      }
      this.$emit("dblclicked", { id, flag });
      // this.$store.commit("changeEquipId",id)
    },
    selectAll(flag) {
      this.classList.forEach(value => {
        this.$set(value, "is_selected", flag);
      });
    },
    selectItem(e, index) {
      this.classList[index].is_selected = e;
      let result = this.classList.every(val => {
        return val.is_selected === true;
      });
      this.isAll = result;
    },
    //选择类型
    checkType(type) {
      this.type = type;
      let arr = ["", "", "", ""];
      arr[type] = "active";
      this.checkedArr = arr;
      this.page = 1;
      this.mapid = "";
      switch (type) {
        case 0:
          this.stationShow = true;
          this.cameraShow = false;
          this.labelShow = false;
          this.xietiaoShow = false;
          this.dingWeiShow = false;
          this.getStation();
          break;
        case 1:
          this.stationShow = false;
          this.cameraShow = true;
          this.labelShow = false;
          this.xietiaoShow = false;
          this.dingWeiShow = false;
          this.getCamera();
          break;
        case 2:
          this.stationShow = false;
          this.cameraShow = false;
          this.labelShow = true;
          this.xietiaoShow = false;
          this.dingWeiShow = false;
          this.getLabel();
          break;
        case 3:
          // this.getStationGroup();
          this.$emit("showGroup");
          break;
        case 4:
          this.stationShow = false;
          this.cameraShow = false;
          this.labelShow = false;
          this.xietiaoShow = true;
          this.dingWeiShow = false;
          break;
        default:
          444;
      }
    },
    getStation() {
      let mapid = this.mapid === "" ? "" : this.mapid + 1;
      this.classList = [];
      screenStation(mapid, "").then(data => {
        this.total = data.count;
        this.stationList = data.results;
      });
    },
    getCamera() {
      this.stationList = [];
      getCameraPage(this.page).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    },
    getLabel() {
      this.stationList = [];
      getLabel(this.page).then(data => {
        this.total = data.count;
        this.classList = data.results;
      });
    },
    addEquipment() {
      let flag;
      if (this.stationShow === true) {
        flag = "station";
        this.$store.state.operationType = 0;
      } else if (this.cameraShow === true) {
        flag = "camera";
        this.$store.state.operationType = 2;
      } else if (this.labelShow === true) {
        flag = "label";
      }
      this.$emit("addEquip", flag);
    },
    updateEquipment() {
      let newArr = [];
      if (this.checkedArr[0] === "active") {
        newArr = this.stationList.filter(value => {
          return value.is_selected;
        });
      } else {
        newArr = this.classList.filter(value => {
          return value.is_selected;
        });
      }
      if (newArr.length === 0) {
        this.$message.error("未选择编辑项");
        return;
      }
      if (newArr.length > 1) {
        this.$message.error("只能单独选择一个");
        return;
      }
      let flag;
      if (this.stationShow === true) {
        flag = "station";
      } else if (this.cameraShow === true) {
        flag = "camera";
      } else if (this.labelShow === true) {
        flag = "label";
      }
      this.$emit("editStation", { id: newArr[0].id, flag });
    },
    deleteEquipment(e) {
      e.stopPropagation();
      let newArr = [];
      if (this.checkedArr[0] === "active") {
        newArr = this.stationList.filter(value => {
          return value.is_selected;
        });
      } else {
        newArr = this.classList.filter(value => {
          return value.is_selected;
        });
      }
      if (newArr.length === 0) {
        this.$message.error("未选择删除项");
        return;
      }
      this.$confirm("是否删除改设备?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.stationShow) {
            this.stationList.forEach(value => {
              if (value.is_selected === true) {
                deleteStation(value.id)
                  .then(() => {
                    this.$message({
                      message: "删除成功",
                      type: "success"
                    });
                    getAllBaseStation().then(data => {
                      this.total = data.count;
                      this.stationList = data.results.filter(value => {
                        return value.map.mapid == this.$store.state.mapid;
                      });
                      this.$store.commit("changeStations", data.results);
                    });
                  })
                  .catch(() => {
                    this.$message.error("删除失败");
                  });
              }
            });

            // screenStation(this.page).then(data => {
            //   this.total = data.count;
            //   this.stationList = data.results;
            // });

            return;
          }
          //如果不是基站
          this.classList.forEach(value => {
            if (value.is_selected === true) {
              this.cameraShow &&
                deleteCamera(value.id)
                  .then(() => {
                    this.$message({
                      message: "删除成功",
                      type: "success"
                    });
                    getCameraPage(this.page).then(data => {
                      this.total = data.count;
                      this.classList = data.results;
                    });
                    getAllCamera().then(data => {
                      this.total = data.count;
                      this.$store.commit("changeCamera", data.results);
                    });
                  })
                  .catch(() => {
                    this.$message.error("删除失败");
                  });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    getData(page) {
      this.page = page;
      let mapid;
      switch (this.type) {
        case 0:
          screenStation(this.$store.state.mapid, "").then(data => {
            this.total = data.count;
            this.stationList = data.results;
          });
          break;
        case 1:
          mapid = this.mapid === "" ? "" : this.mapid + 1;
          getCameraPage(page, mapid).then(data => {
            this.total = data.count;
            this.classList = data.results;
          });
          break;
        case 2:
          getLabel(page, this.mapid + 1).then(data => {
            this.total = data.count;
            this.classList = data.results;
          });
          break;
        default:
          444;
      }
    },
    getValue(value, index) {
      this.mapid = index;
      this.page = 1;
      let mapid = this.mapid === "" ? "" : this.mapid + 1;
      switch (this.type) {
        case 0:
          screenStation(mapid).then(data => {
            this.total = data.count;
            this.stationList = data.results;
          });
          break;
        case 1:
          getCameraPage(this.page, mapid).then(data => {
            this.total = data.count;
            this.classList = data.results;
          });
          break;
        case 2:
          break;
        default:
          break;
      }
    },
    searchValue(value) {
      switch (this.type) {
        case 0:
          screenStation(this.mapid + 1, value).then(data => {
            this.total = data.count;
            this.stationList = data.results;
          });
          break;
        case 1:
          this.page = 1;
          getCameraPage(this.page, this.mapid && this.mapid + 1, value).then(
            data => {
              this.total = data.count;
              this.classList = data.results;
            }
          );
          break;
        case 2:
          break;
        default:
          break;
      }
    },
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
    styleFilter(item) {
      let ip = item.ip;
      if (
        ip === "10.106.200.11" ||
        ip === "10.106.200.5" ||
        ip === "10.106.200.14" ||
        ip === "10.106.200.17" ||
        ip === "10.106.200.20"
      ) {
        return 0;
      }
      let disTime = new Date() - item.lastreceivetime;
      return disTime > 180000 ? 1 : 0;
    },
    selectStation(e, index) {
      if (this.$store.state.isiPad) {
        return;
      }
      if (this.isKeyDown) {
        this.$set(this.stationList[index], "is_selected", !e);
      } else {
        this.stationList.forEach(value => {
          value.is_selected = false;
        });
        this.$set(this.stationList[index], "is_selected", !e);
      }
    },
    cancelAll() {
      if (this.isKeyDown) return;
      let arr = this.stationList.filter(value => {
        return value.is_selected === true;
      });
      if (arr.length === 1) return;
      this.stationList.forEach(value => {
        value.is_selected = false;
      });
    }
  }
};
</script>
<style lang="less">
.equip-manage {
  overflow: auto;
  font-size: 1.4rem;
  .equip-oper {
    display: flex;
    justify-content: space-between;
    padding: 0.4rem 0;
    & > .item {
      width: 18rem;
    }
    & > .search-item {
      width: 18rem;
    }
  }
  .station {
    background: rgba(178, 223, 255, 0.1);
    border-radius: 5px;
    .station-tips {
      padding: 0.4rem 1rem;
      background: rgba(178, 223, 255, 0.2);
      border-radius: 0.5rem 0.5rem 0rem 0rem;
    }
    .station-list {
      height: 31rem;
      padding: 0 1rem;
      overflow: auto;
      // flex-wrap: wrap;
      // justify-content: flex-start;
      // align-items: center;
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        /*!*滚动条里面小方块*!*/
        border-radius: 0.3rem;
        background: rgba(255, 255, 255, 0.3);
        height: 3rem;
      }
      & > div {
        float: left;
        width: 10%;
        height: 9rem;
        display: flex;
        justify-content: center;
        // flex-grow: 1;
      }

      .station-item {
        width: 6.8rem;
        height: 6.8rem;
        margin-top: 2rem;
        border-radius: 0.6rem;
        border: 1px solid #ccc;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        cursor: pointer;

        &:hover {
          box-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
          border: 0.2rem solid rgb(0, 89, 223);
          text-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
          .item-square {
            box-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
          }
        }

        // .item-circle {
        //   text-align: center;
        //   margin-top: 4px;
        //   span {
        //     font-size: 2rem;
        //   }
        // }

        .item-square {
          width: 4rem;
          height: 4rem;
          text-align: center;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 0.8rem;
          background: rgb(0, 102, 255);
          span {
            font-size: 1.8rem;
          }
        }
        p {
          width: 150%;
          text-align: center;
          font-size: 1.2rem;
          margin: 1px 0;
          transform: scale(0.7);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
      .checked {
        box-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
        border: 0.2rem solid rgb(0, 89, 223);
        text-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
        .item-square {
          box-shadow: 0rem 0rem 1rem rgb(0, 102, 255);
        }
      }
      // .invalid {
      //   background: #707070;
      // }
    }
    .clearfix:after {
      content: "."; /* 内容为小点， 尽量加不要空， 否则旧版本浏览器有空隙 */
      display: block; /* 转换为块级元素 */
      height: 0; /* 高度为0 */
      visibility: hidden; /* 隐藏盒子 */
      clear: both; /* 清除浮动 */
    }
  }

  .content-controller {
    display: flex;
    // justify-content: space-around;
    justify-content: space-between;
    height: 4rem;
    align-items: center;
    .select-bar {
      // margin-left: 1rem;
      .active {
        background: rgba(89, 141, 204, 1);
        color: rgba(255, 255, 255, 1);
      }
      button {
        font-size: 1.4rem;
        border: 0;
        cursor: pointer;
        width: 6.2rem;
        height: 3rem;
        background: rgba(58, 101, 153, 0.3);
        border-radius: 0.3rem 0rem 0rem 0.3rem;
        color: rgba(134, 208, 255, 1);
      }
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

  .monitor-grop-list {
    height: 37rem;
  }
  & > ul {
    height: 33.4rem;
    overflow: auto;
    color: rgba(255, 255, 255, 1);
    background: rgba(178, 223, 255, 0.1);
    border-radius: 0.5rem;
    .first-item {
      width: 2%;
      flex-grow: 0;
    }
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 3px;
      background: rgba(134, 208, 255, 0.3);
    }
    .grop-title {
      background: rgba(178, 223, 255, 0.2);
      border-radius: 0.5rem 0.5rem 0rem 0rem;
    }
    li {
      display: flex;
      align-items: center;
      line-height: 3.6rem;
      // padding: 1rem 0;
      cursor: pointer;
      & > div {
        display: inline-block;
        width: 20%;
      }
      & > div:first-of-type {
        flex-grow: 1;
        text-align: center;
        margin-left: 1rem;
      }
      & > div:nth-of-type(2) {
        flex-grow: 3;
      }
      & > div:nth-of-type(3) {
        flex-grow: 3;
      }
      & > div:nth-of-type(4) {
        flex-grow: 4;
      }
      & > div:nth-of-type(5) {
        flex-grow: 3;
      }
      & > div:nth-of-type(6) {
        flex-grow: 3;
      }
      & > div:nth-of-type(7) {
        flex-grow: 3;
      }
    }
    li:hover {
      background: rgba(134, 208, 255, 0.1);
      img {
        display: block;
      }
      .check-detail > span {
        display: inline;
        margin-left: 2rem;
      }
    }
    .check-detail {
      color: rgba(134, 208, 255, 1);
      display: flex;
      span {
        /*display: none;*/
        margin-left: 2rem;
        display: inline;
      }
    }
    .play-icon {
      justify-content: space-between;
      img {
        width: 3rem;
        height: 3rem;
        /*display: none;*/
        display: block;
      }
    }
  }
  // }
}
.page-check {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.3rem;
}
.el-pagination__total {
  color: #fff;
}
</style>