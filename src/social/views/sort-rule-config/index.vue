<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" :rules="rules" :model="searchForm" label-width="100px" class="form">
          <ody-search-item :label="$t('排序规则名称')" prop="channelList">
            <el-input v-model.trim="searchForm.rankGroupName"/>
          </ody-search-item>
          <ody-search-item :label="$t('渠道')" prop="channelList">
            <el-select v-model="searchForm.channelList" name="searchForm_channelList" multiple>
              <el-option
                v-for="item in channelList"
                :key="item.channelCode"
                :label="item.channelName"
                :value="item.channelCode" />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="SocialSortRuleConfigBatchDelete_handleBatchDelete" code="SocialSortRuleConfigBatchDelete" size="small" type="primary" @click="handleBatchDelete">{{ $t('批量删除') }}</ody-button>
        <ody-button name="SocialSortRuleConfigAdd_handleAddFactor" code="SocialSortRuleConfigAdd" size="small" type="primary" @click="handleAddFactor">{{ $t('添加因子') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          :multiple="multiple"
          :checked.sync="checked"
          :can-filter="false"
          name="data276"/>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <div slot="footer" align="center">
      <ody-button name="SocialSortRuleConfigSave_handleSave" code="SocialSortRuleConfigSave" type="primary" size="small" @click="handleSave">{{ $t('保存') }}</ody-button>
      <el-button name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
    </div>
    <social-sort-rule-factor-list-dialog :visible.sync="listDialogVisible" :comment.sync="listInfo" @ok="getCheckedList"/>
    <social-sort-rule-factor-detail-dialog :visible.sync="detailDialogVisible" :comment.sync="detailInfo" @ok="getConfigData"/>
  </div>
</template>

<script>
import SocialSortRuleFactorListDialog from '@/components/sort-rule-factor-list-dialog'
import SocialSortRuleFactorDetailDialog from '@/components/sort-rule-factor-detail-dialog'
export default {
  name: 'SocialSortRuleConfig',
  components: {
    SocialSortRuleFactorListDialog,
    SocialSortRuleFactorDetailDialog
  },
  data() {
    const self = this
    return {
      detailDialogVisible: false,
      listDialogVisible: false,
      listInfo: [],
      detailInfo: {},
      channelList: [],
      searchForm: {
        rankGroupName: '',
        channelList: []
      },
      data: [],
      loading: false,
      multiple: true,
      checked: [],
      rules: {
        rankGroupName: [
          { required: true, message: this.$t('排序规则名称不能为空'), trigger: 'change' }
        ],
        channelList: [
          { required: true, message: this.$t('请至少选择一个渠道'), trigger: 'change' }
        ]
      },
      columns: [
        {
          show: true,
          prop: 'rankCode',
          label: this.$t('排序因子编号'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'rankName',
          label: this.$t('排序因子名称'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'sortValue',
          label: this.$t('优先级'),
          align: 'center',
          minWidth: 120
        }
      ],
      operates: {
        width: 140,
        align: 'center',
        list: [
          {
            label: this.$t('编辑'),
            code: 'SocialSortRuleConfigEdit',
            disabled: false,
            method(index, row) {
              self.handleEdit(row)
            }
          },
          {
            label: this.$t('删除'),
            code: 'SocialSortRuleConfigDelete',
            disabled: false,
            method(index, row) {
              self.handleDelete(row)
            }
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  watch: {
    'listDialogVisible': {
      handler() {
        if (!this.listDialogVisible) {
          this.page.total = this.data.length
        }
      }
    }
  },
  mounted() {
    this.id = this.$route.query.id
    this.indexApi = this.$social.$api.indexApi
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      await this.initChannel()
      this.handleSearchQuery()
    },
    async initChannel() {
      const res = await this.indexApi.getChannelList({})
      if (res.code === '0') {
        this.channelList = res.data
      }
    },
    handleSearchQuery() {
      this.page.current = 1
      this.query()
    },
    query() {
      if (this.id) {
        this.loading = true
        try {
          this.indexApi.getRankGroupById({ id: this.id }).then(res => {
            if (res.code === '0') {
              this.searchForm.rankGroupName = res.data.rankGroupName
              const list = []
              res.data.channelList.forEach(item => {
                list.push(item.channelCode)
              })
              this.searchForm.channelList = list
              this.searchForm.isAvailable = res.data.isAvailable
            }
          })
          const param = {
            rankGroupId: this.id,
            pageSize: this.page.size,
            pageNum: this.page.current
          }
          this.indexApi.getOrderingRuleByGroupId(param).then(res => {
            if (res.code === '0') {
              this.data = res.data
            }
            this.page.total = res.data.length
          })
        } finally {
          this.loading = false
        }
      }
    },
    getCheckedList(param) {
      const list = this.data
      if (param && param.length > 0) {
        param.forEach(checkedItem => {
          let flag = true
          this.data.forEach(item => {
            if (item.rankConfigId === checkedItem.rankConfigId) {
              flag = false
            }
          })
          if (flag) {
            list.push(checkedItem)
          }
        })
      }
      const sortList = list.sort((a, b) => {
        return (a.sortValue ? a.sortValue : 0) - (b.sortValue ? b.sortValue : 0)
      })
      this.data = sortList
      this.checked = []
    },
    handleEdit(row) {
      this.detailInfo = row
      this.detailDialogVisible = true
    },
    handleSave() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (!this.data || this.data.length < 1) {
            this.$message.error(this.$t('请至少添加一个排序因子'))
            return
          }

          this.$confirm(this.$t('是否保存') + '?', this.$t('提示'), {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }).then(() => {
            const channelList = []
            this.searchForm.channelList.forEach(item => {
              const channel = {
                channelCode: item
              }
              channelList.push(channel)
            })
            const param = {
              id: this.id,
              isAvailable: this.searchForm.isAvailable,
              rankGroupName: this.searchForm.rankGroupName,
              channelList: channelList,
              orderingRuleList: this.data
            }
            this.indexApi.saveRankGroup(param).then(res => {
              if (res.code === '0') {
                this.$message({
                  type: 'success',
                  message: this.$t('保存成功') + '!'
                })
                this.$portal.delActiveViewAndRefresh('SocialSortRule')
              }
            })
          })
        }
      })
    },
    handleBatchDelete() {
      const list = []
      this.data.forEach(item => {
        let flag = true
        this.checked.forEach(checkedItem => {
          if (checkedItem.rankConfigId === item.rankConfigId) {
            flag = false
          }
        })
        if (flag) {
          list.push(item)
        }
      })
      this.data = list
      this.page.total = list.length
    },
    handleBack() {
      this.$portal.delActiveViewAndRefresh('SocialSortRule')
    },
    handleDelete(row) {
      const list = []
      const rankConfigId = row.rankConfigId
      this.data.forEach(item => {
        if (item.rankConfigId !== rankConfigId) {
          list.push(item)
        }
      })
      this.data = list
      this.page.total = list.length
    },
    handleAddFactor() {
      const param = {
        pageNum: 1,
        pageSize: 10
      }
      const checkedList = []
      this.indexApi.getOrderingRuleList(param).then(res => {
        if (res.code === '0' && res.data.dataList.length > 0) {
          const list = res.data.dataList
          list.forEach(item => {
            this.data.forEach(checkedItem => {
              if (item.rankConfigId === checkedItem.rankConfigId) {
                checkedList.push(item)
              }
            })
          })
          this.listInfo.list = list
          this.listInfo.checkedList = checkedList
        }
        this.listInfo.total = res.data.totalItems
        this.listDialogVisible = true
      })
    },
    handlePageSizeChange() {
      this.query()
    },
    handlePageCurrentChange() {
      this.query()
    },
    getConfigData(param) {
      this.data.forEach(item => {
        if (item.rankConfigId === param.rankConfigId) {
          item.note = param.note
          item.ruleValueList = param.ruleValueList
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
