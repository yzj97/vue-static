<template>
  <el-card>
    <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
      <el-tab-pane :label="$t('productInfo')" name="productInfo">
        <product-commission-set :merchant-id.sync="merchantId" :merchant-name.sync="merchantName"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('brandInfo')" name="brandInfo" >
        <brand-commission-set :merchant-id.sync="merchantId" :merchant-name.sync="merchantName"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('categoryInfo')" name="categoryInfo" >
        <category-commission-set :merchant-id.sync="merchantId" :merchant-name.sync="merchantName"/>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import ProductCommissionSet from '@/components/productCommissionSet'
import BrandCommissionSet from '@/components/brandCommissionSet'
import CategoryCommissionSet from '@/components/categoryCommissionSet'

export default {
  name: 'AgentStoreCommissionParameterSet',
  components: {
    ProductCommissionSet,
    BrandCommissionSet,
    CategoryCommissionSet
  },
  data() {
    return {
      merchantId: null,
      merchantName: null,
      commissionType: null
    }
  },
  async mounted() {
    try {
      if (this.$route.query.commissionId) {
        this.commissionId = this.$route.query.commissionId
      }
      if (this.$route.query.merchantId) {
        this.merchantId = this.$route.query.merchantId
      }
      if (this.$route.query.merchantName) {
        this.merchantName = this.$route.query.merchantName
      }
      if (this.$route.query.commissionType) {
        if (this.$route.query.commissionType === 2) {
          this.activeName = 'productInfo'
        }
        if (this.$route.query.commissionType === 3) {
          this.activeName = 'brandInfo'
        }
        if (this.$route.query.commissionType === 5) {
          this.activeName = 'categoryInfo'
        }
      } else {
        this.activeName = 'productInfo'
      }
    } catch (ex) {
      console.log(ex)
    }
  },
  handleClick() {
    this.currentTab = this.tabs[this.activeName]
  }
}
</script>
<style lang="scss" scoped>
  .el-container {
    border: #ededed 1px solid;
    margin-bottom: 20px;
  }

  .el-header {
    background-color: #d6d6d6;
    color: #333;
    text-align: left;
    line-height: 60px;
  }

  .el-main {
    background-color: #e9eef3;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

</style>
