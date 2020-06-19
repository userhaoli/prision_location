<template>
  <div class="person-list pop-container">
    <div class="pop-title">人员列表</div>
    <div class="monitor-content">
      <div class="left-content">
        <div class="content-controller">
          <div class="check-item">
            <spinner
              :content="personType[typeid]||' 职务'"
              :list="personType"
              @sendValue="getPersonType"
            ></spinner>
          </div>
          <div class="search-bar">
            <search-item holder="请输入人员信息" @search="getValue" @valueChange="valueChange"></search-item>
          </div>
        </div>
        <div
          class="monitor-grop-list"
          @touchstart="getFirstY"
          @touchmove="scrollElement"
          ref="listBar"
        >
          <transition-group tag="div">
            <div class="grop-title" :key="'aaa'">
              <span v-show="!flag" class="photo"></span>
              <span>姓名</span>
              <!--<span v-show="!flag">性别</span>-->
              <!--lfq-->
              <span v-show="!flag">电话</span>
              <span>编号</span>
              <span>类型</span>
              <span>职务</span>
            </div>
            <div
              v-for="(value,index) in personList"
              :key="value.id"
              @click="checkStaff(value)"
              @touchstart.stop.prevent="checkStaff(value,index)"
              :class="count==index?'hover-style':''"
            >
              <!--   @dblclick="findPerson(value.label)" -->
              <span class="photo" v-show="!flag">
                <img :src="value.imageurl?(baseUrl+value.imageurl):srcArr[value.type]" alt="??" />
              </span>
              <span>{{ value.name }}</span>
              <!--<span v-show="!flag">{{ value.sex ? "男" : "女" }}</span>-->
              <!--lfq-->
              <span v-show="!flag">{{ value.tel }}</span>
              <span>{{ value.pid }}</span>
              <span>{{ value.type === 0?'公安':'地铁人员' }}</span>
              <span>{{ value.job }}</span>
            </div>
          </transition-group>
        </div>
      </div>
      <div class="right-content" v-show="flag">
        <div class="person-msgs">
          <div class="msg-head">
            <div class="msg-back" @click="hiddenRightBar" @touchstart.stop.prevent="hiddenRightBar">
              <span class="icon iconfont">&#xe614;</span>
            </div>
            <div class="msgs-top">
              <div class="data-box" style="width: 11rem;height: 16.5rem;">
                <div class="line-box">
                  <i class="t-l-line"></i>
                  <i class="l-t-line"></i>
                </div>
                <div class="line-box">
                  <i class="t-r-line"></i>
                  <i class="r-t-line"></i>
                </div>
                <div class="line-box">
                  <i class="b-l-line"></i>
                  <i class="l-b-line"></i>
                </div>
                <div class="line-box">
                  <i class="b-r-line"></i>
                  <i class="r-b-line"></i>
                </div>
                <img
                  :src="personData.imageurl?(baseUrl + personData.imageurl):srcBigArr[personData.type]"
                  alt="这是张图片"
                />
              </div>

              <div style="line-height: 2.2rem;padding-top: 0.5rem;margin-left: 2rem;">
                <span>姓名：{{ personData.name }}</span>
                <!--<span>性别：{{ personData.sex ? "男" : "女" }}</span>-->
                <!--lfq-->
                <span>编号：{{ personData.pid }}</span>
                <span>电话：{{ personData.tel }}</span>
                <!--<span>职务：{{ personData.job }}</span>-->
                <span>
                  类型：{{
                  personData.type===0?'公安':'地铁人员'
                  }}
                </span>
                <span>部门：{{personData.dep}}</span>
                <span>职务：{{ personData.job }}</span>
              </div>
            </div>
          </div>
          <div class="person-oper">
            <div>
              <button class="common-button" @click="track">{{trackFlag?'隐藏轨迹':'实时轨迹'}}</button>
            </div>
            <div>
              <button class="common-button" @click="checkHistoryTrack">历史轨迹</button>
            </div>
            <div>
              <button class="common-button" @click="follow">{{followFlag?'取消跟踪':'实时跟踪'}}</button>
            </div>
            <div>
              <button class="common-button" @click="findPerson(personData.label)">查看位置</button>
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
import { getSearchResult, getPagePerson } from "@/apis/interfance.js";
import params from "@/apis/commonParams.js";
import personMixin from "@/mixin/personMixin.js";

