<template>
  <div class="cms-channel-choose-template">
    <el-radio-group v-model="value" name="value">
      <el-radio v-for="(item,index) in configData.navigationTemplete" :key="index" :label="item.label">{{ item.name }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import configData from './config.js'
export default {
  props: {
    value: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      configData
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
.cms-bulletin-icon {
  display: flex;
}
</style>
