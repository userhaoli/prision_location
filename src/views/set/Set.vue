<template>
  <div class="set root-element">
    <div class="wrapper">
      <ul class="nav">
        <li>显示</li>
        <li>报警</li>
        <li>考勤</li>
        <li>设备</li>
      </ul>
      <div class="content">
        <div class="set-show">
          <input type="checkbox" />基站
          <input type="checkbox" />摄像头
          <input type="checkbox" />人员
          <input type="checkbox" />围栏
          <input type="checkbox" />水滴图
        </div>
        <div class="set-alarm">
          <input type="checkbox" />基站
          <input type="checkbox" />摄像头
        </div>
        <div class="set-attendance">
          <input type="checkbox" />基站
          <input type="checkbox" />摄像头
        </div>
        <div class="set-equip">
           定位频率:<input type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.set {
  display: flex;
  justify-content: center;
  align-items: center;
  .wrapper {
    background: #4491f8;
    width: 60rem;
    height: 60rem;
    display: flex;
    border-radius: 1rem;
    .nav {
      width: 20%;
      height: 100%;
    }
    .content {
      width: 80%;
      height: 100%;
      .set-show {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>