<template>
  <div class="handle" @scroll.capture="lazyLoad($event)">
    <div class="handle-class">
      <button
        :class="flag==0?'active':''"
        @click="handleType(0)"
        @touchstart.stop.prevent="handleType(0)"
      >全部</button>
      <button
        :class="flag==1?'active':''"
        @click="handleType(1)"
        @touchstart.stop.prevent="handleType(1)"
      >待处理</button>
      <button
        :class="flag==2?'active':''"
        @click="handleType(2)"
        @touchstart.stop.prevent="handleType(2)"
      >已处理</button>
    </div>
    <div class="danger-level">
      <button
        :class="status[3]"
        @click="showMessage(3)"
        @touchstart.stop.prevent="showMessage(3)"
      >全部</button>
      <button
        :class="status[2]"
        @click="showMessage(2)"
        @touchstart.stop.prevent="showMessage(2)"
      >危急</button>
      <button
        :class="status[1]"
        @click="showMessage(1)"
        @touchstart.stop.prevent="showMessage(1)"
      >严重</button>
      <button
        :class="status[0]"
        @click="showMessage(0)"
        @touchstart.stop.prevent="showMessage(0)"
      >普通</button>
    </div>
    <transition-group
      tag="ul"
      name="warn-items"
      enter-active-class="animated bounceInLeft"
      leave-active-class="animated bounceOutRight"
      ref="alarmBar"
      @touchmove="scrollAlarms"
    >
      <li v-for="(item, index) in showAlarms" :key="item.id" ref="items">
        <div class="top-bar" :style="item.status == true?'filter:grayscale(0.5)':''">
          <span :style="styleArr[item.type.level]" class="alarm-level">
            {{
            item.type.level | alarmLevel
            }}
          </span>
          <p>
            <span style="line-height:2.6rem">{{ item.logtime | formatTime }}</span>
            <br />
            <span style="color:#FF7352">[{{item.map.name}}]</span>发生
            <span style="color:#D9354E">
              [{{
              item.type.name
              }}]
            </span>。
          </p>
        </div>
        <div class="bot-bar">
          <button @click="alarmDetail(item.id)" @touchstart.stop.prevent="alarmDetail(item.id)">查看详情</button>
          <button
            @click="handleAlarm(item.id, index)"
            @touchstart.stop.prevent="handleAlarm(item.id, index)"
            v-show="!item.status"
          >处理</button>
        </div>
      </li>
    </transition-group>
    <div class="set-bar">
      <!-- 加载条--------------- -->
      <div
        v-show="loading"
        class="loader loader--style2"
        title="1"
        style="height: 5%;width: 5%;margin-left: 40%;"
      >
        <svg
          version="1.1"
          id="loader-1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          x="0px"
          y="0px"
          width="40px"
          height="40px"
          viewBox="0 0 50 50"
          style="enable-background:new 0 0 50 50;"
          xml:space="preserve"
        >
          <path
            fill="#000"
            d="M25.251,6.461c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615V6.461z"
          >
            <animateTransform
              attributeType="xml"
              attributeName="transform"
              type="rotate"
              from="0 25 25"
              to="360 25 25"
              dur="0.6s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
      <button
        @click="handleAll"
        @touchstart.stop.prevent="handleAll"
        v-show="$store.state.unhandleAlarm.length"
      >一键处理</button>
      <!-- <button>设置</button> -->
      <span>共{{showAlarms.length}}条</span>
    </div>
  </div>
</template>

