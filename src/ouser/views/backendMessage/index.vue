<template>
  <div>
    <section>
      <ody-list-table-area>
        <div slot="tabs">
          <el-tabs v-model="searchForm.hasRead" name="searchForm_hasRead" @tab-click="tabChange">
            <el-tab-pane :label="$t('全部')" name="-1"/>
            <el-tab-pane :label="$t('已读')" name="0"/>
            <el-tab-pane :label="$t('未读')" name="1"/>
          </el-tabs>
        </div>
        <div slot="table">
          <ody-table
            :loading="loading"
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            name="listTable_list049"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="searchForm.currentPage"
            :list="listTable.list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="searchForm.itemsPerPage"
            :total.sync="listTable.total"
            background
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="query"
            @current-change="query"/>

        </div>
      </ody-list-table-area>
    </section>
    <!--发布公告-->
    <ody-dialog-full-right
      :visible.sync="addDialog.show"
      :title="$t('公告')">
      <div v-html="addDialog.content"/>
      <div slot="footer">
        <el-button name="cancel" @click="cancel">{{ $t('关闭') }}</el-button>
      </div>
    </ody-dialog-full-right>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  name: 'OuserBackendMessage',
  data() {
    const self = this
    return {
      loading: false,
      addDialog: { show: false, content: null },
      searchForm: { currentPage: 1, itemsPerPage: 10, hasRead: '-1' },
      listTable: {
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'title',
            label: self.$t('标题'),
            align: 'center',
            render: function(h, params) {
              // 已读
              if (params.row.hasRead === 0) {
                return (
                  <ody-button code='OuserBackendMessageOperRead' size='mini' on-click={() => { self.showDetail(params.row) }}>{params.row.title}</ody-button>
                )
              } else {
                // 未读
                return (
                  <div>
                    <ody-button code='OuserBackendMessageOperRead' size='mini' on-click={() => {
                      self.showDetail(params.row)
                    }}>{params.row.title}</ody-button>&nbsp;&nbsp;<el-tag type='danger'>未读</el-tag></div>
                )
              }
            }
          },
          {
            show: true,
            prop: 'typeStr',
            label: self.$t('类型'),
            align: 'center',
            minWidth: 88
          },
          {
            show: true,
            prop: 'publicTimeStr',
            label: self.$t('发布时间'),
            align: 'center',
            minWidth: 200
          }
        ] }
    }
  },
  async mounted() {
    this.loading = true
    await this.init()
    this.loading = false
  },
  methods: {
    async init() {
      // 1、初始化站内信类型列表
      const self = this
      const oscService = this.$ouser.$api.oscService
      await oscService.pageGet({ key: 'MESSAGE_TYPE_OPTIONS', pool: 'ouser' }).then(res => {
        self.messageTypeOptions = JSON.parse(res.data.value)
      })
      await this.query()
    },
    tabChange() {
      this.searchForm.currentPage = 1
      this.searchForm.itemsPerPage = 10
      this.query()
    },
    async query() {
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      // 设置时间区间
      // 2、获取站内信列表
      this.loading = true
      try {
        const res = await backendMessageService.getUserMessageList(this.searchForm)

        // 初始化类型
        util.formatDate(res.data.listObj, 'publicTime')
        self.listTable.list = res.data.listObj
        self.listTable.total = res.data.total
        self.listTable.list.forEach(one => {
          one.typeStr = util.getOnePropByKeyFromArr(self.messageTypeOptions, one.type.toString(), 'value', 'label')
        })
      } finally {
        this.loading = false
      }
    },
    handleModifyMessageStatus(row, status) {
      // 修改公告状态
      const self = this
      const backendMessageService = this.$ouser.$api.backendMessageService
      row.status = status
      backendMessageService.modifyMessageStatus(row).then(res => {
        self.$message({
          message: self.$t('信息更新成功'),
          type: 'success'
        })
        self.query()
      })
    },
    showDetail(row) {
      this.addDialog.show = true
      this.addDialog.content = row.content
      const backendMessageService = this.$ouser.$api.backendMessageService
      backendMessageService.mark2Read({ backendMessageId: row.backendMessageId })
    },
    cancel() {
      this.addDialog = { show: false, content: null }
      this.query()
    }
  }
}
</script>
