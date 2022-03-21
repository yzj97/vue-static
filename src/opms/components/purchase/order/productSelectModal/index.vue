<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="'选择合同商品'"
      width="80%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="'合同编码'" prop="contractCode">
                <el-input v-model="searchForm.contractCode" name="searchForm_contractCode" />
              </ody-search-item>
              <ody-search-item :label="'店铺编码'" prop="storeCode">
                <el-input v-model="searchForm.storeCode" name="searchForm_storeCode" />
              </ody-search-item>
              <ody-search-item :label="'店铺名称'" prop="storeName">
                <el-input v-model="searchForm.storeName" name="searchForm_storeName" />
              </ody-search-item>
              <ody-search-item :label="'商品编码'" prop="mpCode">
                <el-input v-model="searchForm.mpCode" name="searchForm_mpCode" />
              </ody-search-item>
              <ody-search-item :label="'商品名称'" prop="mpName">
                <el-input v-model="searchForm.mpName" name="searchForm_mpName" />
              </ody-search-item>
              <ody-search-item :label="'结算地'" prop="settlementPartyType">
                <el-select
                  v-model="searchForm.settlementPartyType"
                  name="searchForm_settlementPartyType"
                >
                  <el-option :label="$t('common_status_all')" />
                  <el-option
                    v-for="obj in settlementPartyTypes"
                    :key="obj.code"
                    :value="obj.code"
                    :label="obj.name"
                  />
                </el-select>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_search') }}</el-button>
            <el-button
              name="handleSearchReset"
              size="small"
              @click="handleSearchReset"
            >{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              :can-filter="false"
              name="list301"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"
              />
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_return') }}</el-button>
        <el-button
          :disabled="checked.length === 0"
          name="handleOk"
          size="small"
          type="primary"
          @click="handleOk"
        >{{ $t('common_submit') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    supplierCode: {
      type: String,
      default: null
    },
    storeCode: {
      type: String,
      default: null
    },
    isRefund: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiple: true,
      settlementPartyTypes: [],
      searchForm: getDefaultSearchForm(),
      loading: false,
      checked: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'contractCode',
          label: '合同编码',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'contractTypeText',
          label: '合同类型',
          align: 'center'
        },
        {
          show: true,
          prop: 'storeName',
          label: '店铺名称',
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'storeCode',
          label: '店铺编码',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'supplierName',
          label: '供应商名称',
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'supplierCode',
          label: '供应商编码',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'mpCode',
          label: '商品编码',
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'mpBarcode',
          label: '商品条码',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          prop: 'mpName',
          label: '商品名称',
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'mpMeasurementUnit',
          label: '主计量单位',
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'mpPurchaseUnit',
          label: '采购单位',
          align: 'center'
        },
        {
          show: true,
          prop: 'mpPurchaseUnitRate',
          label: '转换率',
          align: 'center'
        },
        {
          show: true,
          prop: 'mpSpec',
          label: '商品规格',
          align: 'center'
        },
        {
          show: true,
          prop: 'costWithTaxUnitAmt',
          label: '含税采购价',
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'costTaxRate',
          label: '进项税率',
          align: 'center',
          formatter: (row, column) => {
            if (row.costTaxRate != null) {
              return Number(row.costTaxRate * 100).toFixed(2) + '%'
            } else {
              return ''
            }
          }
        },
        {
          show: true,
          prop: 'turnoverChannelText',
          label: '流转途径',
          align: 'center'
        },
        {
          show: true,
          prop: 'minOrderQuantity',
          label: '起订量',
          align: 'center'
        },
        {
          show: true,
          prop: 'orderMultipleNum',
          label: '订货倍数',
          align: 'center'
        },
        {
          show: true,
          prop: 'distributionChannelText',
          label: '运输方式',
          align: 'center'
        },
        {
          show: true,
          prop: 'isIncludingDeliveryFee',
          label: '是否含运费',
          align: 'center',
          formatter: (row, column, cellValue) => {
            return row.isIncludingDeliveryFee + '' === '1'
              ? this.$t('是')
              : this.$t('否')
          }
        },
        // {
        //   show: true,
        //   prop: 'inCatalogText',
        //   label: '库存组织进目录',
        //   align: 'center',
        //   minWidth: 120
        // },
        {
          show: true,
          prop: 'stockNum',
          label: '库存量',
          align: 'center'
        }
      ]
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
        this.$opms.$api.code
          .select({ category: 'SETTLEMENT_PARTY_TYPE' })
          .then(result => {
            this.settlementPartyTypes = result.data
          })
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      this.searchForm = getDefaultSearchForm()
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.checked = []
    },
    handleOk() {
      const vue = this
      vue.$emit('update:visible', !vue.visible)
      vue.$emit('ok', vue.checked)
      vue.checked = []
    }
  }
}

async function loadList(vue) {
  const param = {
    refund: vue.isRefund,
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    supplierCode: vue.supplierCode,
    storeCode: vue.storeCode,
    ...vue.searchForm
  }

  const contractProductPrice = vue.$opms.$api.contractProductPrice
  const result = await contractProductPrice.selectContractProductPriceList(
    param
  )
  if (result && result.data) {
    const data = result.data
    for (let i = 0; i < data.listObj.length; i++) {
      const item = data.listObj[i]
      item.supplierId = item.id
      item.suppliers = []
      item.suppliers.push({
        id: item.id,
        supplierCode: item.supplierCode,
        supplierName: item.supplierName
      })
    }
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return {
    obj: {}
  }
}
</script>

<style lang="scss" scoped>
</style>
