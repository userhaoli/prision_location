<template>
  <div class="search-item">
    <input type="text" :placeholder="holder" v-model="value" @keydown.enter="search" @blur="hidden" />
    <img src="../images/search.png" alt="这原本是张图片" @click="search" @touchstart="search" />
    <span class="icon iconfont vertical">&#xe605;</span>
    <button class="value-clear" @click="clearValue" v-show="value">
      <span class="icon iconfont">&#xe614;</span>
    </button>
  </div>
</template>
<script>
export default {
  props: {
    holder: {
      type: String
    }
  },
  data() {
    return {
      value: ""
    };
  },
  methods: {
    search() {
      this.$emit("search", this.value);
    },
    hidden() {
      this.flag = false;
    },
    clearValue() {
      this.value = "";
    }
  },
  watch: {
    value(val) {
      this.$emit("valueChange", val);
    }
  }
};
</script>

<style lang="less">
.search-item {
  width: 100%;
  height: 3.8rem;
  line-height: 3.8rem;
  position: relative;
  .value-clear {
    font-size: 1.4rem;
    position: absolute;
    right: 4.2rem;
    top: 0.8rem;
    width: 1.6rem;
    height: 1.6rem;
    line-height: 1.6rem;
    text-align: center;
    background: 0;
    border: 0;
    padding: 0;
    :hover {
      background: 0;
    }
  }
  input {
    width: 100%;
    height: 3.8rem;
    // line-height: 3.8rem;
    background: rgba(30, 159, 255, 0);
    border: 1px solid rgba(51, 119, 233, 1);
    border-radius: 0.2rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 1.6rem;
    box-sizing: border-box;
    text-indent: 1rem;
  }
  img {
    position: absolute;
    cursor: pointer;
    right: 0.8rem;
    top: 0.8rem;
  }
  .vertical {
    font-size: 2.4rem;
    color: rgba(51, 119, 233, 1);
    position: absolute;
    right: 2.4rem;
    top: 0rem;
  }
  .association-bar {
    position: absolute;
    width: 100%;
    height: 10rem;
    border: 1px solid rgba(178, 223, 255, 0.2);
    box-sizing: border-box;
    overflow: auto;
    line-height: 2rem;
    font-size: 1.4rem;
    text-indent: 0.4rem;
    background: rgba(0, 0, 0, 0.8);
    &::-webkit-scrollbar {
      /*滚动条整体样式*/
      width: 0.6rem; /*高宽分别对应横竖滚动条的尺寸*/
    }
    &::-webkit-scrollbar-thumb {
      /*滚动条里面小方块*/
      border-radius: 0.3rem;
      background: rgba(67, 97, 122, 1);
    }
  }
}
</style>