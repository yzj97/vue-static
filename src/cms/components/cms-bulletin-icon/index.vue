<template>
  <div class="cms-bulletin-icon">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="5120"
      :show-tip="false"
      name="value"
    />
    <el-button name="changeImgUrl" type="text" @click="changeImgUrl">{{ $t('恢复默认') }}</el-button>
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
  data() {
    return {
      defaultImgUrl: '//cdn.oudianyun.com/h5_static/icon-bulletin.png'
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    changeImgUrl() {
      this.value = this.defaultImgUrl
    }
  }
}
</script>

<style lang="scss" scoped>
.cms-bulletin-icon {
  display: flex;
}
</style>
