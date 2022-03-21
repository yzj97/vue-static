<template>
  <div class="cms-title-url">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="5120"
      :show-tip="false"
      :disabled="getDisabled"
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
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  computed: {
    getDisabled() {
      if (this.formData.model.titleType === 2) {
        return false
      } else {
        return true
      }
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
