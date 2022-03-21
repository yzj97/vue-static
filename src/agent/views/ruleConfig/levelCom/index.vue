<template>
  <section>
    <ody-dialog
      :visible.sync="visible"
      :title="$t('权限设置')"
      :before-close="handleClose"
      width="900px"
      @open="init"
    >
      <div slot="content">
        <el-row ref="comForm" :model="row" :inline="true">
          <el-row>
            <el-col :span="labelColSpan">
              {{ $t('等级名称') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-input :disabled="true" :value="row.name" />
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="labelColSpan">
              {{ $t('等级权益') }}
            </el-col>
          </el-row>
          <el-row>
            <el-col>
              <el-tabs v-model="activeTab" name="activeTab" type="border-card">
                <el-tab-pane :label="$t('销售佣金')" name="sale">
                  <el-row>
                    <el-col :span="4">
                      <el-form-item>
                        {{ $t('class_a') + $t('销售佣金') + ':' }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input-number
                          :controls="false"
                          :precision="formData.comCalcType === 1 ? 2 : 1"
                          :min="0"
                          :max="formData.comCalcType === 1 ? maxAmount : 50"
                          v-model="saleCom1.primaryCom"
                          name="saleCom1_primaryCom"
                          size="mini"
                        />{{ formData.comCalcType === 1 ? $t('元') : '%' }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-checkbox
                          v-show="formData.additionalBonusOn"
                          v-model="saleCom1.primaryComBonusOn"
                          name="saleCom1_primaryComBonusOn"
                          @change="onBonusSwitchChange('saleBonuses1')"
                        >{{ $t('添加附加奖励') }}</el-checkbox
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4">
                      <LevelBonus
                        v-show="
                          formData.additionalBonusOn &&
                            saleCom1.primaryComBonusOn
                        "
                        ref="saleBonuses1"
                        :bonus-label="'primaryBonuses'"
                        :bonus-type="1"
                        :calc-type="formData.comCalcType"
                        :row.sync="row"
                        :data.sync="saleCom1"
                      />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-row v-show="formData.rewardSecondaryComOn">
                      <el-col :span="4">
                        <el-form-item>
                          {{ $t('二级') + $t('销售佣金') + ':' }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input-number
                            :controls="false"
                            :precision="formData.comCalcType === 1 ? 2 : 1"
                            :min="0"
                            :max="formData.comCalcType === 1 ? maxAmount : 50"
                            v-model="saleCom2.secondaryCom"
                            name="saleCom2_secondaryCom"
                            size="mini"
                          />{{ formData.comCalcType === 1 ? $t('元') : '%' }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item>
                          <el-checkbox
                            v-show="formData.additionalBonusOn"
                            v-model="saleCom2.secondaryComBonusOn"
                            name="saleCom2_secondaryComBonusOn"
                            @change="onBonusSwitchChange('saleBonuses2')"
                          >{{ $t('添加附加奖励') }}</el-checkbox
                          >
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :offset="4">
                        <LevelBonus
                          v-show="
                            formData.additionalBonusOn &&
                              saleCom2.secondaryComBonusOn
                          "
                          ref="saleBonuses2"
                          :bonus-label="'secondaryBonuses'"
                          :bonus-type="2"
                          :calc-type="formData.comCalcType"
                          :row.sync="row"
                          :data.sync="saleCom2"
                        />
                      </el-col>
                    </el-row>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane
                  v-if="formData.rewardInviteOn"
                  :label="$t('邀请佣金')"
                  name="invite"
                >
                  <el-row>
                    <el-col :span="4">
                      <el-form-item>
                        {{ $t('class_a') + $t('邀请佣金') + ':' }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item>
                        <el-input-number
                          :controls="false"
                          :precision="2"
                          :min="0"
                          :max="maxAmount"
                          v-model="inviteCom1.primaryCom"
                          name="inviteCom1_primaryCom"
                          size="mini"
                        />{{ $t('元') }}
                      </el-form-item>
                    </el-col>
                    <el-col :span="3">
                      <el-form-item>
                        <el-checkbox
                          v-show="formData.additionalBonusOn"
                          v-model="inviteCom1.primaryComBonusOn"
                          name="inviteCom1_primaryComBonusOn"
                          @change="onBonusSwitchChange('inviteBonuses1')"
                        >{{ $t('添加附加奖励') }}</el-checkbox
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-col :offset="4">
                      <LevelBonus
                        v-show="
                          formData.additionalBonusOn &&
                            inviteCom1.primaryComBonusOn
                        "
                        ref="inviteBonuses1"
                        :bonus-label="'primaryBonuses'"
                        :bonus-type="1"
                        :row.sync="row"
                        :data.sync="inviteCom1"
                      />
                    </el-col>
                  </el-row>
                  <el-row>
                    <el-row v-show="formData.rewardSecondaryComOn">
                      <el-col :span="4">
                        <el-form-item>
                          {{ $t('二级') + $t('邀请佣金') + ':' }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input-number
                            :controls="false"
                            :precision="2"
                            :min="0"
                            :max="maxAmount"
                            v-model="inviteCom2.secondaryCom"
                            name="inviteCom2_secondaryCom"
                            size="mini"
                          />{{ $t('元') }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item>
                          <el-checkbox
                            v-show="
                              formData.additionalBonusOn &&
                                formData.rewardSecondaryComOn
                            "
                            v-model="inviteCom2.secondaryComBonusOn"
                            name="inviteCom2_secondaryComBonusOn"
                            @change="onBonusSwitchChange('inviteBonuses2')"
                          >{{ $t('添加附加奖励') }}</el-checkbox
                          >
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :offset="4">
                        <LevelBonus
                          v-show="
                            formData.additionalBonusOn &&
                              inviteCom2.secondaryComBonusOn
                          "
                          ref="inviteBonuses2"
                          :bonus-label="'secondaryBonuses'"
                          :bonus-type="2"
                          :row.sync="row"
                          :data.sync="inviteCom2"
                        />
                      </el-col>
                    </el-row>
                  </el-row>
                </el-tab-pane>
                <el-tab-pane
                  v-if="formData.rewardUpgradeOn"
                  :label="$t('升级佣金')"
                  name="upgrade"
                >
                  <div
                    v-for="(value, level) in formData[switchListLabel]"
                    :key="value"
                  >
                    <h3>{{ $t('grade') + level }}</h3>
                    <el-row>
                      <el-col :span="4">
                        <el-form-item>
                          {{ $t('class_a') + $t('升级佣金') + ':' }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="6">
                        <el-form-item>
                          <el-input-number
                            :controls="false"
                            :precision="2"
                            :min="0"
                            :max="maxAmount"
                            v-model="upgradeCom1[level].primaryCom"
                            name="upgradeCom1[level]_primaryCom"
                            size="mini"
                          />{{ $t('元') }}
                        </el-form-item>
                      </el-col>
                      <el-col :span="3">
                        <el-form-item>
                          <el-checkbox
                            v-show="formData.additionalBonusOn"
                            v-model="upgradeCom1[level].primaryComBonusOn"
                            name="upgradeCom1[level]_primaryComBonusOn"
                            @change="
                              onBonusSwitchChange('upgradeBonuses1-' + level)
                            "
                          >{{ $t('添加附加奖励') }}</el-checkbox
                          >
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-col :offset="4">
                        <LevelBonus
                          v-show="
                            formData.additionalBonusOn &&
                              upgradeCom1[level].primaryComBonusOn
                          "
                          :ref="'upgradeBonuses1-' + level"
                          :bonus-label="'primaryBonuses'"
                          :bonus-type="1"
                          :row.sync="row"
                          :data.sync="upgradeCom1[level]"
                        />
                      </el-col>
                    </el-row>
                    <el-row>
                      <el-row v-show="formData.rewardSecondaryComOn">
                        <el-col :span="4">
                          <el-form-item>
                            {{ $t('二级') + $t('升级佣金') + ':' }}
                          </el-form-item>
                        </el-col>
                        <el-col :span="6">
                          <el-form-item>
                            <el-input-number
                              :controls="false"
                              :precision="2"
                              :min="0"
                              :max="maxAmount"
                              v-model="upgradeCom2[level].secondaryCom"
                              name="upgradeCom2[level]_secondaryCom"
                              size="mini"
                            />{{ $t('元') }}
                          </el-form-item>
                        </el-col>
                        <el-col :span="3">
                          <el-form-item>
                            <el-checkbox
                              v-show="
                                formData.additionalBonusOn &&
                                  formData.rewardSecondaryComOn
                              "
                              v-model="upgradeCom2[level].secondaryComBonusOn"
                              name="upgradeCom2[level]_secondaryComBonusOn"
                              @change="
                                onBonusSwitchChange('upgradeBonuses2-' + level)
                              "
                            >{{ $t('添加附加奖励') }}</el-checkbox
                            >
                          </el-form-item>
                        </el-col>
                      </el-row>
                      <el-row>
                        <el-col :offset="4">
                          <LevelBonus
                            v-show="
                              formData.additionalBonusOn &&
                                upgradeCom2[level].secondaryComBonusOn
                            "
                            :ref="'upgradeBonuses2-' + level"
                            :bonus-label="'secondaryBonuses'"
                            :bonus-type="2"
                            :row.sync="row"
                            :data.sync="upgradeCom2[level]"
                          />
                        </el-col>
                      </el-row>
                    </el-row>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-col>
          </el-row>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="AgentRuleConfig310_save"
          code="AgentRuleConfig310"
          size="small"
          type="primary"
          @click="save()"
        >{{ $t('common_save') }}</ody-button
        >
        <el-button
          v-loading="saving"
          name="handleClose"
          size="small"
          @click="handleClose"
        >{{ $t('common_close') }}</el-button
        >
      </span>
    </ody-dialog>
  </section>
</template>
<script>
import LevelBonus from '../levelBonus'

function initUpgradeCom(swithList) {
  const com = {}
  for (const p in swithList) {
    com[p] = {}
  }
  return com
}

export default {
  components: {
    LevelBonus
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    row: {
      type: Object,
      default: () => {
        return {}
      }
    },
    switchListLabel: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      maxAmount: 1000,
      saving: false,
      labelColSpan: 4,
      activeTab: 'sale',
      comList: [],
      saleCom: {},
      saleCom1: {},
      saleCom2: {},
      inviteCom: {},
      inviteCom1: {},
      inviteCom2: {},
      upgradeCom: {},
      upgradeCom1: initUpgradeCom(this.formData[this.switchListLabel]),
      upgradeCom2: initUpgradeCom(this.formData[this.switchListLabel]),
      initailizing: false
    }
  },
  mounted() {
    this.ruleApi = this.$agent.$api.rule
  },
  methods: {
    init() {
      if (this.initailizing) {
        return
      }
      this.initailizing = true
      this.activeTab = 'sale'
      for (const p in this.formData[this.switchListLabel]) {
        this.upgradeCom[p] = this.buildLevelCom(3, this.row, parseInt(p), false, false)
      }
      this.saleCom = this.buildLevelCom(1, this.row, 0, true, false)
      this.inviteCom = this.buildLevelCom(2, this.row, 0, false, false)

      try {
        this.ruleApi.config_getLevelComConfig({ customerType: this.row.customerType, level: this.row.level }).then(res => {
          this.comList = res.data
          this.comList.forEach(item => {
            item.primaryComBonusOn = !!(item.primaryComBonusOn)
            item.secondaryComBonusOn = !!(item.secondaryComBonusOn)
            if (item.comType === 1) {
              this.saleCom = item
            } else if (item.comType === 2) {
              this.inviteCom = item
            } else if (item.comType === 3) {
              this.upgradeCom[item.comLevel] = item
            }
          })

          this.splitLevelCom(this.saleCom, this.saleCom1, this.saleCom2)
          this.splitLevelCom(this.inviteCom, this.inviteCom1, this.inviteCom2)
          for (const p in this.formData[this.switchListLabel]) {
            this.splitLevelCom(this.upgradeCom[p], this.upgradeCom1[p], this.upgradeCom2[p])
          }

          for (const ref in this.$refs) {
            if (this.$refs[ref].init) {
              this.$refs[ref].init.call(ref)
            } else {
              if (this.$refs[ref]['0'] && this.$refs[ref]['0'].init) {
                this.$refs[ref]['0'].init.call(ref)
              }
            }
          }
          this.initailizing = false
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    onBonusSwitchChange(ref) {
      try {
        this.$forceUpdate()
        const bonusRef = this.$refs[ref]
        if (bonusRef.refresh) {
          bonusRef.refresh()
        } else if (bonusRef['0'] && bonusRef['0'].refresh) {
          bonusRef['0'].refresh()
        }
      } catch (e) {
        console.log(e)
      }
    },
    splitLevelCom(item, com1, com2) {
      com1.comType = com2.comType = item.comType
      com1.comLevel = com2.comLevel = item.comLevel
      com1.id = com2.id = item.id
      for (const key in item) {
        if (key.startsWith('primary')) {
          com1[key] = item[key]
        } else if (key.startsWith('secondary')) {
          com2[key] = item[key]
        }
      }
    },
    buildLevelCom(comType, row, comLevel, isPrimaryOn, isSecondaryOn) {
      return {
        customerType: row.customerType,
        level: row.level,
        comType: comType,
        comLevel: comLevel,
        primaryCom: null,
        secondaryCom: null,
        primaryComBonusOn: isPrimaryOn,
        secondaryComBonusOn: isSecondaryOn,
        primaryBonuses: [],
        secondaryBonuses: []
      }
    },
    save() {
      try {
        // refresh bonusData
        this.$forceUpdate()
        for (const ref in this.$refs) {
          if (this.$refs[ref].refresh) {
            this.$refs[ref].refresh.call(ref)
          } else {
            if (this.$refs[ref]['0'] && this.$refs[ref]['0'].refresh) {
              this.$refs[ref]['0'].refresh.call(ref)
            }
          }
        }
        // fix data
        const submitData = []
        submitData.push(this.fixBonusData(this.saleCom, this.saleCom1, this.saleCom2))

        if (this.formData.rewardInviteOn) {
          submitData.push(this.fixBonusData(this.inviteCom, this.inviteCom1, this.inviteCom2))
        }
        if (this.formData.rewardUpgradeOn) {
          for (const p in this.upgradeCom) {
            submitData.push(this.fixBonusData(this.upgradeCom[p], this.upgradeCom1[p], this.upgradeCom2[p]))
          }
        }
        if (this.formData.additionalBonusOn) {
        // validate data
          if (!this.validateBonusData(this.saleCom, this.$t('销售佣金'), -1, -1)) {
            return
          }
          if (this.formData.rewardInviteOn) { // 二级佣金开关开启
            if (!this.validateBonusData(this.inviteCom, this.$t('邀请佣金'), -1, -1)) {
              return
            }
          }
        }

        if (this.formData.rewardUpgradeOn) {
          let minTargetValues = [-1, -1]
          for (const p in this.upgradeCom) {
            minTargetValues = this.validateBonusData(this.upgradeCom[p], this.$t('升级佣金'), minTargetValues[0], minTargetValues[1])
            if (!minTargetValues) {
              return
            }
          }
        }

        submitData.forEach(item => {
          item.bonuses = [].concat(item.primaryBonuses, item.secondaryBonuses)
          delete item.primaryBonuses
          delete item.secondaryBonuses
        })
        // submit data
        this.saving = true
        this.ruleApi.config_updateComLevelRight(submitData).then(res => {
          this.saving = false
          if (res.success) {
            this.$message.success(this.$t('plMpConfig_save_success'))
            this.handleClose()
          } else {
            this.$message.error(res.message)
          }
        }, () => { this.saving = false })
      } catch (e) {
        console.log(e)
      }
    },
    validateBonusData(com, comLabel, minTargetValue1, minTargetValue2) {
      if (com.primaryCom === null) {
        this.$message.info(this.$t('class_a') + comLabel + this.$t('cant_be_empty'))
        return false
      }
      let primaryMinTargetValue = minTargetValue1
      let secondaryMinTargetValue = minTargetValue2
      if (com.primaryComBonusOn) { // 一级附加奖励开关开启
        if (!com.primaryBonuses || com.primaryBonuses.length < 1) {
          this.$message.info(this.$t('class_a') + comLabel + this.$t('附加奖励') + this.$t('cant_be_empty'))
          return false
        } else {
          for (var b = 0; b < com.primaryBonuses.length; b++) {
            const bonus = com.primaryBonuses[b]
            if (!bonus.targetValue || !bonus.addValue) {
              this.$message.info(this.$t('class_a') + comLabel + this.$t('附加奖励') + this.$t('thats_ok') + (parseInt(b) + 1) + ':' + this.$t('值不正确'))
              return false
            }
            if (b === 0) {
              primaryMinTargetValue = bonus.bonus
            } else if (primaryMinTargetValue <= bonus.targetValue) {
              this.$message.info(this.$t('class_a') + comLabel + this.$t('附加奖励') + this.$t('thats_ok') + (parseInt(b) + 1) + ':' + this.$t('推广金额') + this.$t('必须小于上一级'))
              return
            }
            primaryMinTargetValue = bonus.targetValue
          }
        }
      }

      if (this.formData.rewardSecondaryComOn) { // 二级佣金开关开启
        if (com.secondaryCom === null) {
          this.$message.info(this.$t('二级') + comLabel + this.$t('cant_be_empty'))
          return false
        }
        if (com.secondaryComBonusOn) { // 二级附加奖励开关开启
          if (!com.secondaryBonuses || com.secondaryBonuses.length < 1) {
            this.$message.info(this.$t('二级') + comLabel + this.$t('附加奖励') + this.$t('cant_be_empty'))
            return false
          } else {
            console.log(com.secondaryBonuses)
            for (var m = 0; m < com.secondaryBonuses.length; m++) {
              const bonus = com.secondaryBonuses[m]
              if (!bonus.targetValue || !bonus.addValue) {
                this.$message.info(this.$t('二级') + comLabel + this.$t('附加奖励') + this.$t('thats_ok') + (parseInt(m) + 1) + ':' + this.$t('值不正确'))
                return false
              }
              if (m === 0) {
                secondaryMinTargetValue = bonus.targetValue
                console.log(secondaryMinTargetValue)
              } else if (secondaryMinTargetValue <= bonus.targetValue) {
                this.$message.info(this.$t('二级') + comLabel + this.$t('附加奖励') + this.$t('thats_ok') + (parseInt(m) + 1) + ':' + this.$t('推广金额') + this.$t('必须小于上一级'))
                return
              }
              secondaryMinTargetValue = bonus.targetValue
            }
          }
        }
      }
      return [primaryMinTargetValue, secondaryMinTargetValue]
    },
    fixBonusData(com, com1, com2) {
      if (!com1 && !com2) {
        return com
      }
      if (!com2) {
        com2 = {}
      }
      console.log(com, com1, com2)
      if (!this.formData.rewardSecondaryComOn) {
        com2.secondaryComBonusOn = false
        com2.secondaryBonuses = []
      }
      if (!com1.primaryComBonusOn) {
        com1.primaryBonuses = []
      }
      if (!com2.secondaryComBonusOn) {
        com2.secondaryBonuses = []
      }
      return Object.assign(com, com1, com2)
    }
  }
}
</script>
