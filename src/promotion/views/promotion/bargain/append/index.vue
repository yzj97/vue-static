<template>
  <div class="append-goods">
    <ody-box :title="$t('砍价增加商品')">
      <promotion-view-title :detail="detail" />
      <promotion-bargain-product
        ref="addProduct"
        :append="true"
        :prom-type="promotionType"
        :promotion-id="promotionId"
      />
      <ody-fixed>
        <ody-button
          name="handleComplete"
          type="primary"
          code="button010"
          @click="handleComplete"
        >{{ $t('确认添加') }}</ody-button>
      </ody-fixed>
    </ody-box>
  </div>
</template>
<script>
import PromotionBargainProduct from '@/components/promotion-bargain-product'
import PromotionViewTitle from '@/components/promotion-view-title'
export default {
  name: 'PromSinglePromotionAppend',
  components: {
    PromotionBargainProduct,
    PromotionViewTitle
  },
  data() {
    return {
      promotionType: '',
      promotionId: '',
      detail: {}
    }
  },
  created() {
    this.promotionType = parseInt(this.$route.params.promotionType, 10)
    this.promotionId = parseInt(this.$route.params.promotionId, 10)
    this.promotionAPI = this.$promotion.$api.promotion
  },
  mounted() {
    this.queryPromotionView()
  },
  methods: {
    queryPromotionView() {
      const params = {
        activityId: this.promotionId,
        promType: this.promotionType
      }
      this.promotionAPI.queryPromotionView(params).then(res => {
        this.detail = res.data
      })
    },
    checkAppend() {
      let flag = false
      const list = this.$refs.addProduct.getUseAppendList()
      list.map(item => {
        if (item.isAvailable === 0) {
          flag = true
        }
      })
      return flag
    },
    async handleComplete() {
      if (this.checkAppend() === false) {
        this.$message({
          type: 'warning',
          message: this.$t('请先添加追加商品')
        })
        return
      }
      const res = await this.$refs.addProduct.comfirm()
      if (res) {
        this.$refs.addProduct.appendSave()
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
