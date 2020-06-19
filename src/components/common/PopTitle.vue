<template>
  <div class="pop-title">
    <span>{{title}}</span>
    <span class="icon iconfont marginR10" @click="routerBack">&#xe640;</span>
  </div>
</template>

<script>
export default {
  props:["title"],
  methods: {
    routerBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="less">
</style>