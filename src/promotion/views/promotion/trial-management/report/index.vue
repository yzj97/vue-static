<template>
  <div class="pg-tral-management-report">
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
          <el-tab-pane :label="$t('待提交')" name="0" />
          <el-tab-pane :label="$t('待发布')" name="3" />
          <el-tab-pane :label="$t('已发布')" name="4" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="applyActivityList"
          :columns="table.columns"
          :operates="table.operates"
          name="applyActivityList952"
        >
          <template slot="mobile" slot-scope="scope">{{ scope.row.socialUUserVo.mobile }}</template>
          <template slot="variables" slot-scope="scope">{{ getVariables(scope.row.variables) }}</template>
          <template
            slot="channelCode"
            slot-scope="scope"
          >{{ scope.row.channelCode | getChannelName(channelMap) }}</template>
          <template
            slot="status"
            slot-scope="scope"
          >{{ scope.row.status | keyVal(getRegistrationType) }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
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
  name: 'PromTrialReportList',
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
      queryContent: {
        applyActivityType: undefined,
        queryStatus: undefined,
        totalItems: undefined,
        statusTab: '-1',
        promType: 16,
        obj: {
          pageNo: 1,
          pageSize: 10,
          statusList: [],
          activityTitle: undefined,
          activityId: undefined,
          mobile: undefined,
          mpName: undefined,
          mpCode: undefined,
          channelCode: undefined,
          refType: undefined
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
            show: true,
            minWidth: 200
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
            show: true
          },
          {
            label: this.$t('申请时间'),
            prop: 'createTime',
            align: 'center',
            minWidth: 200,
            show: true,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          },
          {
            label: this.$t('申请人手机号'),
            slot: 'mobile',
            align: 'center',
            show: true
          },
          {
            label: this.$t('试用报告'),
            slot: 'variables',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            show: true,
            slot: 'status',
            label: this.$t('试用报告状态'),
            align: 'center'
          }
        ],
        operates: {
          width: 250,
          fixed: 'right',
          list: [
            {
              label: this.$t('提醒报告'),
              hidden: (index, e) => {
                const show = e.status === 0 || e.status === 1 || e.status === 2
                return !show
              },
              method: async(index, reportInfo) => {
                const msgTitle = this.$t('报告提醒')
                const { value: msgContent, action } = await this.$prompt(
                  '',
                  msgTitle,
                  {
                    inputValue:
                      this.$t('您的试用报告还未提交') +
                      this.$t('请尽快提交哦') +
                      '~~',
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消')
                  }
                )

                if (action !== 'confirm') {
                  return
                }

                await this.promotionAPI.sendMessageTrial({
                  recevier: [reportInfo.userId],
                  msgTitle,
                  msgContent
                })
                await this.query()
                this.$message.success('报告提醒成功')
              },
              code: 'button002'
            },
            {
              label: this.$t('查看报告'),
              hidden: function(index, e) {
                const show = e.status === 4 || e.status === 3
                return !show
              },
              method: (index, row) => {
                this.$router.push({
                  name: 'PromTrialReportDetail',
                  params: {
                    id: row.id
                  }
                })
              },
              code: 'button003'
            },
            {
              label: this.$t('审核未通过'),
              hidden: function(index, e) {
                const show = e.status === 3
                return !show
              },
              method: async(index, reportInfo) => {
                const msgTitle = this.$t('审核未通过')
                const { value: msgContent, action } = await this.$prompt(
                  '',
                  msgTitle,
                  {
                    inputValue: this.$t(
                      '请补充描述试用体验细节后再次提交试用报告，感谢您的配合'
                    ),
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消')
                  }
                )

                if (action !== 'confirm') {
                  return
                }
                await await this.updateReport(reportInfo, 2)
                await this.promotionAPI.sendMessageTrial({
                  recevier: [reportInfo.userId],
                  msgTitle,
                  msgContent
                })

                await this.query()
                this.$message.success('审核未通过提交成功')
              },
              code: 'button004'
            },
            {
              label: this.$t('取消发布'),
              hidden: function(index, e) {
                const show = e.status === 4
                return !show
              },
              method: async(index, row) => {
                const res = await this.$confirm(
                  '确定要取消发布该试用报告？',
                  '取消发布',
                  {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                  }
                )
                if (!res) {
                  return false
                }
                await this.updateReport(row, 3)
                await this.query()
                this.$message.success(this.$t('取消发布提交成功'))
              },
              code: 'button005'
            },
            {
              label: this.$t('发布'),
              hidden: function(index, e) {
                const show = e.status === 3
                return !show
              },
              method: async(index, row) => {
                // this.updateApplyActivity(row)
                const res = await this.$confirm(
                  '确定要发布该试用报告？',
                  '发布',
                  {
                    confirmButtonText: this.$t('确定'),
                    cancelButtonText: this.$t('取消'),
                    type: 'warning'
                  }
                )
                if (!res) {
                  return false
                }
                await this.updateReport(row, 4)
                await this.query()
                this.$message.success('发布提交成功')
              },
              code: 'button006'
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
      return constants.trialReportList.reduce((rtv, item) => {
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
    async updateReport(reportInfo, status) {
      await this.promotionAPI.trialReportUpdateStatus({
        id: reportInfo.id,
        status // 发布
      })
    },
    async showNoPassModal(reportInfo) {
      const msgTitle = this.$t('审核未通过')
      return this.$prompt('', msgTitle, {
        inputValue: this.$t(
          '请补充描述试用体验细节后再次提交试用报告，感谢您的配合'
        ),
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消')
      }).then(({ value: msgContent }) => {
        return this.promotionAPI.trialReportUpdateStatus({
          id: reportInfo.id,
          status: 2, // 审核未通过
          recevier: [reportInfo.userId],
          msgTitle,
          msgContent
        })
      })
    },
    getVariables(variables) {
      try {
        const obj = JSON.parse(decodeURIComponent(variables))
        return obj.experience && obj.experience.value
      } catch (ex) {
        return ''
      }
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
      this.queryContent.obj = {
        refType: undefined,
        channelCode: undefined
      }
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')
      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      const params = this.queryContent.obj
      if (+this.queryContent.statusTab === -1) {
        this.queryContent.obj.statusList = null
      }
      if (+this.queryContent.statusTab === 0) {
        this.queryContent.obj.statusList = [0, 1, 2]
      }
      if (+this.queryContent.statusTab === 3) {
        this.queryContent.obj.statusList = [3]
      }
      if (+this.queryContent.statusTab === 4) {
        this.queryContent.obj.statusList = [4]
      }
      const {
        data: { listObj = [], total = 0 } = {}
      } = await this.promotionAPI.queryReport(params)
      this.applyActivityList = listObj
      this.queryContent.totalItems = total
    },
    handleFilterGroupon() {
      this.queryContent.obj.pageNo = 1
      this.query()
    }
  }
}
</script>
<style lang="scss" scoped>
.pg-tral-management-report {
  .activity-id-link {
    color: #409eff;
  }
}
</style>
