<template>
  <div class="batch-attr-unit-value-form-item">
    <el-form-item
      :rules="[ { required: attr.required, message: $t('请输入保质期'), trigger: 'blur' } ]"
      :prop="'temp_batchAttrs.' + index + '.unitValue'"
      style="display: inline-block;">
      <ody-input-number
        v-model="attr.unitValue"
        :empty-tip="false"
        :placeholder="$t('请输入保质期')"
        @input="handleUnitValueInput"/>
    </el-form-item>
    {{ attr.unit }}
  </div>
</template>

<script>
export default {
  props: {
    attr: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {}
  },
  methods: {
    handleUnitValueInput() {
      this.attr.unitAttr = (this.attr.unitValue || '') + (this.attr.unit || '')
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-attr-unit-value-form-item {
  display: inline-block;
}
</style>
