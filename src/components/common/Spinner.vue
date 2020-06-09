<template>
  <div class="item" @mouseenter="enterSelection" @mouseleave="leaveSelection">
    <span @touchstart.stop.prevent="selectionTouch">
      {{ area }}
      <span class="icon iconfont">&#xe65a;</span>
    </span>
    <ul class="selection" v-show="selectShow" >
      <li v-for="(value,index) in list" :key="index" @click.stop="checkContent(value,index)" @touchstart.stop.prevent="checkContent(value,index)">{{ value }}</li>
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
    selectionTouch(){
      this.selectShow = !this.selectShow;
    },
    checkContent(content,index) {
      if(this.$store.state.isiPad){
          this.selectShow = false;
      }
      this.flag = false;
      // this.area = content;
      this.$emit("sendValue", content,index);
    },
    enterSelection(){
      this.selectShow = true;
    },
    leaveSelection(){
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
.item {
  border-radius: 0.5rem;
  line-height: 2rem;
  font-size: 1.4rem;
  position: relative;
  cursor: pointer;
  text-indent: 0.6rem;
  background: rgba(0, 0, 0, 0.2);
  padding-right: 0.4rem;
  &:hover {
    // background: rgba(39, 74, 127, 1);
    .selection {
      display: block;
    }
  }
  & > span {
    line-height: 3rem;
    display: flex;
    // background: rgba(0, 0, 0, 0.2);
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
    // background: #274a7f;
    color: #fff;
    // max-height: 8rem;
    overflow: auto;
    z-index: 10;
    display: block;
    background: rgba(49, 95, 157, 1);
    box-shadow: 1px 1px 1rem 0rem rgba(4, 0, 0, 0.5);
    border-radius: 0.3rem;
    line-height: 3rem;
    li {
      padding-left: 0.4rem;
      padding-right: 0.4rem;
      box-sizing: border-box;
    }
    li:hover {
      border-radius: 0.3rem;
      background: rgba(61, 209, 255, 1);
    }
  }
}
</style>