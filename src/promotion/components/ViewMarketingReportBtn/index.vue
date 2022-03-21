<template>
  <div>
    <ody-button
      size="small"
      type="primary"
      name="viewMarketingReport"
      code="button012"
      @click="viewMarketingReport"
    >
      {{ $t('查看营销报告') }}
    </ody-button>
  </div>
</template>

<script>
export default {
  components: {

  },
  props: {
    promotionId: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {

    }
  },
  created() {
    console.log(this.promotionId, 999)
  },
  methods: {
    viewMarketingReport() {
      this.$router.push({
        name: 'ObiShowActivityEffectReport',
        query: { id: +this.promotionId }
      })
    }
  }
}
</script>

<style scoped>

</style>
