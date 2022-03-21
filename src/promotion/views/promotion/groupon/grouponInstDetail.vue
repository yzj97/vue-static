<template>
  <div>
    <ody-box v-load="isLoaded" :title="$t('开团管理详情')">
      <ody-title :title="$t('基本信息')" />
      <el-row>
        <el-col :span="3">{{ $t('拼团单号') }}：</el-col>
        <el-col :span="8">{{ detail.grouponInstId }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">{{ $t('拼团活动名称') }}：</el-col>
        <el-col :span="8">{{ detail.activityTitle }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">{{ $t('拼团人数') }}：</el-col>
        <el-col :span="8">{{ detail.totalMembers }}{{ $t('人') }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">{{ $t('成团状态') }}：</el-col>
        <el-col :span="8">{{ detail.grouponStatus | getGroupName(platformList) }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="3">{{ $t('开团时间') }}：</el-col>
        <el-col :span="8">{{ detail.launchTime | parseTime }}</el-col>
      </el-row>
      <el-row v-if="detail.completedTime">
        <el-col :span="3">{{ $t('成团时间') }}：</el-col>
        <el-col :span="8">{{ detail.completedTime | parseTime }}</el-col>
      </el-row>
      <div v-if="detail.grouponStatus === 2" class="btn">
        <ody-button
          name="forceToComplete"
          size="small"
          type="primary"
          code="button002"
          @click="forceToComplete"
        >{{ $t('强制成团') }}</ody-button>
      </div>

      <ody-title :title="$t('参团人信息')" />
      <ody-table
        ref="tableList"
        :columns="table.columns"
        :index="true"
        :can-filter="false"
        request-url="/back-promotion-web/patchGrouponRead/queryGrouponDetailList.action"
      >
        <template slot="orderCode" slot-scope="scope">{{ scope.row.orderCode || '---' }}</template>
        <template slot="receiveAddress" slot-scope="scope">{{ scope.row.receiveAddress || '---' }}</template>
        <template slot="joinTime" slot-scope="scope">{{ scope.row.joinTime | parseTime }}</template>
        <template v-if="Object.keys(payWays).length > 0" slot="paymentType" slot-scope="scope">{{ payWays[scope.row.paymentType ].label }}</template>
        <template slot="status" slot-scope="scope">
          <span v-if="scope.row.status === 0">{{ $t('未支付') }}</span>
          <span v-if="scope.row.status === 2">{{ $t('已取消') }}</span>
          <span v-else-if="scope.row.status === 3">{{ $t('已支付') }}</span>
        </template>
      </ody-table>
    </ody-box>
  </div>
</template>

<script>
export default {
  name: 'PromGrouponInstDetail',
  filters: {
    getGroupName(grouponStatus = this.detail.grouponStatus, platformList) {
      return platformList[grouponStatus] && platformList[grouponStatus].label || ''
    }
  },
  data() {
    return {
      payWays: {},
      statusList: {
        2: this.$t('已取消'),
        3: this.$t('已支付')
      },
      platformList: {
        '0': {
          value: '0',
          label: this.$t('开团中')
        },
        '2': {
          value: '2',
          label: this.$t('组团中')
        },
        '3': {
          value: '3',
          label: this.$t('组团成功')
        },
        '6': {
          value: '6',
          label: this.$t('组团失败')
        }
      },
      grouponInstId: '',
      detail: {
        grouponInstId: null,
        activityTitle: null,
        totalMembers: null,
        grouponStatus: null,
        launchTime: new Date() * 1
      },
      isLoaded: false,
      table: {
        columns: [
          {
            label: this.$t('订单编号'),
            slot: 'orderCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('参团用户ID'),
            prop: 'customerId',
            show: true,
            minWidth: 150
          },
          {
            label: this.$t('收货人'),
            prop: 'receiveMember',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('联系电话'),
            prop: 'cellPhone',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('支付方式'),
            slot: 'paymentType',
            show: true,
            minWidth: 120
          },
          /*          {
            label: this.$t('收货地址'),
            slot: 'receiveAddress',
            show: true,
            minWidth: 120
          },*/
          {
            label: this.$t('参团时间'),
            slot: 'joinTime',
            show: true,
            minWidth: 160
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            show: true,
            minWidth: 120
          }
        ]
      }
    }
  },
  created() {
    this.grouponInstId = +this.$route.params.grouponInstId
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.queryPayPlatformList4Coupon()
    await this.queryGrouponInstList()
    this.$nextTick(async() => {
      await this.query()
    })
    this.isLoaded = true
  },
  methods: {
    forceToComplete() {
      this.$confirm(this.$t('确定要强制成团吗') + '？')
        .then(_ => {
          this.promotionAPI
            .forceToCompleteGroupon(this.detail.grouponInstId)
            .then(res => {
              if (res.code === '0') {
                this.$message({
                  message: this.$t('强制成团成功'),
                  type: 'success'
                })
              } else {
                this.$message({
                  message: res.message,
                  type: 'error'
                })
              }
              this.queryGrouponInstList()
            })
        })
        .catch(_ => {})
    },
    queryGrouponInstList() {
      const params = {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          grouponInstId: this.grouponInstId
        }
      }
      this.promotionAPI.queryGrouponInstList(params).then(res => {
        this.detail = res.data.listObj[0]
      })
    },
    async query() {
      const params = {
        obj: this.grouponInstId
      }
      return this.$refs.tableList.getList(this.formHasValue(params))
    },
    // 获取支付方式
    async queryPayPlatformList4Coupon() {
      this.promotionAPI.queryPayPlatformList4Coupon({}).then(res => {
        var payWays = res.data.reduce((obj, item) => {
          obj[item.payType] = item
          return obj
        }, {})
        this.payWays = payWays
      })
    }
  }
}
</script>

<style lang="less" scope>
.el-row {
  margin-bottom: 20px;
}
</style>
