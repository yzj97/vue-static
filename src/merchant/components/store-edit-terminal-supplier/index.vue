<template>
  <div class="">
    <merchant-title>{{ $t('供应商店铺映射') }}</merchant-title>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          id="merchantStoreListTerminalSupplier"
          :disabled="isView"
          name="MerchantStoreListTerminalSupplier_handleModelAddStoreTerminalSupplierOpen"
          code="MerchantStoreListTerminalSupplier"
          size="mini"
          type="primary"
          @click="handleModelAddStoreTerminalSupplierOpen">{{ $t('映射外部店铺') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          :can-filter="false"
          request-url="/ouser-web/storeAction/queryStoreTerminalSupplierPage.do"
        >
          <template slot="isAvailable" slot-scope="scope">
            <el-switch
              v-if="$portal.hasPermission('MerchantStoreListTerminalSupplierAvailable')"
              v-model="scope.row.isAvailable"
              :active-value="1"
              :inactive-value="0"
              :disabled="isView || scope.row.isAvailableDisabled"
              name="scope_row_isAvailable"
              @change="handleIsAvailableChange(scope.row)"
            />
            {{ scope.row.isAvailable | keyVal(getIsAvailableMap) }}
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <merchant-modal-add-store-terminal-supplier
      v-if="modalAddStoreTerminalSupplier.visible"
      :visible.sync="modalAddStoreTerminalSupplier.visible"
      :store-id="storeId"
      :supplier-id="modalAddStoreTerminalSupplier.supplierId"
      :terminal-supplier-code="modalAddStoreTerminalSupplier.terminalSupplierCode"
      :outer-store-code="modalAddStoreTerminalSupplier.outerStoreCode"
      :is-available="modalAddStoreTerminalSupplier.isAvailable"
      :remarks="modalAddStoreTerminalSupplier.remarks"
      @ok="handleModelAddStoreTerminalSupplierOk"
    />
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'
import MerchantModalAddStoreTerminalSupplier from '@/components/modal-add-store-terminal-supplier'
import constant from 'packages/utils/constant'

export default {
  components: {
    MerchantTitle,
    MerchantModalAddStoreTerminalSupplier
  },
  props: {
  },
  data() {
    const { status, orgId: storeId } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    return {
      isEdit,
      isView,
      storeId,
      table: {
        columns: [
          {
            label: this.$t('供应商名称'),
            prop: 'terminalSupplierName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('对应供应商店铺ID'),
            prop: 'outerStoreCode',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('状态'),
            slot: 'isAvailable',
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
                this.modalAddStoreTerminalSupplier.supplierId = row.id
                this.modalAddStoreTerminalSupplier.terminalSupplierCode = row.terminalSupplierCode
                this.modalAddStoreTerminalSupplier.outerStoreCode = row.outerStoreCode
                this.modalAddStoreTerminalSupplier.remarks = row.remarks
                this.modalAddStoreTerminalSupplier.isAvailable = row.isAvailable
                this.modalAddStoreTerminalSupplier.visible = true
              },
              code: 'MerchantStoreListTerminalSupplierEdit'
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
                params.storeId = this.storeId
                // this.deleteRole(row)
                await this.$merchant.$api.storeService.deleteStoreTerminalSupplier(params)
                this.$message({
                  message: this.$t('删除成功'),
                  type: 'success'
                })
                this.query()
              },
              code: 'MerchantStoreListTerminalSupplierDelete'
            }
          ]
        }
      },
      modalAddStoreTerminalSupplier: {
        visible: false
      }
    }
  },
  computed: {
    getIsAvailableMap() {
      return constant.purchasingStatusList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  mounted() {
    this.query()
  },
  methods: {
    async handleIsAvailableChange(row) {
      const { ...params } = row
      row.isAvailableDisabled = true
      params.storeId = this.storeId
      await this.$merchant.$api.storeService.updateStoreTerminalSupplier(params)
      this.query()
    },
    query() {
      const { orgId: storeId } = this.$route.params
      this.$refs.table.getList({
        storeId
      })
    },
    handleModelAddStoreTerminalSupplierOpen() {
      this.modalAddStoreTerminalSupplier.supplierId = 0
      this.modalAddStoreTerminalSupplier.visible = true
    },
    handleModelAddStoreTerminalSupplierOk() {
      this.modalAddStoreTerminalSupplier.visible = false
      this.query()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
