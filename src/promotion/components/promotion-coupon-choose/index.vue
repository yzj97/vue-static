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
    :response="handleResponse"
    :highlight-current-row="!multiple"
    :title="$t('添加优惠券')"
    @close="handleClose"
    @submit="handleSubmit"
  />
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
            label: this.$t('券活动名称'),
            prop: 'couponThemeName',
            type: 'input'
          }
        ],
        searchValue: {
          activityId: this.params['promotionId'],
          couponThemeName: '',
          prizeType: 3,
          ...this.params
        },
        requestUrl: '/back-promotion-web/lotteryAwardsRead/queryAwardsProduct.do',
        columns: [
          {
            label: this.$t('优惠券活动id'),
            prop: 'id',
            show: true,
            minWidth: 150
          },
          {
            label: this.$t('优惠券名称'),
            prop: 'themeTitle',
            show: true,
            minWidth: 120
          }
        ]
      }
    }
  },
  mounted() {

  },
  methods: {
    handleResponse(res) {
      if (res && res.data && res.data.listObj) {
        const result = []
        res.data.listObj.forEach(item => {
          const obj = item.couponThemeVO
          if (obj) {
            result.push({ id: obj.id ? obj.id : obj.couponThemeRef, ...obj })
          }
        })
        res.data.listObj = result
      }
      return res
    },
    handleClose() {
      this.$emit('cancel')
    },
    handleSubmit(val) {
      if (val.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择优惠券')
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
