<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('活动ID:')" prop="obj.activityId">
            <ody-input-number
              :placeholder="$t('请输入活动ID')"
              :max="9999999999999999"
              :empty-tip="false"
              v-model="queryContent.obj.activityId"
              name="queryContent_obj_activityId"
              maxlength="16"
              style="width:100%"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动名称:')" prop="obj.title">
            <el-input
              :placeholder="$t('请输入活动名称')"
              v-model="queryContent.obj.title"
              name="queryContent_obj_title"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动类型:')" prop="obj.promType">
            <promotion-type-select
              v-model="queryContent.obj.promType"
              :placeholder="$t('全部')"
              name="queryContent_obj_promType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('创建人:')" prop="obj.createUsername">
            <el-input
              :placeholder="$t('请输入创建人')"
              v-model="queryContent.obj.createUsername"
              name="queryContent_obj_createUsername"
            />
          </ody-search-item>
          <ody-search-item :label="$t('参与方式:')" prop="obj.activityType">
            <promotion-activity-type-select
              v-model="queryContent.obj.activityType"
              :placeholder="$t('全部')"
              name="queryContent_obj_activityType"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动渠道:')" prop="obj.channelCode">
            <promotion-all-channel-code-select
              v-model="queryContent.obj.channelCode"
              :prom-type="queryContent.obj.promType"
              :placeholder="$t('全部')"
              name="queryContent_obj_channelCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动商家:')" prop="obj.merchantId">
            <ody-merchant-select
              v-model="queryContent.obj.merchantId"
              :placeholder="$t('全部')"
              name="queryContent_obj_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动店铺:')" prop="obj.storeId">
            <ody-store-select
              v-model="queryContent.obj.storeId"
              :placeholder="$t('全部')"
              name="queryContent_obj_storeId"
              value-key="storeId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动时间:')" :space="2" prop="obj.activityTime">
            <ody-date-range-picker
              v-model="queryContent.obj.activityTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_obj_activityTime"
              type="date"
              range-separator="-"
            />
          </ody-search-item>

          <ody-search-item :label="$t('创建时间:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="queryContent.obj.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_obj_createTime"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="PromPromotionAuditListList01"
          size="small"
          type="primary"
          code="PromPromotionAuditListList01"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="tabs">
        <el-tabs
          v-model="queryContent.obj.status"
          name="queryContent_obj_status"
          @tab-click="handleFilterGroupon"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('待提交')" name="0" />
          <el-tab-pane :label="$t('待审核')" name="1" />
          <el-tab-pane :label="$t('审核未通过')" name="3" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="queryPromotionList"
          :columns="table.columns"
          :operates="table.operates"
          name="queryPromotionList465"
          request-url="/back-promotion-web/promotionRead/queryPromotionList.do"
        >
          <template
            slot="promType"
            slot-scope="scope"
          >{{ scope.row.promType | keyVal(getPromTypeMap) }}</template>
          <template
            slot="activityType"
            slot-scope="scope"
          >{{ scope.row.activityType | keyVal(getActivityTypeMap) }}</template>
          <template slot="activityTime" slot-scope="scope">{{ scope.row.activityTime | parseTime }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template slot="status" slot-scope="scope">{{ scope.row.status | keyVal(getStatusType) }}</template>
          <template slot="activityId" slot-scope="scope">
            <a
              v-if="$portal.hasPermission('PromPromotionAuditListList02')"
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.activityId }}</a>
            <a
              v-if="!$portal.hasPermission('PromPromotionAuditListList02')"
              name="seeNewTab"
              class="activity-id-link"
            >{{ scope.row.activityId }}</a>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import util from '@/utils/util'
