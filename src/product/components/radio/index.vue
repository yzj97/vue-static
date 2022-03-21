<template>
  <el-radio-group
    v-model="value"
    :disabled="disabled"
    name="value"
    @change="handleChange">
    <el-radio
      v-for="item in list"
      :label="item.value"
      :key="item.value">
      {{ $t(item.label) }}
    </el-radio>
  </el-radio-group>
</template>

<script>
import constants from '@/utils/constants'

export default {
  props: {
    listKey: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: []
    }
  },
  mounted() {
    this.list = constants[this.listKey]
  },
  methods: {
    handleChange(val) {
      this.$emit('input', val)
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
