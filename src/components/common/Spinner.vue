<template>
  <div class="spinner-item height38" @mouseenter="enterSelection" @mouseleave="leaveSelection">
    <span @touchstart.stop.prevent="selectionTouch">
      {{ area }}
      <span class="icon iconfont">&#xe65a;</span>
    </span>
    <ul class="selection" v-show="selectShow">
      <li
        v-for="(value,index) in list"
        :key="index"
        @click.stop="checkContent(value,index)"
        @touchstart.stop.prevent="checkContent(value,index)"
      >{{ value }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  props: ["content", "list"],
  data() {
    return {
      flag: false,
      area: this.content,
      selectShow: false
    };
  },
  methods: {
    check() {
      this.flag = !this.flag;
    },
    selectionTouch() {
      this.selectShow = !this.selectShow;
    },
    checkContent(content, index) {
      if (this.$store.state.isiPad) {
        this.selectShow = false;
      }
      this.flag = false;
      this.$emit("sendValue", content, index);
    },
    enterSelection() {
      this.selectShow = true;
    },
    leaveSelection() {
      this.selectShow = false;
    }
  },
  watch: {
    content(val) {
      this.area = val;
    }
  }
};
</script>

<style lang="less" scopeds>
.spinner-item {
  border-radius: 0.5rem;
  position: relative;
  cursor: pointer;
  text-indent: 0.6rem;
  background: rgba(82, 145, 255, 1);
  border-radius: 0.4rem;
  font-size: 1.6rem;
  &:hover {
    background: rgba(38, 67, 158, 1);
    .selection {
      display: block;
    }
  }
  & > span {
    display: flex;
    border-radius: 0.5rem;
    opacity: 0.8;
    span {
      display: inline-block;
      font-size: 1.8rem;
      flex-grow: 1;
      text-align: right;
    }
  }
  .selection {
    width: 100%;
    position: absolute;
    left: 0;
    color: #fff;
    overflow: auto;
    z-index: 10;
    display: block;
    background: rgba(38, 67, 158, 1);
    box-shadow: 0px 1px 1.8rem 0px rgba(6, 26, 77, 0.71);
    border-radius: 0.2rem;
    li {
      height: 3.8rem;
      padding:0 0.4rem;
      box-sizing: border-box;
    }
    li:hover {
      border-radius: 0.3rem;
      background: rgba(82, 145, 255, 0.87);
    }
  }
}
</style>