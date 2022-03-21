<template>
  <section>
    <el-form ref="form" :model="formData" :rules="rules" :inline="true">
      <h3>{{ $t('客户关系') }}</h3>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('关联方式') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.crmRelRegisterOn" :label="$t('register')" name="formData_crmRelRegisterOn"/>
            <el-checkbox v-model="formData.crmRelOrderOn" :label="$t('buyProduct')" name="formData_crmRelOrderOn"/>
          </el-form-item>
        </el-col>
      </el-row>

      <h3>{{ $t('commission_set') }}</h3>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('参与分佣金额') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-radio-group v-model="formData.comAmountType" name="formData_comAmountType">
              <el-radio v-for="(value, key) in dictMap['com_amount_type']" :key="key" :label="parseInt(key)" :disabled="Object.keys(dictMap['com_amount_type']).length === 1">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('冻结佣金计算节点') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-radio-group v-model="formData.comFreezeNode" name="formData_comFreezeNode">
              <el-radio v-for="(value, key) in dictMap['com_freeze_node']" :key="key" :label="parseInt(key)" :disabled="Object.keys(dictMap['com_freeze_node']).length === 1">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('提现佣金计算节点') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-radio-group v-model="formData.comCashNode" name="formData_comCashNode">
              <el-radio v-for="(value, key) in dictMap['com_cash_node']" :key="key" :label="parseInt(key)" :disabled="Object.keys(dictMap['com_cash_node']).length === 1">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            <ody-tip-star :content="$t('commission_type') + ':'"/>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-radio-group v-model="formData.comCalcType" name="formData_comCalcType">
              <el-radio v-for="(value, key) in dictMap['com_calc_type']" :key="key" :label="parseInt(key)" :disabled="Object.keys(dictMap['com_calc_type']).length === 1" @change="onComCaclTypeChange">{{ value }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('分销员自购分佣') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.rewardSelfPurchaseOn" :label="$t('open')" name="formData_rewardSelfPurchaseOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('邀请奖励') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.rewardInviteOn" :label="$t('open')" name="formData_rewardInviteOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('升级奖励') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.rewardUpgradeOn" :label="$t('open')" name="formData_rewardUpgradeOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('二级佣金奖励') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.rewardSecondaryComOn" :label="$t('open')" name="formData_rewardSecondaryComOn"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="labelColSpan" class="form-label">
          <el-form-item>
            {{ $t('附加奖励') + ':' }}
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item>
            <el-checkbox v-model="formData.additionalBonusOn" :label="$t('open')" name="formData_additionalBonusOn"/>
            <el-link v-show="formData.additionalBonusOn" name="showBonusPeriodConfig" class="underline" type="info" @click="showBonusPeriodConfig = true">{{ $t('设置周期') }}</el-link>
          </el-form-item>
        </el-col>
      </el-row>

      <h3>{{ $t('等级设置') }}</h3>
      <Level
        v-if="formData['levels'].length > 0"
        ref="level"
        :loading="loading"
        :com-calc-type-changed="comCalcTypeChanged"
        :data.sync="formData"
        :levels="'levels'"
        :level-con-product-on="'levelConProductOn'"
        :level-con-amount-accum-on="'levelConAmountAccumOn'"
        :level-con-amount-pop-on="'levelConAmountPopOn'"
        :level-con-amount-group-on="'levelConAmountGroupOn'"
        :level-con-invite-on="'levelConInviteOn'"
        :level-con-invite-level-on="'levelInviteLevelSwitchList'"
      />
      <el-row>
        <el-col :span="18" :offset="9">
          <ody-button v-loading.fullscreen.lock="saving" name="AgentRuleConfig309_save" code="AgentRuleConfig309" type="primary" @click="save()">{{ $t('保存') }}</ody-button>
        </el-col>
      </el-row>
    </el-form>

    <ody-dialog
      :visible.sync="showBonusPeriodConfig"
      :append-to-body="true"
      :title="$t('设置周期')"
      width="700px">
      <div slot="content">
        <el-form ref="periodForm" :model="formData" :inline="true">
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-radio v-model="periodType" :label="1" name="periodType" @change="onPeriodTypeChange">{{ $t('固定日期') }}</el-radio>
                <el-select v-show="periodType !== 0" v-model="formData.additionalBonusPeriod" name="formData_additionalBonusPeriod">
                  <el-option :label="$t('日')" :value="1"/>
                  <el-option :label="$t('plRule_timeUnit_week')" :value="2"/>
                  <el-option :label="$t('月')" :value="3"/>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item>
                <el-radio v-model="periodType" :label="0" name="periodType8" @change="onPeriodTypeChange">{{ $t('指定日期') }}</el-radio>
                <el-date-picker v-show="periodType === 0" :picker-options="periodDatePickerOptions" v-model="period" name="period" type="daterange" style="display:inline-block;" @change="onDateChange"/>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="showBonusPeriodConfig6"
          size="small"
          type="primary"
          @click="showBonusPeriodConfig = false"
        >{{ $t('common.confirm') }}</ody-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
import Level from '../level'
import util from '@/utils/util'

export default {
  name: 'RuleConfig',
  components: {
    Level
  },
  data() {
    return {
      labelColSpan: 4,
      loading: false,
      saving: false,
      savedComCalcType: null,
      comCalcTypeChanged: false,
      formData: {},
      rules: {
        crmRelType: [{ required: true, message: this.$t('关联方式') + this.$t('as_required') }]
      },
      dictMap: {},
      showBonusPeriodConfig: false,
      periodType: 1,
      period: [],
      periodPickerOptionsChange: false,
      periodDatePickerOptions: {
        disabledDate: (time) => {
          const curDate = new Date()
          curDate.setHours(0)
          curDate.setMinutes(0)
          curDate.setSeconds(0)
          curDate.setUTCMilliseconds(0)
          return time.getTime() < curDate.getTime()
        }
      }
    }
  },
  async mounted() {
    this.ruleApi = this.$agent.$api.rule
    this.init()
  },
  methods: {
    async init() {
      await this.loadDicts()
      await this.load()
      this.initPeriod()
    },
    initPeriod() {
      this.periodType = 1
      this.period = []
      const startTime = this.formData.additionalBonusStartTime
      const endTime = this.formData.additionalBonusEndTime
      if (startTime != null) {
        this.period[0] = new Date(startTime)
      }
      if (endTime != null) {
        this.period[1] = new Date(endTime)
      }
      if (typeof this.formData.additionalBonusPeriod === 'undefined') {
        this.formData.additionalBonusPeriod = 1
      }
      if (this.formData.additionalBonusPeriod === 0) {
        this.periodType = 0
      }
    },
    onDateChange() {
      if (this.period && this.period.length > 0) {
        this.formData.additionalBonusStartTime = this.period[0]
        this.formData.additionalBonusEndTime = this.period[1]
      } else {
        this.formData.additionalBonusStartTime = null
        this.formData.additionalBonusEndTime = null
      }
      this.periodPickerOptionsChange = true
    },
    onPeriodTypeChange(value) {
      if (value === 0) {
        this.$set(this.formData, 'additionalBonusPeriod', 0)
      } else {
        this.$set(this.formData, 'additionalBonusPeriod', 1)
      }
    },
    onComCaclTypeChange(value) {
      if (this.savedComCalcType !== null) {
        if (this.savedComCalcType === value) {
          this.comCalcTypeChanged = false
        } else {
          util.confirm(this, this.$t('切换分佣方式将在保存时清空各等级销售佣金值设置'), () => {
            this.comCalcTypeChanged = true
          }, () => {
            this.formData.comCalcType = this.savedComCalcType
          })
        }
      }
    },
    loadDicts() {
      const dicts = ['com_reward_type', 'com_amount_type', 'com_freeze_node', 'com_cash_node', 'com_calc_type', 'LEVEL_AGENT']
      return this.$agent.$api.common.code_listMulti({ categories: dicts }).then(res => {
        this.dictMap = res.data
      })
    },
    load() {
      this.loading = true
      return this.ruleApi.config_getLevelConfig().then(res => {
        this.loading = false
        this.formData = res.data
        this.formData.comAmountType = this.formData.comAmountType || 0
        this.formData.comFreezeNode = this.formData.comFreezeNode || 0
        this.formData.comCashNode = this.formData.comCashNode || 0
        this.formData.comCalcType = this.formData.comCalcType || 0
        if (this.formData.additionalBonusPeriod === null) {
          this.formData.additionalBonusPeriod = 1
        }
        this.fillLevelData(this.formData, 'levelInviteLevelSwitchList', 'levels', this.dictMap['LEVEL_AGENT'])

        this.savedComCalcType = this.formData.comCalcType
      })
    },
    fillLevelData(data, levelSwitchListKey, levelsKey, levelDict) {
      const switchList = {}
      for (const p in levelDict) {
        if (parseInt(p) > 1) {
          if (data[levelSwitchListKey] && data[levelSwitchListKey][p] !== null) {
            switchList[p] = data[levelSwitchListKey][p]
          } else {
            switchList[p] = false
          }
        }
      }
      this.$set(data, levelSwitchListKey, switchList)

      const rows = []
      const rowLevels = {}
      if (data[levelsKey]) {
        data[levelsKey].forEach(item => {
          rowLevels[item.level] = item
        })
      }
      for (const p in levelDict) {
        const level = parseInt(p)
        const row = rowLevels[p] || this.createRow(level)

        const items = []
        const levelItems = {}
        if (row.levelItems) {
          row.levelItems.forEach(i => {
            levelItems[i.level] = i
          })
        }

        for (const k in levelDict) {
          if (parseInt(k) > 1) {
            var item = levelItems[k] || {
              level: parseInt(k),
              on: false,
              value: null
            }
            items.push(item)
          }
          row.levelItems = items
        }

        row.name = levelDict[p]
        rows.push(row)
      }
      this.$set(data, levelsKey, rows)
    },
    save() {
      try {
        if (this.$refs['level'] && this.$refs['level'].refresh) {
          this.$refs['level'].refresh()
        }
        // validate data
        if (!this.formData.crmRelRegisterOn && !this.formData.crmRelOrderOn) {
          this.$message.info(this.$t('关联方式') + this.$t('as_required'))
          return
        }
        if (this.formData.additionalBonusOn &&
          (this.periodType === 1 && !this.formData.additionalBonusPeriod ||
          this.periodType === 0 && (!this.formData.additionalBonusStartTime || !this.formData.additionalBonusEndTime))) {
          this.$message.info(this.$t('附加奖励') + this.$t('周期') + this.$t('cant_be_empty'))
          return
        }

        this.$refs.level.validateData()

        if (!this.validateLevelData(this.formData, 'levelInviteLevelSwitchList', 'levels')) {
          return
        }
      } catch (e) {
        console.log(e)
      }
      // Remove level 1
      const submitData = JSON.parse(JSON.stringify(this.formData))
      submitData.levels.splice(0, 1)

      this.saving = true
      this.ruleApi.config_updateLevelConfig(submitData).then(res => {
        this.saving = false
        this.comCalcTypeChanged = false
        if (res.success) {
          this.$message.success(this.$t('plMpConfig_save_success'))
        } else {
          this.$message.error(res.message)
        }
      }, () => { this.saving = false })
    },
    validateLevelData(data, levelSwitchListKey, levelsKey) {
      const switchList = data[levelSwitchListKey]
      const switchOnKeys = ['levelConProductOn', 'levelConAmountAccumOn', 'levelConAmountPopOn', 'levelConAmountGroupOn', 'levelConInviteOn']

      const anySwitchOnChecked = switchOnKeys.some(key => {
        return data[key]
      })
      const inviteLevelOnchecked = Object.keys(switchList).some(item => {
        return switchList[item]
      })
      if (!anySwitchOnChecked && !inviteLevelOnchecked) {
        this.$message.info(this.$t('rank_condition') + this.$t('as_required'))
        return false
      }

      var validated = true
      var vue = this

      const levelSwitchRowMap = {
        levelConProductOn: {
          onKey: 'assignedProductOn',
          name: vue.$t('购买指定商品'),
          validate: (row, rowSwitch) => {
            if (!row.mpIds || row.mpIds.length < 1) {
              vue.$message.info(vue.$t('grade') + row.level + ':' + rowSwitch.name + this.$t('cant_be_empty'))
              return false
            }
            return true
          }
        },
        levelConAmountAccumOn: {
          onKey: 'amountAccumOn',
          valueKey: 'amountAccum',
          name: vue.$t('消费金额累积')
        },
        levelConAmountPopOn: {
          onKey: 'amountSpreadOn',
          valueKey: 'amountSpread',
          name: vue.$t('推广金额累积')
        },
        levelConAmountGroupOn: {
          onKey: 'amountGroupOn',
          valueKey: 'amountGroup',
          name: vue.$t('团队金额累积')
        },
        levelConInviteOn: {
          onKey: 'inviteCountOn',
          valueKey: 'inviteCount',
          name: vue.$t('inviteAgentCount')
        }
      }
      const levels = data[levelsKey]
      for (const key in levelSwitchRowMap) {
        const isSwitchOn = data[key]
        const rowSwitch = levelSwitchRowMap[key]
        let lastLevelValue = -1
        for (let index = 0; index < levels.length; index++) {
          const row = levels[index]
          if (isSwitchOn) {
            const isRowSwitchOn = row[rowSwitch.onKey]
            if (isRowSwitchOn && row.level > 1) {
              if (rowSwitch.validate) {
                validated = rowSwitch.validate.call(this, row, rowSwitch)
              } else {
                var itemValue = row[rowSwitch.valueKey]
                if (!itemValue && itemValue !== 0) {
                  vue.$message.info(vue.$t('grade') + row.level + ':' + rowSwitch.name + this.$t('cant_be_empty'))
                  validated = false
                } else if (Number(lastLevelValue) >= Number(itemValue)) {
                  vue.$message.info(vue.$t('grade') + row.level + ':' + rowSwitch.name + this.$t('必须大于上一级'))
                  validated = false
                }
                lastLevelValue = itemValue
              }
            }
          } else {
            // 开关向下传递
            row[rowSwitch.onKey] = false
          }

          if (!validated) {
            return validated
          }
        }

        if (!validated) {
          return validated
        }
      }

      for (const key in switchList) {
        const level = parseInt(key)
        const isSwitchOn = switchList[key]
        let lastLevelValue = -1
        for (let index = 0; index < levels.length; index++) {
          const row = levels[index]
          for (let i = 0; i < row.levelItems.length; i++) {
            const item = row.levelItems[i]
            if (item.level === level) {
              if (isSwitchOn && item.on && item.level > 1) {
                if (!item.value && item.value !== 0) {
                  vue.$message.info(vue.$t('grade') + row.level + ':' + this.$t('邀请等级') + level + this.$t('agent2') + this.$t('cant_be_empty'))
                  validated = false
                } else if (Number(lastLevelValue) >= Number(item.value)) {
                  vue.$message.info(vue.$t('grade') + row.level + ':' + this.$t('邀请等级') + level + this.$t('agent2') + this.$t('必须大于上一级'))
                  validated = false
                }
                lastLevelValue = item.value
              } else {
                // 开关向下传递
                item.on = false
              }
            }
          }

          if (!validated) {
            return validated
          }
        }

        if (!validated) {
          return validated
        }
      }

      return validated
    },
    chooseProduct() {
      this.showProductModal = true
    },
    onProductOk(productList) {
      this.productList = productList
    },
    createRow(level) {
      return {
        level: level,
        assignedProductOn: true,
        amountAccumOn: true,
        amountAccum: 0,
        amountSpreadOn: true,
        amountSpread: 0,
        amountGroupOn: true,
        amountGroup: 0,
        inviteCountOn: true,
        inviteCount: 0
      }
    }
  }
}

</script>
