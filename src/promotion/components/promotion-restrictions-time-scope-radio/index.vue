<template>
  <div class="cp-restrictions-time-scope">
    <ody-radio2
      key="promotionGiftRule"
      ref="promotionRestrictionsTimeScopeRadio"
      v-model="promotionRestrictionsTimeScopeRadio.timeScope"
      :selected.sync="selected"
      :clearable="!(selected && selected.disabled)"
      name="promotionRestrictionsTimeScopeRadio_timeScope"
      list-key="timeScopeListMap"
      @change="handleGiftRuleChange">
      <span slot="1" class="gift-limit-box">
        <el-form-item
          :rules="{ required: +promotionRestrictionsTimeScopeRadio.timeScope === 1 && !promotionRestrictionsTimeScopeRadio.startDate4NoLimit, message: $t('请选择规则开始时间'), trigger: 'blur' }"
          prop="startDate4NoLimit"
          class="gift-limit-multy">
          <el-date-picker
            v-model="promotionRestrictionsTimeScopeRadio.startDate4NoLimit"
            :disabled="+promotionRestrictionsTimeScopeRadio.timeScope !== 1"
            :placeholder="$t('选择日期')"
            name="promotionRestrictionsTimeScopeRadio_startDate4NoLimit"
            type="datetime"/>
        </el-form-item>
      </span>
      <span slot="2" class="gift-limit-box">
        <el-form-item
          :rules="{ required: +promotionRestrictionsTimeScopeRadio.timeScope === 2 && !promotionRestrictionsTimeScopeRadio.period, message: $t('请选择周期'), trigger: 'blur' }"
          prop="period"
          class="gift-limit-multy">
          <ody-input-number
            v-model="promotionRestrictionsTimeScopeRadio.period"
            :disabled="+promotionRestrictionsTimeScopeRadio.timeScope !== 2"
            name="promotionRestrictionsTimeScopeRadio_period"
            class="gift-limit-multy">
            <ody-select2 slot="append" v-model="promotionRestrictionsTimeScopeRadio.unit" name="promotionRestrictionsTimeScopeRadio_unit" list-key="unitTypeMap"/>
          </ody-input-number>
        </el-form-item>
      </span>
      <span slot="3" class="gift-limit-box">
        <el-form-item
          :rules="{ required: +promotionRestrictionsTimeScopeRadio.timeScope === 3 && timeViewContent.date4Customize.length === 0, message: $t('请选择自定义期限'), trigger: 'blur' }"
          prop="date4Customize"
          class="gift-limit-multy">
          <el-date-picker
            v-model="timeViewContent.date4Customize"
            :disabled="+promotionRestrictionsTimeScopeRadio.timeScope !== 3"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            name="timeViewContent_date4Customize"
            value-format="yyyy-MM-dd"
            type="datetimerange"
            range-separator="-" />
        </el-form-item>
      </span>
    </ody-radio2>
  </div>
</template>

<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    memberRestrictionObj: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      applicationScopeArr: [],
      defaultContentTypeSelected: [],
      couponDeductionTypeList: [],
      giftPromotion: {
        giftLimit4Multy: undefined,
        promotionGiftRule: undefined
      },
      promotionRestrictionsTimeScopeRadio: {
        timeScope: 1,
        unit: 0,
        period: undefined,
        startDate4Customize: undefined,
        endDate4Customize: undefined,
        startDate4NoLimit: undefined
      },
      timeViewContent: {
        date4Customize: []
      }
    }
  },
  watch: {
    'promotionRestrictionsTimeScopeRadio.startDate4NoLimit': function(val) {
      if (val) {
        this.promotionRestrictionsTimeScopeRadio.startDate4NoLimit = val
      }
      this.$emit('promotionRestrictionsTimeScopeRadio', this.promotionRestrictionsTimeScopeRadio)
    },
    'promotionRestrictionsTimeScopeRadio.period': function(val) {
      if (val) {
        this.promotionRestrictionsTimeScopeRadio.period = val
      }
      this.$emit('promotionRestrictionsTimeScopeRadio', this.promotionRestrictionsTimeScopeRadio)
    },
    'promotionRestrictionsTimeScopeRadio.unit': function(val) {
      if (val) {
        this.promotionRestrictionsTimeScopeRadio.unit = val
      }
      this.$emit('promotionRestrictionsTimeScopeRadio', this.promotionRestrictionsTimeScopeRadio)
    },
    'timeViewContent.date4Customize': function(val) {
      if (val.date4Customize && val.date4Customize.length > 0) {
        this.promotionRestrictionsTimeScopeRadio.startDate4Customize = val.date4Customize[0]
        this.promotionRestrictionsTimeScopeRadio.endDate4Customize = val.date4Customize[1]
      }
      this.$emit('promotionRestrictionsTimeScopeRadio', this.promotionRestrictionsTimeScopeRadio)
      this.$emit('timeViewContent', this.timeViewContent)
    }
  },
  async mounted() {
    await setTimeout(() => {
      this.remote()
    }, 1000)
  },
  methods: {
    async remote() {
      if (this.type === 'edit') {
        if (this.memberRestrictionObj.startDate) {
          this.promotionRestrictionsTimeScopeRadio.startDate4NoLimit = this.$portal.parseTime(this.memberRestrictionObj.startDate, '{y}-{m}-{d}')
        }
        if (this.memberRestrictionObj.endDate) {
          this.promotionRestrictionsTimeScopeRadio.endDate4Customize = this.$portal.parseTime(this.memberRestrictionObj.endDate, '{y}-{m}-{d}')
        }
        if (this.memberRestrictionObj.startDate4Customize && this.memberRestrictionObj.endDate4Customize) {
          this.timeViewContent.date4Customize[0] = this.$portal.parseTime(this.memberRestrictionObj.startDate4Customize, '{y}-{m}-{d}')
          this.timeViewContent.date4Customize[1] = this.$portal.parseTime(this.memberRestrictionObj.endDate4Customize, '{y}-{m}-{d}')
        }
      }
    },
    async getPublicCodeSelect() {
      const { data } = await this.$promotion.$api.promotion.getPublicCodeSelect({
        category: 'ORDER_SOURCE'
      })

      return data
    },
    handleGiftRuleChange(val) {
      if (val === 1) {
        this.promotionRestrictionsTimeScopeRadio.period = null
        this.promotionRestrictionsTimeScopeRadio.unit = null
      }
    },
    unitChange(val) {
      this.promotionRestrictionsTimeScopeRadio.unit = val
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-restrictions-time-scope{
    /deep/ {
      .el-radio {
        display: block;
        margin-bottom: 15px;
      }
    }
    .gift-limit-box {

      /deep/{
        .el-input-group__append {
          width: 128px;
        }
      }
    }
    .gift-limit-multy{
      font-size: 14px;
      width: 180px;
      display: inline-block;
      line-height: 32px;
    }
  }
</style>
