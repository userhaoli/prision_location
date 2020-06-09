<template>
  <div class="control-item">
    <p>77</p>
    <p>总人数</p>
  </div>
</template>
<script>
export default {
  props: {
    src:{
      type:String,
      required:true
    },
  }
};
</script>

<style lang="less" scoped>
.control-item {
  width: 100%;
  height: 100%;
  text-align: center;
  color: #0096FF;
}

</style>