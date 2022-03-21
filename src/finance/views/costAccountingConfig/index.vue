<template>
  <section class="pg-apSupplierInvoice-list">
    <div slot="content">
      <el-form ref="costAccountingConfig" :model="formData" :rules="rules" label-width="100px">
        <el-card shadow="never">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('common_merchant_name') + ':'">
                <ody-merchant-select
                  v-model="merchantId"
                  :selected.sync="selectedItem"
                  name="merchantId"
                  @change="changeMerchant()"
                >
                  <template slot-scope="scope">
                    <span style="float: left">{{ scope.item.label }}</span>
                    <span
                      style="float: right; color: #8492a6; font-size: 13px"
                    >{{ scope.item.value }}</span>
                  </template>
                </ody-merchant-select>
              </el-form-item>
            </el-col>
            <el-col :span="18">
              <ody-search-item :label="$t('cost_accounting_method') + ':'" prop="costAccountingMethod">
                <el-select v-model="formData.costAccountingMethod" name="formData_costAccountingMethod">
                  <el-option
                    v-for="item in costAccountingMethods"
                    :label="item.name"
                    :key="item.code"
                    :value="item.code"
                  />
                </el-select>
              </ody-search-item>
            </el-col>
          </el-row>
        </el-card>
      </el-form>
      <div v-show="saveShow" slot="btn" style="text-align: center;">
        <ody-button name="FinanceCostAccountingConfigSave_save" code="FinanceCostAccountingConfigSave" size="small" type="primary" @click="save">{{ $t('common_save') }}</ody-button>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FinanceCostAccountingConfig',
  data() {
    return {
      formData: {
        merchantName: '',
        merchantId: '',
        merchantCode: '',
        costAccountingMethod: '1'
      },
      merchantId: null,
      selectedItem: {},
      costAccountingMethods: [],
      saveShow: false
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    initCodes() {
      this.$finance.$api.common
        .queryCodeList({ category: 'COST_ACCOUNTING_METHOD' })
        .then(res => {
          this.costAccountingMethods = res.data
        })
    },
    save() {
      if (!this.selectedItem.merchantId) {
        this.$message({
          type: 'warning',
          message: this.$t('common_please_choose_merchant')
        })
        return
      }
      this.formData.merchantId = this.selectedItem.merchantId
      this.formData.merchantCode = this.selectedItem.merchantCode
      this.formData.merchantName = this.selectedItem.merchantName
      this.$finance.$api.costAccountingConfig
        .addCostAccountingConfig(this.formData)
        .then(result => {
          if (result && result.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            // this.updateList()
          }
        })
    },
    async changeMerchant() {
      if (this.selectedItem.merchantId) {
        const costAccountingConfig = this.$finance.$api.costAccountingConfig
        const result = await costAccountingConfig.getCostAccountingConfig({
          merchantId: this.selectedItem.merchantId
        })

        if (result && result.code === '0') {
          if (result.data != null) {
            result.data.costAccountingMethod =
              result.data.costAccountingMethod + ''
            Object.assign(this.formData, result.data)
          } else {
            this.formData.id = null
          }
        }
        const inventoryLogId = await this.$finance.$api.costAccountingConfig.getInventoryLogId(
          { merchantId: this.selectedItem.merchantId }
        )
        if (inventoryLogId && inventoryLogId.code === '0') {
          if (inventoryLogId.data == null) {
            this.saveShow = true
          } else {
            this.saveShow = false
          }
        }
      }
    },
    async init() {
      await this.initCodes()
    }
  }
}
</script>

<style scoped>
</style>
