<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('商品备注') }}</strong>
        <BeverageRemarks
          ref="beverageremark"
          :id="mpId"
          :warehouse-type="warehouseType"
          :merchant-id="merchantId"
          :charging-group-vos="chargingGroupVOS"
          :data-type="mp.dataType"
          :is-view="isView"
        />
      </div>
    </el-card>
  </section>
</template>

<script>
import BeverageRemarks from '@/components/beverageRemarks'
export default {
  components: {
    BeverageRemarks
  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chargingGroupVOS: this.mp.chargingGroupVOS,
      mpId: this.mpId,
      warehouseType: null,
      merchantId:
        this.mp.dataType * 1 === 1 ? null : this.mp.productVO.merchantId
    }
  },
  mounted() {
    this.warehouseType = this.mp.productInfoVO.warehouseType
    this.init()
  },
  methods: {
    init() {},
    getData(emit) {
      const data = this.$refs.beverageremark.$refs.remarkGroup
      var result = data.ruleFormValidate()
      if (result) {
        if (emit) {
          this.$set(
            this.mp,
            'chargingGroupVOS',
            this.$refs.beverageremark.remarkGroupList
          )
        }
      }
      return result
    },
    validate() {
      return this.getData()
    },
    preSubmit() {
      this.getData(true)
    }
  }
}
</script>
<style scoped>
</style>
