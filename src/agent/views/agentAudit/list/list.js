export default {
  name: 'AgentAuditList',
  data() {
    const self = this
    return {
      visible: false,
      loading: false,
      checked: [],
      auditStatusList: [{
        label: this.$t('待审核'),
        value: 0
      }, {
        label: this.$t('审核拒绝'),
        value: 1
      }, {
        label: this.$t('审核通过'),
        value: 2
      }],
      queryParam: {
        id: '',
        userMobile: '',
        primaryAgentMobile: '',
        auditStatus: null,
        auditApplyTime: null
      },
      auditStatus: '2',
      agentList: [],
      list: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          label: this.$t('申请编号'),
          prop: 'id',
          align: 'center',
          show: true
        },
        {
          label: this.$t('手机号'),
          prop: 'userMobile',
          align: 'center',
          show: true
        },
        {
          label: this.$t('邀请人手机号'),
          prop: 'primaryAgentMobile',
          align: 'center',
          show: true
        },
        {
          label: this.$t('申请时间'),
          prop: 'auditApplyTime',
          align: 'center',
          show: true,
          minWidth: 200,
          formatter: function(row) {
            if (!row.auditApplyTime) return ''
            return self.$portal.parseTime(row.auditApplyTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        },
        {
          label: this.$t('审核状态'),
          prop: 'auditStatusStr',
          align: 'center',
          show: true
        },
        {
          label: this.$t('审核人'),
          prop: 'auditUsername',
          align: 'center',
          show: true
        },
        {
          label: this.$t('审核时间'),
          prop: 'auditTime',
          align: 'center',
          show: true,
          minWidth: 200,
          formatter: function(row) {
            if (!row.auditTime) return ''
            return self.$portal.parseTime(row.auditTime, '{y}-{m}-{d} {h}:{i}:{s}')
          }
        }
      ],
      operates: {
        fixed: 'right',
        align: 'center',
        list: [
          {
            label: this.$t('审核'),
            hidden: (index, row) => {
              return !(row.auditStatus === 0)
            },
            method: (index, row) => {
              this.showAudit([{ id: row.id, userId: row.userId }])
            },
            code: 'agentAudit'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.reset()
      await this.queryList()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async handleQuery() {
      this.page.currentPage = 1
      await this.queryList()
    },
    openDialog() {
      this.auditStatus = '2'
    },
    async queryList() {
      this.loading = true
      try {
        const queryObj = Object.assign({}, this.queryParam)
        if (queryObj.auditApplyTime && queryObj.auditApplyTime.length > 0) {
          queryObj.startAuditApplyTime = queryObj.auditApplyTime[0]
          queryObj.endAuditApplyTime = queryObj.auditApplyTime[1]
          delete queryObj.auditApplyTime
        }
        const result = await this.$agent.$api.agentApply.listPage({
          filters: queryObj,
          sorts: [{ field: 'audit_apply_time', asc: false }],
          page: this.page.currentPage,
          limit: this.page.itemsPerPage
        })
        const auditMap = {}
        this.auditStatusList.forEach(o => { auditMap[o.value] = o.label })
        if (result) {
          if (result.data) {
            result.data.forEach(o1 => { o1.auditStatusStr = auditMap[o1.auditStatus] })
          }
          this.list = result.data || []
          this.page.total = result.total || 0
        }
      } finally {
        this.loading = false
      }
    },
    batchAudit() {
      const isChecked = (this.checked && this.checked.length)
      if (!isChecked) {
        this.$message(this.$t('请勾选数据'))
        return
      }
      this.showAudit(this.checked.map(o => { return { id: o.id, userId: o.userId } }))
    },
    showAudit(agentList) {
      this.visible = true
      this.agentList = agentList
    },
    async doAudit() {
      if (!this.agentList || this.agentList.length === 0) {
        return
      }
      this.agentList.forEach(o => {
        o.type = 8
      })
      // 批量审核操作
      const result = await this.$agent.$api.agent.batchAudit({
        applyList: this.agentList,
        auditStatus: this.auditStatus
      })
      if (result && result.code === '0') {
        this.$message({ type: 'success', message: this.$t('操作成功') })
        this.visible = false
        this.agentList = []
        this.checked = []
        this.queryList()
      } else {
        this.$message({ type: 'error', message: this.$t('操作失败') })
      }
    },
    reset() {
      const date = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      this.queryParam = {
        userMobile: '',
        primaryAgentMobile: '',
        auditStatus: null,
        auditApplyTime: [date + ' 00:00:00', date + ' 23:59:59']
      }
    },
    change(val) {
      this.page.itemsPerPage = val
      this.queryList()
    },
    checkedSelectable(row, index) {
      return row.auditStatus === 0
    }
  }
}
