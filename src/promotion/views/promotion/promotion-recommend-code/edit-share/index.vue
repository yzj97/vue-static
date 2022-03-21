<template>
  <div>
    <promotion-recommend-code-detail :is-edit="true"/>
  </div>
</template>
<script>
import PromotionRecommendCodeDetail from '@/components/promotion-recommend-code-detail'

export default {
  name: 'PromRecommendCodeEditShare',
  components: {
    PromotionRecommendCodeDetail
  }
}
</script>
