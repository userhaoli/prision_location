<template>
  <div class="track-panel  pop-container">
     <div class="pop-title">电子围栏</div>
    <ul class="view-mode">
      <li>
        <search-item holder="请输入人员信息" @search="getValue" @valueChange="valueChange"></search-item>
      </li>
    </ul>
    <transition-group
      tag="ul"
      class="list"
      @touchstart="getFirstY"
      @touchmove="scrollElement"
      ref="listBar"
    >
      <li class="title" key="5624ll">
        <div>人员姓名</div>
        <div>人员类型</div>
        <div>人员编号</div>
        <div>操作</div>
      </li>
      <li v-for="item in personList" :key="item.id">
        <div>{{item.name}}</div>
        <div>{{item.type==0?'公安':'地铁工作人员'}}</div>
        <div>{{item.pid}}</div>
        <div
          @click="changeState(true,item.id,item.type)"
          @touchstart.stop.prevent="changeState(true,item.id,item.type)"
        >
          <button>轨迹回放</button>
        </div>
      </li>
    </transition-group>
    <div class="page-check">
      <el-pagination
        background
        layout="total,prev, pager, next"
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
    <div class="time-picker" v-show="isShow">
      <!--lfq-->
      <el-form>
        <el-date-picker
          v-model="dateSelected"
          type="date"
          placeholder="选择日期"
          style="width:150px;"
          :editable="false"
        ></el-date-picker>&nbsp;
        <el-time-select
          placeholder="起始时间"
          v-model="sTime"
          :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00'
            }"
          style="width:150px"
          :editable="false"
        ></el-time-select>&nbsp;
        <el-time-select
          placeholder="结束时间"
          v-model="eTime"
          :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '24:00',
              minTime: sTime
            }"
          style="width:150px"
          :editable="false"
        ></el-time-select>
      </el-form>
      <button @click="changeState(false)" @touchstart.stop.prevent="changeState(false)">取消</button>
      <button @click="trackBack" @touchstart.stop.prevent="trackBack">确认</button>
    </div>
  </div>
</template>

<script>
import SearchItem from "@/components/common/SearchItem.vue";
import {
  getSearchResult,
  getPagePerson,
  getTrackData
} from "@/apis/interfance.js";
import scrollMixin from "@/mixin/scrollMixin.js";

export default {
  components: {
    SearchItem,
  },
  mixins: [scrollMixin],
  data() {
    return {
      startFlag: false,
      endFlag: false,
      sTime: "",
      eTime: "",
      dateSelected: "",
      startTime: "",
      endTime: "",
      page: 1,
      total: 0,
      personList: [],
      searchWords: "",
      isShow: false,
      id: 0,
      type: 0
    };
  },
  mounted() {
    if (this.$store.state.onePersonFlag) {
      this.personList = [this.$store.state.personInfo];
      this.$store.state.onePersonFlag = false;
    } else {
      getPagePerson(this.page, "").then(data => {
        this.total = data.count;
        this.personList = data.results;
      });
    }
  },
  methods: {
    trackBack() {
      if (this.sTime === "") {
        this.$message.error("必须选择起始时间");
        return;
      }
      let time1 = this.sTime
        ? +new Date(
            new Date(this.dateSelected).toDateString() + " " + this.sTime
          )
        : "";
      let time2 = this.eTime
        ? +new Date(
            new Date(this.dateSelected).toDateString() + " " + this.eTime
          )
        : "";
      getTrackData(time1, time2,this.id).then(data => {
        if (data.length === 0 || data.msg) {
          this.$message.error("该时间段无可播放轨迹");
          return;
        }
        this.$router.pusg("/blankmap/track");
      });
    },
    changeState(flag, id, type) {
      this.isShow = flag;
      this.id = id;
      this.type = type;
    },
    getValue(val) {
      // this.page = 1;
      this.searchWords = val;
      if (!val) return;
      this.valueChange(val);
    },
    valueChange(val) {
      this.page = 1;
      this.searchWords = val;
      let reg = /[\u4E00-\u9FA5\\s]/gim;
      if (reg.test(val) === true) {
        getSearchResult({ name: val }, "", this.page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, "", this.page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      }
    },
    getData(page) {
      this.page = page;
      let reg = /[\u4E00-\u9FA5\\s]/gim,
        val = this.searchWords;
      if (reg.test(val) === true) {
        getSearchResult({ name: val }, "", page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, "", page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      }
    }
  }
};
</script>

<style lang="less">
/*日期插件样式 lfq*/
.el-date-editor {
  height: 2.7rem;
  border-color: #5789ff;
  background-color: transparent;
  color: #eee;
  text-align: center;
  font-size: 1.2rem;
}
.el-picker-panel {
  color: #e4e7ed;
}
.time-select-item.disabled {
  color: #606266;
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
  color: #eee;
  height: 2.7rem;
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
  line-height: 2.8rem;
}

.el-picker-panel {
  background: #101e33;
  border-color: #5789ff;
}
.el-picker-panel__icon-btn {
  color: #eee;
}
.view-mode {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  color: #86d0ff;
  padding: 0.6rem 0;
  li {
    width: 18rem;
  }
}
.list {
  color: #fff;
  font-size: 1.4rem;
  height: 36.6rem;
  overflow: auto;
  background: rgba(178, 223, 255, 0.1);
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
  .title {
    background: rgba(178, 223, 255, 0.2);
    border-radius: 0.5rem 0.5rem 0px 0px;
  }

  li {
    display: flex;
    justify-content: space-between;
    line-height: 3.6rem;
    padding: 0 1rem;
    & > div {
      width: 14%;
    }
    &:hover {
      background: rgba(134, 208, 255, 0.1);
    }
  }
}
.time-picker {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(49, 95, 157, 1);
  button {
    margin-left: 1rem;
  }
}
.el-pagination__total {
  color: #fff;
}
</style>