import constants from '@/utils/constants'
import PromotionActivityTypeSelect from '@/components/promotion-activity-type-select'
import PromotionTypeSelect from '@/components/promotion-type-select'
import PromotionAllChannelCodeSelect from '@/components/promotion-all-channel-code-select'
import { listDetail } from '@/utils/listType'
export default {
  name: 'PromPromotionAuditListList',
  components: {
    PromotionActivityTypeSelect,
    PromotionTypeSelect,
    PromotionAllChannelCodeSelect
  },
  data() {
    return {
      promTypeArr: [],
      channelMap: null,
      channelCodeArr: [],
      queryContent: {
        obj: {
          activityId: undefined,
          title: undefined,
          promType: undefined,
          startTime: undefined,
          endTime: undefined,
          createUsername: undefined,
          createStart: undefined,
          createEnd: undefined,
          activityType: undefined,
          channelCode: undefined,
          merchantId: undefined,
          storeId: undefined,
          status: '-1',
          promTypeList: [],
          activityTime: [],
          createTime: []
        }
      },
      queryPromotionList: [],
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
            prop: 'title',
            align: 'center',
            show: true
          },
          {
            show: true,
            prop: 'channelCodes',
            label: this.$t('活动渠道'),
            align: 'center',
            formatter: (row, column, cellValue) => {
              return `<span>${this.getChannelName(row.channelCodes)}</span>`
            }
          },
          {
            label: this.$t('活动时间'),
            prop: 'activityTime',
            show: true,
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              if (row.startTime && row.endTime) {
                return `<span>${this.$portal.parseTime(
                  row.startTime,
                  '{y}-{m}-{d} {h}:{i}'
                )}-</span>
               <span>${this.$portal.parseTime(
    row.endTime,
    '{y}-{m}-{d} {h}:{i}'
  )}</span>`
              }
            }
          },
          {
            show: true,
            slot: 'promType',
            label: this.$t('活动类型'),
            align: 'center'
          },
          {
            label: this.$t('参与方式'),
            slot: 'activityType',
            show: true,
            align: 'center'
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            align: 'center',
            show: true
          },
          {
            label: this.$t('创建人'),
            prop: 'createUsername',
            align: 'center',
            show: true
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTime',
            align: 'center',
            show: true,
            minWidth: 200,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          }
        ],
        operates: {
          width: 160,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              method: (index, row) => {
                this.seeNewTab(row)
              },
              code: 'PromPromotionAuditListList02'
            },
            {
              label: this.$t('提交审核'),
              hidden: (index, row) => {
                return !(
                  (row.status === 0 || row.status === 3) &&
                  row.hasWriteRoll
                )
              },
              method: (index, row) => {
                this.submitVerifyActivity(row)
              },
              code: 'PromPromotionAuditListList03'
            },
            {
              label: this.$t('审核'),
              hidden: (index, row) => {
                return !(row.status === 1 && row.hasWriteRoll)
              },
              method: (index, row) => {
                this.openVerifyPop(row)
              },
              code: 'PromPromotionAuditListList04'
            }
          ]
        }
      }
    }
  },
  computed: {
    getPromTypeMap() {
      return constants.allPromotionTypes.reduce((rtv, item) => {
        rtv[item.id] = this.$t(item.text)
        return rtv
      }, {})
    },
    getActivityTypeMap() {
      return constants.activityTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getStatusType() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    this.getChannelMap()
    await this.loadOscConfig()
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj = {
        activityId: undefined,
        title: undefined,
        promType: undefined,
        createUsername: undefined,
        activityType: undefined,
        channelCode: undefined,
        merchantId: undefined,
        storeId: undefined,
        status: '-1',
        activityTime: [],
        createTime: []
      }
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')

      if (validError) {
        return
      }
      await this.query()
    },
    async loadOscConfig() {
      await this.promotionAPI.loadOscConfigUrl('promTypeList').then(res => {
        if (res.code === '0' && res.data && res.data.result) {
          const promObj = []
          this.promTypeArr = res.data.result
          this.promTypeArr.map(item => {
            return promObj.push(item.id)
          })
          this.queryContent.obj.promTypeList = promObj
        }
      })
    },
    async query() {
      const {
        activityTime: [activityTimeStart, activityTimeEnd],
        createTime: [createTimeStart, createTimeEnd],
        ...params
      } = JSON.parse(JSON.stringify(this.queryContent.obj))
      params.startTime = activityTimeStart
      params.endTime = activityTimeEnd
      params.createStart = createTimeStart
      params.createEnd = createTimeEnd

      if (params.status === '-1') {
        delete params.status
      }

      const param = {
        obj: this.formHasValue(params)
      }

      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(param))
    },
    async queryPromotionActivityDetail() {
      if (this.promType === 3001) {
        const { data, code } = await this.promotionAPI.queryCutPriceDetail(
          this.queryContent.activityId
        )
        if (+code === 0) {
          this.detailData = data || {}
        }
      } else {
        this.query()
        // const { data, code } = await this.promotionAPI.getPromotionDetailUrl({ id: this.queryContent.activityId })
        // if (+code === 0) {
        //   this.detailData = data || {}
        // }
      }
    },
    handleFilterGroupon() {
      this.queryContent.currentPage = 1
      this.query()
    },
    /**
     * 加载渠道名称
     */
    getChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        if (response.code === '0') {
          this.channelMap = response.data
        }
      })
    },
    /**
     * 获取渠道名称
     * @param channelCodes
     */
    getChannelName(channelCodes) {
      if (util.isEmpty(channelCodes)) {
        return ''
      } else {
        return channelCodes
          .filter(x => this.channelMap[x])
          .map(item => {
            return this.channelMap[item].channelName
          })
          .join('、')
      }
    },
    // 查看
    seeNewTab(e) {
      const params = {
        promotionId: e.activityId,
        status: e.status,
        promotionType: e.promType
      }
      this.$router.push({
        name: listDetail[e.promType],
        params: params
      })
    },
    // 提交审核
    async submitVerifyActivity(e) {
      const confirm = await this.$confirm(this.$t('确认提交审核') + '？', this.$t('提交审核'))
      if (!confirm) {
        return
      }
      if (e.promType < 100) {
        const { code } = await this.promotionAPI.submitActivity({
          id: e.activityId
        })
        if (+code === 0) {
          await this.queryPromotionActivityDetail()
        }
      } else {
        if (e.promType === 2000) { // 拼团
          const { code } = await this.promotionAPI.patchGrouponThemeSubmitAuditUrl({
            id: e.activityId,
            status: e.status
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        } else if (e.promType === 3001) { // 砍价
          const { code } = await this.promotionAPI.cutPriceActivitySubmitAudit({
            id: e.activityId,
            status: e.status
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        } else if (e.promType === 4001) { // 免单
          const { code } = await this.promotionAPI.freeOrderActivitySubmitAudit({
            id: e.activityId,
            status: e.status
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        } else if (e.promType === 5001) { // 抽奖
          const { code } = await this.promotionAPI.submitLotteryActivity({
            id: e.activityId,
            status: e.status
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        } else if (e.promType === 6000) { // 优惠券
          const { code } = await this.promotionAPI.couponActivitySubmitAudit({
            id: e.activityId,
            status: e.status
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        } else if (e.promType === 8000) { // 推荐码
          const { code } = await this.promotionAPI.recommendSubmitActivity({
            id: e.activityId,
            status: 1
          })
          if (+code === 0) {
            await this.queryPromotionActivityDetail()
          }
        }
      }
    },
    // 审核
    openVerifyPop(e) {
      this.$prompt('管理员备注:', this.$t('提示'), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t('通过'),
        cancelButtonText: this.$t('不通过'),
        showClose: true,
        inputType: 'textarea',
        inputPattern: /^.{0,100}$/,
        inputErrorMessage: this.$t('只能输入100字符以内'),
        beforeClose: async(action, instance, done) => {
          const remark = instance.inputValue

          if ((remark === '' || remark === null) && action === 'cancel') {
            this.$message('请填写备注')
            return
          }

          if (action === 'close') {
            done()
            return
          }

          if (instance.editorErrorMessage !== '') {
            return false
          }

          if (action === 'cancel') {
            if (instance.editorErrorMessage !== '') {
              return false
            }
            if (e.promType < 100) {
              this.promotionAPI.verifyActivityNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 2000) { // 拼团
              this.promotionAPI.patchGrouponThemeAuditNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 3001) { // 砍价
              this.promotionAPI.cutPriceActivityAuditNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 4001) { // 免单
              this.promotionAPI.freeOrderActivityAuditNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 5001) { // 抽奖
              this.promotionAPI.auditLotteryActivity({
                lotteryThemeId: e.activityId,
                remark: remark,
                status: 3
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 6000) { // 优惠券
              this.promotionAPI.couponActivityAuditNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            } else if (e.promType === 8000) { // 推荐码
              this.promotionAPI.codeVerifyActivityNotPass({
                id: e.activityId,
                remark: remark,
                status: e.status
              }).then(res => {
                if (+res.code === 0) {
                  this.queryPromotionActivityDetail()
                  done()
                }
              })
            }
          } else if (action === 'confirm') {
            if (instance.editorErrorMessage !== '') {
              return false
            }
            if (e.promType < 100) {
              const { code } = await this.promotionAPI.verifyActivityPass({
                id: e.activityId,
                remark: remark
              })
              if (+code === 0) {
                await this.queryPromotionActivityDetail()
                done()
              }
            } else {
              if (e.promType === 2000) { // 拼团
                const { code } = await this.promotionAPI.patchGrouponThemeAuditPass({
                  id: e.activityId,
                  remark: remark,
                  status: e.status
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              } else if (e.promType === 3001) { // 砍价
                const { code } = await this.promotionAPI.cutPriceActivityAuditPass({
                  id: e.activityId,
                  remark: remark,
                  status: e.status
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              } else if (e.promType === 4001) { // 免单
                const { code } = await this.promotionAPI.freeOrderActivityAuditPass({
                  id: e.activityId,
                  remark: remark,
                  status: e.status
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              } else if (e.promType === 6000) { // 优惠券
                const { code } = await this.promotionAPI.couponActivityAuditPass({
                  id: e.activityId,
                  remark: remark,
                  status: e.status
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              } else if (e.promType === 8000) { // 推荐码
                const { code } = await this.promotionAPI.codeVerifyActivityPass({
                  id: e.activityId,
                  remark: remark,
                  status: e.status
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              } else if (e.promType === 5001) { // 抽奖
                const { code } = await this.promotionAPI.auditLotteryActivity({
                  lotteryThemeId: e.activityId,
                  remark: remark,
                  status: 4
                })
                if (+code === 0) {
                  await this.queryPromotionActivityDetail()
                  done()
                }
              }
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.activity-id-link {
  color: #409eff;
}
/deep/ .cp-search-item{
  overflow: unset !important;
}
/deep/ .data-time-name{
  display:  none !important;
}
/deep/ .box{
  max-height: 180px !important;
  height: 180px !important;
}
// /deep/ .cp-list-search-area .inner{
//   overflow: unset !important;
// }
</style>
