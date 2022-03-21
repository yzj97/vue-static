<template>
  <div>
    <ody-choose
      :visible.sync="visible"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :highlight-current-row="false"
      :search-format="searchFormat"
      :title="$t('推荐码使用记录')"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    referralCode: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestUrl: '/back-promotion-web/referralCodeRead/queryReferralCodeUseRecord.action',
      searchConfig: [
        {
          label: this.$t('应用订单号'),
          prop: 'orderCode',
          type: 'input'
        },
        {
          label: this.$t('用户'),
          prop: 'cellNo',
          type: 'input'
        }

      ],
      searchValue: {
        orderCode: '',
        cellNo: ''
      },
      columns: [
        {
          label: this.$t('应用订单号'),
          prop: 'orderCode',
          show: true,
          minWidth: 120
        },
        {
          label: this.$t('推荐码'),
          show: true,
          minWidth: 120,
          prop: 'referralCode'
        },
        {
          label: this.$t('用户'),
          prop: 'cellNo',
          minWidth: 120, show: true
        },
        {
          label: this.$t('订单金额'),
          prop: 'orderAmount',
          minWidth: 120, show: true
        },
        {
          label: this.$t('使用时间'),
          prop: 'useTime',
          minWidth: 120, show: true
        }
      ]
    }
  },
  methods: {
    searchFormat(params) {
      return {
        obj: { ...params, referralCode: this.referralCode }
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    handleSubmit() {
      this.handleClose()
    }
  }
}
</script>
