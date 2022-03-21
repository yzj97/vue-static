<template>
  <div class="cms-channel-backgroundImg">
    <ody-upload-image
      v-model="value"
      :pic-type="['png', 'jpg']"
      :pic-size="750"
      :show-tip="false"
      name="value"
    />
    <span class="backgroundImg-tip">{{ $t('备注: 导航背景图片尺寸为750*160px') }}</span>
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
  data() {
    return {
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
  }
}
</script>

<style lang="scss" scoped>
.cms-channel-backgroundImg {
  display: flex;
  flex-direction: column;
}
.backgroundImg-tip{
font-size: 0.14rem;
color: #ef5351;
}
</style>
