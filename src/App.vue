<template>
  <div id="app">
    <div class="title-style">
      <span class="icon iconfont" @click="routeBack">&#xe608;</span>
      <h1>UWB高精度定位系统</h1>
      <div class="account">
        <img src="/images/favicon.ico" alt />
        <button>注销</button>
      </div>
    </div>
    <router-view/>
  </div>
</template>
<script>
export default {
  mounted() {
    this.computedRem();
    window.addEventListener("resize", () => {
      this.computedRem();
    });
  },
  methods: {
    computedRem() {
      var docEl = document.documentElement;
      if (docEl.clientWidth > 1200) {
        docEl.style.fontSize = "10px";
      } else {
        docEl.style.fontSize = "8px";
      }
    },
    routeBack(){
     this.$router.back();
    }
  },
};
</script>

<style lang="less">
#app {
  background: #00071d;
  color: #fff;
  .title-style {
    position: relative;
    height: 8rem;
    width: 100%;
    background: url("/images/title.png") no-repeat;
    background-size: 100% 100%;
    .icon {
      position: absolute;
      font-size: 2.4rem;
      left: 2rem;
      top: 1rem;
      color:#00071d;
      &:hover {
        color: aqua;
      }
    }
    h1 {
      width: 23rem;
      font-size: 2.4rem;
      margin: 0 auto;
      height: 6rem;
      line-height: 6rem;
    }
    .account {
      position: absolute;
      right: 2rem;
      top: 0.6rem;
      display: flex;
      img {
        width: 4rem;
        cursor: pointer;
      }
      button {
        color: #fff;
        font-size: 1.4rem;
        cursor: pointer;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
