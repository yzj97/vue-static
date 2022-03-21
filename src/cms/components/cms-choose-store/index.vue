<template>
  <div class="cms-choose-store">
    <ody-store-choose
      :key="params"
      v-model="value"
      :params="params"
      :multiple="true"
      :collapse-tags="true"
      :placeholder="$t('请选择')"
      name="value"
      type="select"
      value-key="storeId"
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
      default: () => ({ model: { channelCodeList: [] }})
    }
  },
  data() {
    return {
      params: {
        channelCodes: this.formData.model.channelCodeList
      }

    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    },
    'formData.model.channelCodeList': {
      handler(val) {
        this.params = {
          channelCodes: this.formData.model.channelCodeList
        }
        this.value = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cms-choose-store {

}
</style>
