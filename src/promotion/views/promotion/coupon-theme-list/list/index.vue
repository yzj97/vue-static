<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="queryContent" :model="queryContent" label-width="120px" class="form">
          <ody-search-item :label="$t('优惠券名称:')" prop="obj.themeTitle">
            <el-input
              :placeholder="$t('请输入优惠券名称')"
              v-model="queryContent.obj.themeTitle"
              name="queryContent_obj_themeTitle"
            />
          </ody-search-item>
          <ody-search-item :label="$t('优惠券类型:')" prop="obj.couponType">
            <promotion-coupon-type-select
              v-model="queryContent.obj.couponType"
              :placeholder="$t('全部')"
              name="queryContent_obj_couponType"
            />
          </ody-search-item>

          <ody-search-item :label="$t('发券类型:')" prop="obj.couponGiveRule">
            <promotion-coupon-give-rule-select
              v-model="queryContent.obj.couponGiveRule"
              :placeholder="$t('全部')"
              name="queryContent_obj_couponGiveRule"
              @platformId="getPlatformId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('使用渠道:')" prop="obj.receiveChannelCode">
            <promotion-channel-code-select
              v-model="queryContent.obj.receiveChannelCode"
              :prom-type="promotionType"
              :placeholder="$t('全部')"
              name="queryContent_obj_receiveChannelCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('按活动创建时间:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="queryContent.obj.createTime"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              name="queryContent_obj_createTime"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('活动有效时间:')" :space="2" prop="obj.activityTime">
            <ody-date-range-picker
              v-model="queryContent.obj.activityTime"
              :start-placeholder="$t('开始时间')"
              :end-placeholder="$t('结束时间')"
              name="queryContent_obj_activityTime"
              type="datetimer"
              range-separator="-"
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
      <div slot="btn-bottom">
        <ody-button
          name="createCoupon"
          size="small"
          type="primary"
          code="button002"
          @click="createCoupon"
        >{{ $t('创建优惠券') }}</ody-button>
        <promotion-init-send-coupon-task-box :visble="visble" class="init-send-coupon" style="margin-left: 16px"/>
        <ody-button
          name="exportMPTemplate"
          size="small"
          code="button003"
          style="margin-left: 16px"
          @click="exportMPTemplate"
        >{{ $t('导出') }}</ody-button>
      </div>
      <div slot="tabs">
        <el-tabs
          v-model="queryContent.obj.status"
          name="queryContent_obj_status"
          @tab-click="handleFilterGroupon"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('进行中')" name="4" />
          <el-tab-pane :label="$t('已失效')" name="5" />
          <el-tab-pane :label="$t('已关闭')" name="6" />
          <el-tab-pane :label="$t('未开始')" name="2" />
          <el-tab-pane :label="$t('待提交')" name="0" />
          <el-tab-pane :label="$t('待审核')" name="1" />
          <el-tab-pane :label="$t('审核未通过')" name="3" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :operates="table.operates"
          name="queryCouponActivityPG969"
          request-url="/back-promotion-web/couponActivityRead/queryCouponActivityPG.do"
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
          >
            {{ getStatusText(scope.row)| keyVal(getCouponListType) }}
            <el-tooltip
              v-show="scope.row.remark"
              :content="scope.row.remark"
              class="item"
              effect="dark"
              placement="top-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
          </template>
          <template
            slot="couponDeductionType"
            slot-scope="scope"
          >{{ scope.row.couponDeductionType | keyVal(getCouponDeductionTypeMap) }}</template>
          <template slot="themeTitle" slot-scope="scope">
            <a
              name="seeNewTab"
              class="activity-id-link"
              @click="seeNewTab(scope.row)"
            >{{ scope.row.themeTitle }}</a>
          </template>
          <template slot="couponAmount" slot-scope="scope">
            {{ formatCouponAmount(scope.row) }}
            <!-- <promotion-coupon-amount-detail :coupon="scope.row"/> -->
            <!-- <span
              v-if="scope.row.couponDiscountType === 1"
            >{{ scope.row.couponAmount }}{{ scope.row.couponUnit }},&nbsp;折扣上限{{ scope.row.useUpLimit }}{{ $t('元') }}</span>
            <span
              v-if="scope.row.couponDiscountType === 0"
            >{{ scope.row.couponAmount }}{{ scope.row.couponUnit }}</span> -->
            <!-- <span v-if="scope.row.couponDiscountType === 0">{{ scope.row.couponAmountExt1 }}</span>
            <span v-if="scope.row.couponAmountExt1.length !== 0">{{ scope.row.couponUnit }}</span>-->
            <!-- <span v-else>{{ scope.row.couponAmount }}{{ scope.row.couponUnit }}</span> -->
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>

    <ody-dialog v-if="dialogVisible" :visible.sync="dialogVisible" :title="$t('发券')" width="600px" >
      <el-form ref="form" label-width="120px" class="form">
        <el-form-item :label="$t('优惠券名称')" required>
          <span>{{ sendCouponObj.themeTitle }}</span>
        </el-form-item>
        <el-form-item :label="$t('可发行数量')" required>
          <span>{{ sendCouponObj.availableCoupons }}</span>
        </el-form-item>
        <el-form-item :label="$t('发放用户手机号')" required>
          <promotion-phone-number-send-radio
            ref="phoneNumberSendRadio"
            v-model="provideCouponObj.phoneNumberByText"
            name="provideCouponObj_phoneNumberByText"
            @provideCouponObj="getProvideCouponObj"
          />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <div class="line-top" />
        <el-button name="hideDialog" size="small" @click="hideDialog">{{ $t('取消') }}</el-button>
        <el-button
          name="confirmDialog"
          size="small"
          type="primary"
          @click="confirmDialog"
        >{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
    <ody-dialog
      v-if="createCouponModal.visible"
      :visible.sync="createCouponModal.visible"
      :title="$t('生券')"
      width="600px" >
      <el-form
        ref="createCouponForm"
        :model="generateCouponContent"
        :rules="createCouponFormRules"
        label-width="120px"
        class="form">
        <el-form-item :label="$t('优惠券名称')">
          <span>{{ generateCouponContent.themeTitle }}</span>
        </el-form-item>
        <el-form-item :label="$t('可生券张数')">
          <span>{{ generateCouponContent.canDrawed }}</span>
        </el-form-item>
        <el-form-item :label="$t('生券张数')" prop="generateAmount">
          <ody-input-number
            :min="1"
            :max="generateCouponContent.canDrawed"
            v-model="generateCouponContent.generateAmount"
            name="generateCouponContent_generateAmount"/>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div class="line-top" />
        <el-button
          name="hideDialog"
          size="small"
          @click="createCouponModalHide">
          {{ $t('取消') }}
        </el-button>
        <el-button
          name="confirmDialog"
          size="small"
          type="primary"
          @click="createCouponModalConfirm"
        >{{ $t('确定') }}</el-button>
      </template>
    </ody-dialog>

    <simple-edit :promotion-id="editPromotionId" :visible.sync="showSimpleEdit" @ok="handleSubmit"/>
  </div>
</template>
<script>
import constants from '@/utils/constants'
import * as utilService from '@/services/utilService'
import * as constantService from '@/services/constantService'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
import PromotionCouponTypeSelect from '@/components/promotion-coupon-type-select'
import PromotionCouponGiveRuleSelect from '@/components/promotion-coupon-give-rule-select'
import PromotionInitSendCouponTaskBox from '@/components/promotion-init-send-coupon-task-box'
import PromotionPhoneNumberSendRadio from '@/components/promotion-phone-number-send-radio'
import PromotionCouponAmountDetail from '@/components/coupon-amount-detail'
import SimpleEdit from '../edit/SimpleEdit'

export default {
  name: 'PromPromotionCouponThemeList',
  components: {
    SimpleEdit,
    PromotionCouponAmountDetail,
    PromotionChannelCodeSelect,
    PromotionCouponTypeSelect,
    PromotionCouponGiveRuleSelect,
    PromotionInitSendCouponTaskBox,
    PromotionPhoneNumberSendRadio
  },
  data() {
    const self = this
    return {
      showSimpleEdit: false,
      editPromotionId: null,
      createCouponFormRules: {
        generateAmount: [
          { required: true, message: '请输入生券张数', trigger: 'blur' }
        ]
      },
      generateCouponContent: {
        id: null,
        themeTitle: null, // 优惠券名称
        canDrawed: null, // 可生券张数
        generateAmount: null // 生券张数
      },
      createCouponModal: {
        visible: false
      },
      queryCouponActivityPG: {},
      sendCouponObj: {},
      dialogVisible: false,
      channelMap: null,
      visble: false,
      promotionType: 6000,
      couponDeductionTypeArr: [],
      platformId: undefined,
      queryContent: {
        currentPage: 1,
        itemsPerPage: 10,
        obj: {
          // promType: 6000,
          startTime: undefined,
          endTime: undefined,
          createTime1: undefined,
          createTime2: undefined,
          receiveChannelCode: undefined,
          status: '-1',
          couponGiveRule: undefined,
          couponType: undefined,
          createTime: [],
          activityTime: []
        }
      },
      sendCouponContent: {
        canDrawed: ''
      },

      provideCouponObj: {
        phoneNumbers: '',
        fileName: '',
        phoneNumberByText: ''
      },
      table: {
        columns: [
          {
            label: this.$t('优惠券名称'),
            slot: 'themeTitle',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('发券类型'),
            slot: 'couponGiveRule',
            align: 'center',
            show: true
          },
          {
            label: this.$t('优惠券类型'),
            slot: 'couponType',
            align: 'center',
            show: true
          },
          {
            label: this.$t('金额抵扣类型'),
            slot: 'couponDeductionType',
            align: 'center',
            show: true
          },
          {
            label: this.$t('面值（元)'),
            slot: 'couponAmount',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            show: true,
            prop: 'receiveChannelCodes',
            label: this.$t('使用渠道'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return `<span>${this.getChannelName(
                row.receiveChannelCodes
              )}</span>`
            }
          },
          {
            label: this.$t('券活动日期'),
            prop: 'activityTime',
            show: true,
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              if (row.startTime && row.endTime) {
                return `<span>${this.$portal.parseTime(
                  row.startTime,
                  '{y}-{m}-{d} {h}:{i}:{s}'
                )}-</span>
                  <span>${this.$portal.parseTime(
    row.endTime,
    '{y}-{m}-{d} {h}:{i}:{s}'
  )}</span>`
              }
            }
          },
          {
            show: true,
            prop: 'totalLimit',
            label: this.$t('总限领（张）'),
            align: 'center',
            minWidth: 120
          },
          {
            show: true,
            prop: 'individualLimit',
            label: this.$t('每人限领（张）'),
            align: 'center',
            minWidth: 160
          },
          {
            label: this.$t('使用条件'),
            prop: 'useLimit',
            show: true,
            align: 'center',
            minWidth: 120,
            render: function(h, params) {
              return (
                <div>
                  <span>{self.$t('满')}</span>
                  { params.row.useLimit === null ? '0' : params.row.useLimit }
                  <span>{self.$t('元可用')}</span></div>
              )
            }
          },
          {
            label: this.$t('创建时间'),
            prop: 'createTime',
            align: 'center',
            show: true,
            minWidth: 160,
            formatter: (row, column) => {
              if (row.createTime) {
                return this.$portal.parseTime(row.createTime)
              }
            }
          },
          {
            label: this.$t('已发行量/已领取/已使用'),
            prop: 'drawedCoupons/sendedCouopns/usedCouopns',
            align: 'center',
            minWidth: 220, show: true,
            formatter: (row, column, cellValue) => {
              return (
                row.drawedCoupons +
                '/' +
                row.sendedCouopns +
                '/' +
                row.usedCouopns
              )
            }
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            align: 'center',
            minWidth: 120, show: true
          }
        ],
        operates: {
          minWidth: 240,
          fixed: 'right',
          list: [
            {
              label: this.$t('查看'),
              method: (index, row) => {
                this.seeNewTab(row)
              },
              code: 'button005'
            },
            {
              label: this.$t('复制'),
              method: (index, row) => {
                this.copyActivity(row)
              },
              code: 'button004'
            },
            {
              label: this.$t('编辑'),
              hidden: function(index, row) {
                if (self.getStatusText(row) >= 5) {
                  return true
                }
                // 1. 进行中 和 未开始 的下单分享券  2.待提交和审核未通过
                if (((row.status === 4 || row.status === 2) && row.couponGiveRule === 12) ||
                  row.status === 0 || row.status === 3
                ) {
                  return false
                }
                return true
                // if (row.status !== 0 && row.status !== 3) {
                //   return true
                // }
              },
              method: (index, row) => {
                // 下单分享券允许在进行中和未开始这两种状态下简单修改一些文案
                if ((row.status === 4 || row.status === 2) && row.couponGiveRule === 12) {
                  this.editPromotionId = row.id
                  this.showSimpleEdit = true
                  return
                }
                this.updateCouponTheme(row)
              },
              code: 'button006'
            },
            {
              label: this.$t('删除'),
              hidden: (index, row) => {
                return row.status !== 0
              },
              method: (index, row) => {
                this.deleteActivity(row)
              },
              code: 'button007'
            },
            {
              label: this.$t('关闭'),
              hidden: (index, row) => {
                return !(row.status === 2 || (row.status === 4 && row.endTime > new Date()))
              },
              method: (index, row) => {
                this.closeActivity(row)
              },
              code: 'button008'
            },
            {
              label: this.$t('生券'),
              hidden: (index, row) => {
                return !this.generateCouponBtnShow(row)
              },
              method: (index, row) => {
                this.initGenerateCouponModal(row)
              },
              code: 'button009'
            },
            {
              label: this.$t('发券'),
              hidden: (index, row) => {
                return !(
                  this.sendCouponBtnShow(row) && row.couponGiveRule !== 18
                )
              },
              method: (index, row) => {
                this.closeSendCouponModal(row)
              },
              code: 'button009'
            }
          ]
        }
      }
    }
  },
  computed: {
    getCouponTypeMap() {
      return constants.couponTypeMapList.reduce((rtv, item) => {
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
    getCouponListType() {
      return constants.couponListStatus.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    },
    getCouponDeductionTypeMap() {
      return constants.couponDeductionTypeList.reduce((rtv, item) => {
        rtv[item.value] = this.$t(item.label)
        return rtv
      }, {})
    }
  },
  watch: {
    'provideCouponObj.phoneNumbers': function(val) {
      if (val) {
        this.provideCouponObj.phoneNumberByText = val
      }
      true
    },
    'provideCouponObj.fileName': function(val) {
      if (val) {
        this.provideCouponObj.phoneNumberByText = val
        console.log(
          'this.provideCouponObj.phoneNumberByText',
          this.provideCouponObj.phoneNumberByText
        )
      }
      true
    }
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    await this.getChannelMap()

    // 等优惠券类型接口请求过来之后 不写setTimeout 还要传入事件 不利于代码阅读
    setTimeout(() => {
      this.query()
    }, 500)
  },
  methods: {
    formatCouponAmount(e) {
      if (!e.ruleType) {
        return ''
      }
      if (e.couponDiscountType === 0) {
        if (e.ruleType === 5) {
          return e.couponAmount + this.$t('元')
        }
        if (e.ruleType === 7) {
          return e.couponAmount + this.$t('元') + '~' + e.couponAmountExt1 + this.$t('元')
        }
      }
      if (e.couponDiscountType === 1) {
        return e.couponAmount + this.$t('折') + '，' + this.$t('折扣上限') + e.useUpLimit + this.$t('元')
      }
      return ''
    },
    initGenerateCouponModal(row) {
      var canDrawed = row.totalLimit - row.drawedCoupons
      this.generateCouponContent = { ...row, canDrawed }
      this.createCouponModal.visible = true
    },
    async createCouponModalConfirm() {
      const [validError] = await this.formValidate('createCouponForm')

      if (validError) {
        return
      }
      // debugger
      await this.promotionAPI.generateCoupons(this.generateCouponContent)
      this.createCouponModalHide()
      this.$message({
        message: this.$t('生券成功!'),
        type: 'success'
      })
      await this.query()
    },
    createCouponModalHide() {
      this.createCouponModal.visible = false
    },
    // 生券按钮显示
    generateCouponBtnShow(e) {
      // 券活动状态为2：未开始或4：进行中时按钮显示
      var canDrawed = e.totalLimit - e.drawedCoupons
      return (this.getTrueStatus(e.status, e.startTime, e.endTime) === 4) && e.couponType === 1 && canDrawed > 0
    },

    getStatusText(row) {
      var trueStatus = this.getTrueStatus(
        row.status,
        row.startTime,
        row.endTime
      )
      return trueStatus
    },

    sendCouponBtnShow(e) {
      // 发券类型不为15：异业合作券，券活动状态为2：未开始或4：进行中时按钮显示
      var canDrawed = e.totalLimit - e.drawedCoupons
      return (
        e.couponGiveRule !== 15 &&
        e.couponGiveRule !== 12 &&
        this.getTrueStatus(e.status, e.startTime, e.endTime) === 4 &&
        canDrawed > 0
      )
    },
    getTrueStatus(status, startTime, endTime) {
      return utilService.getTrueStatusByStatusAndTimeRange(
        status,
        startTime,
        endTime,
        2,
        4,
        5
      )
    },
    // 导出EXCEL
    exportMPTemplate() {
      var id = this.queryContent.obj.id || ''
      var themeTitle = this.queryContent.obj.themeTitle || ''
      var couponGiveRule = this.queryContent.obj.couponGiveRule || ''
      var couponType = this.queryContent.obj.couponType || ''
      var status = this.queryContent.obj.status || ''
      const [
        createTimeStart,
        createTimeEnd
      ] = this.queryContent.obj.createTime
      var createTime1 = createTimeStart || ''
      var createTime2 = createTimeEnd || ''
      const [
        activityTimeStart,
        activityTimeEnd
      ] = this.queryContent.obj.activityTime
      var startTime = activityTimeStart || ''
      var endTime = activityTimeEnd || ''
      var themeType = -1
      var params =
        themeTitle +
        '|' +
        couponGiveRule +
        '|' +
        couponType +
        '|' +
        status +
        '|' +
        createTime1 +
        '|' +
        createTime2 +
        '|' +
        startTime +
        '|' +
        endTime +
        '|' +
        id +
        '|' +
        themeType

      this.$portal.downloadFileByGet(
        '/api/back-promotion-web/couponActivityRead/exportCouponThemeList.do',
        {
          params
        }
      )
    },
    /**
     * 获取渠道名称
     * @param receiveChannelCodes
     */
    getChannelName(receiveChannelCodes) {
      if (utilService.isEmpty(receiveChannelCodes)) {
        return ''
      } else {
        var arr = []
        receiveChannelCodes
          .map(item => {
            if (this.channelMap[item] && this.channelMap[item].channelName) {
              arr.push(this.channelMap[item].channelName)
            }
          })
        return arr.join('、')
      }
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
    updateCouponTheme(e) {
      const params = {
        promotionId: e.id,
        promotionType: 6000
      }
      this.$router.push({
        name: 'PromPromotionCouponThemeEdit',
        params: params
      })
    },
    handleReset() {
      this.formReset('queryContent')
      this.queryContent.obj = {
        receiveChannelCode: undefined,
        status: '-1',
        couponGiveRule: undefined,
        couponType: undefined,
        startTime: undefined,
        endTime: undefined,
        createTime1: undefined,
        createTime2: undefined,
        activityTime: [],
        createTime: []
      }
    },
    createCoupon() {
      console.log('删除再创建')
      this.$parent.$parent.$parent.$children[2].delViewByName('PromPromotionCouponThemeCreate')
      const params = {
        promotionType: 6000
      }
      // console.log(params)
      this.$router.push({
        name: 'PromPromotionCouponThemeCreate',
        params: params
      })
    },
    // 是否可写操作
    isHasWriteRoll(e) {
      return e.hasWriteRoll
    },
    async handleSubmit() {
      const [validError] = await this.formValidate('queryContent')

      if (validError) {
        return
      }
      await this.query()
    },
    async query() {
      const {
        ...params
      } = JSON.parse(JSON.stringify(this.queryContent.obj))

      if (this.queryContent.obj) {
        if (this.queryContent.obj.activityTime && this.queryContent.obj.activityTime.length > 0) {
          const [activityTimeStart, activityTimeEnd] = this.queryContent.obj.activityTime
          params.startTime = activityTimeStart
          params.endTime = activityTimeEnd
        }
        if (this.queryContent.obj.createTime && this.queryContent.obj.createTime.length > 0) {
          const [createTimeStart, createTimeEnd] = this.queryContent.obj.createTime
          params.createTime1 = createTimeStart
          params.createTime2 = createTimeEnd
        }
      }
      delete params.createTime
      delete params.activityTime

      params.couponGiveRule = this.queryContent.obj.couponGiveRule
        ? this.queryContent.obj.couponGiveRule
        : -1
      params.couponType = this.queryContent.obj.couponType !== 'undefined'
        ? this.queryContent.obj.couponType
        : -1
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
    handleFilterGroupon() {
      this.queryContent.currentPage = 1
      this.query()
    },
    getPlatformId(id) {
      this.platformId = id
    },
    seeNewTab(e) {
      const params = {
        promotionId: e.id,
        status: e.status
      }
      this.$router.push({
        name: 'PromPromotionCouponThemeDetail',
        params: params
      })
      // 隐藏tooltip
      setTimeout(function() {
        const tooltips = document.getElementsByClassName('el-tooltip__popper')
        for (let i = 0; i < tooltips.length; i++) {
          tooltips[i].style.display = 'none'
        }
        console.log('隐藏tooltip setTimeout')
      }, 1000)
    },
    // 复制促销活动
    copyActivity(e) {
      this.$confirm(this.$t('是否确认复制该活动？'), this.$t('系统提示'), {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const data = e.id
          const request = this.promotionAPI.copyCouponTheme(data)
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('复制成功!')
              })
              this.handleSubmit()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消复制')
          })
        })
    },
    // 删除活动
    deleteActivity(e) {
      this.$confirm(this.$t('是否确认删除活动') + '？', '系统提示', {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const data = e.id
          const request = this.promotionAPI.deleteCouponTheme(data)
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('删除成功!')
              })
              this.handleSubmit()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消删除')
          })
        })
    },
    // 关闭活动
    closeActivity(e) {
      this.$confirm(this.$t('是否确认关闭活动') + '？', '系统提示', {
        confirmButtonText: this.$t('确认'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      })
        .then(() => {
          const data = e.id
          const request = this.promotionAPI.closeCouponTheme(data)
          request.then(response => {
            if (response.code === constantService.getSuccessStatus()) {
              this.$message({
                type: 'success',
                message: this.$t('关闭成功!')
              })
              this.handleSearchSubmit()
            }
          })
          this.query()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消关闭')
          })
        })
    },
    // 发券
    closeSendCouponModal(e) {
      this.dialogVisible = true
      this.sendCouponObj = e
    },
    hideDialog() {
      this.resetData()
      this.dialogVisible = false
    },
    resetData() {
      // 清空查询对象
      this.provideCouponObj = {
        phoneNumbers: '',
        fileName: '',
        phoneNumberByText: ''
      }
    },
    async getProvideCouponObj(val) {
      this.provideCouponObj = val
      if (this.provideCouponObj.phoneNumbers) {
        this.provideCouponObj.phoneNumberByText = this.provideCouponObj.phoneNumbers
      }
      if (this.provideCouponObj.fileName) {
        this.provideCouponObj.phoneNumberByText = this.provideCouponObj.fileName
      }
    },
    async confirmDialog() {
      this.provideCouponObj.phoneNumbers === ''
      if (this.sendCouponObj.totalLimit === 0) {
        this.$message({
          type: 'info',
          message: this.$t('可发行数量为') + '0，' + this.$t('不能发券')
        })
        return
      }
      if (
        (this.provideCouponObj.phoneNumbers === null ||
          this.provideCouponObj.phoneNumbers === 'undefined' ||
          this.provideCouponObj.phoneNumbers === '') &&
        this.provideCouponObj.fileName === ''
      ) {
        this.$message({
          type: 'info',
          message: this.$t('使用者手机号') + '、CSV' + this.$t('文件不能都为空')
        })
        return
      }
      this.sendMessageFlg = 1

      // this.$refs.phoneNumberSendRadio.provideCouponObj.timeScope
      const queryObject = {
        id: this.sendCouponObj.id,
        smFlg: this.sendMessageFlg,
        phoneNumbers: this.provideCouponObj.phoneNumbers
      }
      if (this.$refs.phoneNumberSendRadio.provideCouponObj.timeScope === 1) {
        if (
          this.provideCouponObj.phoneNumbers != null &&
          this.provideCouponObj.phoneNumbers !== 'undefined' &&
          this.provideCouponObj.phoneNumbers !== ''
        ) {
          var phoneNumbers = this.provideCouponObj.phoneNumbers.split(';')
          var phoneRegExp = /^1\d{10}$/
          var legal = true
          for (var i = 0; i < phoneNumbers.length; i++) {
            if (!phoneRegExp.test(phoneNumbers[i])) {
              legal = false
              break
            }
          }
          if (!legal) {
            this.$message({
              type: 'info',
              message:
                this.$t('用户手机号输入不合法') + '，' + this.$t('请确认输入')
            })
            return
          }
        }
      } else {
        delete queryObject.phoneNumbers
      }
      const queryString = this.$portal.param(queryObject)
      const data = new FormData()
      const file =
        document.getElementsByName('fileData') &&
        document.getElementsByName('fileData')[0] &&
        document.getElementsByName('fileData')[0].files &&
        document.getElementsByName('fileData')[0].files[0]
      // console.log('file', file)
      // console.log(this.$refs.phoneNumberSendRadio.$refs.upload)
      data.append('fileData', file)
      const { code } = await this.$portal.post(
        `/back-promotion-web/couponActivityWrite/provideCoupons.do?${queryString}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      )

      if (+code === 0) {
        this.$confirm(
          this.$t('发券任务已创建! 请在任务列表点击“下载结果”查看'),
          {
            confirmButtonText: this.$t('确认'),
            cancelButtonText: this.$t('取消'),
            type: 'success'
          }
        )
        this.resetData()
        this.dialogVisible = false
        // this.query()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.init-send-coupon {
  display: inline-block;
}
.activity-id-link {
  color: #409eff;
}
</style>
