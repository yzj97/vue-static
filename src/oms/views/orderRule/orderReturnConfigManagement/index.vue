<template>
  <section>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="OmsSoReturnConfig_Add_openReturnFormDialog" code="OmsSoReturnConfig_Add" size="small" type="primary" @click="openReturnFormDialog('add')">{{ $t('add') }}</ody-button>
      </div>

      <div slot="table">
        <ody-table
          v-loading="loading"
          :data="data"
          :columns="columns"
          :operates="operates"
          :multiple="false"
          :checked.sync="checked"
          :can-filter="false"
          name="data721"
          @custom-sort-change="hanleCustomSortChange"
          @selection-change="handleSelectionChange"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="size"
          :total.sync="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <orderReturnConfigManagementSet
      :visible.sync="visibleOfSet"
      :modal-type="modalType"
      :selected-item="selectedItem"
      @ok="handleOk"/>
  </section>
</template>

<script>
import orderReturnConfigManagementSet from '@/components/orderReturnConfigManagementSet'

export default {
  name: 'OmsSoReturnConfig',
  components: {
    orderReturnConfigManagementSet
  },
  data() {
    const self = this
    return {
      visibleOfSet: false,
      modalType: '',

      channelMap: null,
      returnTypeMap: null,
      selectedItem: {
        returnType: '1',
        channelCode: 0,
        isDefault: false
      },

      data: [],
      loading: false,
      total: 0,
      size: 10,
      current: 1,
      columns: [
        {
          show: true,
          prop: 'channelCode',
          label: this.$t('so_return_channel_code'),
          align: 'left',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            return row.isDefault === 1 ? row.channelCode : self.channelMap[row.channelCode].channelName
          }
        }, {
          show: true,
          prop: 'returnType',
          label: this.$t('so_return_type'),
          align: 'left',
          formatter: (row, column, cellValue) => {
            return self.returnTypeMap[row.returnType]
          }
        }, {
          show: true,
          prop: 'returnDays',
          label: this.$t('so_return_days'),
          align: 'left',
          formatter: (row, column, cellValue) => {
            return row.returnType + '' === '4' ? `订单发货后${row.returnDays}天` : `订单已签收后${row.returnDays}天`
          }
        }
      ],
      operates: {
        align: 'center',
        list: [
          {
            label: this.$t('edit'),
            disabled: false,
            method(index, row) {
              self.selectedItem = JSON.parse(JSON.stringify(row))
              self.openReturnFormDialog('edit')
            },
            code: 'OmsSoReturnConfig_Edit'
          },
          {
            label: this.$t('delete'),
            disabled(index, row) {
              return row.isDefault === 1
            },
            method(index, row) {
              self.deleteOrderReturnItem(row)
            },
            code: 'OmsSoReturnConfig_Deleted'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    handlePageSizeChange(newSize) {
      this.size = newSize
      this.updateList()
    },
    handlePageCurrentChange(newPage) {
      this.current = newPage
      this.updateList()
    },
    openReturnFormDialog(type) {
      this.modalType = type
      this.visibleOfSet = true
    },
    deleteOrderReturnItem(row) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'info'
      }).then(() => {
        this.$oms.$api.soReturnConfig.soReturnConfigDelete(JSON.stringify([row.id])).then(resp => {
          this.$message({
            type: 'info',
            message: this.$t('common_delete_success')
          })
          this.updateList()
        })
      })
    },
    handleOk() {
      this.current = 1
      this.updateList()
    },

    async updateList() {
      try {
        this.loading = true
        await this.getList(this)
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    async getList() {
      const resp = await this.$oms.$api.soReturnConfig.soReturnConfigListPage({
        filters: {},
        limit: this.size,
        page: this.current
      })
      this.total = resp.total
      this.data = resp.data
    },
    async init() {
      const returnType = this.$oms.$api.common.selectCodes({ category: 'RETURN_TYPE' }).then(resp => {
        this.returnTypeMap = resp.data.reduce((map, curr) => {
          map[curr.code] = curr.name
          return map
        }, {})
      })
      const channels = this.$oms.$api.common.listAllChannels().then(resp => {
        this.channelMap = resp.data
      })
      await Promise.all([returnType, channels])

      this.updateList()
    }
  }
}
</script>

<style scoped>

</style>
