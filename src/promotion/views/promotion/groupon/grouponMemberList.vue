<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('订单编号:')" prop="orderCode">
            <el-input
              v-model="search.orderCode"
              :placeholder="$t('请输入拼团单号')"
              name="search_orderCode"
            />
          </ody-search-item>
          <ody-search-item :label="$t('用户ID:')" prop="userId">
            <ody-input-number
              v-model="search.userId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入用户ID')"
              name="search_userId"
              maxlength="16"
              style="width:100%"
              clearable
            />
          </ody-search-item>
          <ody-search-item :label="$t('拼团活动ID:')" prop="themeId">
            <ody-input-number
              v-model="search.themeId"
              :max="9999999999999999"
              :empty-tip="false"
              :placeholder="$t('请输入拼团活动ID')"
              name="search_themeId"
              maxlength="16"
              style="width:100%"
              clearable
            />
            <!-- <ody-date-range-picker v-model="search.gouponId" name="search_gouponId" /> -->
          </ody-search-item>
          <ody-search-item :label="$t('订单状态:')" prop="status">
            <el-select v-model="search.status" :placeholder="$t('全部')" name="search_status">
              <el-option
                v-for="item in platformList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('参团时间:')" :space="2" prop="createTime">
            <ody-date-range-picker
              v-model="search.createTime"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="search_createTime"
              type="datetimer"
            />
          </ody-search-item>
          <ody-search-item :label="$t('渠道:')" prop="channelCode">
            <promotion-channel-code-select
              v-model="search.channelCode"
              :prom-type="search.promType"
              :placeholder="$t('全部')"
              name="search_channelCode"
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
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :can-filter="false"
          request-url="/back-promotion-web/patchGrouponRead/queryGrouponDetailListPG.do"
        >
          <template slot="payWay" slot-scope="scope">网上 支付</template>
          <template slot="status" slot-scope="scope">{{ scope.row.status | keyVal(getPlatformMap) }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import * as utilService from '@/services/utilService'
import PromotionChannelCodeSelect from '@/components/promotion-channel-code-select'

export default {
  name: 'PromGrouponMemberList',
  components: {
    PromotionChannelCodeSelect
  },
  data() {
    return {
      platformList: [
        {
          value: '-1',
          label: this.$t('全部')
        },
        {
          value: '0',
          label: this.$t('未支付')
        },
        {
          value: '2',
          label: this.$t('已取消')
        },
        {
          value: '3',
          label: this.$t('已支付')
        }
      ],
      channelMap: null,
      search: {
        name: '',
        fromDate: undefined,
        endDate: undefined,
        userId: undefined,
        platformId: '',
        createTime: [],
        orderCode: undefined,
        channelCode: undefined,
        promType: 2000,
        themeId: undefined,
        payWay: undefined,
        status: '-1'
      },
      table: {
        columns: [
          {
            label: this.$t('用户ID'),
            prop: 'customerId',
            show: true
          },
          {
            label: this.$t('订单编号'),
            show: true,
            prop: 'orderCode'
          },
          {
            label: this.$t('拼团活动ID'),
            prop: 'refPatchGrouponTheme',
            minWidth: 200,
            show: true
          },
          {
            show: true,
            prop: 'channelCode',
            label: this.$t('渠道'),
            align: 'center',
            minWidth: 200,
            formatter: (row, column, cellValue) => {
              return `<span>${this.getChannelName([row.channelCode])}</span>`
            }
          },
          {
            label: this.$t('参团时间'),
            prop: 'joinTime',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('支付方式'),
            slot: 'payWay',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('状态'),
            slot: 'status',
            minWidth: 200,
            show: true
          }
        ]
      }
    }
  },
  computed: {
    getPlatformMap() {
      return this.platformList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  created() {
    this.promotionAPI = this.$promotion.$api.promotion
  },
  async mounted() {
    await this.loadOscConfig()
    await this.queryPayPlatformList4Coupon()
    await this.queryChannelMap()
    await this.query()
  },
  methods: {
    handleReset() {
      this.formReset('search')
    },
    async query() {
      this.search.createTime = this.search.createTime || []

      const {
        createTime: [fromDate, endDate],
        ...params
      } = JSON.parse(JSON.stringify(this.search))

      params.fromDate = fromDate
      params.endDate = endDate
      const param = {
        obj: this.formHasValue(params)
      }

      return this.$refs.table.getList(param)
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
    async handleSubmit() {
      await this.query()
    },
    async loadOscConfig() {
      this.promotionAPI
        .loadOscConfigUrl('PROMOTION_CHANNEL_CODES')
        .then(response => {
          // 活动类型
          // this.channelMap = response.data.result
        })
    },
    // 渠道
    async queryChannelMap() {
      this.promotionAPI.queryChannelMap().then(response => {
        // 活动类型
        this.channelMap = response.data
      })
    },
    // 获取支付方式
    async queryPayPlatformList4Coupon() {
      this.promotionAPI.queryPayPlatformList4Coupon({}).then(response => {
        // 活动类型
        this.payWays = response.data
      })
    }
  }
}
</script>
