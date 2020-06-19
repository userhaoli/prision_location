<template>
  <div class="alarm-panel pop-container">
    <div class="pop-title">报警信息</div>
    <div @click="set" @touchstart.stop.prevent="set">
      <img width="22px" height="22px" class="setting-button" src content="设置" />
    </div>
    <ul class="check-bar">
      <!--报警等级-->
      <li style="width: 11.4rem;">
        <spinner :content="typeArr[level]" :list="typeArr" @sendValue="getAlarmLevelList"></spinner>
      </li>
      <!--报警类型-->
      <li style="width: 17.6rem;">
        <spinner :content="alarmType[type]" :list="alarmType" @sendValue="getAlarmTypeList"></spinner>
      </li>
      <li>
        <el-form>
          <el-date-picker
            v-model="dateRange"
            :picker-options="pickerOptions"
            type="datetimerange"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="change"
            class="date-input-class"
            align="right"
            style="width: 32.8rem;"
            :editable="false"
          ></el-date-picker>
        </el-form>
      </li>
      <li style="width: 15rem;margin:0">
        <el-checkbox-group
          v-model="checkedItemArr"
          style="margin-top:0.3rem;width: 16.2rem;margin-left:0px"
        >
          <el-checkbox
            v-for="(value,index) in checkProgram"
            :key="index"
            :label="value.name"
            @change="chooseItem"
          >{{value.name}}</el-checkbox>
        </el-checkbox-group>
      </li>
    </ul>
    <transition-group
      tag="ul"
      class="alarm-msg"
      @touchstart="getFirstY"
      @touchmove="scrollElement"
      ref="listBar"
    >
      <li class="title" key="title">
        <div>编号</div>
        <div style="width: 18%">报警类型</div>
        <div class="alarm-time" style="width: 22%">报警时间</div>
        <div style="width: 20%">所在区域</div>
        <div style="width: 11%">处理状态</div>
        <div style="width: 11%">报警等级</div>
        <!-- <div style="width: 10%">操作</div> -->
        <div></div>
      </li>
      <li v-for="(item) in alarmData" :key="item.id" :class="item.status?'handle-style':''">
        <div style="width: 10%">{{ item.id }}</div>
        <div style="width: 18%">{{ item.type.name }}</div>
        <div class="alarm-time" style="width: 22%">{{ item.logtime | timeFormat }}</div>
        <div style="width: 20%">{{ getMapNameById(item.map.id)}}</div>
        <div style="width: 11%">{{ item.status?"已处理":"未处理" }}</div>
        <div style="width: 10%">{{ typeArr[item.type.level]}}</div>
        <div
          @click="showDetail(item.id)"
          @touchstart.stop.prevent="showDetail(item.id)"
          class="alarm-check"
          style="width: 11%"
        >
          <span>查看详情</span>
        </div>
      </li>
      <!-- <li></li> -->
    </transition-group>
    <!-- </ul> -->
    <div class="page-check">
      <div>
        <el-pagination
          background
          layout="total, prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          prev-text="上一页"
          next-text="下一页"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
let _minDate = null;
let _maxDate = null;
import Spinner from "@/components/common/Spinner.vue";
import moment from "moment";
import scrollMixin from "@/mixin/scrollMixin.js";

