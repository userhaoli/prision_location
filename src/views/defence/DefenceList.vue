<template>
  <div class="fence pop-container">
    <pop-title :title="'电子围栏'"></pop-title>
    <div class="defence-list">
      <div class="content-controller">
        <button class="common-button height38 marginL20" @click="add">新增</button>
        <button class="common-button height38 marginL20" @click="edit">编辑</button>
        <button class="common-button height38 marginL20" @click="dele">删除</button>
        <div class="check-bar marginL20">
          <div class="check-type">
            <spinner :content="mapArr[mapid]||'地图'" :list="mapArr" @sendValue="getMap"></spinner>
          </div>
          <div class="search-bar marginR20">
            <search-item holder="输入围栏信息"></search-item>
          </div>
        </div>
      </div>
      <div class="content">
        <transition-group
          tag="ul"
          class="monitor-grop-list left-content"
          @touchstart="getFirstY"
          @touchmove="scrollElement"
          ref="listBar"
        >
          <li class="grop-title list-title" key="title">
            <span class="first-item">
              <lh-checkbox @sendCheckMsg="selectAll" :isChecked="isAll"></lh-checkbox>
            </span>
            <span style="width:20%">{{ titleBar.name }}</span>
            <!--lfq-->
            <span style="width:15%">{{ titleBar.type }}</span>
            <span style="width:30%">{{ titleBar.map }}</span>
            <span class="first-item" style="width:15%">{{ titleBar.isShow }}</span>
          </li>
          <li
            v-for="(value, index) in classList"
            :key="index"
            @click="checkStaff(value.id)"
            class="list-item"
          >
            <span class="first-item">
              <lh-checkbox @sendCheckMsg="selectItem($event, index)" :isChecked="value.is_selected"></lh-checkbox>
            </span>
            <span style="width:20%">{{ value.name }}</span>
            <span style="width:15%">{{ value.type | formatType }}</span>
            <span style="width:30%">{{ value.map ? value.map.name:value.name }}</span>
            <span class="first-item" style="width:15%">
              <el-switch
                v-model="showArr[index]"
                active-color="#13ce66"
                inactive-color="#C0C0C0"
                :width="30"
                @change="showImg($event, index)"
              ></el-switch>
            </span>
          </li>
        </transition-group>
      </div>
      <div class="page-check">
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
  </div>
</template>
<script>
import LhCheckbox from "@/components/common/LhCheckbox.vue";
import SearchItem from "@/components/common/SearchItem.vue";
import Spinner from "@/components/common/Spinner.vue";
import PopTitle from "@/components/common/PopTitle.vue";

import params from "@/apis/commonParams.js";
import scrollMixin from "@/mixin/scrollMixin.js";

import {
  getPageFence,
  getFenceData,
  deleteFence,
  getClassFence
} from "@/apis/interfance.js";

