<template>
  <div class="record root-element">
    <ul class="record-list">
      <li>
        <span>考勤时间</span>
        <span>考勤区域</span>
        <span>应到人数</span>
        <span>已到人数</span>
        <span>缺勤人数</span>
        <span>操作</span>
      </li>
      <li>
        <span>2020-06-18 15:00:11</span>
        <span>公司模拟区域</span>
        <span>60</span>
        <span>58</span>
        <span>2</span>
        <span>导出excel</span>
      </li>
      <li></li>
      <li></li>
      <li></li>
    </ul>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.record {
  .record-list {
    li{
      span{
        width:15%;
      }
    }
  }
}
</style>