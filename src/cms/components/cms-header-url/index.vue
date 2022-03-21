<template>
  <div class="cms-title-url">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="5120"
      :show-tip="false"
      name="value"
    />
    <div class="tip">{{ tip }}</div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    tip: {
      type: String,
      default: '备注: 添加图片尺寸为40*40px, 切换样式恢复默认'
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

<style lang="scss" scoped>
.tip {
  color: #EF5351;
  font-size: 12px;
}
</style>
