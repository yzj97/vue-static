<template>
  <section>
    <ody-dialog-full-right
      :visible.sync="dialogVisible"
      :title="$t('newly_added')"
      @open="open"
      @close="close"
    >
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <ody-search-item :label="$t('purchase_plan_filed_code')+':'" prop="planType">
                <span>{{ data.templateCode }}</span>
              </ody-search-item>
              <ody-search-item :label="$t('merchant_name')+':'">
                <span>{{ data.merchantName }}</span>
              </ody-search-item>
              <ody-search-item :label="$t('purchase_plan_type')+':'">
                <el-select
                  v-if="!isShow"
                  v-model="data.planType"
                  :placeholder="$t('common_choose_please')"
                  name="data_planType"
                >
                  <el-option
                    v-for="(item,index) in planTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.code"
                  />
                </el-select>
                <span v-else>{{ data.planTypeStr }}</span>
              </ody-search-item>
            </el-form>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div v-if="!isShow" slot="btn">
            <ody-button
              name="OpmsPurchasePlanTemplate06_visible"
              size="small"
              type="primary"
              code="OpmsPurchasePlanTemplate06"
              @click="visible=true"
            >{{ $t('common_mp_choose') }}</ody-button>
            <ody-button
              :disabled="selectedRows.length<=0"
              name="OpmsPurchasePlanTemplate07_patchDelete"
              size="small"
              code="OpmsPurchasePlanTemplate07"
              @click="patchDelete"
            >{{ $t('batch_deleting') }}</ody-button>
            <el-upload
              :show-file-list="false"
              :on-success="importData"
              accept=".xls, .xlsx"
              action="api/opms-web/purchasePlanTemplate/importProduct.do"
              style="display:inline-block;margin-left:10px"
            >
              <ody-button
                name="OpmsPurchasePlanTemplate08"
                size="small"
                type="primary"
                code="OpmsPurchasePlanTemplate08"
              >{{ $t('commodity_introduction') }}</ody-button>
            </el-upload>
            <ody-button
              name="OpmsPurchasePlanTemplate09_downloadTemplate"
              size="small"
              type="primary"
              style="margin-left:10px"
              code="OpmsPurchasePlanTemplate09"
              @click="downloadTemplate()"
            >{{ $t('template_download') }}</ody-button>
          </div>
          <div slot="table">
            <el-table
              v-loading="loading"
              ref="table"
              :data="tableList"
              :summary-method="getSummaries"
              name="tableList026"
              style="width: 100%"
              show-summary
              @selection-change="handleSelectionChange"
            >
              <el-table-column v-if="!isShow" type="selection" width="60" />
              <el-table-column type="index" />
              <el-table-column :label="$t('common_product_name')" prop="mpName" />
              <el-table-column :label="$t('common_product_code')" prop="mpCode" />
              <el-table-column :label="$t('common_mp_spec')" prop="mpSpec" />
              <el-table-column :label="$t('common_mp_unit')" prop="mpMeasureUnitName" />
              <el-table-column
                v-if="isShow"
                :label="$t('purchase_plan_filed_apply_purchase_num')"
                prop="applyPurchaseNum"
              />
              <el-table-column
                v-else
                :label="$t('purchase_plan_filed_apply_purchase_num')"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.applyPurchaseNum"
                    :precision="6"
                    :max="10000000"
                    :min="0"
                    :step="0.000001"
                    name="scope_row_applyPurchaseNum"
                    size="mini"
                    style="width: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column v-if="isShow" :label="$t('common_remark')" prop="remark" />
              <el-table-column v-else :label="$t('common_remark')">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" name="scope_row_remark" maxlength="500" size="mini" />
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ody-list-table-area>
      </div>
      <div slot="footer">
        <el-button name="close" @click="close">{{ $t('common_cancel') }}</el-button>
        <ody-button
          v-if="!isShow"
          :disabled="tableList.length<=0"
          name="OpmsPurchasePlanTemplate10_ok"
          type="primary"
          code="OpmsPurchasePlanTemplate10"
          @click="ok"
        >{{ $t('common_save') }}</ody-button>
      </div>
    </ody-dialog-full-right>
    <purchase-plan-template-product
      :visible.sync="visible"
      :merchant-id="data.merchantId"
      @ok="selectProduct"
    />
  </section>