<script>
import {
  // getAllAlarmData,
  handleAlarmData,
  getAlamDataByContdition
} from "@/apis/interfance.js";
export default {
  data() {
    return {
      status: ["", "", "", "active"],
      showAlarms: [],
      alarms: [],
      styleArr: [
        { background: "#00A67B" },
        { background: "#FF7352" },
        { background: "#D9354E" }
      ],
      flag: 1,
      typeid: 3,
      size: 10,
      page: 1,
      loading: false,
      oldY: undefined
    };
  },
  mounted() {
    getAlamDataByContdition("", "False", "", "", "", 1, 10).then(data => {
      this.showAlarms = [...data.results];
    });
  },
  methods: {
    //报警详情
    alarmDetail(id) {
      this.$router.push("/home/detail/" + id);
    },
    //处理报警信息
    handleAlarm(id, index) {
      this.$confirm("确定处理该报警？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          handleAlarmData(id)
            .then(() => {
              this.$message({
                type: "success",
                message: "处理成功!"
              });
              this.showAlarms.splice(index, 1);
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "处理失败!"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消处理"
          });
        });
    },
    handleAll() {
      let arr = [];
      if (this.flag != 1) {
        this.$message({
          type: "error",
          message: "列表暂无可处理项!"
        });
        return;
      }
      this.$confirm("确定处理该报警？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showAlarms.forEach(value => {
          handleAlarmData(value.id)
            .then(() => {
              this.$message({
                type: "success",
                message: "处理成功!"
              });
            })
            .catch(() => {
              this.$message({
                type: "error",
                message: "处理失败!"
              });
              arr.push(value);
            });
        });
        this.showAlarms = arr;
      });
    },
    showMessage(count) {
      if (this.typeid == count) return;
      this.loading = true;
      this.page = 1;
      let arr = ["", "", "", ""];
      this.typeid = count;
      arr[count] = "active";
      this.status = arr;
      let type = this.flag == 0 ? "" : this.flag == 1 ? "False" : "True";
      this.size = this.flag == 1 ? 1000 : 10;
      let typeid = this.typeid == 3 ? "" : this.typeid;
      getAlamDataByContdition(
        typeid,
        type,
        "",
        "",
        "",
        this.page,
        this.size
      ).then(data => {
        this.showAlarms = [...data.results];
        this.loading = false;
      });
    },
    handleType(type) {
      if (this.flag == type) return;
      this.loading = true;
      this.page = 1;
      this.flag = type;
      type = type == 0 ? "" : type == 1 ? "False" : "True";
      let typeid = this.typeid == 3 ? "" : this.typeid;
      this.size = this.flag == 1 ? 1000 : 10;
      getAlamDataByContdition(
        typeid,
        type,
        "",
        "",
        "",
        this.page,
        this.size
      ).then(data => {
        this.showAlarms = [...data.results];
        this.loading = false;
      });
    },
    lazyLoad(e) {
      let itemLength = this.$refs.items[0] && this.$refs.items[0].offsetHeight;
      let ulLength = this.$refs.alarmBar.$el.offsetHeight;
      // console.log(itemLength,this.$refs.alarmBar,ulLength)
      if (e.target.scrollTop > itemLength * this.page * this.size - ulLength) {
        if (this.showAlarms.length < this.page * this.size) return;
        this.page += 1;
        let type = this.flag == 0 ? "" : this.flag == 1 ? "False" : "True";
        // this.size = this.flag == 1 ? 1000 : 10;
        let typeid = this.typeid == 3 ? "" : this.typeid;
        this.loading = true;
        getAlamDataByContdition(typeid, type, "", "", "", this.page, this.size)
          .then(data => {
            this.showAlarms = [...this.showAlarms, ...data.results];
            this.loading = false;
          })
          .catch(() => {
            this.loading = false;
          });
      }
    },
    scrollAlarms(e) {
      let newY = e.targetTouches[0].pageX;
      if (this.oldY === undefined) {
        this.oldY = newY;
      }
      this.$refs.alarmBar.scrollTop -= newY - this.oldY;
      this.oldY = newY;
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
    },
    alarmLevel(n) {
      let arr = ["普通", "严重", "危急"];
      return arr[n];
    }
  },
  watch: {
    "$store.state.unhandleAlarm.length": {
      handler() {
        this.page = 1;
        this.size = 10;
        let type = this.flag == 0 ? "" : this.flag == 1 ? "False" : "True";
        let typeid = this.typeid == 3 ? "" : this.typeid;
        getAlamDataByContdition(
          typeid,
          type,
          "",
          "",
          "",
          this.page,
          this.size
        ).then(data => {
          this.showAlarms = [...data.results];
          this.loading = false;
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
button {
  border: 0;
  background: 0;
  cursor: pointer;
}
.handle {
  width: 31rem;
  height: 100%;
  border-left: 1px solid rgba(134, 208, 255, 0.2);
  color: #fff;
  position: relative;
  // background: url("../UI/right_color.png") no-repeat;
  // background-size: 100% 100%;
  background: rgba(5, 15, 39, 1);
  border: 1px solid rgba(51, 119, 233, 1);
  box-shadow: 0px 9px 21px 0px rgba(12, 7, 4, 0.35);
  opacity: 0.95;
  .handle-class {
    display: flex;
    justify-content: space-around;
    button {
      flex-grow: 1;
      line-height: 4rem;
      font-size: 1.6rem;
      background: #23406f;
      color: #fff;
      padding: 0 0.6rem;
      border-radius: 0;
    }
    .active {
      background: 0;
      font-size: 1.6rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(61, 209, 255, 1);
      line-height: 2rem;
    }
  }
  .danger-level {
    display: flex;
    justify-content: space-between;
    padding: 0rem 1rem;
    button {
      line-height: 3rem;
      margin: 1rem 0;
      color: #ffffff;
      background: #3672c3;
      border-radius: 0.3rem;
      padding: 0 1.9rem;
      font-size: 1.4rem;
      font-family: Microsoft YaHei;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      span {
        margin-left: 1.5rem;
      }
    }
    .active {
      background: #3dd1ff;
    }
  }
  ul {
    // border-bottom: 1px solid rgba(134, 208, 255, 0.2);
    height: 79%;
    overflow: auto;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0.3rem;
      background: rgba(134, 208, 255, 0.3);
    }
    li {
      margin: 0 1rem 0.6rem 1rem;
      color: rgba(255, 255, 255, 1);
      font-size: 1.4rem;
      width: 29rem;
      height: 10rem;
      background: rgba(39, 74, 127, 1);
      border: 1px solid rgba(51, 119, 233, 1);
      border-radius: 0.3rem;
      box-sizing: border-box;
      .top-bar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .alarm-level {
          display: inline-block;
          width: 5rem;
          line-height: 5rem;
          font-size: 1.6rem;
          text-align: center;
          margin: 0.5rem;
          border-radius: 0.4rem;
        }
        p {
          margin: 0;
          width: 22rem;
          padding-right: 0.6rem;
          font-size: 1.3rem;
          line-height: 1.6rem;
        }
      }
      .bot-bar {
        text-align: right;
        line-height: 2.6rem;
        margin-top: 0.6rem;
        button {
          font-size: 1.2rem;
          color: #fff;
          line-height: 1.6rem;
          background: rgba(54, 114, 195, 1);
          border-radius: 0.3rem;
          margin-right: 1rem;
        }
        :hover {
          background: rgba(61, 209, 255, 1);
          color: rgba(28, 46, 86, 1);
        }
      }
    }
  }
  .set-bar {
    width: 100%;
    position: absolute;
    padding: 0.6rem 2rem;
    text-align: center;
    font-size: 1.2rem;
    bottom: 3rem;
    button {
      color: #fff;
      line-height: 2.6rem;
      width: 8rem;
      background: rgba(54, 114, 195, 1);
      margin-right: 1rem;
      border-radius: 0.3rem;
      &:hover {
        background: rgba(61, 209, 255, 1);
        color: rgba(28, 46, 86, 1);
      }
    }
  }
}
</style>