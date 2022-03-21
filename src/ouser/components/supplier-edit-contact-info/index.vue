<template>
  <div class="supplier-edit-contact-info">
    <div v-if="!isView" slot="btn">
      <ody-button
        v-if="isEdit"
        name="OpmsSupplierList08_handleModelAddSupplierContactOpen"
        size="small"
        type="primary"
        code="OpmsSupplierList08"
        @click="handleModelAddSupplierContactOpen"
      >{{ $t('新增') }}</ody-button>
    </div>
    <div slot="table">
      <ody-table
        ref="table"
        :columns="table.columns"
        :operates="table.operates"
        :can-filter="false"
        request-url="/ouser-web/merchantOrgContact/queryMerchantOrgContactByOrgIdPage.do"
        @getTableList="loadTable"
      >
        <template slot="sex" slot-scope="scope">{{ scope.row.sex | keyVal(getSexMap) }}</template>
        <template slot="isMain" slot-scope="scope">{{ scope.row.isMain | keyVal(getIsDefaultMap) }}</template>
      </ody-table>
    </div>
    <opms-modal-add-supplier-contact
      v-if="modalAddSupplierContact.visible"
      :visible.sync="modalAddSupplierContact.visible"
      :supplier-contact="modalAddSupplierContact.supplierContact"
      :is-add="isAdd"
      :org-id="orgId"
      :org-name="orgName"
      :org-code="orgCode"
      :main-contact-id="mainContactId"
      @ok="handleModelAddSupplierContactOk"
    />
  </div>
</template>

<script>
import OpmsModalAddSupplierContact from '@/components/modal-add-supplier-contact'
import constant from 'packages/utils/constant'

export default {
  components: {
    OpmsModalAddSupplierContact
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    return {
      mainContactId: null,
      orgId: supplierId,
      orgName: this.basicInfo.orgName,
      orgCode: this.basicInfo.orgCode,
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      table: {
        columns: [
          {
            label: this.$t('联系人名称'),
            prop: 'name',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('性别'),
            slot: 'sex',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('联系人职位名称'),
            prop: 'position',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('手机号码'),
            prop: 'mobileNo',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('固定电话'),
            prop: 'telNo',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('传真'),
            prop: 'fax',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('QQ'),
            prop: 'qq',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('微信'),
            prop: 'weixin',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('联系邮箱'),
            prop: 'email',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('联系地址（省）'),
            prop: 'provinceName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('联系地址（市）'),
            prop: 'cityName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('联系地址（区）'),
            prop: 'regionName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('详细地址'),
            prop: 'detailAddress',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('主要联系人'),
            slot: 'isMain',
            show: true,
            minWidth: 180
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              disabled: isView,
              method: (index, row) => {
                this.modalAddSupplierContact.supplierContact = row
                this.modalAddSupplierContact.visible = true
              },
              code: 'OpmsSupplierList10'
            },
            {
              label: this.$t('删除'),
              disabled: isView,
              method: async(index, row) => {
                const res = await this.$confirm('确定删除吗?', '提示', {
                  confirmButtonText: this.$t('确定'),
                  cancelButtonText: this.$t('取消'),
                  type: 'warning'
                })

                if (!res) {
                  return
                }

                const { ...params } = row

                await this.$ouser.$api.supplier.deleteOrgContactById(
                  JSON.stringify(params.id)
                )
                this.$message({
                  message: this.$t('删除成功'),
                  type: 'success'
                })
                this.query()
              },
              code: 'OpmsSupplierList11'
            }
          ]
        }
      },
      modalAddSupplierContact: {
        visible: false,
        supplierContact: {}
      }
    }
  },
  computed: {
    getSexMap() {
      return constant.sexList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getIsDefaultMap() {
      return constant.mainList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
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
    handleModelAddSupplierContactOpen() {
      this.modalAddSupplierContact = {
        visible: false,
        supplierContact: {}
      }
      this.modalAddSupplierContact.visible = true
    },
    query() {
      const { supplierId } = this
      const searchParam = { orgId: supplierId }
      this.$refs.table.getList(searchParam)
    },
    handleModelAddSupplierContactOk(val) {
      this.modalAddSupplierContact.visible = false
      this.query()
    },
    loadTable(tableList) {
      this.mainContactId = null
      tableList.forEach(it => {
        if (it.isMain === 1) {
          this.mainContactId = it.id
          return
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-edit-contact-info {
  .cp-box {
    box-shadow: none;
    padding-bottom: 0;
  }
}
</style>
