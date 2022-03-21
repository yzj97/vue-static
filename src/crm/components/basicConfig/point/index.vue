<template>
  <div>
    <el-form v-if="config.pointType ==='0' " >
      <el-form-item :label="$t('选择规则类型')" label-width="120px">
        <el-select v-model="active" name="memberSettingForm_memberLevel" style="width:140px;" >
          <el-option
            v-for="i in types"
            :label="i.value"
            :key="i.key"
            :value="i.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form v-if="(config.pointType ==='0' || config.pointType === '1') && active === '1'" ref="form" :model="pointRuleInfoPre" label-width="120px">
      <el-form-item :label="$t('rule_status')">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="pointRuleInfoPre.status"
          :active-text="pointRuleInfoPre.status === 1 ? $t('open') : $t('close')"
          :disabled="!$portal.hasPermission('OuserCenterRuleConfigUpdatePointRuleStatus')"
          name="pointRuleInfo_status"
        />
        <sapn style="margin-left: 30px">{{ $t('point_basic_config_tips') }}</sapn>
      </el-form-item>

      <el-form-item :label="$t('rule_modify')">
        <el-row>
          <sapn>{{ $t('pre_point_tips') }}</sapn>
          <ody-input-number
            v-model="pointRuleInfoPre.paramJson.value"
            :min="1"
            :max="999"
            name="pointRuleInfo_value"
            style="width: 60px;margin-left: 10px;display:inline-block;"
          />
          <el-select
            v-model="pointRuleInfoPre.paramJson.type"
            :placeholder="$t('please_choose')"
            :clearable="false"
            name="pointRuleInfo_type"
            style="width: 100px;margin-left: 10px;display:inline-block;"
          >
            <el-option
              v-for="item in dateTypes"
              :key="item.value"
              :label="item.name"
              :value="item.code"
            />
          </el-select>
          <sapn>{{ $t('deduction_point_tips') }}</sapn>
        </el-row>
      </el-form-item>

      <el-form-item>
        <ody-button
          name="OuserCenterRuleConfigUpdatePonitRule_updatePointRule1"
          size="small"
          type="primary"
          code="OuserCenterRuleConfigUpdatePonitRule"
          @click="updatePointRule"
        >{{ $t('preservation') }}</ody-button>
      </el-form-item>
    </el-form>
    <el-form v-if="(config.pointType ==='0' || config.pointType === '2') && active === '2'" ref="form" :model="pointRuleInfoFixed" label-width="120px">
      <el-form-item :label="$t('rule_status')">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="pointRuleInfoFixed.status"
          :active-text="pointRuleInfoFixed.status === 1 ? $t('open') : $t('close')"
          :disabled="!$portal.hasPermission('OuserCenterRuleConfigUpdatePointRuleStatus')"
          name="pointRuleInfo_status"
        />
        <sapn style="margin-left: 30px">{{ $t('point_basic_config_tips') }}</sapn>
      </el-form-item>

      <el-form-item :label="$t('rule_modify')">
        <el-row>
          <span>{{ $t('在每年的') }}</span>
          <el-date-picker
            v-model="pointRuleInfoFixed.paramJson.value"
            :placeholder="$t('选择日期')"
            name="pointRuleInfoFixed_value"
            format="MM-dd"
            align="right"
            style="display:inline-block;"
            type="date"/>
          <sapn>{{ $t('deduction_fixed_point_tips') }}</sapn>
        </el-row>
      </el-form-item>

      <el-form-item>
        <ody-button
          name="OuserCenterRuleConfigUpdatePonitRule_updatePointRule2"
          size="small"
          type="primary"
          code="OuserCenterRuleConfigUpdatePonitRule"
          @click="updatePointRule"
        >{{ $t('preservation') }}</ody-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [{ key: '1', value: this.$t('阶梯时间扣减') }, { key: '2', value: this.$t('固定时间扣减') }],
      config: {
        pointType: '1'
      },
      // 阶梯
      pointRuleInfoFixed: initPointInfo(),
      pointRuleInfoPre: initPointInfo(),
      dateTypes: [],
      active: '1'
    }
  },
  async mounted() {
    await this.getConfig()
    await this.queryCode()
    await this.getPointRuleInfo()
  },
  methods: {
    getConfig() {
      this.$crm.$api.common.getStringValue({ key: 'poingBasicConfigRule', pool: 'crm' }).then(res => {
        this.config.pointType = res.data
      })
    },
    queryCode() {
      const categorys = {
        categories: ['RULE_BAISC_DATE_UNIT']
      }
      this.$crm.$api.userService.listMulti(categorys).then(resp => {
        this.dateTypes = resp.data['RULE_BAISC_DATE_UNIT']
      })
    },
    updatePointRule() {
      const param = this.active === '1' ? this.pointRuleInfoPre : this.pointRuleInfoFixed
      this.$crm.$api.crmService.updateRule(param).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
        this.getPointRuleInfo()
      })
    },
    getPointRuleInfo() {
      const param = {
        type: 2,
        subType: 0,
        entityType: 1
      }
      this.$crm.$api.crmService.listRulePage(param).then(result => {
        if (result.data.length > 0) {
          result.data.forEach(obj => {
            const param = JSON.parse(obj.param)
            if (param.ruleType === 1) {
              this.pointRuleInfoPre.status = obj.status
              this.pointRuleInfoPre.paramJson = param
            } else {
              this.pointRuleInfoFixed.status = obj.status
              this.pointRuleInfoFixed.paramJson = param
            }
            this.pointRuleInfoPre.id = obj.id
            this.pointRuleInfoPre.paramJson.ruleType = 1
            this.pointRuleInfoFixed.id = obj.id
            this.pointRuleInfoFixed.paramJson.ruleType = 2
            if (obj.status === 1) {
              this.active = param.ruleType.toString()
            }
          })
        }
      })
    }
  }
}

function initPointInfo() {
  return {
    id: null,
    paramJson: {},
    status: null
  }
}

</script>

<style scoped>

</style>
