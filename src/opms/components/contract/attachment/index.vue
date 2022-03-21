<template>
  <div>
    <ody-list-table-area>
      <div slot="btn">
        <el-upload
          v-if="isEdit"
          ref="upload"
          :http-request="createAttachment"
          :show-file-list="false"
          :file-list="fileList"
          name="file"
          multiple="false"
          style="display: inline-block;"
        >
          <ody-button
            name="OpmsJxContractList22"
            size="mini"
            type="primary"
            code="OpmsJxContractList22"
          >{{ $t('contract_uploadContractOri') }}</ody-button>
        </el-upload>
        <ody-button
          v-if="isEdit"
          name="OpmsJxContractList23_deleteAttachment"
          size="mini"
          type="primary"
          code="OpmsJxContractList23"
          @click="deleteAttachment"
        >{{ $t('common_delete') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="list"
          :columns="columns"
          :can-filter="false"
          :checked.sync="checked"
          :multiple="isEdit"
          name="list119"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
export default {
  props: {
    contractId: {
      type: Number,
      default: null
    },
    contractCode: {
      type: String,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      list: [],
      checked: [],
      fileList: [],
      columns: [
        {
          show: true,
          prop: 'feeTypeCode',
          label: this.$t('contract_contractOri'),
          align: 'center',
          render: (h, params) => {
            return (
              <el-link
                icon='el-icon-document'
                href={params.row.attachPath}
                target='_blank'
              >
                {params.row.attachName}
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
          prop: 'createTimeStr',
          label: this.$t('contract_uploadTime'),
          align: 'center'
        }
      ]
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
        contractId: vue.contractId
      }

      vue.$opms.$api.jxContract.queryAttachmentList(params).then(res => {
        if (res && res.code === '0') {
          res.data.forEach(function(item) {
            item.createTimeStr = vue.$portal.parseTime(
              item.createTime,
              '{y}-{m}-{d} {h}:{i}:{s}'
            )
          })
          vue.list = res.data
        }
      })
    },
    createAttachment(param) {
      const vue = this
      const formData = new FormData()
      formData.append('file', param.file)
      formData.append('contractId', vue.contractId)
      formData.append('contractCode', vue.contractCode)
      vue.$opms.$api.jxContract.addAttach(formData).then(res => {
        if (res && res.code === '0') {
          vue.updateList()
          vue.$message({
            type: 'success',
            message: vue.$t('save_success')
          })
        }
      })
    },
    deleteAttachment() {
      const vue = this

      if (vue.checked && vue.checked.length > 0) {
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
            const ids = []
            vue.checked.forEach(function(item) {
              ids.push(item.id)
            })

            vue.$opms.$api.jxContract
              .deleteAttach({ contractId: vue.contractId, ids: ids })
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
      } else {
        vue.$message({
          type: 'warning',
          message: vue.$t('please_choose_at_least_one_item')
        })
      }
    }
  }
}
</script>

<style scoped>
</style>