export default {
  mixins: [personMixin],
  components: {
    SearchItem,
    Spinner
  },
  data() {
    return {
      flag: false,
      trackFlag: false,
      followFlag: false,
      typeid: 4,
      personType: ["公安", "地铁人员", "全部"],
      personList: [],
      personData: {},
      total: 0,
      baseUrl: "",
      searchRes: [],
      srcArr: ["/images/police.png", "/images/staff.png"],
      srcBigArr: ["/images/police_big.png", "/images/staff_big.png"],
      searchWords: "",
      page: 1,
      count: -1
    };
  },
  mounted() {
    this.baseUrl = params.peronUrl;
    let type = this.typeid;
    if (type != 0 && type != 1) {
      type = "";
    }
    getPagePerson(1, type).then(data => {
      this.total = data.count;
      this.personList = data.results;
    });
  },
  methods: {
    checkStaff(value, index) {
      console.log(value);
      this.count = index;
      this.flag = true;
      this.personData = value;
      this.trackFlag = false;
      //trouble
      if (value.label.id) {
        this.$store.state.labelData.id = value.label.id;
      } else {
        this.$store.state.labelData.id = value.label.id;
        this.$message({
          message: "该人员未绑定标签",
          type: "warning"
        });
      }
      this.$store.state.persons.forEach(val => {
        if (val.labelId == value.label.id) {
          this.trackFlag = val.track;
          this.followFlag = val.follow;
        }
      });
    },
    getValue(val) {
      if (!val) return;
      this.valueChange(val);
    },
    getData(page) {
      this.page = page;
      let reg = /[\u4E00-\u9FA5\\s]/gim,
        val = this.searchWords;
      let typeid = this.typeid;
      if (this.typeid != 0 && this.typeid != 1) {
        typeid = "";
      }
      if (reg.test(val) === true) {
        getSearchResult({ name: val }, typeid, page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, typeid, page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      }
    },
    getPersonType(content, index) {
      this.typeid = index;
    },
    hiddenRightBar() {
      this.flag = false;
    },
    valueChange(val) {
      this.searchWords = val;
      this.page = 1;
      let reg = /[\u4E00-\u9FA5\\s]/gim;
      let typeid = this.typeid;
      if (this.typeid != 0 && this.typeid != 1) {
        typeid = "";
      }
      if (reg.test(val) === true) {
        getSearchResult({ name: val }, typeid, this.page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      } else if (reg.test(val) === false) {
        getSearchResult({ polid: val }, typeid, this.page).then(data => {
          this.total = data.count;
          this.personList = data.results;
        });
      }
    },
    track() {
      let arr = this.$store.state.persons.filter(value => {
        return value.labelId === this.$store.state.labelData.id;
      });
      if (arr.length === 0) {
        this.$message({
          message: "该人员暂未上线",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.personData;
      this.handleTrack();
      this.trackFlag &&
        this.$emit("findPerson", this.$store.state.labelData.id);
      // this.$emit("handleTrack")
    },
    checkHistoryTrack() {
      if (!this.$store.state.labelData.id) {
        this.$message({
          message: "该人员未绑定标签",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.personData;
      this.$emit("checkHistoryTrack");
    },
    follow() {
      let arr = this.$store.state.persons.filter(value => {
        return value.labelId === this.$store.state.labelData.id;
      });
      if (arr.length === 0) {
        this.$message({
          message: "该人员暂未上线",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.personData;
      this.personFollow();
      this.followFlag &&
        this.$emit("findPerson", this.$store.state.labelData.id);

      // this.$emit("personFollow")
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
        return value.labelId === labelid;
      });
      if (arr.length === 0) {
        this.$message({
          message: "该人员暂未上线",
          type: "warning"
        });
        return;
      }
      this.$store.state.personInfo = this.personData;
      this.$emit("findPerson", labelid);
    },
    getFirstY(e) {
      this.oldY = e.targetTouches[0].pageY;
    },
    scrollElement(e) {
      this.$refs.listBar.scrollTop -= e.targetTouches[0].pageY - this.oldY;
      this.oldY = e.targetTouches[0].pageY;
    }
  },
  watch: {
    typeid() {
      this.valueChange(this.searchWords);
    }
    // "$store.state.labelData.id": {
    //   handler(val) {
    //     this.$store.state.persons.forEach(value => {
    //       if (value.labelId == val) {
    //         this.$store.state.trackFlag = value.track;
    //         this.$store.state.followFlag = value.follow;
    //       }
    //     });
    //   }
    // }
  }
};
</script>

<style lang="less">
.person-list {
  .monitor-content {
    font-size: 1.4rem;
    display: flex;
    // background: rgba(24, 45, 77, 0.6);
    height: 86%;
    .left-content {
      // width: 55%;
      flex-grow: 1;
      // margin-right: 1rem;
    }
    .content-controller {
      display: flex;
      justify-content: space-between;
      height: 4rem;
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
        width: 18rem;
        // flex-grow: 1;
        // margin-right: 1rem;
        margin-left: 0.6rem;
        position: relative;
        z-index: 0;
      }
    }
    .monitor-grop-list {
      height: 36.8rem;
      overflow: auto;
      color: #fff;
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
      .grop-title {
        background: rgba(178, 223, 255, 0.2);
        border-radius: 0.5rem 0.5rem 0rem 0rem;
      }
      & > div > div {
        display: flex;
        align-items: center;
        cursor: pointer;
        line-height: 3.6rem;
        padding-left: 1rem;
        .photo {
          width: 12%;
          display: flex;
          align-items: center;
        }
        img {
          // width: 1%;
          // width: 32px;
          height: 3.2rem;
          text-indent: middle;
          border-radius: 0.4rem;
        }
        span {
          display: inline-block;
          width: 32%;
          flex-grow: 1;
        }
      }
      & > div > div:hover {
        background: rgba(134, 208, 255, 0.1);
      }
      & > div > .hover-style {
        background: rgba(134, 208, 255, 0.1);
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