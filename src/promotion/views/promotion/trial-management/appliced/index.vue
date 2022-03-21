<template>
  <div class="pg-tral-management-appliced">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('活动名称:')" prop="obj.activityTitle">
            <el-input
              :placeholder="$t('请输入活动名称')"
              v-model="queryContent.obj.activityTitle"
              name="queryContent_obj_activityTitle"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动ID:')" prop="obj.activityId">
            <ody-input-number
              :placeholder="$t('请输入活动ID')"
              v-model="queryContent.obj.activityId"
              :max="9999999999999999"
              :empty-tip="false"
              name="queryContent_obj_activityId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('申请人手机号:')" prop="obj.mobile">
            <el-input
              :placeholder="$t('请输入申请人手机号')"
              v-model="queryContent.obj.mobile"
              name="queryContent_obj_mobile"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('试用商品名称:')" prop="obj.mpName">
            <el-input
              :placeholder="$t('请输入试用商品名称')"
              v-model="queryContent.obj.mpName"
              name="queryContent_obj_mpName"
            />
          </ody-search-item>
          <ody-search-item :label="$t('试用商品编码:')" prop="obj.mpCode">
            <el-input
              :placeholder="$t('请输入试用商品编码')"
              v-model="queryContent.obj.mpCode"
              name="queryContent_obj_mpCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('来源渠道:')" prop="obj.channelCode">
            <promotion-channel-code-select
              v-model="queryContent.obj.channelCode"
              :prom-type="queryContent.promType"
              :placeholder="$t('全部')"
              name="queryContent_obj_channelCode"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="button001"
          size="small"
          type="primary"
          code="button001"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs
          v-model="queryContent.statusTab"
          name="queryContent_statusTab"
          @tab-click="handleFilterGroupon"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('待审核')" name="0" />
          <el-tab-pane :label="$t('审核通过（创建订单成功）')" name="1" />
          <el-tab-pane :label="$t('审核通过（创建订单失败）')" name="3" />
          <el-tab-pane :label="$t('审核不通过')" name="2" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="applyActivityList"
          :columns="table.columns"
          :operates="table.operates"
          name="applyActivityList210"
        >
          <template
            slot="channelCode"
            slot-scope="scope"
          >{{ scope.row.channelCode | getChannelName(channelMap) }}</template>
          <template
            slot="status"
            slot-scope="scope"
          >{{ scope.row.status | keyVal(activityStatusName) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template slot="address" slot-scope="scope">
            <!-- {{ scope.row.createTime | parseTime }} -->
            <div>{{ $t('姓名') }}：{{ scope.row.userName }}</div>
            <div>{{ $t('手机') }}：{{ scope.row.mobile }}</div>
            <div>
              {{ $t('收货地址') }}：
              {{ scope.row.provinceName }},
              {{ scope.row.cityName }},
              {{ scope.row.regionName }},
              {{ scope.row.detailAddress }}
            </div>
          </template>
          <template slot="activityId" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.activityId }}</a>
            <a
              v-if="!$portal.hasPermission('button003')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.activityId }}</a>
          </template>
          <template slot="userType" slot-scope="scope">{{ scope.row.socialUUserVo.userType }}</template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="queryContent.obj.pageNo"
          :list="applyActivityList"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="queryContent.obj.pageSize"
          :total.sync="queryContent.totalItems"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import constants from '@/utils/constants'
