<template>
  <div class="hjz-list">
    <ul class="list">
      <li class="item">
        <div></div>
        <div>互监组名称</div>
        <div>人数</div>
        <div>距离（m）</div>
        <div>解除时间</div>
        <div>操作</div>
      </li>
      <li class="item">
        <div></div>
        <div>互监组001</div>
        <div>10</div>
        <div>200</div>
        <div>2020-06-10</div>
        <div class="oper"><span @click="showDetail">详情</span>|<span @click="edit">编辑</span>|<span @click="delet">删除</span></div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data(){
    return{
 
    }
  },
  mounted(){

  },
  methods:{
  showDetail(){
     
  },
  edit(){
    this.$router.push("/home/hjzedit")
  },
  dele(){

  }
  }
};
</script>

<style lang="less">
.hjz-list {
  font-size: 1.6rem;
  .list {
    width: 120rem;
    margin: 0 auto;
    .item {
      display: flex;
      align-items: center;
      width: 100%;
      & > div {
        width: 16%;
      }
      .oper{
        span{
          cursor: pointer;
          color: aqua;
          &:hover{
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>