<template>
  <div class="cms-header-background">
    <el-radio-group v-model="value.style" name="value_style" class="radio-group-wrapper" >
      <div class="radio-item mb10">
        <el-radio :label="1" class="label">{{ $t('单色') }}</el-radio>
        <el-color-picker v-model="value.color" name="value_color"/>
      </div>
      <div class="radio-item">
        <el-radio :label="2" class="label">{{ $t('渐变色') }}</el-radio>
        <el-color-picker v-model="value.startColor" name="value_startColor" class="mr10"/>
        <el-color-picker v-model="value.endColor" name="value_endColor"/>
      </div>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.mb10{
  margin-bottom: 10px;
}
.mr10 {
  margin-right: 10px;
}
.radio-item {
  display: flex;
  align-items: center;

  .label{
    width: 50px;
  }
}
</style>
