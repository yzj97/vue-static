<template>
  <div>
    <el-form v-if="config.growthType === '0'">
      <el-form-item :label="$t('选择规则类型')" label-width="120px">
        <el-select
          v-model="active"
          name="memberSettingForm_memberLevel"
          style="width:140px;"
        >
          <el-option
            v-for="i in types"
            :label="i.value"
            :key="i.key"
            :value="i.key"
          />
        </el-select>
      </el-form-item>
    </el-form>
    <el-form
      v-if="
        (config.growthType === '0' || config.growthType === '1') &&
          active === '1'
      "
      ref="form"
      :model="growthRuleInfo"
      label-width="120px"
    >
      <el-form-item :label="$t('rule_status')">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="growthRuleInfo.status"
          :active-text="growthRuleInfo.status === 1 ? $t('open') : $t('close')"
          :disabled="
            !$portal.hasPermission('OuserCenterRuleConfigUpdateGrowthRuleSatus')
          "
          name="growthRuleInfo_status"
        />

        <sapn style="margin-left: 30px">{{
          $t("point_basic_config_tips")
        }}</sapn>
      </el-form-item>

      <el-form-item :label="$t('rule_modify')">
        <sapn>{{ $t("continuous") }}</sapn>
        <sapn style="font-weight:bold">{{ growthRuleInfo.paramJson.value }}</sapn>
        <!-- <span>{{ $t("natural_year") }}</span> -->
        <span>{{ dateMap[growthRuleInfo.paramJson.type] }}</span>
        <sapn>{{ $t("deduction_growth_tips") }}</sapn>
      </el-form-item>

      <el-form-item>
        <ody-button
          name="OuserCenterRuleConfigUpdateGrowthRule_updateGrowthRule1"
          size="small"
          type="primary"
          code="OuserCenterRuleConfigUpdateGrowthRule"
          @click="updateGrowthRule"
        >{{ $t("preservation") }}
        </ody-button>
      </el-form-item>
    </el-form>
    <el-form
      v-if="
        (config.growthType === '0' || config.growthType === '2') &&
          active === '2'
      "
      ref="form"
      :model="growthRuleInfoFixed"
      label-width="120px"
    >
      <el-form-item :label="$t('rule_status')">
        <el-switch
          :active-value="1"
          :inactive-value="0"
          v-model="growthRuleInfoFixed.status"
          :active-text="
            growthRuleInfoFixed.status === 1 ? $t('open') : $t('close')
          "
          :disabled="
            !$portal.hasPermission('OuserCenterRuleConfigUpdateGrowthRuleSatus')
          "
          name="growthRuleInfo_status"
        />

        <sapn style="margin-left: 30px">{{
          $t("point_basic_config_tips")
        }}</sapn>
      </el-form-item>

      <el-form-item :label="$t('rule_modify')">
        <sapn>{{ $t("在每年的") }}</sapn>
        <el-date-picker
          v-model="growthRuleInfoFixed.paramJson.value"
          :placeholder="$t('选择日期')"
          name="pointRuleInfoFixed_value"
          format="MM-dd"
          align="right"
          style="display:inline-block;"
          type="date"
        />
        <sapn>{{ $t("deduction_growth_fixed_tips") }}</sapn>
      </el-form-item>

      <el-form-item>
        <ody-button
          name="OuserCenterRuleConfigUpdateGrowthRule_updateGrowthRule1"
          size="small"
          type="primary"
          code="OuserCenterRuleConfigUpdateGrowthRule"
          @click="updateGrowthRule"
        >{{ $t("preservation") }}
        </ody-button>
      </el-form-item>
    </el-form>
    <ody-title :title="$t('level_info')" />
    <ody-table
      :can-filter="false"
      :data="levelList"
      :columns="levelColumns"
      name="levelList889"
      style="width: 50%"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {
      types: [
        { key: '1', value: this.$t('阶梯时间扣减') },
        { key: '2', value: this.$t('固定时间扣减') }
      ],
      months: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      config: {
        growthType: '1'
      },
      growthRuleInfo: {
        id: null,
        status: null,
        paramJson: {}
      },
      growthRuleInfoFixed: {
        id: null,
        status: null,
        paramJson: {}
      },
      dateTypes: [],
      levelList: [],
      levelColumns: [
        {
          show: true,
          prop: 'levelName',
          label: this.$t('rank_name'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'memberTypeStr',
          label: this.$t('rank_type'),
          align: 'center',
          minWidth: 124
        },
        {
          show: true,
          prop: 'growthValue',
          label: this.$t('required_growth_value'),
          align: 'center',
          minWidth: 124
        }
      ],
      dateMap: {
        day: this.$t('common_unit_day'),
        month: this.$t('month'),
        year: this.$t('natural_year')
      },
      active: '1'
    }
  },
  async mounted() {
    await this.getConfig()
    await this.queryCode()
    await this.getGrowthRuleInfo()
    await this.getLevelList()
  },
  methods: {
    getConfig() {
      this.$crm.$api.common
        .getStringValue({ key: 'growthBasicConfigRule', pool: 'crm' })
        .then(res => {
          this.config.growthType = res.data
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
    updateGrowthRuleStatus(id, status) {
      this.$crm.$api.crmService
        .updateRuleStatus({ id: id, status: status })
        .then(res => {
          if (res.code === '0') {
            this.$message({
              type: 'success',
              message: this.$t('common_update_success')
            })
          }
          this.getGrowthRuleInfo()
        })
    },
    getGrowthRuleInfo() {
      const param = {
        type: 2,
        subType: 0,
        entityType: 2
      }
      const crmService = this.$crm.$api.crmService
      crmService.listRulePage(param).then(result => {
        if (result.data.length > 0) {
          result.data.forEach(obj => {
            const param = JSON.parse(obj.param)
            if (param.ruleType === 1) {
              this.growthRuleInfo.status = obj.status
              this.growthRuleInfo.paramJson = param
            } else {
              this.growthRuleInfoFixed.status = obj.status
              this.growthRuleInfoFixed.paramJson = param
            }
            this.growthRuleInfo.id = obj.id
            this.growthRuleInfo.paramJson.ruleType = 1
            this.growthRuleInfo.paramJson.type = this.growthRuleInfo.type == null ? 'year' : this.growthRuleInfo.type
            this.growthRuleInfo.paramJson.value = this.growthRuleInfo.value == null ? 1 : this.growthRuleInfo.value
            this.growthRuleInfoFixed.id = obj.id
            this.growthRuleInfoFixed.paramJson.ruleType = 2
            if (obj.status === 1) {
              this.active = param.ruleType.toString()
            }
          })
        }
      })
    },
    getLevelList() {
      var param = {
        filters: {
          sort: 2
        }
      }
      const levelService = this.$crm.$api.crmService
      levelService.getUcMembershipLevelList(param).then(result => {
        if (result.code === '0') {
          const data = result.data
          this.levelList = data
          for (var i = 0; i < this.levelList.length; i++) {
            if (this.levelList[i].memberType === 1) {
              this.levelList[i].memberTypeStr = this.$t('ordinary_member')
            }
          }
        }
      })
    },
    updateGrowthRule() {
      const ruleInfo =
        this.active === '1' ? this.growthRuleInfo : this.growthRuleInfoFixed
      // const paramJson = {
      //   value: ruleInfo.value,
      //   type: ruleInfo.type,
      //   ruleType: ruleInfo.ruleType
      // }
      // const pointInfoParam = {
      //   id: ruleInfo.id,
      //   status: ruleInfo.status,
      //   paramJson: paramJson
      // }

      this.$crm.$api.crmService.updateRule(ruleInfo).then(res => {
        if (res.code === '0') {
          this.$message({
            type: 'success',
            message: this.$t('common_update_success')
          })
        }
        this.getGrowthRuleInfo()
      })
    }
  }
}
</script>

<style scoped></style>
