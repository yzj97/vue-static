<template>
  <ody-choose
    v-if="visible"
    :visible="visible"
    :search-config="choose.searchConfig"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="choose.columns"
    :checked="selected"
    :choose-key="chooseKey"
    :multiple="multiple"
    :highlight-current-row="!multiple"
    :title="$t('选择优惠券')"
    :search-format="searchFormat"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="count" slot-scope="scope">
      <ody-number-range
        v-model="scope.row.count"
        :decimal="2"
        name="scope_row_count"
        range="[0, 99999999]"/>
    </template>
    <template slot="couponAmount" slot-scope="scope">
      <template v-if="scope.row.couponDiscountType === 1">
        {{ scope.row.couponDiscount / 10 }}
        {{ scope.row.couponUnit }}
        ，折扣上限{{ scope.row.useUpLimit }}元
      </template>
      <template v-else>
        {{ scope.row.couponAmount }} {{ scope.row.couponUnit }}
      </template>
    </template>
    <template slot="time" slot-scope="scope">
      <div>
        {{ getTime(scope.row) }}
      </div>
    </template>
    <template slot="limit" slot-scope="scope">
      <div>
        {{ scope.row.totalLimit + '/' + scope.row.drawedCoupons }}
      </div>
    </template>
  </ody-choose>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      choose: {
        searchConfig: [
          {
            label: this.$t('优惠券ID'),
            prop: 'id',
            type: 'input'
          },
          {
            label: this.$t('优惠券名称'),
            prop: 'themeTitle',
            type: 'input'
          },
          {
            label: this.$t('优惠券面值'),
            slot: 'count'
          },
          {
            label: this.$t('优惠券有效时间'),
            prop: 'use',
            type: 'date-picker',
            dataProp: ['startTimeConfig', 'endTimeConfig']
          }
        ],
        searchValue: {
          id: '',
          themeTitle: '',
          use: [],
          count: [],
          ...this.params
        },
        requestUrl: '/back-promotion-web/giftRead/querySelectionCouponGiftList.do',
        columns: [
          {
            label: this.$t('优惠券id'),
            prop: 'id',
            show: true,
            minWidth: 150
          },
          {
            label: this.$t('优惠券名称'),
            prop: 'themeTitle',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('面值'),
            slot: 'couponAmount',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('有效时间'),
            slot: 'time',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('每人限领（张）'),
            prop: 'individualLimit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('使用条件（元）'),
            prop: 'useLimit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('总量限制/已发行量'),
            slot: 'limit',
            show: true,
            minWidth: 180
          }

        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    getTime(row) {
      if (row.effdateCalcMethod === 2) {
        return `自用户领取${row.effDays}天失效`
      } else if (row.effdateCalcMethod === 1) {
        return `${this.$portal.parseTime(row.startTimeConfig, '{y}-{m}-{d} {h}:{i}:{s}')}-${this.$portal.parseTime(row.endTimeConfig, '{y}-{m}-{d} {h}:{i}:{s}')}`
      }
    },
    searchFormat(params) {
      var newParams = this.$portal.deepClone(params)
      newParams.couponAmount = newParams.count[0]
      newParams.couponAmountMax = newParams.count[1]
      delete newParams.count
      return newParams
    },
    handleClose() {
      this.$emit('cancel')
    },

    handleSubmit(val) {
      if (val.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择赠品')
        })
        return
      }
      this.$emit('ok', val)
    }
  }
}
</script>
<style lang="less" scoped>
 .box{
    max-height: none !important;
  }
  .cp-tree-select {
    width: 200px;
    display: inline-block;
  }
  .el-select {
    display: inline-block !important;
    vertical-align: inherit !important;
  }
</style>
