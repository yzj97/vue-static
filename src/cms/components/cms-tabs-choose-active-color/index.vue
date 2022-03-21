<template>
  <div class="cp-tabs-choose-color">
    <div class="content-page">
      <div class="content">
        <div class="font-size">
          <span>{{ $t('字体') }}</span>
          <el-color-picker v-model="value.activeFontColor" name="value_activeFontColor"/>
        </div>
        <div class="bgColor">
          <span>{{ $t('背景') }}</span>
          <el-color-picker v-model="value.activeBgColor" name="value_activeBgColor"/>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
  .cp-tabs-choose-color {
    position: relative;
    .content{
      display: flex;
      font-size: 0.14rem;
      color: #666;
    }
    .bgColor {
      display: flex;
      span{
        margin-right: 0.05rem;
      }
    }
    .font-size {
      display: flex;
      margin-right: 0.7rem;
      span{
        margin-right: 0.05rem;
      }
    }
  }
</style>
