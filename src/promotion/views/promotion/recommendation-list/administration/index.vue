<template>
  <div class="app-container">
    <ody-list-search-area>
      <div slot="content">
        <el-form :model="listQuery">
          <ody-search-item :label="$t('推荐码:')" prop="obj.referralCode">
            <el-input
              v-model="listQuery.obj.referralCode"
              :placeholder="$t('请输入推荐码')"
              name="listQuery_obj_referralCode"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('会员所属账号:')" prop="obj.bindCellNo">
            <el-input
              v-model="listQuery.obj.bindCellNo"
              :placeholder="$t('请输入会员所属账号')"
              name="listQuery_obj_bindCellNo"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('推荐码有效期:')" :space="2" prop="obj.createTime">
            <ody-date-range-picker
              v-model="listQuery.obj.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="listQuery_obj_createTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimer"
              range-separator="-"
            />
          </ody-search-item>
          <ody-search-item :label="$t('使用渠道:')" prop="obj.channelCode">
            <promotion-channel-code-select
              v-model="listQuery.obj.channelCode"
              :prom-type="promType"
              :placeholder="$t('全部')"
              name="listQuery_obj_channelCode"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button
          name="resetQuery"
          class="filter-item"
          size="small"
          @click="resetQuery"
        >{{ $t('重置') }}</el-button>
        <ody-button
          name="handleSearchSubmit"
          class="filter-item"
          type="primary"
          size="small"
          code="button001"
          @click="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>

    <ody-list-table-area>
      <ody-button
        slot="btn-bottom"
        name="exportMPTemplate"
        size="small"
        code="button002"
        @click="exportMPTemplate"
      >{{ $t('导出EXCEL') }}</ody-button>
      <div slot="tabs">
        <el-tabs
          v-model="listQuery.obj.status"
          name="listQuery_obj_status"
          @tab-click="handleSearchSubmit"
        >
          <el-tab-pane :label="$t('全部')" name="-1" />
          <el-tab-pane :label="$t('生效中')" name="1" />
          <el-tab-pane :label="$t('已失效')" name="2" />
        </el-tabs>
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="columns"
          :operates="operates"
          :can-filter="false"
          request-url="/back-promotion-web/referralCodeRead/queryReferralCodeList.action"
        />
      </div>
    </ody-list-table-area>
    <promotion-referral-code-use
      v-if="visibleUse"
      :referral-code="referralCodeItem"
      :visible.sync="visibleUse"
    />
  </div>
</template>

<script>
import * as utilService from '@/services/utilService'

import constants from '@/utils/constants'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'
import PromotionTypeRadio from '@/components/promotion-type-radio'
import PromotionReferralCodeUse from '@/components/promotion-referral-code-use'

export default {
  name: 'PromotionRecommendationAdministration',
  components: {
    PromotionChannelCodeSelect,
    PromotionTypeRadio,
    PromotionReferralCodeUse
  },
  data() {
    return {
      visibleUse: false,
      referralCodeItem: '',
      activityId: '', // 所属活动ID
      merchantType: undefined,
      title: this.$t('promotion'),
      platformId: null,
      promotionDictionary: null,
      applyActivityTypeArr: undefined,
      patchGroupModel: 0,
      channelMap: null,
      promType: 8000,
      frontPromTypeArr: {},
      listQuery: {
        // 搜索对象
        obj: {
          bindCellNo: undefined, // 会员所属账号
          referralCode: undefined, // 推荐码
          startTime: undefined, // 推荐码开始时间
          endTime: undefined, // 推荐码结束时间
          channelCode: undefined, // 活动渠道
          createTime: [],
          status: '-1' // 状态
        }
      },
      columns: [
        {
          show: true,
          prop: 'referralCode',
          label: this.$t('推荐码'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'bindCellNo',
          label: this.$t('所属会员登录账号'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'referralCodeThemeId',
          label: this.$t('所属活动ID'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'referralCodeThemeName',
          label: this.$t('所属活动名称'),
          align: 'center'
        },
        {
          show: true,
          prop: 'referralCode',
          label: this.$t('使用渠道'),
          align: 'center',
          formatter: (row, column, cellValue) => {
            return `<span>${this.getChannelName(row.channelCodes)}</span>`
          }
        },
        {
          show: true,
          prop: 'startTime',
          label: this.$t('推荐码有效开始时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'endTime',
          label: this.$t('推荐码有效结束时间'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          label: this.$t('状态'),
          prop: 'statusValue',
          align: 'center'
        }
      ],
      operates: {
        width: 200,
        fixed: 'right',
        list: [
          {
            label: this.$t('使用记录'),
            hidden: (index, row) => {},
            method: (index, row) => {
              this.seeNewTab(row)
            },
            code: 'button003'
          }
        ]
      }
    }
  },
  computed: {
    getActivityStatus() {
      return constants.activityStatus.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    // 取路由promType
  },
  async mounted() {
    this.promotionAPI = this.$promotion.$api.promotion
    this.getChannelMap()

    await this.init()
  },
  methods: {
    // 导出EXCEL
    exportMPTemplate() {
      const params = {
        referralCode: this.listQuery.obj.referralCode,
        loginAccount: this.listQuery.obj.bindCellNo,
        status: this.listQuery.obj.status,
        channelCode: this.listQuery.obj.channelCode
      }
      const {
        createTime: [startTime, endTime]
      } = JSON.parse(JSON.stringify(this.listQuery.obj))
      params.startTime = startTime
      params.endTime = endTime
      this.$portal.downloadFileByGet(
        '/api/back-promotion-web/referralCodeRead/exportReferralCodeList.do',
        params
      )
    },
    updateBtnShow(e) {
      // 促销活动状态为0：待提交或3：审核未通过时按钮显示
      return e.status === 0 || e.status === 3
    },
    resetQuery() {
      this.listQuery.obj = {
        promType: 8000,
        status: '-1',
        patchGroupName: undefined,
        id: undefined,
        createUsername: undefined,
        startTime: null,
        endTime: null,
        channelCode: undefined,
        createTime: []
      }
    },
    /**
     * 获取渠道名称
     * @param channelCodes
     */
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
    /**
     * 获取活动类型名称
     * @param val
     * @returns {string}
     */
    getActivityTypeName(val) {
      if (utilService.isEmpty(val)) {
        return ''
      } else {
        const activityTypeName = utilService.getDictionaryText(
          val,
          this.activityTypeArray
        )
        return activityTypeName
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
    // 是否可写操作
    isHasWriteRoll(e) {
      return e.stockType
    },
    // 查看
    seeNewTab(e) {
      this.referralCodeItem = e.referralCode
      this.visibleUse = true
    },
    async query() {
      const {
        createTime,
        ...params
      } = JSON.parse(JSON.stringify(this.listQuery.obj))
      const [startTime, endTime] = createTime || []
      params.startTime = startTime
      params.endTime = endTime
      const param = {
        obj: this.formHasValue(params)
      }

      return this.$refs.table.getList(param)
    },
    async handleSearchSubmit() {
      await this.query()
    },
    async init() {
      await this.query()
    }
  }
}
</script>

