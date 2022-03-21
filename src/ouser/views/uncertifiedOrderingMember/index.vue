<template>
  <div>
    <section>
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form" label-width="100px" class="form">
            <ody-search-item :label="$t('手机号')" prop="phone" maxlength="11">
              <el-input v-model="searchForm.phone"/>
            </ody-search-item>
            <ody-search-item :label="$t('会员昵称')" prop="userName">
              <el-input v-model="searchForm.userName" maxlength="15"/>
            </ody-search-item>
            <ody-search-item :label="$t('是否认证')" prop="isCert">
              <el-select v-model="searchForm.isCert">
                <el-option :label="$t('是')" :value="2"/>
                <el-option :label="$t('否')" :value="1"/>
              </el-select>
            </ody-search-item>
            <ody-search-item :label="$t('下单时间')" prop="orderTime">
              <el-date-picker
                v-model="searchForm.orderTime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"/>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button size="small" @click="initForm">{{ $t('重置') }}</el-button>
          <el-button size="small" type="primary" @click="queryList">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="listTable.list"
            :columns="listTable.columns"
            :operates="listTable.operates"
            :data-key="listTable.dataKey"
            :multiple="true"
            name="listTable_list293"/>
        </div>
        <div slot="page">
          <ody-pagination
            :current-page.sync="page.currentPage"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.itemsPerPage"
            :total.sync="listTable.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="queryList"
            @current-change="queryList"/>
        </div>
      </ody-list-table-area>
    </section>
    <ody-dialog-full-right
      :visible.sync="dialogVisible"
      title="VIP卡认证">
      <section>
        <ody-box>
          <div class="box">
            <el-form ref="form" label-width="100px" class="form">
              <el-form-item :label="$t('VIP卡号：')" prop="vipNo">
                <el-input v-model="vipCardSearchForm.vipNo" :placeholder="$t('请输入VIP卡号')" maxlength="30"/>
              </el-form-item>
            </el-form>
            <ody-button size="small" type="primary" code="ui" style="margin:0 auto" @click="queryVipList">{{ $t('查询') }}</ody-button>
          </div>
        </ody-box>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :data="vipListTable.list"
              :columns="vipListTable.columns"
              :operates="vipListTable.operates"
            />
          </div>
          <div slot="page">
            <ody-pagination
              :current-page.sync="vipCardPage.page"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="vipCardPage.limit"
              :total.sync="vipListTable.total"
              background
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="queryVipList()"
              @current-change="queryVipList()"/>
          </div>
        </ody-list-table-area>
      </section>
      <div slot="footer">
        <ody-button code="ui" @click="handleCloseDialog">关闭</ody-button>
      </div>
      <el-dialog :visible.sync="tipsVisible" :append-to-body="true" title="提示" width="400px">
        <div>你所选择的是</div>
        <div>VIP卡号：{{ bindVipNo }}</div>
        <div>VIP客户名称：{{ bindVipName }}</div>
        <div slot="footer">
          <ody-button code="ui" size="mini" @click="tipsVisible = false">取消</ody-button>
          <ody-button code="ui" size="mini" type="primary" @click="bindDeter">确定</ody-button>
        </div>
      </el-dialog>
    </ody-dialog-full-right>

  </div>
</template>
<script>

