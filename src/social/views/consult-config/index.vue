<template>
  <div>
    <el-tabs v-model="activeName" name="activeName">
      <el-tab-pane :label="$t('咨询')" name="first">
        <b><ody-title :title="$t('发表配置')"/></b>
        <el-form>
          <span>{{ $t('发表用户') }}</span>
          <el-form-item>
            <el-radio v-model="consultConfig.publishConfig.allUser" name="consultConfig_publishConfig_allUser" label="1">{{ $t('全部用户(不含游客)') }}</el-radio><br>
            <el-radio v-model="consultConfig.publishConfig.allUser" name="consultConfig_publishConfig_allUser1" label="0">{{ $t('部分用户') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-radio v-model="consultConfig.publishConfig.allUser" name="consultConfig_publishConfig_allUser6" label="0">{{ $t('购买过该商品用户') }}</el-radio>
          </el-form-item>
        </el-form>
        <b><ody-title :title="$t('内容拦截/审核设置')"/></b>
        <el-form>
          <span>{{ $t('拦截规则') }}</span>
          <el-form-item>
            <el-radio v-model="consultConfig.interceptRuleConfig.allIntercept" name="consultConfig_interceptRuleConfig_allIntercept" label="1">{{ $t('全部拦截') }}</el-radio><br>
            <el-radio v-model="consultConfig.interceptRuleConfig.allIntercept" name="consultConfig_interceptRuleConfig_allIntercept7" label="0">{{ $t('按规则拦截') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="consultConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo" :label="$t('敏感词过滤')" name="consultConfig_interceptRuleConfig_accordRule_sensitiveWordsInterceptBoo"/><br>
            <div style="float: left">
              &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="consultConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo" :label="$t('发表次数大于')" name="consultConfig_interceptRuleConfig_accordRule_publishTime_onOffBoo"/>
              <ody-input-number v-model="consultConfig.interceptRuleConfig.accordRule.publishTime.num" name="consultConfig_interceptRuleConfig_accordRule_publishTime_num"/> /
            </div>
            <el-select v-model="consultConfig.interceptRuleConfig.accordRule.publishTime.timeUnitId" :placeholder="$t('请选择')" name="consultConfig_interceptRuleConfig_accordRule_publishTime_timeUnitId" style="width: 100px;float: left;margin-left: 5px">
              <el-option
                v-for="item in times"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-form>
        <b><ody-title :title="$t('可见用户配置')"/></b>
        <el-form>
          <span>{{ $t('可见用户') }}</span>
          <el-form-item>
            <el-radio v-model="consultConfig.viewUserConfig.allUser" name="consultConfig_viewUserConfig_allUser" label="1">{{ $t('全部用户(含游客)') }}</el-radio><br>
            <el-radio v-model="consultConfig.viewUserConfig.allUser" name="consultConfig_viewUserConfig_allUser8" label="0">{{ $t('部分用户') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="consultConfig.viewUserConfig.loggedUserBoo" :label="$t('登录用户')" name="consultConfig_viewUserConfig_loggedUserBoo"/><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="consultConfig.viewUserConfig.boughtUserBoo" :label="$t('购买过该商品用户')" name="consultConfig_viewUserConfig_boughtUserBoo"/>
          </el-form-item>
        </el-form>
        <div align="center">
          <ody-button name="ConsultAndQaConfigAdd_saveConsultConfig" code="ConsultAndQaConfigAdd" size="small" type="primary" @click="saveConsultConfig()">{{ $t('保存') }}</ody-button>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('问答')" name="second">
        <b><ody-title :title="$t('发表配置')"/></b>
        <el-form>
          <span>{{ $t('发表用户') }}</span>
          <el-form-item>
            <el-radio v-model="questionAnswerConfig.publishConfig.allUser" name="questionAnswerConfig_publishConfig_allUser" label="1">{{ $t('全部用户(不含游客)') }}</el-radio><br>
            <el-radio v-model="questionAnswerConfig.publishConfig.allUser" name="questionAnswerConfig_publishConfig_allUser2" label="0">{{ $t('部分用户') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-radio v-model="questionAnswerConfig.publishConfig.allUser" name="questionAnswerConfig_publishConfig_allUser7" label="0">{{ $t('购买过该商品用户') }}</el-radio>
          </el-form-item>
        </el-form>
        <b><ody-title :title="$t('内容拦截/审核设置')"/></b>
        <el-form>
          <span>{{ $t('拦截规则') }}</span>
          <el-form-item>
            <el-radio v-model="questionAnswerConfig.interceptRuleConfig.allIntercept" name="questionAnswerConfig_interceptRuleConfig_allIntercept" label="1">{{ $t('全部拦截') }}</el-radio><br>
            <el-radio v-model="questionAnswerConfig.interceptRuleConfig.allIntercept" name="questionAnswerConfig_interceptRuleConfig_allIntercept6" label="0">{{ $t('按规则拦截') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="questionAnswerConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo" :label="$t('敏感词过滤')" name="questionAnswerConfig_interceptRuleConfig_accordRule_sensitiveWordsInterceptBoo"/><br>
            <div style="float: left">
              &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo" :label="$t('发表次数大于')" name="questionAnswerConfig_interceptRuleConfig_accordRule_publishTime_onOffBoo"/>
              <ody-input-number v-model="questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.num" name="questionAnswerConfig_interceptRuleConfig_accordRule_publishTime_num"/> /
            </div>
            <el-select v-model="questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.timeUnitId" :placeholder="$t('请选择')" name="questionAnswerConfig_interceptRuleConfig_accordRule_publishTime_timeUnitId" style="width: 100px;float: left;margin-left: 5px">
              <el-option
                v-for="item in times"
                :key="item.code"
                :label="item.name"
                :value="item.code" />
            </el-select>
          </el-form-item>
        </el-form>
        <b><ody-title :title="$t('可见用户配置')"/></b>
        <el-form>
          <span>{{ $t('可见用户') }}</span>
          <el-form-item>
            <el-radio v-model="questionAnswerConfig.viewUserConfig.allUser" name="questionAnswerConfig_viewUserConfig_allUser" label="1">{{ $t('全部用户(含游客)') }}</el-radio><br>
            <el-radio v-model="questionAnswerConfig.viewUserConfig.allUser" name="questionAnswerConfig_viewUserConfig_allUser0" label="0">{{ $t('部分用户') }}</el-radio><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="questionAnswerConfig.viewUserConfig.loggedUserBoo" :label="$t('登录用户')" name="questionAnswerConfig_viewUserConfig_loggedUserBoo"/><br>
            &nbsp;&nbsp;&nbsp;&nbsp;<el-checkbox v-model="questionAnswerConfig.viewUserConfig.boughtUserBoo" :label="$t('购买过该商品用户')" name="questionAnswerConfig_viewUserConfig_boughtUserBoo"/>
          </el-form-item>
        </el-form>
        <b><ody-title :title="$t('回复配置')"/></b>
        <el-form>
          <span>{{ $t('回复模式') }}</span>
          <el-form-item>
            <el-radio v-model="questionAnswerConfig.replyConfig.replyMode.singleMode" name="questionAnswerConfig_replyConfig_replyMode_singleMode" label="1">{{ $t('单次回复') }}</el-radio>
          </el-form-item>
          <span>{{ $t('回复人') }}</span>
          <el-form-item>
            <el-checkbox v-model="questionAnswerConfig.replyConfig.replyUser.collectUserBoo" :label="$t('添加收藏用户')" name="questionAnswerConfig_replyConfig_replyUser_collectUserBoo"/>
            <el-input v-model="questionAnswerConfig.replyConfig.replyUser.collectUserNum" name="questionAnswerConfig_replyConfig_replyUser_collectUserNum" style="width: 150px"/>
          </el-form-item>
        </el-form>
        <div align="center">
          <ody-button name="ConsultAndQaConfigAdd_saveQuestionAnswerConfig" code="ConsultAndQaConfigAdd" size="small" type="primary" @click="saveQuestionAnswerConfig()">{{ $t('保存') }}</ody-button>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: 'SocialConsultConfig',
  data() {
    return {
      time: '',
      times: [],
      activeName: 'first',
      checkList: [],
      num: '',
      checked: false,
      consultConfig: {
        publishConfig: {
          allUser: '0'
        },
        interceptRuleConfig: {
          allIntercept: '0',
          accordRule: {
            publishTime: {},
            sensitiveWordsInterceptBoo: false
          }
        },
        viewUserConfig: {
          allUser: '0',
          loggedUserBoo: false,
          boughtUserBoo: false
        }
      },
      questionAnswerConfig: {
        publishConfig: {
          allUser: '0'
        },
        interceptRuleConfig: {
          allIntercept: '0',
          accordRule: {
            publishTime: {},
            sensitiveWordsInterceptBoo: false
          }
        },
        viewUserConfig: {
          allUser: '0',
          loggedUserBoo: false,
          boughtUserBoo: false
        },
        replyConfig: {
          replyUser: {
            collectUser: 0,
            collectUserBoo: false,
            collectUserNum: 0
          },
          replyMode: {
            singleMode: '1'
          }
        }
      }
    }
  },
  watch: {
    'consultConfig.interceptRuleConfig.allIntercept': {
      handler() {
        if (this.consultConfig.interceptRuleConfig.allIntercept === '1') {
          this.consultConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo = false
          this.consultConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo = false
          this.consultConfig.interceptRuleConfig.accordRule.publishTime.num = 0
        }
      }
    },
    'consultConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo': {
      handler() {
        if (this.consultConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo) {
          this.consultConfig.interceptRuleConfig.allIntercept = '0'
        }
      }
    },
    'consultConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo': {
      handler() {
        if (this.consultConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo) {
          this.consultConfig.interceptRuleConfig.allIntercept = '0'
        }
      }
    },
    'questionAnswerConfig.interceptRuleConfig.allIntercept': {
      handler() {
        if (this.questionAnswerConfig.interceptRuleConfig.allIntercept === '1') {
          this.questionAnswerConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo = false
          this.questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo = false
        }
      }
    },
    'questionAnswerConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo': {
      handler() {
        if (this.questionAnswerConfig.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo) {
          this.questionAnswerConfig.interceptRuleConfig.allIntercept = '0'
        }
      }
    },
    'questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo': {
      handler() {
        if (this.questionAnswerConfig.interceptRuleConfig.accordRule.publishTime.onOffBoo) {
          this.questionAnswerConfig.interceptRuleConfig.allIntercept = '0'
        }
      }
    },
    'consultConfig.viewUserConfig.allUser': {
      handler() {
        if (this.consultConfig.viewUserConfig.allUser === '1') {
          this.consultConfig.viewUserConfig.loggedUserBoo = false
          this.consultConfig.viewUserConfig.boughtUserBoo = false
        }
      }
    },
    'consultConfig.viewUserConfig.loggedUserBoo': {
      handler() {
        if (this.consultConfig.viewUserConfig.loggedUserBoo) {
          this.consultConfig.viewUserConfig.allUser = '0'
        }
      }
    },
    'consultConfig.viewUserConfig.boughtUserBoo': {
      handler() {
        if (this.consultConfig.viewUserConfig.boughtUserBoo) {
          this.consultConfig.viewUserConfig.allUser = '0'
        }
      }
    },
    'questionAnswerConfig.viewUserConfig.allUser': {
      handler() {
        if (this.questionAnswerConfig.viewUserConfig.allUser === '1') {
          this.questionAnswerConfig.viewUserConfig.loggedUserBoo = false
          this.questionAnswerConfig.viewUserConfig.boughtUserBoo = false
        }
      }
    },
    'questionAnswerConfig.viewUserConfig.loggedUserBoo': {
      handler() {
        if (this.questionAnswerConfig.viewUserConfig.loggedUserBoo) {
          this.questionAnswerConfig.viewUserConfig.allUser = '0'
        }
      }
    },
    'questionAnswerConfig.viewUserConfig.boughtUserBoo': {
      handler() {
        if (this.questionAnswerConfig.viewUserConfig.boughtUserBoo) {
          this.questionAnswerConfig.viewUserConfig.allUser = '0'
        }
      }
    }
  },
  async mounted() {
    this.initCode()
    try {
      this.socialApi = this.$social.$api.socialApi
      await this.handleQuery(true, true)
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    initCode() {
      this.$social.$api.common.listMultiCode({
        categories: [
          'TIMES_FOR_SELECT'
        ]
      }).then(res => {
        res.data.TIMES_FOR_SELECT.forEach(item => {
          this.times.push({ code: +item.code, name: item.name })
        })
      })
    },
    handleQuery(flag1, flag2) {
      if (flag1) {
        this.socialApi.getConsultConfig().then(
          res => {
            if (res.data.value && res.data.value.length > 0) {
              const value = JSON.parse(res.data.value)
              this.handleResultValue(value)
              this.consultConfig = value
            }
          }
        )
      }
      if (flag2) {
        this.socialApi.getQuestionAnswerConfig().then(
          res => {
            if (res.data.value && res.data.value.length > 0) {
              const value = JSON.parse(res.data.value)
              this.handleResultValue(value)
              this.questionAnswerConfig = value
            }
          }
        )
      }
    },
    handleResultValue(value) {
      value.publishConfig.allUser = value.publishConfig.allUser.toString()
      value.publishConfig.boughtUser = value.publishConfig.boughtUser.toString()
      value.interceptRuleConfig.allIntercept = value.interceptRuleConfig.allIntercept.toString()
      value.interceptRuleConfig.accordRule.sensitiveWordsIntercept = value.interceptRuleConfig.accordRule.sensitiveWordsIntercept.toString()
      value.interceptRuleConfig.accordRule.publishTime.onOff = value.interceptRuleConfig.accordRule.publishTime.onOff.toString()
      value.interceptRuleConfig.accordRule.publishTime.onOffBoo = value.interceptRuleConfig.accordRule.publishTime.onOff === '1'
      value.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo = value.interceptRuleConfig.accordRule.sensitiveWordsIntercept === '1'
      value.viewUserConfig.allUser = value.viewUserConfig.allUser.toString()
      value.viewUserConfig.loggedUser = value.viewUserConfig.loggedUser.toString()
      value.viewUserConfig.boughtUser = value.viewUserConfig.boughtUser.toString()
      value.viewUserConfig.loggedUserBoo = value.viewUserConfig.loggedUser === '1'
      value.viewUserConfig.boughtUserBoo = value.viewUserConfig.boughtUser === '1'
      if (value.replyConfig) {
        value.replyConfig.replyUser.collectUser = value.replyConfig.replyUser.collectUser.toString()
        value.replyConfig.replyUser.collectUserBoo = value.replyConfig.replyUser.collectUser === '1'
        value.replyConfig.replyUser.boughtUser = value.replyConfig.replyUser.boughtUser.toString()
        value.replyConfig.replyMode.singleMode = value.replyConfig.replyMode.singleMode.toString()
      }
    },
    handleSubmitData(data, flag) {
      const newData = {
        publishConfig: {
          allUser: data.publishConfig.allUser === '1' ? 1 : 0,
          boughtUser: data.publishConfig.allUser === '0' ? 1 : 0
        },
        interceptRuleConfig: {
          allIntercept: data.interceptRuleConfig.allIntercept === '1' ? 1 : 0,
          accordRule: {
            publishTime: {
              num: data.interceptRuleConfig.accordRule.publishTime.num,
              timeUnitId: data.interceptRuleConfig.accordRule.publishTime.timeUnitId,
              onOff: data.interceptRuleConfig.accordRule.publishTime.onOffBoo ? 1 : 0
            },
            sensitiveWordsIntercept: data.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo ? 1 : 0
          }
        },
        viewUserConfig: {
          allUser: data.viewUserConfig.allUser === '1' ? 1 : 0,
          loggedUser: data.viewUserConfig.loggedUserBoo ? 1 : 0,
          boughtUser: data.viewUserConfig.boughtUserBoo ? 1 : 0
        }
      }
      if (!flag) {
        newData.replyConfig = {
          replyUser: {
            collectUser: data.replyConfig.replyUser.collectUserBoo ? 1 : 0,
            boughtUserNum: 0,
            boughtUserNoReturnNum: 0,
            boughtStartTime: '',
            goodPraiseNum: 0,
            boughtNoReturnStartTime: '',
            collectUserNum: data.replyConfig.replyUser.collectUserNum,
            loggedUser: true,
            boughtUserNoReturn: 0,
            loggedUserNum: 1,
            boughtUser: 0,
            boughtEndTime: '',
            goodPraise: 0,
            boughtNoReturnEndTime: ''
          },
          replyMode: {
            singleMode: data.replyConfig.replyMode.singleMode === '1' ? 1 : 0
          }
        }
      }
      return newData
    },
    saveConsultConfig() {
      const valid = this.validateSubmitData(this.consultConfig, true)
      if (!valid) {
        return false
      }
      const data = this.handleSubmitData(this.consultConfig, true)
      this.socialApi.updateConsultAndQaConfig({ consultConfig: JSON.stringify(data) }).then(
        res => {
          if (res.code === '0') {
            this.$alert(this.$t('保存成功'), this.$t('小贴士'))
          }
          this.handleQuery(true, false)
        }
      )
    },
    saveQuestionAnswerConfig() {
      const valid = this.validateSubmitData(this.questionAnswerConfig, false)
      if (!valid) {
        return false
      }
      const data = this.handleSubmitData(this.questionAnswerConfig, false)
      this.socialApi.updateConsultAndQaConfig({ qaConfig: JSON.stringify(data) }).then(
        res => {
          if (res.code === '0') {
            this.$alert(this.$t('保存成功'), this.$t('小贴士'))
          }
          this.handleQuery(false, true)
        }
      )
    },
    validateSubmitData(value, flag) {
      const valid = true
      if (value.interceptRuleConfig.allIntercept === '0') {
        if (!value.interceptRuleConfig.accordRule.sensitiveWordsInterceptBoo && !value.interceptRuleConfig.accordRule.publishTime.onOffBoo) {
          this.$alert(this.$t('按规则拦截 配置至少勾选一项'), this.$t('提醒'))
          return false
        }
        if (value.interceptRuleConfig.accordRule.publishTime.onOffBoo) {
          const r = /^\+?[1-9][0-9]*$/
          if (!value.interceptRuleConfig.accordRule.publishTime.timeUnitId) {
            this.$alert(this.$t('发表次数没有填写'), this.$t('提醒'))
            return false
          }
          if (!r.test(value.interceptRuleConfig.accordRule.publishTime.num)) {
            this.$alert(this.$t('发表次数没有填写'), this.$t('提醒'))
            return false
          }
        }
      }
      if (value.viewUserConfig.allUser === '0') {
        if (!value.viewUserConfig.loggedUserBoo && !value.viewUserConfig.boughtUserBoo) {
          this.$alert(this.$t('部分用户 配置至少勾选一项'), this.$t('提醒'))
          return false
        }
      }
      if (!flag) {
        if (!value.replyConfig.replyUser.collectUserBoo) {
          this.$alert(this.$t('回复人 配置至少勾选一项'), this.$t('提醒'))
          return false
        }
        const r = /^\+?[1-9][0-9]*$/
        if (!r.test(value.replyConfig.replyUser.collectUserNum)) {
          this.$alert(this.$t('添加收藏用户数量必填，且必须是大于0的正整数'), this.$t('提醒'))
          return false
        }
        if (value.replyConfig.replyMode.singleMode !== '1') {
          this.$alert(this.$t('请选择回复模式'), this.$t('提醒'))
          return false
        }
      }
      return valid
    }
  }
}
</script>

<style scoped>

</style>
