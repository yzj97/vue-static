<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('titleModifyWarehouse')"
      width="40%"
      @open="init" >
      <section class="pg-modifyWarehouseModal-list">
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              name="list987"
              @selection-change="handleSelectionChange"
            />
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="checked.length != 1" name="handleOk" type="primary" @click="handleOk">{{ $t('common_save') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      multiple: true,
      loading: false,
      checked: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },

      columns: [
        {
          show: true,
          prop: 'warehouseName',
          label: this.$t('product_warehouse_name'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'availableNum',
          label: this.$t('manual_order_salable_stock'),
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    init() {
      this.updateList()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk() {
      if (this.checked && this.checked[0]) {
        const result = await this.$oms.$api.soItem.siUpdateItemStock(this.checked[0])
        if (result.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('promptSaveStoreSuccess')
          })
          this.$emit('update:visible', !this.visible)
          this.$emit('ok')
        } else {
          this.$message({
            type: 'error',
            message: result.message
          })
        }
      }
    }
  }
}

async function loadList(vue) {
  const result = await vue.$oms.$api.soItem.siListItemRealWarehouse({ id: vue.item.id })
  if (result.code === '0') {
    vue.list = result.data
  }
}

</script>

<style lang="scss" scoped>

</style>
