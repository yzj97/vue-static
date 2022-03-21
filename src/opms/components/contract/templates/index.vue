<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList25_createTemplate"
          size="mini"
          type="primary"
          code="OpmsJxContractList25"
          @click="createTemplate"
        >{{ $t('contract_addContractTemple') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table :data="list" :columns="columns" :operates="operates" :can-filter="false" name="list426" />
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
    <AddDialog
      :visible.sync="addVisible"
      :contract-id.sync="contractId"
      :form-data.sync="formData"
      @ok="updateList"
    />
  </div>
</template>

<script>
import AddDialog from '@/components/contract/templates/add'

export default {
  components: {
    AddDialog
  },
  props: {
    contractId: {
      type: Number,
      default: null
    },
    contractType: {
      type: Number,
      default: null
    },
    merchantId: {
      type: Number,
      default: null
    },
    contract: {
      type: Object,
      default: function() {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const vue = this
    return {
      addVisible: false,
      list: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      formData: {
        templateCode: '',
        templateName: '',
        contractType: '',
        merchantCode: this.contract.merchantCode,
        merchantId: this.contract.merchantId,
        merchantName: this.contract.merchantName,
        remark: '',
        fileList: []
      },
      columns: [
        {
          show: true,
          prop: 'contractTypeStr',
          label: this.$t('contract_contractType'),
          align: 'center'
        },
        {
          show: true,
          prop: 'templateCode',
          label: this.$t('contract_templateCode'),
          align: 'center'
        },
        {
          show: true,
          prop: 'templateVersion',
          label: this.$t('contract_version'),
          align: 'center'
        },
        {
          show: true,
          prop: 'templateName',
          label: this.$t('contract_templateName'),
          align: 'center'
        },
        {
          show: true,
          prop: 'templateAttachment',
          label: this.$t('contract_templateAttachment'),
          align: 'center',
          render: (h, params) => {
            return (
              <el-link
                icon='el-icon-document'
                href={params.row.templateAttachment}
                target='_blank'
              >
                {params.row.templateAttachmentName}
              </el-link>
            )
          }
        },
        {
          show: true,
          prop: 'createUsername',
          label: this.$t('contract_uploadPersion'),
          align: 'center'
        },
        {
          show: true,
          prop: 'uploadTimeStr',
          label: this.$t('contract_uploadTime'),
          align: 'center'
        },
        {
          show: true,
          prop: 'remark',
          label: this.$t('common_remark'),
          align: 'center'
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('common_edit'),
            method(index, row) {
              vue.formData.fileList = [
                {
                  name: row.templateAttachmentName,
                  url: row.templateAttachment
                }
              ]
              vue.formData.id = row.id
              vue.formData.templateCode = row.templateCode
              vue.formData.templateName = row.templateName
              vue.formData.contractType = row.contractType + ''
              vue.formData.merchantId = row.merchantId
              vue.formData.merchantCode = row.merchantCode
              vue.formData.merchantName = row.merchantName
              vue.formData.remark = row.remark
              vue.addVisible = true
            },
            hidden(index, row) {
              return !vue.isEdit
            },
            code: 'OpmsJxContractList26'
          },
          {
            label: this.$t('common_delete'),
            method(index, row) {
              vue
                .$confirm(
                  vue.$t('common_msg_confirm_delete'),
                  vue.$t('common_msg_delete'),
                  {
                    confirmButtonText: vue.$t('common_confirm'),
                    cancelButtonText: vue.$t('common_cancel'),
                    type: 'warning'
                  }
                )
                .then(() => {
                  vue.$opms.$api.jxContract
                    .deleteContractTemlpate({ id: row.id })
                    .then(res => {
                      if (res && res.code === '0') {
                        vue.updateList()
                        vue.$message({
                          type: 'success',
                          message: vue.$t('delete_success')
                        })
                      }
                    })
                })
            },
            hidden(index, row) {
              return !vue.isEdit
            },
            code: 'OpmsJxContractList27'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.updateList()
    },
    updateList() {
      const vue = this
      const params = {
        contractType: vue.contractType,
        currentPage: vue.page.current,
        itemsPerPage: vue.page.size,
        merchantId: vue.merchantId
      }

      vue.$opms.$api.jxContract.queryTemlpatePage(params).then(res => {
        if (res && res.code === '0') {
          if (res.data.listObj.length > 0) {
            res.data.listObj.forEach(function(item) {
              item.templateVersion = 'V' + item.templateVersion
              item.uploadTimeStr = vue.$portal.parseTime(
                item.uploadTime,
                '{y}-{m}-{d} {h}:{i}:{s}'
              )
            })
          }
          vue.list = res.data.listObj
          vue.page.total = res.data.total
        }
      })
    },
    createTemplate() {
      this.formData = {
        templateCode: '',
        templateName: '',
        contractType: this.contract.contractType + '',
        merchantCode: this.contract.merchantCode,
        merchantId: this.contract.merchantId,
        merchantName: this.contract.merchantName,
        remark: '',
        fileList: []
      }
      this.addVisible = true
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
    }
  }
}
</script>

<style scoped>
</style>
