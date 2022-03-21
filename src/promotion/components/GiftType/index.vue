<template>
  <el-radio-group v-model="giftType" name="giftType" @change="handleChangeGiftType">
    <el-radio :label="1">{{ $t('gift_of_goods') }}</el-radio>
    <el-radio :label="2">{{ $t('gift_coupon') }}</el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    giftType: {
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
    handleChangeGiftType(value) {
      this.$emit('update:giftType', value)
    }
  }
}
</script>

<style scoped>
</style>
