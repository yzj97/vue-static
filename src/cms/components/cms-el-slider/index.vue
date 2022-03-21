<template>
  <div class="cms-el-slider">
    <div class="height-wrapper">
      <div class="el-slider-wrapper">
        <el-slider v-model="value" v-bind="$attrs" name="height"/>
      </div>
      <div class="height">{{ value }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cms-el-slider {
 .height-wrapper{
    display: flex;
    align-items: center;
    .el-slider-wrapper{
      flex: 1;
    }
    .height{
      min-width: 0.58rem;
      height: 0.2rem;
      line-height: 0.2rem;
      border: 0.01rem solid #eee;
      text-align: center;
      margin-left: 0.15rem;
      color: #333;
      border-radius: 0.02rem;
    }
    .height::after{
      content: 'px';
      color: #ccc;
      padding-left: 0.03rem;
    }
  }
}
</style>
