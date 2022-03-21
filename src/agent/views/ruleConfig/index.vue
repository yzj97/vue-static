<template>
  <section>
    <el-container>
      <!--  <el-header>
        <el-switch v-model="switchOn" :active-text="$t('分销规则设置')" name="switchOn" @change="save()"/>
      </el-header> -->
      <el-main v-if="switchOn">
        <div>
          <el-tabs v-model="activeName" name="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane :label="$t('申请设置')" name="apply">
              <ApplyConfig/>
            </el-tab-pane>
            <el-tab-pane :label="$t('客户关系/分佣设置')" name="com">
              <ComConfig/>
            </el-tab-pane>
            <el-tab-pane :label="$t('提现/抵扣设置')" name="settle">
              <SettleConfig/>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-main>
    </el-container>
  </section>
</template>
<script>
import ApplyConfig from './apply'
import ComConfig from './com'
import SettleConfig from './settle'

export default {
  name: 'AgentRuleConfig',
  components: {
    ApplyConfig,
    ComConfig,
    SettleConfig
  },
  data() {
    return {
      switchOn: true,
      activeName: 'apply'
    }
  },
  async mounted() {
    this.ruleApi = this.$agent.$api.rule
    this.init()
  },
  methods: {
    async init() {
      /* const res = await this.ruleApi.config_getSwitch()
      this.switchOn = res.data */
    },
    async save() {
      const res = await this.ruleApi.config_updateSwitch({ on: this.switchOn })
      this.saving = false
      if (res.success) {
        this.$message.success(this.$t('plMpConfig_save_success'))
      } else {
        this.$message.error(res.message)
      }
    }
  }
}

</script>

<style lang="less">
  .el-row {
    margin-bottom: 5px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .form-label {
    text-align: right;
    padding-right: 20px;
  }
  .tip-text {
    font-size: 8pt;
  }
  .underline {
    text-decoration: underline
  }
  .info_class{
    font-size: 14px;
    height: 20px;
    width: 20px;
    line-height: 20px;
    text-align: center;
    display: inline-block;
    color: #ffffff;
    background-color: #000000;
    border: 1px solid #19A3FF;
    border-radius: 12px;
    margin-left: 10px;
    cursor: pointer;
  }
</style>
