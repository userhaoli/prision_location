<template>
  <div class="hjz-list pop-container">
    <pop-title :title="'互监组'"></pop-title>
    <div class="oper-bar">
      <div class="left-bar">
        <button class="common-button marginL20" @click="add">新增</button>
        <button class="common-button marginL20">删除选中</button>
        <button class="common-button marginL20">删除所有</button>
      </div>
      <div class="right-bar marginR20">
        <search-item></search-item>
      </div>
    </div>
    <ul class="list textCenter">
      <li class="item list-title">
        <div style="width:8%">
          <lh-checkbox></lh-checkbox>
        </div>
        <div>互监组名称</div>
        <div>人数</div>
        <div>距离（m）</div>
        <div>解除时间</div>
        <div class="oper">操作</div>
      </li>
      <li class="item list-item">
        <div style="width:8%">
          <lh-checkbox></lh-checkbox>
        </div>
        <div>互监组001</div>
        <div>10</div>
        <div>200</div>
        <div>2020-06-10</div>
        <div class="oper">
          <button class="common-button marginL20 height24" @click="showDetail">
            <span class="icon iconfont">&#xe625;</span>详情
          </button>
          <button class="common-button marginL20 height24" @click="edit">
            <span class="icon iconfont">&#xe66f;</span>修改
          </button>
          <button class="common-button marginL20 height24" @click="delet">
            <span class="icon iconfont">&#xe614;</span>删除
          </button>
        </div>
      </li>
    </ul>
    <div class="hjz-detail" v-show="detailFlag">
      <div class="pop-title">
        <span>互监组详情</span>
        <span class="icon iconfont marginR10" @click="closeDetail">&#xe640;</span>
      </div>
    </div>
  </div>
</template>

<script>
import SearchItem from "@/components/common/SearchItem.vue";
import LhCheckbox from "@/components/common/LhCheckbox.vue";
import PopTitle from "@/components/common/PopTitle.vue";

export default {
  components: {
    SearchItem,
    LhCheckbox,
    PopTitle
  },
  data() {
    return {
      detailFlag:false,
    };
  },
  mounted() {},
  methods: {
    add() {
      this.$router.push("/home/hjzadd");
    },
    showDetail() {
      this.detailFlag = true;
    },

    edit() {
      this.$router.push("/home/hjzedit");
    },
    delet() {},
    closeDetail(){
      this.detailFlag = false;
    }
  }
};
</script>

<style lang="less">
.hjz-list {
  position: relative;
  .oper-bar {
    height: 7.8rem;
    line-height: 7.8rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .left-bar {
      button {
        height: 3.8rem;
        line-height: 3.8rem;
        border-radius: 4px;
        padding: 0 2rem;
      }
    }
    .right-bar {
      width: 34.6rem;
    }
  }
  .list {
    width: 100%;
    margin: 0 auto;
    .item {
      display: flex;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
      padding-left: 2rem;
      font-size: 1.4rem;
      & > div {
        width: 16%;
      }
      .oper {
        width: 30%;
        button {
          font-size: 1.4rem;
        }
      }
    }
  }
  .hjz-detail {
    position: absolute;
    width: 60%;
    height: 60%;
    top: calc(~"50% - 30%");
    left: calc(~"50% - 30%");
    background: rgba(5, 15, 39, 1);
    border: 1px solid rgba(51, 119, 233, 1);
    box-shadow: 0px 9px 21px 0px rgba(12, 7, 4, 0.35);
    opacity: 0.95;
    border-radius: 5px;
  }
}
</style>