export default {
  name: 'UncertifiedOrderingMember',
  data() {
    return {
      obj: {
        value: '1'
      },
      rules: [],
      searchForm: {
        phone: '',
        userName: '',
        isCert: '',
        orderTime: []
      },
      page: {
        currentPage: 1,
        itemsPerPage: 10
      },
      vipCardSearchForm: {
        vipNo: '',
        isAvailable: 1,
        isCertified: 0
      },
      vipCardPage: {
        page: 1,
        limit: 10
      },
      dialogVisible: false,
      bindUserId: '',
      bindVipName: '',
      bindVipNo: '',
      tipsVisible: false,
      // 列表框对象
      listTable: {
        dataKey: 'userId',
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'userName',
            'label': '会员昵称',
            'align': 'center',
            'minWidth': 180
          },
          {
            'show': true,
            'prop': 'phone',
            'label': '手机号',
            'align': 'center',
            'minWidth': 120
          },
          {
            'show': true,
            'prop': 'memberTypeName',
            'label': '会员类型',
            'align': 'center',
            'minWidth': 120
          },
          {
            'show': true,
            'prop': 'isCert',
            'label': '是否认证',
            'align': 'center',
            'minWidth': 120,
            render: (h, params) => {
              if (+params.row.isCert === 1) {
                return (
                  <span>否</span>
                )
              } else {
                return (
                  <span>是</span>
                )
              }
            }
          },
          {
            'show': true,
            'prop': 'memberStatus',
            'label': '会员状态',
            'align': 'center',
            'minWidth': 120,
            render: (h, params) => {
              if (params.row.memberStatus === 1) {
                return (
                  <span>启用</span>
                )
              } else {
                return (
                  <span>停用</span>
                )
              }
            }
          },
          {
            'show': true,
            'prop': 'positionName',
            'label': '下单时间',
            'align': 'center',
            'minWidth': 180,
            render: (h, params) => {
              if (params.row.orderCreateTime) {
                return (
                  <span>{ this.$portal.parseTime(params.row.orderCreateTime || '') }</span>
                )
              } else {
                return (
                  <span>--</span>
                )
              }
            }
          }
        ],
        operates: {
          'width': 120,
          'fixed': 'right',
          'list': [
            {
              'label': 'VIP卡认证',
              'disabled': false,
              method: (index, row) => {
                this.authenticationClick(row)
              },
              code: 'ui',
              hidden(h, row) {
                return row.isCert === 2 || row.memberStatus === 0
              }
            }
          ]
        }
      },
      // 谈款的列表对象
      vipListTable: {
        list: [],
        total: 0,
        columns: [
          {
            'show': true,
            'prop': 'vipNo',
            'label': this.$t('VIP卡号'),
            'align': 'center'
          },
          {
            'show': true,
            'prop': 'vipName',
            'label': this.$t('VIP客户名称'),
            'align': 'center'
          }
        ],
        operates: {
          'width': 100,
          'fixed': 'right',
          'list': [
            {
              'label': this.$t('选择'),
              show: true,
              'disabled': false,
              method: (index, row) => {
                this.selectBindVip(row)
              },
              code: 'ui'
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
    init() {
      this.queryList()
    },
    async queryList() {
      const [startTime, endTime] = this.searchForm.orderTime
      const params = {
        phone: this.searchForm.phone,
        userName: this.searchForm.userName,
        isCert: this.searchForm.isCert,
        startTime,
        endTime,
        ...this.page
      }
      const { code, data: { listObj, total }} = await this.$ouser.$api.userVip.getNoAuthenticationUser(params)
      if (+code === 0) {
        this.listTable.list = listObj || []
        this.listTable.total = total || 0
      } else {
        this.listTable.list = []
        this.listTable.total = 0
      }
    },
    initForm() {
      this.searchForm = Object.assign({}, {
        phone: '',
        userName: '',
        orderTime: []
      })
    },
    handleCloseDialog() {
      this.dialogVisible = false
    },
    async queryVipList() {
      const userVip = this.$ouser.$api.userVip
      const params = {
        filters: this.vipCardSearchForm,
        ...this.vipCardPage
      }
      this.loading = true
      const res = await userVip.listPage(params)
      this.vipListTable.list = res.data
      this.vipListTable.total = res.total
    },
    async authenticationClick(row) {
      this.bindUserId = row.userId
      const { data } = await this.$ouser.$api.userVip.getUserBaseInfoById({ id: this.bindUserId })
      if (+data.isAvailable === 1) {
        this.dialogVisible = true
        this.queryVipList()
      } else {
        this.$message.error('此会员是非启用状态，请刷新列表重试')
        this.queryList()
      }
    },
    async selectBindVip(row) {
      const { vipNo, vipName } = row
      this.bindVipNo = vipNo
      this.bindVipName = vipName
      this.tipsVisible = true
    },
    async bindDeter() {
      const params = {
        account: this.bindVipNo,
        userId: this.bindUserId,
        userName: this.bindVipName
      }
      const { code } = await this.$ouser.$api.userVip.employeeCertification(params)
      if (+code === 0) {
        this.tipsVisible = false
        this.dialogVisible = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.queryList()
      }
    }
  }
}
</script>
<style scoped>
.dialog-footer{
  padding-left: 200px;
}
.box{
  width: 400px;
  display: flex;
  height: 32px;
}
</style>
