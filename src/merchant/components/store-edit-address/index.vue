<template>
  <div class>
    <merchant-title>{{ $t('地址信息') }}</merchant-title>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          id="merchantStoreListAddressAdd"
          :disabled="isView"
          name="MerchantStoreListAddressAdd_handleModelAddAddressOpen"
          code="MerchantStoreListAddressAdd"
          size="mini"
          type="primary"
          @click="handleModelAddAddressOpen"
        >{{ $t('添加地址') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/ouser-web/merchantOrgAddress/queryMerchantOrgAddressByOrgId.do"
        >
          <template
            slot="addressType"
            slot-scope="scope"
          >{{ scope.row.addressType | keyVal(getAddressTypeMap) }}</template>
          <template slot="isDefault" slot-scope="scope">
            <el-switch
              v-if="$portal.hasPermission('MerchantStoreListAddressIsDefault')"
              v-model="scope.row.isDefault"
              :active-value="1"
              :inactive-value="0"
              :disabled="isView || scope.row.isDefaultDisabled"
              name="scope_row_isDefault"
              @change="handleIsDefaultChange(scope.row)"
            />
            {{ scope.row.isDefault | keyVal(getIsDefaultAddressMap) }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <merchant-modal-add-address
      v-if="addAddress.visible"
      :visible.sync="addAddress.visible"
      :org-id="orgId"
      :address-id="addAddress.addressId"
      :contact-person="addAddress.contactPerson"
      :contact-telephone="addAddress.contactTelephone"
      :province-code="addAddress.provinceCode"
      :city-code="addAddress.cityCode"
      :region-code="addAddress.regionCode"
      :detail-address="addAddress.detailAddress"
      :detail-address-lan2="addAddress.detailAddressLan2"
      :address-type="addAddress.addressType"
      :is-default="addAddress.isDefault"
      :post-code="addAddress.postCode"
      :remark="addAddress.remark"
      @ok="handleAddAddressOk"
    />
  </div>
</template>

<script>
import constants from '@/utils/constants'
import MerchantTitle from '@/components/title'
import MerchantModalAddAddress from '@/components/modal-add-address'

export default {
  components: {
    MerchantTitle,
    MerchantModalAddAddress
  },
  props: {},
  data() {
    const { status, orgId } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    return {
      addAddress: {
        visible: false,
        addressObj: {}
      },
      orgId,
      isEdit,
      isView,
      table: {
        columns: [
          {
            label: this.$t('地址类型'),
            slot: 'addressType',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('是否默认地址'),
            slot: 'isDefault',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('联系人'),
            prop: 'contactPerson',
            show: true
          },
          {
            label: this.$t('联系电话'),
            prop: 'contactTelephone',
            show: true
          },
          {
            label: this.$t('邮编'),
            prop: 'postCode',
            show: true
          },
          {
            label: this.$t('详细地址'),
            prop: 'detailAddress',
            show: true
          },
          {
            label: this.$t('备注'),
            prop: 'remark',
            show: true
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
                // this.$router.push({ path: '/ouser-web/roleEdit/' + row.id })
                this.addAddress.addressId = row.id
                this.addAddress.contactPerson = row.contactPerson
                this.addAddress.contactTelephone = row.contactTelephone
                this.addAddress.provinceCode = row.provinceCode
                this.addAddress.cityCode = row.cityCode
                this.addAddress.regionCode = row.regionCode
                this.addAddress.detailAddress = row.detailAddress
                this.addAddress.detailAddressLan2 = row.detailAddressLan2
                this.addAddress.addressType = row.addressType
                this.addAddress.isDefault = row.isDefault
                this.addAddress.postCode = row.postCode
                this.addAddress.remark = row.remark

                this.addAddress.visible = true
              },
              code: 'MerchantStoreListAddressEdit'
            },
            {
              label: this.$t('删除'),
              disabled: isView,
              method: async(index, row) => {
                // this.deleteRole(row)
                const res = await this.$confirm(
                  this.$t('确定删除吗?'),
                  this.$t('提示'),
                  {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                  }
                )

                if (!res) {
                  return
                }

                const { id: params } = row
                // this.deleteRole(row)
                await this.$merchant.$api.distributorService.deleteMerchantOrgAddressById(
                  params
                )
                this.$message({
                  message: this.$t('删除成功'),
                  type: 'success'
                })
                this.query()
              },
              code: 'MerchantStoreListAddressDelete'
            }
          ]
        }
      }
    }
  },
  computed: {
    getAddressTypeMap() {
      return constants.addressType.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getIsDefaultAddressMap() {
      return constants.isDefaultAddress.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    async handleIsDefaultChange(row) {
      const { ...params } = row
      row.isDefaultDisabled = true
      params.orgId = this.orgId
      await this.$merchant.$api.distributorService.updateMerchantOrgAddressById(
        params
      )
      this.query()
    },
    query() {
      const { orgId } = this.$route.params
      this.$refs.table.getList(orgId)
    },
    handleModelAddAddressOpen() {
      this.addAddress.addressId = 0
      this.addAddress.visible = true
    },
    handleAddAddressOk() {
      this.addAddress.visible = false
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
