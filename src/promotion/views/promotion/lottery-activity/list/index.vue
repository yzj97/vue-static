<template>
  <promotion-list-type :type="5001" />
</template>

<script>
import PromotionListType from '@/components/promotion-list-type'

export default {
  name: 'PromLotteryPromotion',
  components: {
    PromotionListType
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
</style>
