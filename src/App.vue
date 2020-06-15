<template>
  <div id="app">
    <div class="title-style">
      <span class="icon iconfont" @click="routeBack">&#xe608;</span>
      <h1>UWB高精度定位系统</h1>
      <div class="account">
        <div class="user-message">
          <span class="icon iconfont">&#xe607;</span>
          <span class="message-num">11</span>
        </div>
        <img src="/images/favicon.ico" alt />
        <button>注销</button>
      </div>
    </div>
    <router-view />
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
    routeBack() {
      this.$router.back();
    }
  }
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
    & > .icon {
      position: absolute;
      font-size: 2.4rem;
      left: 2rem;
      top: 1rem;
      color: #00071d;
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
      align-items: center;
      .user-message {
        width: 4rem;
        height: 4rem;
        text-align: center;
        cursor: pointer;
        position: relative;
        & > .icon {
          line-height: 5rem;
          font-size: 2.8rem;
          color: #fff;
        }
        .message-num{
          color:rgb(44, 39, 39);
          position: absolute;
          bottom:0;
          right:0;
          background:rgb(196, 47, 47);
          border-radius: 1rem;
        }
      }
      img {
        width: 4rem;
        cursor: pointer;
      }
      button {
        color: #fff;
        font-size: 1.4rem;
        cursor: pointer;
        height: 3.2rem;
        line-height: 4.6rem;
        background: 0;
        &:focus {
          outline: none;
        }
      }
    }
  }
}
</style>
