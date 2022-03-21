<template>
  <div class="cms-slider">
    <div class="slider-height-wrapper">
      <span class="tip">{{ $t('轮播图高度可调整区间：(240~340px)') }}</span>
      <div class="height-wrapper">
        <div class="el-slider-wrapper">
          <el-slider v-model="value" :min="240" :max="340" name="height"/>
        </div>
        <div class="height">{{ value }}</div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
  components: {

  },
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
    }
  },
  computed: {
    backStyle() {
      return {
      }
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  mounted() {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.slider-height-wrapper{
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
