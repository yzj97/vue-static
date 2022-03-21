import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'MerchantCustomerManage',
  data() {
    const self = this
    return {
      loading: false,
      // 搜索框对象
      searchForm: {
        orgCode: '', // 客户编号
        orgName: '', // 客户名称
        status: '', // 客户状态
        loginUser: '', // 登录账号
        contactMobileNo: '', // 联系人手机
        merchantId: '', // 所属商家
        registerDates: [], // 注册时间范围 [registerDateBegin, registerDateEnd] 需要格式化
        registerDateBegin: '', // 注册开始时间
        registerDateEnd: '', // 注册结束时间
        orgType: null,
        currentPage: 1,
        itemsPerPage: 10
      },
      isAvailable: [],
      merchantIdList: [],
      orgTypeList: [],
      // 列表框对象
      listTable: {
        checkedList: [],
        list: [],
        total: 0,
        columns: [
          {
            show: true,
            prop: 'orgCode',
            label: this.$t('客户编号'),
            align: 'center',
            render: function(h, params) {
              return (
                <el-link v-permission='MerchantCustomerManageBtnDetail' type='primary' on-click={() => self.queryDetail(params.row)}>{ params.row.orgCode }</el-link>
              )
            }
          },
          {
            show: true,
            prop: 'orgName',
            label: this.$t('客户名称'),
            align: 'center'
          },
          {
            show: true,
            prop: 'orgTypeStr',
            label: this.$t('客户类型'),
            align: 'center'
          },
          {
            show: true,
            prop: 'departmentName',
            label: this.$t('组织架构'),
            align: 'center'
          },
          {
            show: true,
            prop: 'merchantName',
            label: this.$t('所属商家'),
            align: 'center'
          },
          {
            show: true,
            prop: 'contactName',
            label: this.$t('联系人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'contactMobileNo',
            label: this.$t('联系人手机'),
            align: 'center'
          },
          {
            show: true,
            prop: 'createTimeStr',
            label: this.$t('注册时间'),
            align: 'center'
          },
          {
            show: true,
            prop: 'status',
            label: this.$t('状态'),
            align: 'center',
            render: function(h, params) {
              const changeStatus = self.changeStatus
              return (
                <div v-permission='MerchantCustomerManageBtnStatusShow' on-click={(e) => changeStatus(e, params.row)}><el-switch value={params.row.status === 1 } active-text={ params.row.status === 1 ? '启用' : '停用' }></el-switch></div>
              )
            }
          }

        ],
        operates: {
          'width': 180,
          'fixed': 'right',
          'list': [
            {
              label: this.$t('编辑'),
              code: 'MerchantCustomerManageBtnEdit',
              show: true,
              disabled: false,
              method(index, row) {
                self.hasEdit(row)
              }
            },
            {
              label: this.$t('删除'),
              code: 'MerchantCustomerManageBtnDelete',
              show: true,
              disabled: false,
              method(index, row) {
                self.hasDelete(row)
              }
            }
          ]
        }}
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.getMerchantTypeList()
      this.initForm()
      this.isAvailable = constants.isAvailable
      this.orgTypeList = constants.orgTypeList
      try {
        await this.query()
      } catch (e) {
        console.log(e)
      }
    },
    async search() {
      this.searchForm.currentPage = 1
      await this.query()
    },
    async query() {
      // 处理请求参数
      const params = JSON.parse(JSON.stringify(this.searchForm))
      // 处理时间
      if (this.searchForm.registerDates && this.searchForm.registerDates.length) {
        params.createTimeStart = this.$portal.parseTime(this.searchForm.registerDates[0], '{y}-{m}-{d}')
        params.createTimeEnd = this.$portal.parseTime(this.searchForm.registerDates[1], '{y}-{m}-{d}')
      }
      delete params.registerDates
      console.log('查询-----params', params)

      const distributorService = this.$merchant.$api.distributorService
      try {
        this.loading = true
        const res = await distributorService.queryDistributorList(params)
        this.listTable.list = res.data.listObj
        this.listTable.total = res.data.total
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    // 初始化搜索对象
    initForm() {
      this.searchForm = {
        orgCode: '', // 客户编号
        orgName: '', // 客户名称
        status: '', // 客户状态
        loginUser: '', // 登录账号
        contactMobileNo: '', // 联系人手机
        merchantId: '', // 所属商家
        registerDates: [], // 注册时间范围 [registerDateBegin, registerDateEnd] 需要格式化
        registerDateBegin: '', // 注册开始时间
        registerDateEnd: '', // 注册结束时间
        orgType: null,
        currentPage: 1,
        itemsPerPage: 10
      }
    },
    // 获取商家列表
    getMerchantTypeList() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.queryPlatformAuthMerchantPage({ 'currentPage': 1, 'itemsPerPage': 1000 }).then(res => {
        this.merchantIdList = res.data.listObj
      })
    },
    changeStatus(e, row) {
      const vue = this
      e.preventDefault()
      var updatePara = {}
      updatePara.orgId = row.orgId
      updatePara.status = row.status === 0 ? 1 : 0
      const distributorService = this.$merchant.$api.distributorService
      distributorService.updateDistributionStatus(updatePara).then(res => {
        vue.$message({
          type: 'success',
          message: '更新状态成功！'
        })
        this.query()
      })
    },
    queryDetail(row) {
      console.log('详情----row', row)
      this.$router.push({
        name: 'MerchantCustomerManageEdit',
        params: {
          id: row.orgId,
          isEdit: 0 // 1: 能编辑，0： 不能编辑
        }
      })
    },
    hasEdit(row) {
      console.log('编辑----row', row)
      this.$router.push({
        name: 'MerchantCustomerManageEdit',
        params: {
          id: row.orgId,
          isEdit: 1 // 1: 能编辑，0： 不能编辑
        }
      })
    },
    hasDelete(row) {
      const vue = this
      util.confirm(this, '确认要删除吗？', () => {
        var detelePara = {}
        detelePara.orgId = row.orgId
        detelePara.isDeleted = 1
        const distributorService = this.$merchant.$api.distributorService
        distributorService.updateDistributionStatus(detelePara).then(res => {
          vue.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.query()
        })
      })
    },
    hasAdd() {
      this.$router.push({
        name: 'MerchantCustomerManageEdit',
        params: {
          id: -1,
          isEdit: 1 // 1: 能编辑，0： 不能编辑
        }
      })
    }
  }
}
