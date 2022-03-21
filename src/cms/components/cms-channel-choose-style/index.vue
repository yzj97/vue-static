<template>
  <div class="cms-channel-choose-template">
    <el-radio-group v-model="value" name="value">
      <el-radio v-for="(item,index) in navigationStyle" :key="index" :label="item.label">{{ item.name }}</el-radio>
    </el-radio-group>
  </div>
</template>

<script>
import ConfigData from './config.js'
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    formData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      ConfigData,
      navigationStyle: []
    }
  },
  watch: {
    'formData.model.selected': {
      handler(val) {
        this.navigationStyle = this.ConfigData.styleModel[this.formData.model.selected - 1]
      }
    },
    value: {
      handler(val) {
        this.$emit('input', val)
      }
    }
  },
  mounted() {
    var selected = this.formData.model.selected - 1
    this.navigationStyle = this.ConfigData.styleModel[selected]
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
