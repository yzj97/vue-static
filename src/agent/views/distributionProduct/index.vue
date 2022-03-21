<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" class="form">
          <ody-search-item :label="this.$t('common_product_name') + ':'" prop="mpName">
            <el-input v-model="queryParam.mpName" :placeholder="$t('请输入商品名称')" name="queryParam_mpName" maxlength="100" />
          </ody-search-item>
          <ody-search-item :label="$t('product_code') + ':'" prop="mpCode">
            <el-input v-model="queryParam.mpCode" :placeholder="$t('请输入商品编码')" name="queryParam_mpCode" maxlength="50" />
          </ody-search-item>
          <ody-search-item :label="$t('merchant_name') + ':'" prop="merchantId">
            <ody-merchant-select
              v-model="queryParam.merchantId"
              :placeholder="$t('common_all')"
              name="queryParam_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="this.$t('store_name') + ':'" prop="storeId">
            <ody-store-select
              v-model="queryParam.storeId"
              :placeholder="$t('common_all')"
              name="queryParam_storeId"
              value-key="storeId"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
        <ody-button
          name="DistributionProductListQuery_handleQuery"
          size="small"
          code="DistributionProductListQuery"
          type="primary"
          @click="handleQuery"
        >{{ $t('common_search') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="DistributionProductAdd_addDistributionProduct"
          size="small"
          code="DistributionProductAdd"
          type="primary"
          @click="addDistributionProduct"
        >{{ $t('add_product') }}</ody-button>
        <!--<ody-button
          name="DistributionProductTemplateDowLoad_downLoadDistributionProductTemplate"
          size="small"
          code="DistributionProductTemplateDowLoad"
          type="primary"
          @click="downLoadDistributionProductTemplate"
        >{{ $t('商品模板下载') }}</ody-button>
        <ody-button
          :disabled="!canUpload"
          name="DistributionProductImport_batchAddDistributionProduct"
          size="small"
          code="DistributionProductImport"
          type="primary"
          @click="batchAddDistributionProduct"
        >{{ $t('商品模板导入') }}</ody-button>-->
        <ody-batch-import-button
          :import-api="importModel.importApi"
          :import-label="importModel.importLabel"
          :download-local-file="importModel.downloadLocalFile"
          :async="importModel.async"
          :pool="importModel.pool"
          :task-type="importModel.taskType"
          style="margin-left:16px"
          name="distributionProductImport_batchDelete_button"
          code="DistributionProductImport"
          size="small"
        >{{ $t('batch_import') }}</ody-batch-import-button>
        <ody-import-task-button
          pool="agent"
          task-type="distributionProductImport"
          style="margin-left:16px"
          name="distributionProductImport_batchDelete_task"
          code="DistributionProductImport"
          size="small"
        >{{ $t('seeImportTask') }}</ody-import-task-button>
        <ody-button
          style="margin-left:16px"
          name="DistributionProductDelete_batchDelete"
          size="small"
          code="DistributionProductDelete"
          type="danger"
          @click="batchDelete"
        >{{ $t('common_batch_delete') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :checked.sync="table.checked"
          :multiple="true"
          :columns="table.columns"
          :operates="table.operates"
          :selectable="checkedSelectable"
          :can-filter="false"
          request-url="/agent-web/distributionProduct/listPage.do"
          request-page-type="page"
        />
      </div>
    </ody-list-table-area>
    <ody-dialog :visible.sync="importVisible" :title="$t('批量导入分销商品')" @close="handleClose">
      <el-form ref="fileUploadForm" :model="fileUploadForm" :inline="true" :rules="rules">
        <el-form-item
          :label="$t('common_fileUpload')"
          :rules="[{ required: true, message: $t('common_please_selectFile') }]"
          class="register"
          required
          prop="fileName"
        >
          <el-input v-model="fileUploadForm.fileName" name="fileUploadForm_fileName" type="text" disabled="true" />
          <el-upload
            ref="upload"
            :auto-upload="false"
            :before-upload="checkFile"
            :on-change="handlePreview"
            :on-remove="handleRemove"
            :file-list.sync="fileList"
            accept=".xlsx"
            name="file"
            multiple="false"
          >
            <el-button slot="trigger" size="small">{{ $t('choose_file') }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</ody-button>
        <ody-button
          name="DistributionProductImport_submitForm"
          size="small"
          type="primary"
          code="DistributionProductImport"
          @click="submitForm('fileUploadForm')"
        >{{ $t('common_upload') }}</ody-button>
      </span>
    </ody-dialog>

    <StoreProduct :visible.sync="addDistributionProductVisible" @ok="onAddProduct" />
    <DistributionProductSetting
      :visible.sync="distributionProductSettingVisible"
      :id.sync="id"
      @ok="handleQuery"
    />
    <DistributionProductView :visible.sync="viewFlag" :id.sync="id" />
  </section>
</template>

<script>
import StoreProduct from '@/components/storeProduct'
import DistributionProductSetting from '@/components/distributionProductSetting'
import DistributionProductView from '@/components/distributionProductView'
import distributionProductImportResultTemplate from '@/excelfile/distributionProductImportResultTemplate.xlsx'

export default {
  name: 'DistributionProduct',
  components: {
    StoreProduct,
    DistributionProductSetting,
    DistributionProductView
  },
  data() {
    const self = this
    return {
      importModel: {
        importApi: ['agent-web', 'distributionProduct', 'importDistributionProduct.do', {}],
        downloadLocalFile: [require('@/excelfile/distributionProductImportResultTemplate.xlsx')],
        importLabel: this.$t('分销商品导入'),
        pool: 'agent',
        taskType: 'distributionProductImport',
        async: true
      },
      canUpload: true,
      addDistributionProductVisible: false,
      addDistributionProductLoading: false,
      viewFlag: false,
      importVisible: false,
      distributionProductSettingVisible: false,
      id: null,
      queryParam: {},
      limit: 1,
      fileList: [],
      rules: [],
      fileUploadForm: {
        fileName: null
      },
      table: {
        columns: [
          {
            show: true,
            prop: 'mpCode',
            label: self.$t('product_code')
          },
          {
            show: true,
            prop: 'mpName',
            tooltip: false,
            label: self.$t('product_name')
          },
          {
            show: true,
            prop: 'merchantName',
            label: self.$t('merchant_name')
          },
          {
            show: true,
            prop: 'storeCode',
            label: self.$t('common_store_code')
          },
          {
            show: true,
            prop: 'storeName',
            label: self.$t('store_name')
          },
          {
            show: true,
            prop: 'expiryDateTypeStr',
            label: self.$t('expiry_date'),
            minWidth: 200
          },
          {
            show: true,
            prop: 'priority',
            label: self.$t('priority'),
            minWidth: 88
          }
        ],
        operates: {
          fixed: 'right',
          width: 200,
          list: [
            {
              label: this.$t('common_set'),
              disabled: false,
              method: (index, row) => {
                self.edit(row)
              },
              code: 'DistributionProductSet'
            },
            {
              label: this.$t('common_watch'),
              disabled: false,
              method: (index, row) => {
                self.view(row)
              },
              code: 'DistributionProductView'
            },
            {
              label: this.$t('common_delete'),
              disabled: false,
              method: (index, row) => {
                self.delete(row)
              },
              code: 'DistributionProductDelete'
            }
          ]
        },
        checked: []
      }
    }
  },
  async mounted() {
    try {
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async onAddProduct(addList) {
      const result = await this.$agent.$api.distributionProduct.batchAddDistributionProduct(
        addList
      )
      if (result && result.code === '0') {
        this.addDistributionProductVisible = false
        this.handleQuery()
        this.$message({
          type: 'success',
          message: this.$t('common_add_success')
        })
      }
    },
    async handleQuery() {
      await this.queryList()
    },
    // 商家商品列表查询
    async queryList() {
      this.table.checked = []
      return this.$refs.table.getList({
        filters: this.formHasValue(this.queryParam, false)
      })
    },
    // 重置
    reset() {
      this.table.checked = []
      this.queryParam = getDefaultQueryParam()
    },
    addDistributionProduct() {
      this.addDistributionProductVisible = true
    },
    // 编辑
    edit(row) {
      this.id = row.id
      this.distributionProductSettingVisible = true
    },
    view(row) {
      this.id = row.id
      this.viewFlag = true
    },
    async delete(row) {
      const confirm = await this.$confirm(
        this.$t('是否删除当前分销商品'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        const mpIds = []
        ids.push(row.id)
        mpIds.push(row.mpId)
        const submitParams = {}
        submitParams.idList = ids
        submitParams.mpIdList = mpIds
        const result = await this.$agent.$api.distributionProduct.batchDeleteDistributionProduct(
          submitParams
        )
        if (result && result.code === '0') {
          this.queryList()
          this.$message({
            type: 'success',
            message: this.$t('common_delete_success')
          })
        }
      }
    },
    downLoadDistributionProductTemplate() {
      this.$portal.downloadFileByGet(
        distributionProductImportResultTemplate,
        {},
        '分销商品导入.xlsx'
      )
    },
    async batchAddDistributionProduct() {
      this.importVisible = true
    },
    handleRemove(file, fileList) {
      this.fileUploadForm.fileName = ''
    },
    handlePreview(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
      this.fileUploadForm.fileName = file.name
    },
    handleClose() {
      this.canUpload = true
      this.fileUploadForm.fileName = ''
      this.fileList = []
      this.importVisible = false
    },
    async submitForm(fileUploadForm) {
      this.$refs[fileUploadForm].validate(valid => {
        if (valid) {
          const file = document.getElementsByName('file')[0].files[0]
          var formData = new FormData()
          formData.append('file', file)
          this.canUpload = false
          const importRequest = this.$agent.$api.distributionProduct
          importRequest
            .importDistributionProduct(formData)
            .then(result => {
              if (result && result.code === '0') {
                this.canUpload = true
                this.fileUploadForm.fileName = ''
                this.fileList = []
                this.importVisible = false
                this.handleQuery()
                this.$message({
                  type: 'success',
                  message: this.$t('common_import_success')
                })
              } else {
                this.canUpload = true
                console.info(result)
                this.$message({
                  type: 'error',
                  message: result.message
                })
              }
            })
            .catch(() => {
              this.canUpload = true
            })
        }
      })
    },
    async batchDelete() {
      if (this.table.checked.length === 0) {
        return this.$message(this.$t('PLEASE_CHOOSE_A_PRODUCT'))
      }
      const confirm = await this.$confirm(
        this.$t('是否删除选中的分销商品'),
        this.$t('common_prompt')
      )
      if (confirm) {
        const ids = []
        const mpIds = []
        if (this.table.checked && this.table.checked.length > 0) {
          for (let i = 0; i < this.table.checked.length; i++) {
            const item = this.table.checked[i]
            ids.push(item.id)
            mpIds.push(item.mpId)
          }
          const submitParams = {}
          submitParams.idList = ids
          submitParams.mpIdList = mpIds
          const result = await this.$agent.$api.distributionProduct.batchDeleteDistributionProduct(
            submitParams
          )
          if (result && result.code === '0') {
            this.queryList()
            this.$message({
              type: 'success',
              message: this.$t('common_delete_success')
            })
          }
        }
      }
    }
  }
}

function getDefaultQueryParam() {
  return Object.assign(
    {},
    {
      mpName: null,
      brandName: null,
      mpCode: null,
      merchantId: null,
      storeId: null
    }
  )
}
</script>
<style lang="scss" scoped>
</style>
