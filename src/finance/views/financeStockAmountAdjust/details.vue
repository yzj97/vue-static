<template>
  <finance-stock-amount-adjust-edit :new-merchant-id="this.$route.params.newMerchantId" :details-page-type="'details'"/>
</template>

<script>
import FinanceStockAmountAdjustEdit from './edit'

export default {
  name: 'FinanceStockAmountAdjustDetails',
  components: { FinanceStockAmountAdjustEdit }
}
</script>

<style scoped>

</style>
