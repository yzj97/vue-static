<template>
  <section class="pg-soAutoConfig-list">
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs v-model="activeState" name="activeState" @tab-click="handleTabsClick" >
          <el-tab-pane v-for="tab in tabs" :label="tab.heading" :key="tab.index" >
            <ody-button name="OmsSoAutoConfig_Add_handleAdd" code="OmsSoAutoConfig_Add" size="small" type="primary" @click="handleAdd">{{ $t('add') }}</ody-button>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          name="list415"
        />
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"/>

      </div>
    </ody-list-table-area>
    <SoAutoConfig :visible.sync="visible" :type.sync="type" :type-name.sync="typeName" :modal-type.sync="modalType" :selected-item.sync="selectedItem" @ok="handleOk" />
    <SoAutoConfigReturn :return-visible.sync="returnVisible" :type.sync="type" :modal-type.sync="modalType" :selected-item.sync="selectedItem" @ok="handleOk" />
  </section>
</template>

<script>

import SoAutoConfig from '@/components/soAutoConfig'
import SoAutoConfigReturn from '@/components/soAutoConfig/return.vue'

export default {
  name: 'OmsSoAutoConfig',
  components: {
    SoAutoConfig,
    SoAutoConfigReturn
  },
  data() {
    return {
      visible: false,
      returnVisible: false,
      type: 0,
      typeName: '',
      modalType: 'add',
      selectedItem: null,
      appChannelMap: {},
      activeState: '0',
      loading: false,
      returnTypeList: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      typeMap: {
        0: 'cancel',
        1: 'sign',
        2: 'complete'
      },
      columns: [],
      operates: []
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    handleOk(item) {
      /** 对话框点击确认以后的回调 */
      this.updateList()
    },
    async handleTabsClick() {
      try {
        this.switchTab(this.activeState)
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    switchTab(type) {
      this.type = Number(type)
      if (this.type === 3) {
        this._buildReturnList()
      } else {
        this.typeName = this.$t('' + this.typeMap[type])
        this._buildList()
      }
    },
    _buildList() {
      var columnDefs = [
        {
          show: true,
          prop: 'orderSourceStr',
          label: this.$t('order_source'),
          align: 'center'
        }, {
          show: true,
          prop: 'paymentTypeStr',
          label: this.$t('paymentType'),
          align: 'center'
        }
      ]
      if (this.type === 1 || this.type === 2) {
        columnDefs.push({
          show: true,
          prop: 'orderTriggerStatusStr',
          label: this.$t('OrderTriggeringState'),
          align: 'center'
        })
      }
      columnDefs.push({
        show: true,
        prop: 'triggerAfterMinutes',
        label: this.$t('time_limit_' + this.typeMap[this.type]) + '(min)',
        align: 'center'
      })
      columnDefs.push({
        show: true,
        prop: 'appChannelsStr',
        label: this.$t('channel_code'),
        align: 'center',
        minWidth: 40
      })
      this.columns = columnDefs
      const vue = this
      const operatesDefs = {
        width: 200,
        list: [{
          label: this.$t('edit'),
          method: (index, row) => {
            vue.selectedItem = row
            vue.modalType = 'edit'
            vue.openFormDialog(false)
          },
          code: 'OmsSoAutoConfig_Edit'
        }, {
          label: this.$t('delete'),
          method: (index, row) => {
            this.selectedItem = row
            this.deleteItem(row)
          },
          code: 'OmsSoAutoConfig_Deleted'
        }]
      }
      this.operates = operatesDefs
    },
    _buildReturnList() {
      const columnDefs = [
        {
          show: true,
          prop: 'returnTypeStr',
          label: this.$t('so_return_type'),
          align: 'center'
        }, {
          show: true,
          prop: 'appChannelsStr',
          label: this.$t('source_channel'),
          align: 'center'
        }, {
          show: true,
          prop: 'triggerAfterMinutes',
          label: this.$t('time_limit_audit'),
          align: 'center'
        }
      ]
      this.columns = columnDefs
      const vue = this
      const operatesDefs = {
        width: 200,
        list: [{
          label: this.$t('edit'),
          method: (index, row) => {
            vue.selectedItem = row
            vue.modalType = 'edit'
            vue.openReturnFormDialog(false)
          },
          code: 'OmsSoAutoConfig_Edit'
        }, {
          label: this.$t('delete'),
          method: (index, row) => {
            vue.selectedItem = row
            vue.deleteItem(row)
          },
          code: 'OmsSoAutoConfig_Deleted'
        }]
      }
      this.operates = operatesDefs
    },
    handleAdd: function() {
      this.selectedItem = {}
      this.modalType = 'add'
      if (this.type === 3) {
        this.openReturnFormDialog(true)
      } else {
        this.openFormDialog(true)
      }
    },
    openFormDialog: function(isAdd) {
      this.visible = true
    },
    openReturnFormDialog: function(isAdd) {
      this.returnVisible = true
    },
    deleteItem: function(row) {
      this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        const deleteUrl = this.$oms.$api.soAutoConfig.soAutoConfigDelete
        deleteUrl(JSON.stringify([row.id])).then((res) => {
          this.$message({
            type: 'info',
            message: this.$t('common_delete_success')
          })
          this.updateList()
        })
      }).catch(() => {})
    },
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
    async handlePageSizeChange(size) {
      try {
        this.page.current = 1
        await this.updateList()
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
    },
    async _initAllChannels() {
      const res = await this.$oms.$api.common.listAllChannels({ })
      if (res && res.data) {
        const map = res.data
        for (var p in map) {
          this.appChannelMap[map[p].channelCode] = map[p].channelName
        }
      }
    },
    async init() {
      this.tabs = [
        {
          heading: this.$t('orderAutoCancel'),
          index: 0
        }, {
          heading: this.$t('orderAutoSign'),
          index: 1
        }, {
          heading: this.$t('orderAutoDone'),
          index: 2
        }, {
          heading: this.$t('returnOrderAutoAudit'),
          index: 3
        }
      ]
      await this._initAllChannels()
      this.handleTabsClick()
    }
  }
}
async function loadList(vue) {
  const param = {
    filters: {
      type: vue.type
    },
    limit: vue.page.size,
    page: vue.page.current
  }
  const soAutoConfigListPage = vue.$oms.$api.soAutoConfig.soAutoConfigListPage
  const res = await soAutoConfigListPage(param)
  if (res) {
    const data = res.data
    data.forEach(item => {
      if (item.appChannels) {
        item.appChannels = item.appChannels.split(',')
      }
      item.appChannelsStr = getAppChannelsStr(item.appChannels, vue)
    })
    vue.list = data
    vue.page.total = res.total
  }
}
const getAppChannelsStr = (appChannels, vue) => {
  if (Array.isArray(appChannels)) {
    var strs = []
    appChannels.forEach(item => {
      strs.push(vue.appChannelMap[item])
    })
    return strs.join(',')
  }
  return vue.appChannelMap[appChannels]
}
</script>

<style lang="scss" scoped>

</style>
