<template>
  <el-link :underline="true" name="toDetail" type="primary" @click="toDetail">
    <slot/>
  </el-link>
</template>

<script>
import soUtils from '@/utils/soUtils'

export default {
  props: {
    orderCode: {
      type: String,
      default: null
    },
    orderSource: {
      type: Number,
      default: -1
    },
    sysSource: {
      type: String,
      default: null
    }
  },
  data() {
    return {
    }
  },
  methods: {
    toDetail() {
      const vm = this
      soUtils.toOrderDetail(vm, vm.orderCode, vm.orderSource, vm.sysSource)
    }
  }
}
</script>