// import SearchItem from "@/components/common/SearchItem.vue";
import {
  getAlarmData,
  getAlamDataByContdition,
  getAlarmType,
  getAllMap
} from "@/apis/interfance.js";
export default {
  components: {
    Spinner
  },
  mixins: [scrollMixin],
  data() {
    return {
      typeArr: ["普通", "紧急", "危险", "全部等级"],
      level: "", //报警等级
      alarmType: [],
      type: "", //报警类型
      areaArr: ["站台", "安保室", "走廊", "区域"],
      area: "区域", //区域
      classArr: ["active", "", ""],
      checkProgram: [
        { id: 1, name: "已处理" },
        { id: 2, name: "未处理" }
      ],
      checkedItemArr: ["已处理", "未处理"],
      dateArr: ["今日", "本周", "本月", "全年", "选择时间"], //报警时间
      date: "",
      alarmData: [],
      total: 0, //总条数
      pageSize: 10,
      currentPage: 1, //当前页
      status: "", //处理状态，True-已处理，False-未处理，''-全部
      typeid: "", //选择的报警类型 ''-全部，1-低电量报警，2-越界报警，3-SOS按钮主动报警，4-消失报警
      levelid: "", //选择的报警等级 ''-全部，0-普通，1-危险，2-危急
      mapData: [],
      dateRange: [], //默认选择日期范围
      pickerOptions: {
        //日期选择参数
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        onPick(time) {
          //如果只选择一个时间
          if (!time.maxDate) {
            // let timeRange = 6 * 24 * 60 * 60 * 1000; //6天
            // _minDate = time.minDate.getTime() - timeRange;
            // _maxDate = time.minDate.getTime() + timeRange;
            //选择了两个时间
          } else {
            _minDate = _maxDate = null;
          }
        },
        disabledDate(time) {
          //不显示的时间
          if (_minDate && _maxDate) {
            return time.getTime() < _minDate || time.getTime() > _maxDate;
          }
        }
      },
      startTime: "",
      endTime: ""
    };
  },
  mounted() {
    //获取大地图信息
    getAllMap().then(data => {
      data.results.forEach(value => {
        this.mapData.push({ mapId: value.mapid, mapName: value.name });
      });
    });
    //获取所有报警信息
    getAlarmData(this.currentPage).then(data => {
      this.total = data.count;
      this.alarmData = data.results;
    });
    //获取报警类型
    getAlarmType().then(data => {
      data = data.results;
      data.forEach(value => {
        this.alarmType.push(value.name);
      });
      this.alarmType.push("全部类型");
      this.type = this.alarmType.length - 1;
      //报警类型
      if (this.type === this.alarmType.length - 1) {
        this.typeid = "";
      }
      //报警等级
      this.level = this.typeArr.length - 1;
      if (this.level === this.typeArr.length - 1) {
        this.levelid = "";
      }
      this.date = this.dateArr.length - 1;
    });
  },
  methods: {
    //选择报警级别查询
    getAlarmLevelList(content) {
      this.currentPage = 1; //lfq
      this.typeArr.forEach((value, index) => {
        if (value === content) {
          this.level = index;
        }
      });
      content = content === "全部等级" ? "" : content;
    },
    //选择报警类型查询
    getAlarmTypeList(content) {
      this.currentPage = 1; //lfq
      this.alarmType.forEach((value, index) => {
        if (value === content) {
          this.type = index;
        }
      });
      content = content === "全部类型" ? "" : content;
    },
    getDateList(content) {
      let obj = {
        starttime: "",
        endtime: ""
      };
      this.currentPage = 1; //lfq
      this.dateArr.forEach((value, index) => {
        if (value === content) {
          this.date = index;
        }
      });
      content = content === "选择时间" ? "" : content;
      if (this.date === 0) {
        //今天
        obj.starttime = moment(new Date().valueOf()).format(
          "YYYY-MM-DD 00:00:00"
        );
        obj.endtime = moment(new Date().valueOf()).format(
          "YYYY-MM-DD HH:mm:ss"
        );
        this.dateRange = [obj.starttime, obj.endtime];
      } else if (this.date === 1) {
        //本周
        obj.starttime = moment(
          moment()
            .week(moment().week())
            .startOf("week")
            .add(1, "days")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        obj.endtime = moment(
          moment()
            .week(moment().week())
            .endOf("week")
            .add(1, "days")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        this.dateRange = [obj.starttime, obj.endtime];
      } else if (this.date === 2) {
        //本月
        obj.starttime = moment(
          moment()
            .month(moment().month())
            .startOf("month")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        obj.endtime = moment(
          moment()
            .month(moment().month())
            .endOf("month")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        this.dateRange = [obj.starttime, obj.endtime];
      } else if (this.date === 3) {
        //本年
        obj.starttime = moment(
          moment()
            .year(moment().year())
            .startOf("year")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        obj.endtime = moment(
          moment()
            .year(moment().year())
            .endOf("year")
            .valueOf()
        ).format("YYYY-MM-DD HH:mm:ss");
        this.dateRange = [obj.starttime, obj.endtime];
      } else if (this.date === 4) {
        //选择时间
        this.dateRange = null;
      }
    },
    change(val) {
      if (val === null) {
        this.date = this.dateArr.length - 1;
        this.startTime = "";
        this.endTime = "";
        //获取筛选后的报警信息
        this.getFilterAlamData();
      } else {
        this.startTime = new Date(Date.parse(val[0])).getTime();
        this.endTime = new Date(Date.parse(val[1])).getTime();
      }
    },
    //选择区域查询
    getAlarmAreaList(content) {
      this.currentPage = 1; //lfq
      this.areaArr.forEach(value => {
        if (value === content) {
          this.area = value;
        }
      });
      content = content === "全部区域" ? "" : content;
    },
    showDetail(id) {
      this.$router.push("/home/detail/" + id);
    },
    //根据地图id获取地图名称
    getMapNameById(mapId) {
      let name = "";
      this.mapData.forEach(value => {
        if (value.mapId === mapId) {
          name = value.mapName;
        }
      });
      return name;
    },

    //查询全部、处理、未处理的报警信息
    chooseItem() {
      this.currentPage = 1; //lfq
      if (this.checkedItemArr.length == 2) {
        this.status = "";
      } else if (this.checkedItemArr.length == 1) {
        if (this.checkedItemArr[0] == "已处理") {
          this.status = "True";
        } else {
          this.status = "False";
        }
      } else {
        this.status = "";
      }
      //获取筛选后的报警信息
      this.getFilterAlamData();
    },
    //报警设置
    set() {
      this.$emit("setAlarm");
    },
    handleSizeChange: function(size) {
      //分页    初始页currentPage、初始每页数据数pagesize
      this.pageSize = size;
      //获取筛选后的报警信息
      this.getFilterAlamData();
    },
    handleCurrentChange: function(currentPage) {
      this.currentPage = currentPage;
      //获取筛选后的报警信息
      this.getFilterAlamData();
    },
    //获取筛选后的报警信息
    getFilterAlamData() {
      getAlamDataByContdition(
        this.levelid,
        this.status,
        this.typeid,
        this.startTime,
        this.endTime,
        this.currentPage
      ).then(data => {
        this.total = data.count;
        this.alarmData = data.results;
      });
    }
  },
  watch: {
    level(val) {
      if (val === this.typeArr.length - 1) {
        this.levelid = "";
      } else {
        this.levelid = val;
      }
      //获取筛选后的报警信息
      this.getFilterAlamData();
    },
    type(val) {
      if (val === this.alarmType.length - 1) {
        this.typeid = "";
      } else {
        this.typeid = val + 1;
      }
      //获取筛选后的报警信息
      this.getFilterAlamData();
    },
    dateRange(val) {
      if (val === null) {
        this.startTime = "";
        this.endTime = "";
        //获取筛选后的报警信息
        this.getFilterAlamData();
      } else {
        this.startTime = new Date(Date.parse(val[0])).getTime();
        this.endTime = new Date(Date.parse(val[1])).getTime();
      }
      //获取筛选后的报警信息
      this.getFilterAlamData();
    }
  },
  filters: {
    timeFormat(time) {
      let year = new Date(time).getFullYear(),
        month = new Date(time).getMonth() + 1,
        day = new Date(time).getDate(),
        hour = new Date(time).getHours(),
        minute = new Date(time).getMinutes(),
        second = new Date(time).getSeconds();
      return `${year}.${month > 9 ? month : "0" + month}.${
        day > 9 ? day : "0" + day
      } ${hour}:${minute > 9 ? minute : "0" + minute}:${
        second > 9 ? second : "0" + second
      }`;
    }
  }
};
</script>

<style lang="less" >
.el-checkbox-group span {
  padding: 1px;
}
.el-checkbox {
  margin: 0;
}
div.el-date-editor {
  height: 2.7rem;
  border-color: #5789ff;
  background-color: transparent;
  color: #eee;
  text-align: center;
  font-size: 1.2rem;
}
.el-picker-panel__sidebar {
  border-color: #5789ff;
  background-color: transparent;
  color: #eee;
  font-size: 1.2rem;
}
.el-picker-panel__footer {
  border-color: #5789ff;
  background-color: transparent;
  color: #eee;
  font-size: 1.2rem;
}
.el-picker-panel__link-btn {
  border-color: #5789ff;
  background-color: transparent;
  color: #eee;
  width: 5rem;
}
.el-input__inner {
  border-color: #5789ff;
  background-color: transparent;
}
.el-time-panel {
  border-color: #5789ff;
  background-color: #101e33;
  color: #eee;
}
.el-time-panel.el-time-panel__content {
  color: #eee;
}
li.el-time-spinner__item .active {
  color: #eee;
}
.el-date-editor .el-range-separator {
  color: #eee;
  font-size: 1.2rem;
  padding-bottom: 1.5rem;
}
.el-date-editor .el-range-input {
  background-color: transparent;
  color: #eee;
  text-align: center;
  font-size: 1.2rem;
  padding-bottom: 0.2rem;
}
.el-range-separator {
  padding-bottom: 1.4rem;
  font-size: 1.2rem;
  color: #eee;
}
.el-input__icon {
  padding-bottom: 1.3rem;
}
.el-picker-panel {
  background: #101e33;
  border-color: #5789ff;
}
.el-picker-panel__icon-btn {
  color: #eee;
}
.setting-button {
  width: 1.5rem;
  height: 1.5rem;
  /*background: url(../images/Settings.png) no-repeat;*/
  float: right;
  cursor: pointer;
  z-index: 10;
  margin-right: 2.8rem;
  margin-top: -2.6rem;
  border: none;
}
.alarm-panel {
  .alarm-type {
    padding: 0.4rem 1rem;
    border-bottom: 1px solid rgba(134, 208, 255, 0.1);
    display: flex;
    & > button {
      font-size: 1.4rem;
      color: #86d0ff;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(134, 208, 255, 0.3);
      width: 6rem;
      height: 2.4rem;
      margin-right: 3rem;
      cursor: pointer;
    }
    .set {
      flex-grow: 1;
      display: flex;
      justify-content: flex-end;
    }
    .active {
      background: #274a7f;
    }
  }
  .check-bar {
    display: flex;
    padding: 0.4rem 0;
    border-bottom: 1px solid rgba(134, 208, 255, 0.1);
    color: #fff;
    // font-size: 14px;
    & > li {
      margin-right: 1.6rem;
    }
  }
  .alarm-msg {
    color: #fff;
    font-size: 1.4rem;
    height: 37rem;
    overflow: auto;
    line-height: 3.6rem;
    background: rgba(178, 223, 255, 0.1);
    border-radius: 0.5rem;
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0.3rem;
      background: rgba(255, 255, 255, 0.3);
    }
    .handle-style {
      opacity: 0.6;
      // background: rgba(161, 161, 161,0.2);
    }
    li {
      padding: 0 1rem;
      display: flex;
      align-items: center;
      border-bottom: 1px solid rgba(134, 208, 255, 0.1);
      // padding: 4px 0px;
      &:hover {
        background: rgba(134, 208, 255, 0.1);
        .alarm-check > span {
          // display: block;
          text-decoration: underline;
        }
      }
      .alarm-check {
        cursor: pointer;
        color: #86d0ff;
        // span {
        //   display: none;
        // }
      }
      & > div {
        width: 10%;
      }
      .alarm-time {
        flex-grow: 1;
      }
    }
    .title {
      background: rgba(178, 223, 255, 0.2);
      border-radius: 0.5rem 0.5rem 0px 0px;
    }
  }
}
.check-bar > li .el-range-editor {
  display: flex;
  align-items: center;
  // justify-content: center;
}
.check-bar > li .el-range-editor i {
  display: inline-block;
  height: 3.2rem !important;
  line-height: 3.2rem;
  padding-bottom: 1.3rem;
  box-sizing: border-box;
}

.check-bar > li .el-range-editor span {
  height: 3.4rem;
  line-height: 3.4rem;
  box-sizing: border-box;
}
.el-pagination__total {
  color: #fff;
}
.el-checkbox__label {
  font-size: 1.4rem;
}
</style>