<template>
  <div class="cms-choose-coupon-set">
    <ody-choose
      v-if="visible"
      :search-config="searchConfig"
      :search-value="searchValue"
      :request-url="requestUrl"
      :columns="columns"
      :search-format="changeParam"
      :selectable-out="selectable"
      :multiple="true"
      :title="$t('选择优惠券活动')"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="startTime" slot-scope="scope">
        {{ scope.row.startTime | parseTime }} - {{ scope.row.endTime | parseTime }}
      </template>
      <template slot="useLimit" slot-scope="scope">
        {{ $t('满') }} {{ scope.row.useLimit }} {{ $t('元可用') }}
      </template>
      <template slot="couponAmount" slot-scope="scope">
        {{ scope.row.couponDiscountType ? `${scope.row.couponAmount}折，折扣上限${scope.row.useUpLimit}元` : scope.row.couponAmount }}
      </template>
    </ody-choose>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      requestUrl: '/cms-web/cmsModule/couponPage',
      searchConfig: [
        {
          label: this.$t('优惠券活动ID'),
          prop: 'id',
          type: 'input'
        },
        {
          label: this.$t('优惠券活动名称'),
          prop: 'themeTitle',
          type: 'input'
        }

      ],
      searchValue: {
        id: '',
        themeTitle: '',
        moduleId: this.moduleId
      },
      columns: [
        {
          label: this.$t('优惠券活动ID'),
          prop: 'refId',
          show: true
        },
        {
          label: this.$t('优惠券活动名称'),
          prop: 'themeTitle',
          show: true
        },
        {
          label: this.$t('券活动日期'),
          slot: 'startTime',
          show: true
        },
        {
          label: this.$t('面值'),
          slot: 'couponAmount',
          show: true
        },
        {
          label: this.$t('使用条件'),
          slot: 'useLimit',
          show: true
        }
      ]
    }
  },
  methods: {
    selectable(row, index) {
      return !row.exist
    },
    changeParam(val) {
      const obj = { ...val }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSubmit(val) {
      if (val.length === 0) {
        return
      }
      const arr = val.map(item => item.refId)
      const params = {
        moduleId: this.moduleId,
        refIdList: arr,
        refType: 13
      }
      await this.$cms.$api.cmsEdit.addCmsModuleRef(params)
      this.$emit('update:visible', false)
      this.$emit('ok')
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
