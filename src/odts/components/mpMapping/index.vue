<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :title="$t('映射商品')"
      width="800px"
      @open="init" >
      <section class="pg-editMappingItem">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="120px" class="form">
              <el-col :span="12" >
                <el-form-item :label="$t('商品名称')">
                  <el-input v-model="searchForm.chineseName" name="searchForm_chineseName" maxlength="25"/>
                </el-form-item>
              </el-col>
              <el-col :span="12" >
                <el-form-item :label="$t('商品编码')">
                  <el-input v-model="searchForm.code" name="searchForm_code" maxlength="25"/>
                </el-form-item>
              </el-col>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ '查询' }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ '重置' }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :multiple="false"
              :columns="columns"
              :checked="checked"
              :can-filter="false"
              :selectable="handleSelectable"
              :highlight-current-row="true"
              name="list801"
              @selection-change="handleSelectionChange"
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
                @current-change="handlePageCurrentChange"/>
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button :disabled="submiting || checked.length === 0" name="OdtsMpMapping_Save_handleOk" code="OdtsMpMapping_Save" size="small" type="primary" @click="handleOk()">
          {{ this.$t('确定') }}
        </ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    product: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: null
    },
    merchantMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    storeMap: {
      type: Object,
      default: () => {
        return {}
      }
    },
    noStoreChannelCodes: {
      type: Array,
      default: () => {
        return []
      }
    },
    useSku: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      loading: false,
      submiting: false,
      list: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      searchForm: getDefaultSearchForm(),
      columns: [
        {
          show: true,
          label: '商家',
          align: 'center',
          minWidth: 120,
          formatter: (row, column) => {
            if (row.merchantId && self.merchantMap && self.merchantMap[row.merchantId]) {
              return self.merchantMap[row.merchantId].merchantName
            }
            return ''
          }
        },
        {
          show: () => {
            const channelCode = self.product.channelCode
            if (self.noStoreChannelCodes.indexOf(channelCode) !== -1) {
              return false
            }
            return true
          },
          label: '店铺',
          align: 'center',
          minWidth: 120,
          formatter: (row, column) => {
            if (row.storeId && self.storeMap && self.storeMap[row.storeId]) {
              return self.storeMap[row.storeId].storeName
            }
            return ''
          }
        },
        {
          show: true,
          label: '商品编码',
          prop: 'code',
          align: 'center',
          minWidth: 150
        },
        {
          show: true,
          label: '商品名称',
          prop: 'chineseName',
          align: 'center',
          minWidth: 150
        }
      ]
    }
  },
  methods: {
    async init() {
      if (this.product.outerId) {
        this.searchForm.code = this.product.outerId
      }
      this.checked = []
      this.updateList()
    },
    handleSelectable(row, index) {
      return true
    },
    handleSelectionChange(val) {
      this.checked = [val]
    },
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
    handleOk() {
      if (this.useSku) {
        this.$emit('update:visible', !this.visible)
        this.$emit('ok', this.checked[0])
      } else {
        this.updateMapping()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    updateMapping() {
      // submiting
      const vue = this
      const checkedItem = this.checked[0]
      const condition = {
        id: this.product.id,
        channelCode: this.product.channelCode,
        storeMpId: checkedItem.id,
        mpId: checkedItem.mpId,
        productCode: checkedItem.code,
        productCname: checkedItem.chineseName
      }
      const promise = this.$odts.$api.odtsMp.updateChannelItemMapping
      vue.subminting = true
      promise(condition).then(res => {
        if (res.code === '0') {
          vue.$emit('update:visible', !vue.visible)
          vue.$emit('ok', this.checked[0])
        }
      }).finally(r => {
        vue.subminting = false
      })
    }
  }
}
async function loadList(vue) {
  let param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current
  }

  param.dataType = 3
  param.typeOfProducts = (vue.product.isMain && vue.product.hasSkuItem) ? [0, 3] : [0, 2]
  param.parentId = vue.product.isMain ? null : vue.product.parentId
  param.merchantIds = []
  param.merchantIds.push(vue.product.merchantId)
  param.storeIds = []
  param.storeIds.push(vue.product.storeId)

  vue.list = []
  vue.page.total = 0
  if (vue.noStoreChannelCodes.indexOf(vue.product.channelCode) >= 0) {
    param.itemsPerPage = 1000
    param.currentPage = 1
  } else {
    param = {
      chineseName: vue.searchForm.chineseName ? vue.searchForm.chineseName : null,
      code: vue.searchForm.code ? vue.searchForm.code : null,
      ...param
    }
  }

  const res = await vue.$odts.$api.common.listMerchantProductByPage(param)
  if (res && res.code === '0') {
    if (vue.noStoreChannelCodes.indexOf(vue.product.channelCode) === -1) {
      const data = res.data.listObj
      vue.list = data
      vue.page.total = res.data.total
      // vue.$emit('loadList', vue.list) // 发送查询结果事件，如果使用sku，父组件根据结果查询 odySku，并同步odySkuIds，和odyItemItemIds，来判断商品是否可选
    } else if (res.data.total && res.data.total !== 0) { // 没有店铺，根据查询结果查询商家商品
      loadMerchantProduct(vue, res.data.listObj)
    }
  }
}
async function loadMerchantProduct(vue, storeMpList) {
  const param = {
    ...vue.searchForm,
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    dataType: 2,
    typeOfProducts: [0, 2]
  }
  param.merchantIds = []
  param.merchantIds.push(vue.product.merchantId)
  const mpIds = storeMpList.reduce((r, i) => { r.push(i.mpId) }, [])
  param.mpIds = mpIds
  const res = await vue.$odts.$api.common.listMerchantProductByPage(param)
  if (res && res.code === '0') {
    const data = res.data.listObj
    vue.list = data
    vue.page.total = res.data.total
    // vue.$emit('loadList', vue.list)
  }
}
function getDefaultSearchForm() {
  return Object.assign({}, {
    chineseName: null,
    code: null
  })
}
</script>

<style lang="scss" scoped>

</style>
