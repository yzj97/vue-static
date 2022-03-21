<template>
  <div class="cms-warn-text">
    <div class="warn">{{ text }} </div>
  </div>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: () => ''
    }
  }
}
</script>

<style lang="less" scoped>
.cms-warn-text {
  .warn {
    color:red;
  }
}
</style>
