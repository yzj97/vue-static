<template>
  <div class="cms-title-url">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="5120"
      :show-tip="false"
      name="value"
    />
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
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

</style>
