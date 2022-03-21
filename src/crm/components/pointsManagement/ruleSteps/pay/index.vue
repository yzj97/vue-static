<template>
  <el-col :span="14" :offset="8">
    <el-form
      ref="form"
      :disabled="disabled"
      :model="paramJson"
      :rules="detailRule"
      label-width="140px"
      class="form"
      label-position="right"
    >
      <el-form-item :label="$t('订单抵扣规则')+':'" prop="value">
        <el-row>
          <span>{{ '1' }}</span>
          <el-select
            v-model="paramJson.unitType"
            :placeholder="$t('请选择')"
            name="paramJson_type"
            style="width: 70px;display:inline-block">
            <el-option
              v-for="item in payRuleUnit"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <span>{{ '=' }}</span>
          <el-input v-model="paramJson.value" name="paramJson_value" style="margin-left:10px;width: 120px" maxlength="10" />
          <span style="margin-left: 10px">{{ $t('积分') }}</span>

        </el-row>
      </el-form-item>
      <el-form-item :label="$t('订单消耗上限金额')+':'" prop="max">
        <el-row>
          <el-col :span="5">
            <el-input v-model="paramJson.max" name="paramJson_max" style="margin-left:10px;width: 120px" maxlength="10" />
          </el-col>
          <el-col :span="10">
            <el-select v-model="paramJson.type" :placeholder="$t('请选择')" name="paramJson_type" style="width: 160px">
              <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-col>
        </el-row>
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
          style="transform:translateX(-140px);"
        />
      </el-form-item>
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
          max: null,
          type: 2,
          value: null,
          channelCodes: []
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
      paramJson: {},
      channelList: [],
      types: [
        { value: 2, label: '%(' + this.$t('金额百分比') + ')' },
        { value: 1, label: this.$t('元') }
      ],
      payRuleUnit: [],
      detailRule: {
        value: [{ validator: this.checkValue, trigger: 'change' }],
        max: [
          {
            required: true,
            message: this.$t('请输入金额数量'),
            trigger: 'change'
          },
          {
            pattern: /^[1-9][0-9]{0,9}$/,
            message:
              this.$t('请输入1－1000000000之间的整数'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.$crm.$api.common.getStringValue({ key: 'payRuleUnit', pool: 'crm' }).then(res => {
      this.payRuleUnit = JSON.parse(res.data)
    })
    this.paramJson = this.$portal.deepClone(this.param)
    this.$crm.$api.growthValueList.queryChannelMap().then(res => {
      const data = res.data
      for (const key in data) {
        this.channelList.push({ id: key, label: data[key].channelName })
      }
    })
  },
  methods: {
    getParamJson() {
      return this.paramJson
    },
    checkValue(rule, value, callback) {
      if (!this.paramJson.value || this.paramJson.value === '') {
        return callback(new Error(this.$t('请输入积分数量')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(this.paramJson.value)) {
        return callback(new Error(this.$t('最大') + '10' + this.$t('位正整数')))
      }
      if (!this.paramJson.unitType) {
        return callback(new Error(this.$t('请选择单位')))
      }
      return callback()
    }
  }
}
</script>

<style scoped>
</style>
