<template>
  <div>
    <button :style="size" @click="sendMsg" @touchstart.prevent="sendMsg">{{ content }}</button>
  </div>
</template>
<script>
export default {
  props: {
    size: {
      type: Object,
      default: () => {
        return {};
      }
    },
    content: {
      type: String
    }
  },
  data() {
    return {
      count: 0
    };
  },
  methods: {
    sendMsg() {
      this.$emit("checkClick", ++this.count);
    }
  }
};
</script>
<style lang="less">
button {
  font-size: 1.3rem;
  color: rgba(255, 255, 255, 1);
  background: rgba(54, 114, 195, 1);
  background-position: center;
  box-sizing: border-box;
  border: 0;
  border-radius: 0.3rem;
  padding: 0.2rem 0.6rem;
  line-height: 2.4rem;
  cursor: pointer;
  &:hover {
    background: rgba(61, 209, 255, 1);
    color: rgba(28, 46, 86, 1);
  }
}
</style>