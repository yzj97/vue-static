<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select ref="merchant" v-model="search.merchantId" name="search_merchantId" value-key="merchantId" />
          </ody-search-item>
          <ody-search-item :label="$t('商品类目')+ ':'" prop="objRefs">
            <!-- <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="search.objRefs"
              :multiple="true"
              :options="categoryTreeData"
              name="search_objRefs"
              value-consists-of="LEAF_PRIORITY"
            />-->
            <ody-tree-select
              :normalizer="normalizer"
              :append-to-body="true"
              :z-index="10000"
              v-model="search.objRefs"
              :multiple="true"
              :async="isAsync"
              :options="categoryTreeData"
              :load-options="isAsync ? queryBackedRootCategory : null"
              :default-options="isAsync"
              :default-expand-level="9999"
              no-results-text="未查询出结果"
              no-options-text="没有可用的选项"
              search-prompt-text="请搜索你想选择的商品类目"
              open-on-focus
              name="queryParam_categoryIds"
              value-consists-of="LEAF_PRIORITY"
              @open="treeOpen"
              @search-change="searchChange"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="ProductWhiteListAudit_01"
          size="small"
          code="ProductWhiteListAudit_01"
          type="primary"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ProductWhiteListAudit_02"
          size="small"
          code="ProductWhiteListAudit_02"
          type="primary"
          @click.prevent="showAddDialog"
        >{{ $t('新增') }}</ody-button>
        <ody-button
          :disabled="!table.checked || table.checked.length === 0"
          name="ProductWhiteListAudit_03_batchDelete"
          code="ProductWhiteListAudit_03"
          type="primary"
          size="small"
          @click="batchDelete"
        >{{ $t('批量删除') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :multiple="true"
          :checked.sync="table.checked"
          request-url="/back-product-web/back/mp/merchantProductAuditWhite/getWhiteList.do"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog
      ref="dialog"
      :visible="audit.visible"
      :before-close="handleClose"
      :title="$t('详情')"
      width="40%"
      @opened="initDialog"
    >
      <el-form ref="detailForm" :model="audit" :rules="audit.rules" label-width="100px">
        <el-form-item :label="$t('common_merchant_name')" prop="form.merchantId">
          <ody-merchant-select
            ref="merchant"
            v-model="audit.form.merchantId"
            name="audit_form_merchantId"
            value-key="merchantId"
          />
        </el-form-item>
        <el-form-item :label="$t('商品类目')" prop="form.categoryIds">
          <ody-tree-select
            :normalizer="normalizer"
            :append-to-body="true"
            :z-index="10000"
            v-model="audit.form.objRefs"
            :multiple="true"
            :options="categoryTreeData"
            :async="isAsync"
            :load-options="isAsync ? queryBackedRootCategory : null"
            :default-options="isAsync"
            :default-expand-level="9999"
            no-results-text="未查询出结果"
            no-options-text="没有可用的选项"
            search-prompt-text="请搜索你想选择的商品类目"
            open-on-focus
            name="audit_form_objRefs"
            value-consists-of="LEAF_PRIORITY"
            @open="treeOpen"
            @search-change="searchChange"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="end">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
          <ody-button
            name="ProductWhiteListAudit_02_handleAdd"
            size="small"
            code="ProductWhiteListAudit_02"
            type="primary"
            @click="handleAdd"
          >{{ $t('确定') }}</ody-button>
        </el-row>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  name: 'ProductWhiteListAudit',
  data() {
    const vue = this
    return {
      categorySearchKey: '',
      search: getDefaultForm(),
      categoryTreeData: [],
      isAsync: false,
      mpApi: this.$product.$api.mpApi,
      merchantMap: {},
      table: {
        checked: [],
        columns: [
          {
            label: vue.$t('common_merchant_name'),
            prop: 'merchantName',
            show: true,
            render: (h, params) => {
              return (
                <div>
                  {vue.merchantMap[params.row.merchantId]
                    ? vue.merchantMap[params.row.merchantId].merchantName
                    : ''}
                </div>
              )
            }
          },
          {
            label: vue.$t('common_merchant_code'),
            prop: 'merchantCode',
            show: true,
            render: (h, params) => {
              return (
                <div>
                  {vue.merchantMap[params.row.merchantId]
                    ? vue.merchantMap[params.row.merchantId].merchantCode
                    : ''}
                </div>
              )
            }
          },
          {
            label: vue.$t('免审类目'),
            prop: 'fullNamePath',
            show: true,
            minWidth: 200
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: vue.$t('删除'),
              method: (index, row) => {
                this.handleDelete(row)
              },
              code: 'ProductWhiteListAudit_04'
            }
          ]
        }
      },
      checkedItem: null,
      audit: {
        queryDetail: true,
        visible: false,
        form: {
          merchantId: null,
          objRefs: null
        },
        rules: {
          'form.merchantId': [
            { required: true, message: this.$t('required'), trigger: 'change' }
          ],
          'form.objRefs': [{ validator: this.validateRefs, trigger: 'change' }]
        }
      }
    }
  },
  async mounted() {
    await this.getQueryBackedRootCategory()
    await this.initMerchant()
    await this.query()
  },
  methods: {
    validateRefs(rule, value, callback) {
      if (
        this.audit.form.objRefs === null ||
        this.audit.form.objRefs.length === 0
      ) {
        callback(new Error(this.$t('required')))
      } else {
        callback()
      }
    },
    async initMerchant() {
      const {
        data
      } = await this.$product.$api.merchantApi.queryPlatformAuthMerchantPage({
        currentPage: 1,
        itemsPerPage: 500
      })
      if (data && data.listObj) {
        data.listObj.forEach(element => {
          this.merchantMap[element.merchantId] = element
        })
      }
    },
    // 查询后台类目树根节点
    async queryBackedRootCategory({ searchQuery: name, callback }) {
      return this.mpApi.listBackCategoryTree({ name }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }
        callback(null, newData)
      })
    },

    async getQueryBackedRootCategory() {
      return this.mpApi.listBackCategoryTree({ name: this.categorySearchKey }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        this.categoryTreeData = newData
      })
    },

    remoteChildrenNull(data = []) {
      data.forEach(item => {
        if (item.children === null) {
          delete item.children
        } else {
          if (item.children && item.children.length) {
            item.children = this.remoteChildrenNull(item.children)
          } else {
            delete item.children
          }
        }
      })

      return data
    },
    treeOpen() {
      this.isAsync = true
    },
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
    },
    handleReset() {
      this.search = getDefaultForm()
    },
    async handleSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.query()
    },
    queryList() {
      const { ...params } = this.search
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(params))
    },
    async query() {
      await this.queryList()
    },
    showAddDialog(row, showDetail) {
      this.audit.visible = true
    },
    handleClose() {
      this.audit.visible = false
      this.table.checked = []
      this.checkedItem = null
      this.audit.form = {
        merchantId: null,
        objRefs: null
      }
    },
    handleAdd() {
      this.$refs['detailForm'].validate(valid => {
        if (
          this.audit.form.objRefs === null ||
          this.audit.form.objRefs.length === 0
        ) {
          this.$message({
            type: 'error',
            message: this.$t('商品类目') + this.$t('required')
          })
          return
        }
        if (valid) {
          this.mpApi.addWhite(this.audit.form).then(res => {
            this.handleClose()
            this.queryList()
            this.audit.form = []
          })
        }
      })
    },
    handleDelete(row) {
      this.table.checked = []
      this.table.checked.push(row)
      this.batchDelete()
    },
    batchDelete() {
      this.mpApi.deleteWhite(this.table.checked).then(res => {
        this.handleClose()
        this.queryList()
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
function getDefaultForm() {
  return Object.assign(
    {},
    {
      merchantId: null,
      objRefs: []
    }
  )
}
</script>
<style lang="less" scoped>
</style>