</template>

<script>
import PurchasePlanTemplateProduct from '@/components/purchasePlanTemplateProduct/index'

export default {
  name: 'PurchasePlanTemplateDetails',
  components: { PurchasePlanTemplateProduct },
  props: {
    dialogVisible: {
      type: Boolean,
      required: true
    },
    pageType: {
      type: String,
      required: true
    },
    planTypeList: {
      type: Array,
      required: true
    },
    id: {
      type: Object,
      required: false,
      default: null
    },
    merchant: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      visible: false,
      dialogVisible2: false,
      isShow: false,
      isEdit: false,
      isNew: false,
      loading: false,
      data: {},
      selectedRows: [],
      tableList: [],
      deleteList: []
    }
  },
  methods: {
    open() {
      this.isShow = this.pageType === 'isShow'
      this.isEdit = this.pageType === 'isEdit'
      this.isNew = this.pageType === 'isNew'
      if (!this.isNew && this != null) {
        this.updateList()
      } else {
        this.getNewPO()
      }
    },
    close() {
      this.deleteList = []
      this.selectedRows = []
      this.$refs.table.clearSelection()
      this.$emit('ok')
      this.$emit('update:dialogVisible', false)
    },
    downloadTemplate() {
      window.open(
        'api/opms-web/template/excel/import/purchasePlanTemplate/templateProductImport.xlsx'
      )
    },
    async importData(res) {
      const vue = this
      if (res.data.errors !== null && res.data.errors.length > 0) {
        vue.$message({
          type: 'error',
          message: res.data.errors[0]
        })
        return
      }
      this.addProducts(res.data.products)
    },
    async ok() {
      this.data.productList = this.tableList
      if (this.isNew) {
        await this.$opms.$api.purchasePlanTemplate.add(this.data)
      }
      if (this.isEdit) {
        this.data.purchasePlanTemplateItemsVOS = this.tableList
        await this.$opms.$api.purchasePlanTemplate.update(this.data)
      }
      this.close()
    },
    selectProduct(products) {
      products.forEach(item => {
        item.mpMeasureUnitName = item.mpUnit
        item.mpSpec = item.mpStandard
        item.id = null
      })
      this.addProducts(products)
    },
    getSummaries({ data }) {
      let sums = [this.$t('common_total'), '', '', '', '', 0, '']
      sums[5] = data.reduce((prev, curr) => {
        const value = Number(curr.applyPurchaseNum)
        if (!isNaN(value)) {
          return prev + value
        } else {
          return prev
        }
      }, 0)
      if (!this.isShow) {
        sums = ['', ...sums]
      }
      return sums
    },
    handleSelectionChange(rows) {
      this.selectedRows = rows
    },
    patchDelete() {
      this.selectedRows.forEach(item => {
        this.tableList.splice(this.tableList.indexOf(item), 1)
      })
      this.selectedRows = []
    },
    async updateList() {
      const res = await this.$opms.$api.purchasePlanTemplate.get({
        id: this.id
      })
      res.data.planType = res.data.planType + ''
      this.data = res.data
      this.selectedRows = []
      this.tableList = res.data.purchasePlanTemplateItemsVOS
    },
    async getNewPO() {
      const res = await this.$opms.$api.purchasePlanTemplate.getNewPO({})
      res.data.planType = '1'
      if (this.merchant) {
        res.data.merchantId = this.merchant.merchantId
        res.data.merchantCode = this.merchant.merchantCode
        res.data.merchantName = this.merchant.merchantName
      }
      this.data = res.data
      this.tableList = []
    },
    addProducts(products) {
      products.forEach(item => {
        item.mpMeasureUnitName = item.mpUnit
        item.mpSpec = item.mpStandard
        let isExisted = false
        for (let i = 0; i < this.tableList.length; i++) {
          if (this.tableList[i].mpCode === item.mpCode) {
            isExisted = true
            break
          }
        }
        if (!isExisted) {
          if (item.quantity && item.quantity <= 10000000 && item.quantity > 0) {
            item.applyPurchaseNum = item.quantity
          }
          this.tableList.push(item)
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
