<template>
  <div class="set pop-container">
    <pop-title :title="'系统设置'"></pop-title>
    <div class="container">
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
          定位频率:
          <input type="text" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PopTitle from "@/components/common/PopTitle.vue";
export default {
  components: {
    PopTitle
  }
};
</script>

<style lang="less">
.set {
  justify-content: center;
  align-items: center;
  width: 40%;
  height: 60%;
  position: absolute;
  top: calc(~"50% - 40%");
  left: calc(~"50% - 20%");
  // margin: 0 auto;
  background: rgba(5, 15, 39, 1);
  border: 1px solid rgba(51, 119, 233, 1);
  box-shadow: 0px 0.9rem 2.1rem 0px rgba(12, 7, 4, 0.35);
  opacity: 0.95;
  border-radius: 0.5rem;
  .container {
    display: flex;
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