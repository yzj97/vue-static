<template>
  <div class="supplier-edit-qualification-info">
    <div slot="table">
      <!-- <ody-table
        ref="table"
        :columns="table.columns"
        :operates="table.operates"
        :can-filter="false"
        request-url="/ouser-web/storeAction/queryStoreTerminalSupplierPage.do"
      >
        <template slot="isAvailable" slot-scope="scope">
          <el-switch
            v-model="scope.row.isAvailable"
            :active-value="1"
            :inactive-value="0"
            :disabled="isView || scope.row.isAvailableDisabled"
            name="scope_row_isAvailable"
            @change="handleIsAvailableChange(scope.row)"
          />
          {{ scope.row.isAvailable | keyVal(getIsAvailableMap) }}
        </template>
      </ody-table>-->
    </div>
  </div>
</template>

<script>
import OpmsTitle from '@/components/title'
import constants from '@/utils/constants'

export default {
  components: {
    OpmsTitle
  },
  props: {},
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
                this.modalAddStoreTerminalSupplier.terminalSupplierCode =
                  row.terminalSupplierCode
                this.modalAddStoreTerminalSupplier.outerStoreCode =
                  row.outerStoreCode
                this.modalAddStoreTerminalSupplier.remarks = row.remarks
                this.modalAddStoreTerminalSupplier.isAvailable = row.isAvailable
                this.modalAddStoreTerminalSupplier.visible = true
              }
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
                await this.$opms.$api.storeService.deleteStoreTerminalSupplier(
                  params
                )
                this.$message({
                  message: this.$t('删除成功'),
                  type: 'success'
                })
                this.query()
              }
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
      return constants.isAvailableList.reduce((rtv, item) => {
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
      await this.$opms.$api.storeService.updateStoreTerminalSupplier(params)
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
.supplier-edit-qualification-info {
  .cp-box {
    box-shadow: none;
    padding-bottom: 0;
  }
}
</style>
