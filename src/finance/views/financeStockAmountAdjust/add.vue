<template>
  <finance-stock-amount-adjust-edit :new-merchant-id="this.$route.params.newMerchantId"/>
</template>

<script>
import FinanceStockAmountAdjustEdit from './edit'

export default {
  name: 'FinanceStockAmountAdjustAdd',
  components: { FinanceStockAmountAdjustEdit }
}
</script>

<style scoped>

</style>
