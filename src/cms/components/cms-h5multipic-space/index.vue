<template>
  <div class="cms-h5multipic-space">
    <div class="h5multipic-wrapper">
      <el-slider v-model="value" :min="min" :max="max" :show-tooltip="showTooltip" name="value"/>
    </div>
    <span class="h5multipic-margin">{{ value }}px</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      min: 0,
      max: 10,
      showTooltip: false
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>
.cms-h5multipic-space{
  display: flex;
}
.h5multipic-wrapper{
  flex: 1;
}
.h5multipic-margin{
  margin-left: 0.08rem;;
}
</style>
