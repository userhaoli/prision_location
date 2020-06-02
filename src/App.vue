<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
export default {
  mounted() {
    this.computedRem();
    window.addEventListener("resize",()=>{
      this.computedRem();
    })
  },
  methods: {
    computedRem() {
      var docEl = document.documentElement;
      if (docEl.clientWidth > 1200) {
        docEl.style.fontSize = "10px";
      } else {
        docEl.style.fontSize = "8px";
      }
    }
  }
};
</script>

<style lang="less">
</style>
