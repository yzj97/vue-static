<template>
  <div class="cms-url">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="2048"
      :show-tip="false"
      name="value"
    />
    <div v-if="tip">{{ tip }}</div>
  </div>
</template>

<script>
import getImgWidthHeight from '@/utils/getImgWidthHeight'
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    formData: {
      type: Object,
      default: () => {}
    },
    tip: {
      type: String,
      default: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
        this.dispatch('ElFormItem', 'el.form.change', val)
        if (this.formData && this.formData.model && this.formData.model.imgInfo && val) {
          getImgWidthHeight(val).then(res => {
            this.formData.model.imgInfo = res
          })
        }
      }
    }
  },
  methods: {
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
