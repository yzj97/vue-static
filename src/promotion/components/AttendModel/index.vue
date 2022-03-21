<template>
  <el-radio-group v-model="activityType" name="activityType" @change="handleCheckedChange">
    <el-radio :label="1">{{ $t('build_by_oneself','') }}</el-radio>
    <el-radio :label="2">{{ $t('sign_up','') }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    activityType: {
      type: Number,
      default() {
        return 1
      }
    }
  },
  data() {
    return {

    }
  },
  async mounted() {

  },
  methods: {
    handleCheckedChange(value) {
      this.$emit('update:activityType', value)
    }
  }
}
</script>

<style scoped>
</style>
