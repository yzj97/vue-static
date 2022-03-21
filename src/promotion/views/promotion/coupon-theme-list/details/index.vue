<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="100px" class="form">
          <ody-search-item :label="$t('券号:')" prop="obj.couponCode">
            <el-input
              :placeholder="$t('请输入优惠券券号')"
              v-model="queryContent.obj.couponCode"
              name="queryContent_obj_couponCode"
            />
          </ody-search-item>

          <ody-search-item :label="$t('优惠券名称:')" prop="obj.couponActivityName">
            <el-input
              :placeholder="$t('请输入优惠券名称')"
              v-model="queryContent.obj.couponActivityName"
              name="queryContent_obj_couponActivityName"
            />
          </ody-search-item>

          <ody-search-item :label="$t('绑定手机号:')" prop="obj.cellNo">
            <el-input
              :placeholder="$t('请输入绑定手机号')"
              v-model="queryContent.obj.cellNo"
              name="queryContent_obj_cellNo"
            />
          </ody-search-item>
          <ody-search-item :label="$t('生券时间')" :space="2" prop="obj.couponCreateTime">
            <ody-date-range-picker
              v-model="queryContent.obj.couponCreateTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_obj_couponCreateTime"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('有效时间:')" :space="2" prop="obj.couponEffectiveTime">
            <ody-date-range-picker
              v-model="queryContent.obj.couponEffectiveTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="queryContent_obj_couponEffectiveTime"
              type="date"
              range-separator="-"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="button012"
          size="small"
          type="primary"
          code="button012"
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
          <el-tab-pane :label="$t('已发行')" name="0" />
          <el-tab-pane :label="$t('可使用')" name="1" />
          <el-tab-pane :label="$t('已使用')" name="2" />
          <el-tab-pane :label="$t('已过期')" name="4" />
          <el-tab-pane :label="$t('已作废')" name="3" />
        </el-tabs>
      </div>
      <div slot="btn-bottom">
        <ody-button
          name="exportMPTemplate"
          size="small"
          code="button013"
          @click="exportMPTemplate"
        >
          {{ $t('导出') }}
        </ody-button>
        <ody-button
          v-if="queryContent.obj.status === '1'"
          name="handleBatchDelete"
          size="small"
          code="button014"
          @click="handleBatchDelete"
        >
          {{ $t('批量作废') }}
        </ody-button>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :data="queryCouponActivityPG"
          :multiple="queryContent.obj.status === '1'"
          :checked.sync="checked"
          :columns="table.columns"
          :operates="table.operates"
          name="queryCouponActivityPG842"
          request-url="/back-promotion-web/couponRead/queryCouponTypePG.do"
        >
          <template
            slot="couponType"
            slot-scope="scope"
          >{{ scope.row.couponType | keyVal(getCouponTypeMap) }}</template>
          <template
            slot="couponGiveRule"
            slot-scope="scope"
          >{{ scope.row.couponGiveRule | keyVal(getCouponGiveRuleMap) }}</template>
          <template slot="activityTime" slot-scope="scope">{{ scope.row.activityTime | parseTime }}</template>
          <template slot="createTime" slot-scope="scope">{{ scope.row.createTime | parseTime }}</template>
          <template
            slot="status"
            slot-scope="scope"
          >{{ scope.row.status | keyVal(getCouponThemeListType) }}</template>
          <template
            slot="couponDiscountType"
            slot-scope="scope"
          >{{ scope.row.couponDiscountType | keyVal(getCouponDeductionTypeMap) }}</template>
          <template
            slot="receiveChannelCodes"
            slot-scope="scope"
          >{{ scope.row.receiveChannelCodes | keyVal(getChannelArrListMap) }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import constants from '@/utils/constants'
import * as utilService from '@/services/utilService'
import * as constantService from '@/services/constantService'
import PromotionActivityTypeSelect from '@/components/promotion-activity-type-select'
import PromotionCouponGiveRuleSelect from '@/components/promotion-coupon-give-rule-select'
import PromotionInitSendCouponTaskBox from '@/components/promotion-init-send-coupon-task-box'
export default {
  name: 'PromPromotionCouponThemeListDetails',
  components: {
    PromotionActivityTypeSelect,
    PromotionCouponGiveRuleSelect,
    PromotionInitSendCouponTaskBox
  },
  data() {
    return {
      checked: [],
      channelMap: null,
      visble: false,
      promotionType: 6000,
      couponDeductionTypeArr: [],
      platformId: undefined,
      queryContent: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          couponCode: '',
          cellNo: undefined,
          couponCreateStartTime: undefined,
          couponCreateEndTime: undefined,
          couponEffectiveStartTime: undefined,
          couponEffectiveEndTime: undefined,
          status: '-1',
          couponActivityName: undefined,
          couponCreateTime: [],
          couponEffectiveTime: []
        }
      },
      table: {
        columns: [
          {
            label: this.$t('优惠券名称'),
            prop: 'themeTitle',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('券号'),
            prop: 'couponCode',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('订单编号'),
            prop: 'orderCode',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            show: true,
            prop: 'channelCodes',
            label: this.$t('使用渠道'),
            align: 'center',
            formatter: (row, column, cellValue) => {
              return `<span>${this.getChannelName(
                row.receiveChannelCodes
              )}</span>`
            }
          },
          {
            label: this.$t('生券日期'),
            prop: 'createTime',
            align: 'center',
            show: true,
            minWidth: 170,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          },
          {
            label: this.$t('有效时间'),
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
            label: this.$t('绑定手机号'),
            prop: 'cellNo',
            align: 'center',
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            align: 'center',
            show: true
          },
          {
            label: this.$t('绑券时间'),
            prop: 'bindTime',
            align: 'center',
            show: true,
            minWidth: 200,
            formatter: (row, column) => {
              if (row.bindTime) {
                return this.$portal.parseTime(row.bindTime)
              }
            }
          }
        ],
        operates: {
          width: 120,
          fixed: 'right',
          list: [
            {
              label: this.$t('作废'),
              hidden: (index, row) => {
                const show = this.invalidBtnShow(row.status, row.endTime)

                return !show
              },
              method: (index, row) => {
                this.invalidCoupon([row.id])
              },
              code: 'button014'
            }
          ]
        }
      }
    }
  },
  computed: {
    getCouponTypeMap() {
      return constants.couponTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCouponGiveRuleMap() {
      return constants.couponGiveRuleList[this.platformId].reduce(
        (rtv, item) => {
          rtv[item.value] = item.label
          return rtv
        },
        {}
      )
    },
    getCouponThemeListType() {
      return constants.couponThemeListMap.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getCouponDeductionTypeMap() {
      return constants.couponDeductionTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getChannelArrListMap() {
      return constants.channelArrList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    this.getChannelMap()
    await this.query()
  },
  methods: {
    // 获取真实券状态
    getRealStatus(status, endTime) {
      var trueStatus
      // 如果券是按绑定时间计算有效期且未绑定，则结束时间未赋值
      if (!utilService.isEmpty(endTime)) {
        if (status === 0 || status === 1) {
          var now = new Date()
          var eDate = new Date(endTime)
          if (now > eDate) { // 券已失效
            trueStatus = 4
          } else { // 活动进行中
            trueStatus = status
          }
        } else {
          trueStatus = status
        }
      } else {
        trueStatus = status
      }
      return trueStatus
    },
    // 作废按钮显示
    invalidBtnShow(status, endTime) {
      // 券状态为0：已发行时按钮显示
      return this.getRealStatus(status, endTime) === 0 || this.getRealStatus(status, endTime) === 1
    },
    // 导出EXCEL
    async exportMPTemplate() {
      const couponActivityId = ''
      const cellNo = this.queryContent.obj.cellNo || ''
      const activityName = this.queryContent.obj.couponActivityName || ''
      const code = this.queryContent.obj.couponCode || ''
      const status = this.queryContent.obj.status || ''
      const [effectiveStart, effectiveEnd] = this.queryContent.obj.couponEffectiveTime
      const effectiveStartTime = effectiveStart ? this.$moment(effectiveStart).format('YYYY-MM-DD HH:mm:ss') : ''
      const effectiveEndTime = effectiveEnd ? this.$moment(effectiveEnd).format('YYYY-MM-DD HH:mm:ss') : ''
      const [createStart, createEnd] = this.queryContent.obj.couponCreateTime
      const createStartTime = createStart ? this.$moment(createStart).format('YYYY-MM-DD HH:mm:ss') : ''
      const createEndTime = createEnd ? this.$moment(createEnd).format('YYYY-MM-DD HH:mm:ss') : ''
      const params = cellNo + '|' + activityName + '|' + code + '|' + status + '|' + effectiveStartTime + '|' + effectiveEndTime + '|' + createStartTime + '|' + createEndTime + '|' + couponActivityId

      await this.$portal.downloadFileByGet('/api/back-promotion-web/couponRead/exportCoupons.do', {
        params: encodeURI(params)
      }, '优惠券明细导出.xlsx')
    },
    getExportTime(time, index) {
      if (time && time.length > 0) {
        return time[index] || ''
      }
      return ''
    },
    handleBatchDelete() {
      const idList = this.checked.map(x => x.id)

      if (idList && idList.length) {
        this.invalidCoupon(idList)
      } else {
        this.$message.warning('请勾选')
      }
    },
    invalidCoupon(idList) {
      this.$confirm(this.$t('确定要作废此优惠券吗') + '？', this.$t('系统提示'), {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const request = this.promotionAPI.invalidCoupon({ idList })
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('作废成功!')
              })
              this.handleSubmit()
            }
          })
        })
    },
    handleReset() {
      this.queryContent.obj = {
        couponCode: '',
        cellNo: undefined,
        couponCreateStartTime: undefined,
        couponCreateEndTime: undefined,
        couponEffectiveStartTime: undefined,
        couponEffectiveEndTime: undefined,
        status: '-1',
        couponActivityName: undefined,
        couponCreateTime: [],
        couponEffectiveTime: []
      }
    },
    createCoupon() {
      this.$router.push({
        name: 'PromPromotionCouponThemeDetail',
        params: {}
      })
    },
    async handleSubmit() {
      await this.query()
    },
    async query() {
      const {
        couponCreateTime,
        couponEffectiveTime,
        ...params
      } = JSON.parse(JSON.stringify(this.queryContent.obj))
      if (couponCreateTime) {
        const [couponActivityStart, couponActivityEnd] = couponCreateTime
        params.couponCreateStartTime = couponActivityStart
        params.couponCreateEndTime = couponActivityEnd
      }

      if (couponEffectiveTime) {
        const [couponEffectiveStart, couponEffectiveEnd] = couponEffectiveTime
        params.couponEffectiveStartTime = couponEffectiveStart
        params.couponEffectiveEndTime = couponEffectiveEnd
      }
      params.couponStatus = params.status
      delete params.status
      if (params.couponStatus === '-1') {
        delete params.couponStatus
      }

      const param = {
        obj: this.formHasValue(params)
      }
      await this.getCouponDeductionType()
      // 有值才传递
      return this.$refs.table.getList(this.formHasValue(param))
    },
    // 优惠券金额抵扣类型
    getCouponDeductionType() {
      this.$promotion.$api.promotion.loadCouponPageConfig(
        'COUPON_PAGE_CONFIG',
        res => {
          if (res.code === '0' && res.data.result) {
            for (let i = 0; i < res.data.result.length; i++) {
              if (this.promotionType === res.data.result[i].promotionType) {
                this.couponDeductionTypeArr = res.data.result[i].channelCodes
              }
            }
          }
        }
      )
    },
    getChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        if (response.code === '0') {
          this.channelMap = response.data
        }
      })
    },
    getChannelName(channelCodes) {
      if (utilService.isEmpty(channelCodes)) {
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
    async handleFilterGroupon() {
      this.queryContent.currentPage = 1
      await this.query()
    },
    getPlatformId(id) {
      this.platformId = id
    }
  }
}
</script>
<style lang="scss" scoped>
.init-send-coupon {
  display: inline-block;
}
</style>
