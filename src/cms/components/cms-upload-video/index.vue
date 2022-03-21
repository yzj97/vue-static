<template>
  <div class="cp-upload-video">
    <ody-upload-video v-model="value" name="value" />
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
  watch: {
    value: {
      handler(newValue) {
        console.log('视频', newValue)
        this.$emit('input', newValue)
      }
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
