<template>
  <el-col :offset="4">
    <el-form
      ref="form"
      :disabled="disabled"
      :model="paramJson"
      :rules="detailRule"
      :inline="true"
      label-width="120px"
      class="form"
      label-position="right"
    >
      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-checkbox slot="label" v-model="paramJson.birthdayOn" name="paramJson_birthdayOn" @change="onSwitchChange">{{ $t('会员生日回馈') }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            {{ $t('会员消费回馈') }}
          </el-form-item>
        </el-col>
        <el-col :span="10">
          <el-form-item prop="valueForBirthday">
            <el-input-number :placeholder="$t('最多10位正整数位')" v-model="paramJson.valueForBirthday" :controls="false" :precision="0" :min="1" :max="maxAmount" name="paramJson_valueForBirthday" style="width:200px;"/>
            {{ $t('倍积分') }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider direction="horizontal "/>

      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-checkbox slot="label" v-model="paramJson.periodicOn" name="paramJson_periodicOn" @change="onSwitchChange">{{ $t('周期性消费回馈') + ':' }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            {{ $t('effective_date') }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="periodType">
            <el-radio v-model="paramJson.periodType" :label="1" name="paramJson_periodType" @change="onPeriodTypeChange">{{ $t('按周') }}</el-radio>
            {{ $t('each') }}
            <el-select :disabled="paramJson.periodType !== 1" v-model="periodWeek" :clearable="false" name="periodWeek">
              <el-option v-for="(value, key, index) in weekDays" :key="index" :label="value" :value="parseInt(key)"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12" :offset="9">
          <el-form-item>
            <el-radio v-model="paramJson.periodType" :label="2" name="paramJson_periodType5" @change="onPeriodTypeChange">{{ $t('按月') }}</el-radio>
            {{ $t('每个月的') }}
            <el-select :disabled="paramJson.periodType !== 2" v-model="periodDay" :clearable="false" name="periodDay">
              <el-option v-for="(value, key, index) in monthDays" :key="index" :label="value" :value="parseInt(key)"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="5">
          <el-form-item>
            {{ $t('会员消费回馈') }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="valueForPeriodic">
            <el-input-number :placeholder="$t('最多10位正整数位')" v-model="paramJson.valueForPeriodic" :controls="false" :precision="0" :min="1" :max="maxAmount" name="paramJson_valueForPeriodic" style="width:200px;"/>
            {{ $t('倍积分') }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider direction="horizontal "/>

      <el-row>
        <el-col :span="5">
          <el-form-item>
            <el-checkbox slot="label" v-model="paramJson.appointedOn" name="paramJson_appointedOn" @change="onSwitchChange">{{ $t('定时性消费回馈') + ':' }}</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            {{ $t('effective_date') }}
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item prop="appointedDate">
            <el-date-picker :placeholder="$t('请选择') + $t('date,')" :picker-options="periodDatePickerOptions" v-model="paramJson.appointedDate" name="paramJson_appointedDate" value-format="yyyy-MM-dd" type="date" style="display:inline-block;width:200px;"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4" :offset="5">
          <el-form-item>
            {{ $t('会员消费回馈') }}
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item prop="valueForAppointed">
            <el-input-number :placeholder="$t('最多10位正整数位')" v-model="paramJson.valueForAppointed" :controls="false" :precision="0" :min="1" :max="maxAmount" name="paramJson_valueForAppointed" style="width:200px;"/>
            {{ $t('倍积分') }}
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider direction="horizontal "/>

      <el-row>
        <el-col>
          <el-form-item>
            <el-checkbox v-model="paramJson.meantimeTriggerOn" :label="$t('是否同时触发')" name="paramJson_meantimeTriggerOn"/>
            <span class="red">{{ $t('是否与倍数回馈积分规则同步生效，若同步生效则倍数累计') }}</span>
          </el-form-item>
          <el-form-item>
            <ody-checkbox2
              v-if="channelList.length>0"
              v-model="paramJson.channelCodes"
              :is-show-all="true"
              :list="channelList"
              name="paramJson_channelCodes"
              label-key="label"
              value-key="id"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </el-col>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      default: function() {
        return {
          periodType: 1,
          appointedDate: null,
          meantimeTriggerOn: 1,
          channelCodes: [],
          valueForBirthday: null,
          valueForPeriodic: null,
          valueForAppointed: null
        }
      }
    },
    disabled: {
      type: Object,
      default: function() {
        return true
      }
    }
  },
  data() {
    return {
      maxAmount: 100,
      paramJson: {
        periodType: 1
      },
      periodWeek: 1,
      periodDay: 1,
      channelList: [],
      detailRule: {
        valueForBirthday: [{ validator: this.validateValue }],
        valueForPeriodic: [{ validator: this.validateValue }],
        valueForAppointed: [{ validator: this.validateValue }],
        appointedDate: [
          {
            validator: (rule, value, callback) => {
              if (this.paramJson.appointedOn && !value) {
                callback(new Error(this.$t('请输入') + this.$t('effective_date')))
              } else {
                callback()
              }
            }
          }
        ],
        periodType: [
          {
            required: true,
            message: this.$t('请选择') + this.$t('effective_date'),
            trigger: 'change'
          }
        ]
      },
      periodDatePickerOptions: {
        disabledDate: (time) => {
          const curDate = new Date()
          curDate.setHours(0)
          curDate.setMinutes(0)
          curDate.setSeconds(0)
          curDate.setUTCMilliseconds(0)
          return time.getTime() < curDate.getTime()
        }
      },
      weekDays: {
        1: this.$t('common_week_Monday'),
        2: this.$t('common_week_Tuesday'),
        3: this.$t('common_week_Wednesday'),
        4: this.$t('common_weekday_thursday'),
        5: this.$t('common_week_Friday'),
        6: this.$t('common_weekday_saturday'),
        7: this.$t('common_week_Sunday')
      },
      monthDays: {}
    }
  },
  mounted() {
    this.init()

    for (let i = 1; i <= 31; i++) {
      this.monthDays[i] = i + this.$t('号')
    }

    this.paramJson = this.$portal.deepClone(this.param)
    if (!this.paramJson.periodType) {
      this.paramJson.periodType = 1
    }

    if (this.paramJson.periodType === 1) {
      this.periodWeek = this.paramJson.periodDay || 1
    } else {
      this.periodDay = this.paramJson.periodDay || 1
    }

    this.$ouserCenter.$api.growthValueList.queryChannelMap().then(res => {
      const data = res.data
      for (const key in data) {
        this.channelList.push({ id: key, label: data[key].channelName })
      }
    })
  },
  methods: {
    init() {
    },
    getParamJson() {
      this.paramJson.periodDay = this.paramJson.periodType === 1 ? this.periodWeek : this.periodDay
      return this.paramJson
    },
    onPeriodTypeChange() {
      this.$forceUpdate()
    },
    onSwitchChange(value) {
      if (!value) {
        this.$refs['form'].validate()
      }
    },
    validateData() {
      if (!this.paramJson.birthdayOn && !this.paramJson.periodicOn && !this.paramJson.appointedOn) {
        this.$message.info(this.$t('积分反馈') + this.$t('至少选择一项'))
        return false
      }
      return true
    },
    validateValue(rule, value, callback) {
      const onField = rule.field.substring('valueFor'.length).toLowerCase() + 'On'
      if (this.paramJson[onField] && !value) {
        callback(new Error(this.$t('请输入') + this.$t('integral_multiple')))
      } else {
        callback()
      }
    }
  }
}
</script>

<style scoped>
.red {
  color: red;
}
.el-divider--horizontal {
    margin: 5px 0;
}
</style>
