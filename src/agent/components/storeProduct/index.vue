<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :append-to-body="appendToBody"
      :title="$t('add_product')"
      width="900px"
      @open="init"
    >
      <section class="pg-productModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" class="form">
              <ody-search-item :label="$t('product_name')" prop="merchantId">
                <el-input v-model="searchForm[nameLabel]" name="searchForm[nameLabel]" />
              </ody-search-item>
              <ody-search-item :label="$t('product_code')" prop="codeLabel">
                <el-input v-model="searchForm[codeLabel]" name="searchForm[codeLabel]" />
              </ody-search-item>
              <ody-search-item :label="$t('merchant_name')" prop="merchantId">
                <ody-merchant-select
                  v-model="searchForm.merchantId"
                  :placeholder="$t('common_all')"
                  name="searchForm_merchantId"
                  value-key="merchantId"
                />
              </ody-search-item>
              <ody-search-item :label="this.$t('store_name')" prop="storeId">
                <ody-store-select
                  v-model="searchForm.storeId"
                  :placeholder="$t('common_all')"
                  name="searchForm_storeId"
                  value-key="storeId"
                />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button
              name="handleSearchSubmit"
              size="small"
              type="primary"
              @click="handleSearchSubmit"
            >{{ $t('common_select') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              v-loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :selectable="handleSelectable"
              :checked.sync="checked"
              name="list080"
              height="400px"
              style="width: 100%"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                v-if="list && list.length"
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50, 100]"
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_back') }}</el-button>
        <ody-button
          :disabled="submitFlag"
          name="DistributionProductAdd_handleOk"
          size="small"
          code="DistributionProductAdd"
          type="primary"
          @click="handleOk"
        >{{ $t('common_confirm_search') }}</ody-button>
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
    appendToBody: {
      type: Boolean,
      default: false
    },
    idLabel: {
      type: String,
      default: 'id'
    },
    nameLabel: {
      type: String,
      default: 'chineseName'
    },
    codeLabel: {
      type: String,
      default: 'code'
    },
    checkMpIds: {
      type: Array,
      default: () => {
        return []
      }
    },
    listApi: {
      type: Object,
      default() {
        return this.$agent.$api.distributionProduct.listStoreProductPage
      }
    }
  },
  data() {
    const self = this
    return {
      multiple: true,
      checked: [],
      columns: [
        {
          show: true,
          prop: 'mpCode',
          label: self.$t('product_code'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'mpName',
          label: self.$t('product_name'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'merchantName',
          label: self.$t('merchant_name'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'storeName',
          label: self.$t('store_name'),
          align: 'center',
          minWidth: 140
        }
      ],
      loading: false,
      searchForm: getDefaultPage(this.nameLabel, this.codeLabel),
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      submitFlag: false
    }
  },
  methods: {
    async updateList() {
      await loadList(this)
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
      this.checked = []
      this.searchForm = getDefaultPage()
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
      this.submitFlag = false
      this.handleSearchReset()
      this.handleSearchSubmit()
    },
    handleSelectable(row, index) {
      return !row.disabled
    },
    handleClose() {
      this.searchForm = getDefaultPage()
      this.$emit('update:visible', !this.visible)
    },
    async handleOk() {
      if (this.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      this.submitFlag = true
      const addList = []
      if (this.checked && this.checked.length > 0) {
        for (let i = 0; i < this.checked.length; i++) {
          const submitParams = {}
          const item = this.checked[i]
          submitParams.mpId = item[this.idLabel]
          submitParams.mpCode = item[this.codeLabel]
          submitParams.mpName = item[this.nameLabel]
          submitParams.refId = item.refId
          submitParams.storeId = item.storeId
          submitParams.storeName = item.storeName
          submitParams.merchantId = item.merchantId
          submitParams.merchantName = item.merchantName
          submitParams.mpUrl = item.mainPictureUrl
          submitParams.parentId = item.parentId
          submitParams.typeOfProduct = item.typeOfProduct
          submitParams.storeCode = item.storeCode
          submitParams.channelCode = item.channelCode
          addList.push(submitParams)
        }
        this.$emit('ok', addList)
      }
    }
  }
}
async function loadList(vue) {
  queryProductInner(vue)
}
async function queryProductInner(vue) {
  const searchInfo = {}
  for (const p in vue.searchForm) {
    if (p && vue.searchForm[p]) {
      searchInfo[p] = vue.searchForm[p]
    }
  }
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    ...searchInfo
  }
  vue.loading = true
  const res = await vue.listApi(param)
  vue.loading = false
  if (res.code === '0') {
    vue.page.total = res.data.total
    vue.list = res.data.listObj

    vue.list.forEach(item => {
      item.mpId = item[vue.idLabel]
      item.mpCode = item[vue.codeLabel]
      item.mpName = item[vue.nameLabel]
    })
  }
}
function getDefaultPage(nameLabel, codeLabel) {
  const obj = Object.assign(
    {},
    {
      merchantId: null,
      storeId: null
    }
  )
  obj[nameLabel] = null
  obj[codeLabel] = null
  return obj
}
</script>

<style lang="less" scoped>
.pg-productModal-list {
  .cp-search-item {
    width: 33.33333%;
  }
}
</style>