export default {
  components: {
    LhCheckbox,
    SearchItem,
    Spinner,
    PopTitle
  },
  mixins: [scrollMixin],
  data() {
    return {
      classList: [],
      titleBar: {
        name: "围栏名称",
        type: "触发类型",
        map: "地图",
        isShow: "地图显示"
      },
      staffData: { persons: [] },
      total: 0,
      isAll: false,
      rightFlag: false,
      type: 3,
      typeArr: ["离开触发", "进入触发", "出入触发", "全部"],
      showArr: [
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      ],
      baseUrl: "",
      page: 1,
      mapid: "",
      mapArr: [
        "天府广场中间圆形区域",
        "",
        "天府广场负三楼一号线",
        "天府广场负四楼二号线"
      ]
    };
  },
  mounted() {
    this.baseUrl = params.imgUrl;
    this.update();
    this.getAllQueryMap();
  },
  methods: {
    getAllQueryMap() {},
    checkStaff(id) {
      this.rightFlag = true;
      getFenceData(id).then(data => {
        this.staffData = data;
      });
    },
    selectAll(flag) {
      this.classList.forEach(value => {
        value.is_selected = flag;
      });
    },
    selectItem(e, index) {
      this.classList[index].is_selected = e;
      this.isAll = this.classList.every(val => {
        return val.is_selected === true;
      });
    },
    add() {
      this.$router.push("/home/defencebuild");
    },
    edit() {
      let newArr = this.classList.filter(value => {
        return value.is_selected;
      });
      if (newArr.length !== 1) {
        this.$message.error("只能单独选择一个");
        return;
      }
      this.$emit("edit");
      getFenceData(newArr[0].id).then(data => {
        this.$store.state.fenceData = data;
        this.$router.push("/home/defenceedit");
      });
    },
    dele() {
      let arr = this.classList.filter(value => {
        return value.is_selected === true;
      });
      if (arr.length === 0) {
        this.$message.error("未选择删除项");
        return;
      }
      this.$confirm("此操作将永久删除该围栏, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.classList.forEach(value => {
            if (value.is_selected === true) {
              deleteFence(value.id)
                .then(() => {
                  this.$message({
                    message: "删除成功",
                    type: "success"
                  });
                  getPageFence(this.page).then(data => {
                    this.total = data.count;
                    data.results.forEach(value => {
                      value.is_selected = false;
                    });
                    this.classList = data.results;
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
    analyse() {
      this.$emit("analyse");
    },
    getType(content) {
      this.typeArr.forEach((value, index) => {
        if (value === content) {
          this.type = index;
        }
      });
    },
    getMap(content) {
      this.mapArr.forEach((value, index) => {
        if (value === content) {
          this.mapid = index;
        }
      });
      getClassFence(this.mapid + 1).then(data => {
        this.total = data.count;
        data.results.forEach(value => {
          value.is_selected = false;
        });
        this.showArr = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ];
        this.classList = data.results;
        this.classList.forEach((value, index) => {
          this.$store.state.defenceImgArr.forEach(val => {
            if (val.id == value.id) {
              this.showArr[index] = true;
            }
          });
        });
      });
    },
    showImg(e, index) {
      /*[{pints,id},{pints,id}]
       */
      if (e === true) {
        let { points, id, map, name } = this.classList[index],
          mapid = map.mapid;
        points = JSON.parse(points);
        this.$store.state.defenceImgArr.push({ points, id, mapid, name });
        this.$emit("findDefence", mapid);
      } else {
        let id = this.classList[index].id;
        this.$store.state.defenceImgArr.forEach((value, index) => {
          if (value.id === id) {
            this.$store.state.defenceImgArr.splice(index, 1);
          }
        });
      }
      this.saveDefence();
    },
    getData(page) {
      this.page = page;
      this.update();
    },
    update() {
      getPageFence(this.page).then(data => {
        this.total = data.count;
        data.results.forEach(value => {
          value.is_selected = false;
        });
        this.showArr = [
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false,
          false
        ];
        this.classList = data.results;
        this.classList.forEach((value, index) => {
          this.$store.state.defenceImgArr.forEach(val => {
            if (val.id == value.id) {
              this.showArr[index] = true;
            }
          });
        });
      });
    },
    saveDefence() {
      localStorage.setItem(
        "defence",
        JSON.stringify(this.$store.state.defenceImgArr)
      );
    },
    hidden() {
      this.rightFlag = false;
    }
  },
  computed: {},
  filters: {
    formatType(val) {
      let arr = ["离开触发", "进入触发", "出入触发"];
      return arr[val];
    }
  }
};
</script>

<style lang="less" scoped>
.fence {
  overflow: auto;
  box-sizing: border-box;
  .defence-list {
    width: 100%;
    color: #fff;
    margin: 0 auto;
    .left-content {
      width: 30%;
      height: 100%;
      flex-grow: 3;
    }
    .content-controller {
      display: flex;
      height: 7.7rem;
      line-height: 7.7rem;
      align-items: center;
      button {
        padding: 0 2rem;
        border-radius: 0.4rem;
      }
      & > div {
        margin-right: 2rem;
      }
      .active {
        // background-image: url(../images/set_hover.png);
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    .check-bar {
      display: flex;
      justify-content: space-between;
      flex-grow: 1;
      padding: 0.6rem 0 0.6rem 0;
      margin-right: 0px !important;

      .check-type {
        display: flex;
        // min-width: 20%;
        align-items: center;
        // margin-right: 20px;
        color: rgba(255, 255, 255, 1);
        & > div {
          flex-grow: 1;
        }
        .item {
          width: 18.4rem;
          padding-right: 0.4rem;
        }
      }
      .search-bar {
        width: 34.6rem;
        display: flex;
        justify-content: center;
      }
    }
    .monitor-grop-list {
      &::-webkit-scrollbar {
        /*滚动条整体样式*/
        width: 0.5rem; /*高宽分别对应横竖滚动条的尺寸*/
      }
      &::-webkit-scrollbar-thumb {
        /*滚动条里面小方块*/
        border-radius: 0.3rem;
        background: rgba(255, 255, 255, 0.3);
      }
      li {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding-left: 1rem;
        & > span {
          display: inline-block;
          width: 14%;
        }
        & > span:not(.first-item) {
          flex-grow: 1;
        }
        span:first-of-type {
          width: 8%;
        }
      }
    }
    .content {
      display: flex;
      height: 58rem;
    }
  }
}
.fence .el-switch__core {
  height: 1.2rem;
  // margin-left:-12px;
}
.fence .el-switch__core:after {
  width: 1rem !important;
  height: 1rem !important;
  top: 0;
  // margin-left: -10px;
}
.fence .el-switch.is-checked .el-switch__core::after {
  margin-left: -0.9rem;
}
.el-pagination__total {
  color: #fff !important;
}
</style>