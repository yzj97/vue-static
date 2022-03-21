import UserModal from '@/components/userModal'
import agentImportTemplate from '@/excelfile/agentImportTemplate.xlsx'
import constants from '@/utils/constants'
import Customer from '@/views/agentList/customer'

export default {
  name: 'AgentList',
  components: {
    UserModal, Customer, agentImportTemplate
  },
  data() {
    const self = this
    return {
      exportModel: {
        exportApi: ['agent-web', 'agent', 'exportData.do'],
        pool: 'agent',
        taskType: 'agentExport',
        async: true,
        getExportData: () => {
          var vue = this
          return { filters: vue.createParams() }
        }
      },
      importModel: {
        importApi: ['agent-web', 'agent', 'importData.do', {}],
        downloadLocalFile: [require('@/excelfile/agentImportTemplate.xlsx')],
        importLabel: this.$t('分销员导入'),
        pool: 'agent',
        taskType: 'agentImport',
        async: true
      },
      currRow: null,
      disableType: 0,
      disableDialogVisible: false,
      canUpload: true,
      importVisible: false,
      levelAgentList: [],
      fileUploadForm: {
        fileName: null
      },
      customerType: 0,
      showCustomer: false,
      currUser: null,
      showModal: false,
      loading: false,
      // 搜索框对象
      searchForm: {
        code: null,
        level: null,
        userMobile: null,
        primaryAgentMobile: null,
        agentTimes: []
      },
      levelList: {},
      isAvailable: [],
      // 列表框对象
      listTable: {
        dataKey: 'id',
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'code',
            'label': self.$t('agentCode'),
            render: function(h, params) {
              return (
                <router-link to={{ name: 'AgentDetails', params: { userId: params.row.userId }}} class='link-type'>
                  <span>{ params.row.code}</span>
                </router-link>)
            }
          },
          {
            'show': true,
            'prop': 'userMobile',
            'label': self.$t('cell-phone_number')
          },
          {
            'show': true,
            'prop': 'level',
            'label': self.$t('agentLevel'),
            formatter: (row, column) => {
              if (row.levelName) {
                return row.levelName
              }
              return this.levelList[row.level]
            }
          },
          {
            'show': true,
            'prop': 'primaryAgentMobile',
            'label': self.$t('primaryAgentMobile')
          },
          {
            'show': true,
            'prop': 'userSum',
            'label': self.$t('customerName') + self.$t('count'),
            'align': 'center',
            'slot': 'userSum',
            minWidth: 88
          },
          {
            'show': true,
            'prop': 'agentSum',
            'label': self.$t('inviteAgentCount'),
            'align': 'center',
            'slot': 'agentSum',
            minWidth: 88
          },
          {
            'show': true,
            'prop': 'isEnabled',
            'label': self.$t('status'),
            'align': 'center',
            minWidth: 88,
            formatter: (row, column) => {
              return row.isEnabled === 1 ? self.$t('common_enable') : self.$t('common_disable')
            }
          },
          {
            show: true,
            prop: 'agentTime',
            label: self.$t('agentTime'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column) => {
              if (row.agentTime && row.type !== 0) {
                return self.$portal.parseTime(row.agentTime, '{y}-{m}-{d} {h}:{i}:{s}')
              }
              return ''
            }
          }
        ],
        operates: {
          fixed: 'right',
          list: [
            {
              label: self.$t('common_disable'),
              method: (index, row) => {
                self.disableDialogVisible = true
                self.disableType = 0
                self.currRow = row
              },
              hidden(index, row) {
                return row.isEnabled === 0
              },
              code: 'agentEnable'
            },
            {
              label: self.$t('common_enable'),
              method: (index, row) => {
                self.updateRow({ id: row.id, isEnabled: 1 })
              },
              hidden(index, row) {
                return row.isEnabled !== 0
              },
              code: 'agentEnable'
            }
          ]
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.initForm()
      this.isAvailable = constants.isAvailable
      this.initLevel()
      this.query()
    },
    handleClick() {
      this.updateRow({ id: this.currRow.id, isEnabled: this.disableType })
      this.disableDialogVisible = false
    },
    async initLevel() {
      const data = await this.$agent.$api.common.code_listMulti({ categorys: ['LEVEL_AGENT'] })
      this.levelAgentList = data.data.LEVEL_AGENT
    },
    initForm() {
      const date = this.$portal.parseTime(new Date(), '{y}-{m}-{d}')
      this.searchForm = {
        currentPage: 1,
        itemsPerPage: 10,
        agentTimes: [date + ' 00:00:00', date + ' 23:59:59']
      }
    },
    async searchQuery() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      try {
        this.loading = true
        const { data, total } = await this.$agent.$api.agent.queryAgentListPage({
          filters: this.createParams(),
          sorts: [{ field: 'agentTime', asc: false }],
          page: this.searchForm.currentPage,
          limit: this.searchForm.itemsPerPage })
        this.listTable.total = total
        this.loadCustomerCount(data)
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    async loadCustomerCount(list) {
      const userIds = list.map(it => it.userId)
      if (userIds.length <= 0) {
        this.listTable.list = list
        return
      }
      const result = await this.$agent.$api.agent.countCustomerAndInvite(userIds)
      list.forEach(row => {
        for (let i = 0; i < result.data.length; i++) {
          if (result.data[i].userId === row.userId) {
            row.userSum = result.data[i].customerCount + result.data[i].secondaryCustomerCount
            row.agentSum = result.data[i].totalInviteCount
            break
          }
        }
      })
      this.listTable.list = list
    },
    updateRow(row) {
      this.$agent.$api.agent.update(row).then(resp => {
        this.query()
      })
    },
    showAgent(userId) {
      this.currUser = userId
      this.showCustomer = true
      this.customerType = 1
    },
    showUser(userId) {
      this.currUser = userId
      this.showCustomer = true
      this.customerType = 0
    },
    download() {
      this.$portal.downloadFileByGet(agentImportTemplate, {}, '分销员导入模板.xlsx')
    },
    exportExcel() {
      this.$portal.downloadFileByPost('api/agent-web/agent/exportData.do', { filters: this.createParams(), sorts: [{ field: 'agentTime', asc: false }] }, '分销员.xlsx', 'ajax')
    },
    uploadSuccess(response, file, fileList) {
      if (response.code === '0') {
        this.$message({
          type: 'success',
          message: this.$t('common_import_success')
        })
      } else {
        this.$message({
          type: 'error',
          message: this.$t(`${response.message}`)
        })
      }
      this.$refs.upload.clearFiles()
      this.query()
    },
    userSelectModal() { // 打开选择用户弹出框
      this.showModal = true
    },
    selectUser(value) {
      this.addAgent(value)
    },
    addAgent(obj) {
      const vue = this
      const newAgents = obj.map(it => {
        return { userId: it.userId, userMobile: it.mobile, isEnabled: 0, type: 8, totalInviteCount: 0 }
      })
      vue.$agent.$api.agent.addAll(newAgents).then((res) => {
        if (res.code === '0') {
          vue.$message({
            type: 'success',
            message: this.$t('common_deal_success')
          })
          vue.query()
        }
      })
    },
    createParams() {
      const params = JSON.parse(JSON.stringify(this.searchForm))
      params.type = 8
      params.level = params.level
      if (this.searchForm.agentTimes && this.searchForm.agentTimes.length) {
        [params.startAgentTime, params.endAgentTime] = this.searchForm.agentTimes
        delete params.agentTimes
      }
      delete params.currentPage
      delete params.itemsPerPage
      return params
    },
    async batchImport() {
      this.importVisible = true
    },
    handleRemove(file, fileList) {
      this.fileUploadForm.fileName = ''
    },
    handlePreview(file, fileList) {
      this.fileList = [fileList[fileList.length - 1]]
      this.fileUploadForm.fileName = file.name
    },
    handleClose() {
      this.canUpload = true
      this.fileUploadForm.fileName = ''
      this.fileList = []
      this.importVisible = false
    },
    async submitForm(fileUploadForm) {
      this.$refs[fileUploadForm].validate(valid => {
        if (valid) {
          const file = document.getElementsByName('file')[0].files[0]
          var formData = new FormData()
          formData.append('file', file)
          this.canUpload = false
          const importRequest = this.$agent.$api.agent
          importRequest.importData(formData).then(result => {
            if (result && result.code === '0') {
              this.canUpload = true
              this.fileUploadForm.fileName = ''
              this.fileList = []
              this.importVisible = false
              this.query()
              this.$message({
                type: 'success',
                message: this.$t('common_import_success')
              })
            } else {
              this.canUpload = true
              this.$message({
                type: 'error',
                message: result.message
              })
            }
          }).catch(() => {
            this.canUpload = true
          })
        }
      })
    }
  }
}
