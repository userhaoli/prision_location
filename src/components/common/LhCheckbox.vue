<template>
  <div class="lh-checkbox">
    <label @click="sendCheckData">
      <input type="checkbox" :checked="isChecked" ref="checkbox"  />
      <span></span>
      {{content}}
    </label>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String
    },
    isChecked: {
      type: Boolean
    }
  },
  methods: {
    sendCheckData() {
      this.$emit("sendCheckMsg", this.$refs.checkbox.checked);
    }
  },
};
</script>

<style lang="less" scoped>
.lh-checkbox {
  cursor: pointer;
  input {
    display: none;
  }
  span {
    display: inline-block;
    width: 1.4rem;
    height: 1.4rem;
    margin-right: 0.6rem;
    background: url(../images/check.png) no-repeat;
    background-size: 100% 100%;
    background-position: center;
  }
  input:checked + span {
    background: url(../images/checked.png) no-repeat;
    background-position: center;
    background-size: 100% 100%;
  }
  label {
    display: flex;
    align-items: center;
  }
}
</style>