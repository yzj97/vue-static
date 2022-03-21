<template>
  <div class="cms-header-btn">
    <el-checkbox v-model="value.displayLocation" name="value_displayLocation">{{ $t('定位') }}</el-checkbox>
    <el-checkbox v-model="value.displayNews" name="value_displayNews">{{ $t('消息') }}</el-checkbox>
    <el-checkbox v-model="value.displayScan" name="value_displayScan">app端扫一扫</el-checkbox>
    <el-checkbox v-model="value.displayLang" name="value_displayLang">app端语言切换</el-checkbox>
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

<style scoped lang="scss">

</style>
