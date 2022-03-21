<template>
  <div class="cms-choose-goods-type">
    <el-radio-group v-model="value" name="value">
      <el-radio :label="0">{{ $t('手动选品') }}</el-radio>
      <el-radio :label="1">{{ $t('促销选品') }}</el-radio>
    </el-radio-group>
    <div class="tip">
      注意：切换选品方式会丢失原来的商品数据
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    formData: {
      type: Object,
      default: () => {}
    },
    updateModule: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      moduleId: this.formData.id
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
        this.updateCmsModule()
      }
    }
  },
  methods: {
    updateCmsModule() {
      if (this.updateModule) {
        this.updateModule(this.formData)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.tip {
  color: #EF5351;
  font-size: 14px;
}
</style>
