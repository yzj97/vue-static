<template>
  <div class="supplier-edit-attachment-info">
    <div>
      <div v-if="!isView" slot="btn">
        <ody-button
          v-if="isEdit"
          name="OpmsSupplierList12_handleModelAddSupplierAttachOpen"
          size="small"
          type="primary"
          code="OpmsSupplierList12"
          @click="handleModelAddSupplierAttachOpen"
        >{{ $t('上传附件') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/ouser-web/merchantOrgCertificate/queryMerchantOrgCertificateByOrgId.do"
        >
          <template slot="certificateName" slot-scope="scope">{{ scope.row.certificateName }}</template>
          <template
            slot="certificateType"
            slot-scope="scope"
          >{{ scope.row.certificateType | keyVal(getAttachTypeMap) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
        </ody-table>
      </div>
    </div>
    <opms-modal-add-supplier-attach
      v-if="modalAddSupplierAttach.visible"
      :visible.sync="modalAddSupplierAttach.visible"
      :supplier-attach="modalAddSupplierAttach.supplierAttach"
      :is-add="isAdd"
      :org-id="supplierId"
      @ok="handleModelAddSupplierAttachOk"
    />
  </div>
</template>

<script>
import OpmsModalAddSupplierAttach from '@/components/modal-add-supplier-attach'
import constant from 'packages/utils/constant'

export default {
  components: {
    OpmsModalAddSupplierAttach
  },
  props: {},
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    // const isAdd = +editStatus === 0

    return {
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd: true,
      table: {
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              disabled: isView,
              method: (index, row) => {
                this.modalAddSupplierAttach.supplierAttach = row
                this.modalAddSupplierAttach.visible = true
              },
              code: 'OpmsSupplierList14'
            },
            {
              label: this.$t('删除'),
              disabled: isView,
              method: async(index, row) => {
                const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!res) {
                  return
                }

                const { ...params } = row
                // params.storeId = this.storeId
                // this.deleteRole(row)
                await this.$opms.$api.supplier.deleteMerchantOrgCertificateById(
                  JSON.stringify(params.id)
                )
                this.$message({
                  message: this.$t('删除成功'),
                  type: 'success'
                })
                this.query()
              },
              code: 'OpmsSupplierList15'
            }
          ]
        },
        columns: [
          {
            label: this.$t('附件名称'),
            slot: 'certificateName',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('附件类型'),
            slot: 'certificateType',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('上载人'),
            prop: 'createUserName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('上载时间'),
            slot: 'createTime',
            show: true,
            minWidth: 180
          }
        ]
      },
      modalAddSupplierAttach: {
        visible: false,
        supplierAttach: {}
      }
    }
  },
  computed: {
    getAttachTypeMap() {
      return constant.attachTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    if (this.isEdit || this.isView) {
      await this.query()
    }
  },
  methods: {
    handleModelAddSupplierAttachOpen() {
      this.modalAddSupplierAttach = {
        visible: false,
        supplierAttach: {}
      }
      this.modalAddSupplierAttach.visible = true
    },
    query() {
      const { supplierId } = this
      this.$refs.table.getList(supplierId)
    },
    async handleModelAddSupplierAttachOk() {
      this.modalAddSupplierAttach.visible = false
      await this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-edit-attachment-info {
  .cp-box {
    box-shadow: none;
    padding-bottom: 0;
  }
  /deep/ {
    .el-table__footer-wrapper,
    .el-table__header-wrapper {
      margin-top: 10px;
    }
  }
}
</style>
