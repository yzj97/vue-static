<template>
  <div class="cp-effdate-method-radio">
    <ody-radio2
      v-if="couponType === 0"
      key="couponThemeViewContent"
      v-model="value"
      :selected.sync="selected"
      name="value"
      list-key="effdateMethodKey"
      @change="handleEffdateMethodChange">
      <span slot="1" class="gift-limit-box">
        <component
          key="timeConfig"
          :is="+value === 1 ? 'el-form-item' : 'div'"
          :rules="[
            { required: +value === 1 && (!timeConfig || timeConfig.length === 0), message: $t('请输入开始和结束时间'), trigger: 'blur' },
            { validator: validateTimeConfig, trigger: 'blur' }
          ]"
          prop="timeConfig"
          class="gift-limit-multy">
          <el-date-picker
            v-model="timeConfig"
            :disabled="+value !== 1"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            name="timeConfig"
            type="datetimerange"
            range-separator="-"
            @change="updateTimeConfig"/>
        </component>
      </span>
      <span slot="2" class="gift-limit-box">
        <component
          key="effDays"
          :is="+value === 2 ? 'el-form-item' : 'div'"
          :rules="{ required: +value === 2 && !effDays, message: $t('请输入1-5位整数'), trigger: 'blur' }"
          prop="effDays"
          class="gift-limit-multy">
          <ody-input-number
            v-model="effDays"
            :disabled="+value !== 2"
            :min="1"
            :max="99999"
            name="effDays"
            class="gift-limit-multy"
          />
          <span>{{ $t('天后失效') }}</span>
        </component>
      </span>
    </ody-radio2>
    <ody-radio2
      v-if="couponType === 1"
      key="couponThemeViewContent1"
      v-model="value"
      :selected.sync="selected"
      name="value7"
      list-key="effdateMethodKeyOne"
      @change="handleEffdateMethodChange">
      <span slot="1" class="gift-limit-box">
        <component
          key="timeConfig2"
          :is="+value === 1 ? 'el-form-item' : 'div'"
          :rules="{ required: +value === 1 && (!timeConfig || timeConfig.length === 0), message: $t('请输入开始和结束时间'), trigger: 'blur' }"
          prop="timeConfig"
          class="gift-limit-multy">
          <el-date-picker
            v-model="timeConfig"
            :disabled="+value !== 1"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            name="timeConfig3"
            type="datetimerange"
            range-separator="-"
            @change="updateTimeConfig"
          />
        </component>
      </span>
    </ody-radio2>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 1
    },
    selected: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    },
    listKey: {
      type: String,
      default: 'isSuperpositionMap'
    },
    timeConfig: {
      type: Array,
      default: () => []
    },
    couponType: {
      type: Number,
      default: 0
    },
    effDays: {
      type: String,
      default: ''
    },
    dataPicker: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      couponThemeViewContent: {
        startTimeConfig: '',
        endTimeConfig: ''
      }
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.$emit('input', newValue)
      }
    },
    effDays: {
      handler(value) {
        this.$emit('update:effDays', value)
      },
      deep: true
    }
  },
  mounted() {
    // console.log(this.effDays)
  },
  methods: {
    validateTimeConfig(rule, value, callback) {
      const { 1: timeConfigEnd } = value || []
      const { 1: dataPickerEnd } = this.dataPicker || []

      if (timeConfigEnd && dataPickerEnd && this.$moment(timeConfigEnd).valueOf() < this.$moment(dataPickerEnd).valueOf()) {
        callback(new Error('券活动结束时间不能大于券结束时间'))
      } else {
        callback()
      }
    },
    updateTimeConfig() {
      this.$emit('update:timeConfig', this.timeConfig)
    },
    handleEffdateMethodChange(val) {
      if (val === 1) {
        this.effDays = null
      }
      if (val === 2) {
        this.timeConfig = []
        this.$emit('update:timeConfig', [])
      }
      this.$emit('update:value', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-effdate-method-radio {
  /deep/ {
    .el-radio {
      display: block;
      margin-bottom: 10px;
    }
  }
  .gift-limit-box {
    /deep/ {
      .el-input-group__append {
        width: 88px;
      }
      .el-form-item__content {
        margin-bottom: 10px;
      }
    }
  }
  .gift-limit-multy {
    font-size: 14px;
    width: 80px;
    display: inline-block;
    line-height: 32px;
  }
}
</style>