import PromotionRefTypeSelect from '@/components/promotion-ref-type-select'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
export default {
  name: 'PromTrialApplicedList',
  components: {
    PromotionRefTypeSelect,
    PromotionChannelCodeSelect
  },
  filters: {
    getChannelName(channelCode, channelMap) {
      if (channelCode) {
        return channelMap[channelCode].channelName
      }
      return ''
    }
  },
  data() {
    return {
      channelMap: null,
      activityStatusName: {
        '0': this.$t('待审核'),
        '1': this.$t('审核通过'),
        '2': this.$t('审核不通过')
      },
      queryContent: {
        applyActivityType: undefined,
        queryStatus: undefined,
        totalItems: undefined,
        statusTab: '-1',
        promType: 16,
        obj: {
          pageNo: 1,
          pageSize: 10,
          status: '',
          orderStatus: null,
          activityTitle: undefined,
          activityId: undefined,
          mobile: undefined,
          mpName: undefined,
          mpCode: undefined,
          channelCode: undefined
        }
      },
      applyActivityList: [],
      table: {
        columns: [
          {
            label: this.$t('活动ID'),
            slot: 'activityId',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('活动名称'),
            prop: 'activityTitle',
            align: 'center',
            show: true
          },
          {
            label: this.$t('活动渠道'),
            slot: 'channelCode',
            align: 'center',
            show: true
          },
          {
            label: this.$t('试用商品名称'),
            prop: 'mpName',
            align: 'center',
            show: true
          },
          {
            label: this.$t('试用商品编码'),
            prop: 'mpCode',
            align: 'center',
            show: true,
            minWidth: 115
          },
          {
            label: this.$t('试用限量'),
            prop: 'totalLimit',
            align: 'center',
            show: true,
            minWidth: 115
          },
          /* {
            label: this.$t('申请数量'),
            slot: 'userType',
            align: 'center',
            show: true,
            minWidth: 115
          },*/
          {
            label: this.$t('申请人手机号'),
            prop: 'mobile1',
            align: 'center',
            show: true,
            render: (h, params) => {
              return (<div>
                {params.row.socialUUserVo.mobile || ''}
              </div>)
            }
          },
          {
            label: this.$t('申请时间'),
            prop: 'createTime',
            align: 'center',
            minWidth: 200,
            show: true,
            formatter: (row, column) => {
              if (row.createTime) {
                const time = this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
                return this.$portal.parseTime(time)
              }
            }
          },
          {
            show: true,
            slot: 'status',
            label: this.$t('申请状态'),
            align: 'center',
            minWidth: 200
          },
          {
            label: this.$t('收货人信息'),
            slot: 'address',
            align: 'center',
            minWidth: 200,
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('重新创建订单'),
              hidden: function(index, row) {
                const show = row.orderStatus === 0 && row.status === 1
                return !show
              },
              method: (index, row) => {
                this.createOrder(row.id)
              },
              code: 'button002'
            },
            {
              label: this.$t('审核'),
              hidden: function(index, row) {
                const show = row.status === 0
                return !show
              },
              method: (index, row) => {
                this.openVerifyPop(row)
              },
              code: 'button004'
            }
          ]
        }
      }
    }
  },
  computed: {
    getRefTypeMap() {
      return constants.applyActivityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getRegistrationType() {
      return constants.registrationTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    this.getChannelMap()
    await this.query()
  },
  methods: {
    seeNewTab(e) {
      const params = {
        promotionId: e.activityId,
        status: e.status
      }
      this.$router.push({
        name: 'PromTrialActivityListDetail',
        params: params
      })
    },
    async createOrder(id) {
      this.$confirm('确定重新创建订单吗?', this.$t('提示'), {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        type: 'warning'
      }).then(() => {
        this.promotionAPI.createOrderAgain({ id }).then(async res => {
          if (+res.code === 0) {
            this.$message({
              message: res.message,
              type: 'success'
            })
            await this.query()
          }
        })
      })
    },
    handleSizeChange(val) {
      this.queryContent.obj.pageSize = val
      this.query()
    },
    handleCurrentChange(val) {
      this.queryContent.obj.pageNo = val
      this.query()
    },
    // 编辑按钮显示
    updateBtnShow(startTime) {
      return startTime > new Date()
    },
    /**
     * 加载渠道名称
     */
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})

      this.channelMap = data
    },
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj.channelCode = ''
    },
    async handleSubmit() {
      if (this.queryContent.obj.mobile) {
        if (!/^1[3456789]\d{9}$/.test(this.queryContent.obj.mobile)) {
          this.$message({
            type: 'error',
            message: this.$t('请输入正确手机号')
          })
          this.queryContent.obj.mobile = ''
          return
        }
      }
      const [validError] = await this.formValidate('queryContent')
      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      const params = this.queryContent.obj
      if (+this.queryContent.statusTab === -1) {
        this.queryContent.obj.status = -1
        this.queryContent.obj.orderStatus = null
      }
      if (+this.queryContent.statusTab === 0) {
        this.queryContent.obj.status = 0
        this.queryContent.obj.orderStatus = null
      }
      if (+this.queryContent.statusTab === 1) {
        this.queryContent.obj.status = 1
        this.queryContent.obj.orderStatus = 1
      }
      if (+this.queryContent.statusTab === 3) {
        this.queryContent.obj.status = 1
        this.queryContent.obj.orderStatus = 0
      }
      if (+this.queryContent.statusTab === 2) {
        this.queryContent.obj.status = 2
        this.queryContent.obj.orderStatus = ''
      }
      if (params.status === -1) {
        delete params.status
      }
      const {
        data: { listObj = [], total = 0 } = {}
      } = await this.promotionAPI.queryAppliced(params)
      this.applyActivityList = listObj
      this.queryContent.totalItems = total
    },
    handleFilterGroupon() {
      this.queryContent.obj.pageNo = 1
      this.query()
    },
    openVerifyPop(e) {
      this.$confirm('审核通过后系统自动创建一张发货单，给该用户发货。审核操作不可逆，请慎重操作。', '审核', {
        distinguishCancelAndClose: true,
        closeOnClickModal: false,
        confirmButtonText: '通过',
        cancelButtonText: '不通过',
        type: 'warning'
      }).then(() => {
        this.promotionAPI.verifyAppliced({
          id: e.id,
          status: 1,
          activityId: e.activityId,
          activityTitle: e.activityTitle,
          channelCode: e.channelCode,
          regionCode: e.regionCode,
          mpId: e.mpId,
          userId: e.userId
        }).then(async res => {
          if (+res.code === 0) {
            await this.query()
          }
        })
      }).catch(action => {
        if (action === 'cancel') {
          this.promotionAPI
            .verifyAppliced({
              id: e.id,
              status: 2
            })
            .then(res => {
              if (+res.code === 0) {
                this.$message({
                  message: this.$t('操作成功'),
                  type: 'success'
                })
                this.query()
              }
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pg-tral-management-appliced {
  .activity-id-link {
    color: #409eff;
  }
}
</style>
