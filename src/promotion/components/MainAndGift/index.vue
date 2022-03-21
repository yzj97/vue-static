<template>
  <el-radio-group v-model="giftSameAsProductFlg" name="giftSameAsProductFlg" @change="handelChangeGiftSame">
    <el-radio :label="1">{{ $t('yes') }}</el-radio>
    <el-radio :label="2">{{ $t('no') }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    giftSameAsProductFlg: {
      type: Number,
      default() {
        return 2
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
    handelChangeGiftSame(value) {
      this.$emit('update:giftSameAsProductFlg', value)
      this.$emit('change', value)
    }
  }
}
</script>

<style scoped>
</style>
