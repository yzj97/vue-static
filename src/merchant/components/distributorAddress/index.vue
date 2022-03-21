<template>
  <div class="address-content">
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          v-if="isEdit"
          name="MerchantCustomerManageAddAddress_hasAdd"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          code="MerchantCustomerManageAddAddress"
          @click="hasAdd"
        >{{ $t('新增地址') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="listTable.list"
          :can-filter="false"
          :columns="listTable.columns"
          :operates="listTable.operates"
          name="listTable_list490"
        />
      </div>
      <!-- <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="query"
            @current-change="query"/>
        </div>
      </div>-->
    </ody-list-table-area>
    <address-dialog
      v-if="dialogVisible"
      :org-id="orgId"
      :address-obj="addressObj"
      visible="dialogVisible"
      @hide-dialog="hideDialog"
      @confirm-dialog="confirmDialog"
    />
  </div>
</template>

<script>
import AddressDialog from '@/components/addressDialog'
export default {
  components: {
    AddressDialog
  },
  props: {
    editId: { type: Number, default: 0 },
    type: { type: Number, default: 1 },
    isEdit: { type: Boolean, default: false },
    orgType: {
      type: Number,
      default: 0
    },
    columns: {
      type: Array,
      default: () => [
        'contactPerson',
        'contactTelephone',
        'postCode',
        'showDetailAddress',
        'remark'
      ]
    }
  },
  data() {
    const self = this
    return {
      dialogVisible: false,
      orgId: null,
      addressObj: null,
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'addressType',
            label: this.$t('地址类型'),
            align: 'center',
            formatter: (row, column, cellValue) => {
              return row.addressType === 0 ? '发货地址' : '退货地址'
            }
          },
          {
            show: true,
            prop: 'isDefault',
            label: this.$t('默认地址'),
            align: 'center',
            render: function(h, params) {
              return (
                <div on-click={e => self.changeStatus(e, params.row)}>
                  <el-radio
                    value={params.row.isDefault}
                    label={1}
                    name='isDefault'
                  >
                    默认
                  </el-radio>
                </div>
              )
            }
          },
          {
            show: true,
            prop: 'contactPerson',
            label: this.$t('联系人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'contactTelephone',
            label: this.$t('联系人电话'),
            align: 'center'
          },
          {
            show: true,
            prop: 'postCode',
            label: this.$t('邮政编码'),
            align: 'center'
          },
          {
            show: true,
            prop: 'detailAddress',
            label: this.$t('详细地址'),
            align: 'center'
          },
          {
            show: true,
            prop: 'remark',
            label: this.$t('备注'),
            align: 'center'
          }
        ],
        operates: {
          width: 180,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              show: true,
              disabled: false,
              method(index, row) {
                self.hasEdit(row)
              },
              code: ' MerchantCustomerManageEditAddress'
            },
            {
              label: this.$t('删除'),
              show: true,
              disabled: false,
              method(index, row) {
                self.hasDelete(row)
              },
              code: ' MerchantCustomerManageDeleteAddress'
            }
          ]
        }
      },
      isDisabled: false
    }
  },
  watch: {
    // 监控属性editId的变化
    editId: {
      handler: function(val) {
        this.orgId = this.editId
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.orgId = this.editId
      if (this.orgId !== -1 && this.orgId !== 0) {
        this.listAddress()
      }
      if (!this.isEdit) {
        this.listTable.operates = null
      }
    },
    listAddress() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService
        .queryMerchantOrgAddressByOrgId(this.editId)
        .then(res => {
          this.listTable.list = res.data.listObj
        })
    },
    changeStatus(e, row) {
      e.preventDefault()
      var updateParam = {}
      updateParam.id = row.id
      updateParam.isDefault = row.isDefault === 1 ? 0 : 1
      const distributorService = this.$merchant.$api.distributorService
      distributorService.updateDefaultWithOrgId(updateParam).then(res => {
        this.listAddress()
      })
    },
    hasAdd() {
      this.addressObj = null
      this.dialogVisible = true
    },
    hasEdit(row) {
      this.addressObj = row
      this.dialogVisible = true
    },
    hasDelete(row) {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.deleteMerchantOrgAddressById(row.id).then(res => {
        this.listAddress()
      })
    },
    hideDialog() {
      this.addressObj = null
      this.dialogVisible = false
    },
    confirmDialog() {
      this.addressObj = null
      this.dialogVisible = false
      this.listAddress()
    }
  }
}
</script>

<style lang="less">
</style>
