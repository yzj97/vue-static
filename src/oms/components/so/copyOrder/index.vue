<template>
  <div>
    <ody-button name="commit" type="primary" size="mini" @click="commit">{{ $t('复制') }}</ody-button>
  </div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: String,
      default: null
    }
  },
  methods: {
    commit() {
      this.$router.push({ name: 'OmsOrderCopy', params: { fromOrderCode: this.orderCode }})
    }
  }
}
</script>

<style scoped>

</style>
