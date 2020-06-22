<template>
  <div id="app">
    <div class="title-style" ref="titleBar">
      <div class="container">
        <div class="time">
          <img src="./views/UI/clock.png" alt="这是个小图标" />
          <p>2020-06-17 17:48:43</p>
        </div>
        <h1>UWB高精度定位系统</h1>
        <div class="account">
          <div class="user-message">
            <span class="icon iconfont">&#xe6eb;</span>
            <span class="message-num"></span>
          </div>
          <img src="/images/favicon.ico" alt />
          <button>注销</button>
        </div>
      </div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    this.$store.state.titleBar = this.$refs.titleBar;
    console.log("111")
    this.computedRem();
    window.addEventListener("resize", () => {
      this.computedRem();
    });
    window.addEventListener("load", () => {
      let data = JSON.parse(localStorage.getItem("defence"));
      this.$store.state.defenceImgArr = data ? data : [];
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
  background-color: #00071d;
  color: #fff;
  .title-style {
    position: relative;
    width: 100%;
    height: 5.5rem;
    .container {
      position: absolute;
      height: 7.5rem;
      width: 100%;
      background-color: rgba(36, 24, 24, 0.2);
      background: url("./views/UI/title.png") no-repeat;
      background-size: 100% 100%;
      z-index: 10;
      & > .time {
        position: absolute;
        font-size: 1.8rem;
        left: 9.5rem;
        top: 1.5rem;
        display: flex;
        align-items: center;
        color:#3DD1FF;
        img {
          width: 2.4rem;
          margin-right: 1rem;
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
          margin-right: 2.4rem;
          text-align: center;
          cursor: pointer;
          position: relative;
          & > .icon {
            line-height: 5rem;
            font-size: 2.8rem;
            color: #fff;
          }
          .message-num {
            display: block;
            width: 0.8rem;
            height: 0.8rem;
            color: rgb(44, 39, 39);
            position: absolute;
            top: 1.1rem;
            right: 1.1rem;
            background: rgb(196, 47, 47);
            border-radius: 1rem;
          }
        }
        img {
          width: 4rem;
          cursor: pointer;
          border-radius: 2rem;
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
}
</style>
