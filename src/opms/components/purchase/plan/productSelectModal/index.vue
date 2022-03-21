<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_choose_please')"
      width="60%"
      @open="init"
    >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('common_mp_code')" prop="mpCode">
                <el-input v-model="searchForm.mpCode" name="searchForm_mpCode" />
              </ody-search-item>
              <ody-search-item :label="$t('common_mp_barcode')" prop="mpBarcode">
                <el-input v-model="searchForm.mpBarcode" name="searchForm_mpBarcode" />
              </ody-search-item>
              <ody-search-item :label="$t('common_mp_name')" prop="mpName">
                <el-input v-model="searchForm.mpName" name="searchForm_mpName" />
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
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
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
              name="list675"
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
    merchantCode: {
      type: String,
      default: null
    },
    merchantId: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      multiple: true,
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
          prop: 'mpCode',
          label: this.$t('common_mp_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_mp_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpSpec',
          label: this.$t('common_mp_spec'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpBarcode',
          label: this.$t('common_mp_barcode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpMeasurementUnit',
          label: this.$t('common_mp_unit'),
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
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    merchantCode: vue.merchantCode,
    merchantId: vue.merchantId,
    ...vue.searchForm
  }

  const contractProductPrice = vue.$opms.$api.contractProductPrice
  const result = await contractProductPrice.selectContractProductPageForPurchasePlan(
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
