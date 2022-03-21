<template>
  <section class="section">
    <el-card >
      <div slot="header" class="clearfix">
        <strong>{{ $t('商品保障') }}</strong>
        <el-tooltip :content="$t('用于在前端页面展示该商品享有的服务保障项目')" class="item" effect="light" placement="right">
          <i class="el-icon-info"/>
        </el-tooltip>
      </div>
      <el-form-item>
        <el-checkbox-group v-model="checkboxGroup" name="checkboxGroup">
          <el-checkbox v-for="item in merchantProdSecurityList" :checked="item.checked" :key="item.id" :label="item.id" >{{ item.title }} </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-card>
  </section>
</template>

<script>
export default {
  components: {

  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      checkboxGroup: [], // 选中的
      merchantProdSecurityList: [] // 商品保障
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadPlantProtected()
    },
    async loadPlantProtected() {
      let type = this.mp.productVO.sourceType
      if (!type) {
        type = this.mp.dataType
      }
      let promise
      if (type === 1) {
        promise = this.$product.$api.mpApi.querySelectedPlatformMpProtectionList
      } else {
        promise = this.$product.$api.mpApi.queryMerchantProdSecurityList
      }
      const param = { }
      if (this.mp.productVO.merchantId) {
        param.merchantId = this.mp.productVO.merchantId.toString()
      }
      if (this.mp.productInfoVO.id) {
        param.merchantProdId = this.mp.productInfoVO.id.toString()
      }
      const { data } = await promise(param)
      this.merchantProdSecurityList = data || []

      if (this.mp.relationPOS) {
        this.mp.relationPOS.forEach(item => {
          if (item.securityId) {
            this.checkboxGroup.push(item.securityId)
          }
        })
      }
    },
    preSubmit() {
      const merchantSecurityRelationPOS = []
      this.merchantProdSecurityList.forEach(item => {
        if (this.checkboxGroup.indexOf(item.id) >= 0) {
          merchantSecurityRelationPOS.push({ securityId: item.id })
        }
      })
      this.$set(this.mp, 'relationPOS', merchantSecurityRelationPOS)
    }
  }
}

</script>
<style scoped>
</style>
