<template>
  <div class="hjz-list pop-container">
    <div class="pop-title">互监组</div>
    <div class="oper-bar">
      <div class="left-bar">
        <button class="common-button marginL20">新增</button>
        <button class="common-button marginL20">删除选中</button>
        <button class="common-button marginL20">删除所有</button>
      </div>
      <div class="right-bar marginR20">
        <search-item></search-item>
      </div>
    </div>
    <ul class="list textCenter">
      <li class="item list-title">
        <div></div>
        <div>互监组名称</div>
        <div>人数</div>
        <div>距离（m）</div>
        <div>解除时间</div>
        <div class="oper">操作</div>
      </li>
      <li class="item list-item">
        <div></div>
        <div>互监组001</div>
        <div>10</div>
        <div>200</div>
        <div>2020-06-10</div>
        <div class="oper">
           <button class="common-button marginL20 height24"><span class="icon iconfont">&#xe625;</span>详情</button>
           <button class="common-button marginL20 height24"><span class="icon iconfont">&#xe66f;</span>修改</button>
           <button class="common-button marginL20 height24"><span class="icon iconfont">&#xe614;</span>删除</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import SearchItem from "@/components/common/SearchItem.vue";
export default {
  components: {
    SearchItem
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {
    showDetail() {},
    edit() {
      this.$router.push("/home/hjzedit");
    },
    delet() {}
  }
};
</script>

<style lang="less">
.hjz-list {
  .oper-bar{
     height: 7.8rem;
     line-height: 7.8rem;
     display: flex;
     justify-content: space-between;
     align-items: center;
     .left-bar{
       button{
          height: 3.8rem;
          line-height: 3.8rem;
          border-radius:4px;
          padding:0 2rem;
       }
     }
     .right-bar{
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
      & > div {
        width: 16%;
      }
      .oper {
         width: 30%;
         button{
           font-size: 1.4rem;
         }
      }
    }
  }
}
</style>