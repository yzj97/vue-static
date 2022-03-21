<template>
  <el-card>
    <el-container>
      <el-main>
        <el-form
          ref="form"
          :disabled="!add && !edit"
          :model="growthRule"
          label-width="100px"
          class="form">
          <el-row>
            <el-form-item
              :rules="[{ required: true, message: this.$t('请选择规则类型') }]"
              :label="$t('规则类型:')"
              prop="subType">
              <el-select v-model="growthRule.subType" :disabled="!add" :placeholder="$t('请选择')" name="growthRule_subType" style="width: 150px">
                <el-option v-for="item in subTypes" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :rules="[
                { required: true, message: this.$t('请输入规则名称'), trigger: 'change' }
              ]"
              :label="$t('规则名称:')"
              prop="name">
              <el-input
                v-model="growthRule.name"
                name="growthRule_name"
                style="width: 150px"
                maxlength="50"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :rules="[
                { required: true, message: this.$t('请选择渠道'), trigger: 'change' }
              ]"
              :label="$t('渠道:')"
              style="width: 100%"
              prop="channelCodes">
              <ody-checkbox2
                v-if="channelList.length>0"
                v-model="growthRule.channelCodes"
                :list="channelList"
                :is-show-all="true"
                name="growthRule_channelCodes"
                label-key="label"
                value-key="id"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :rules="[
                { required: true, message: this.$t('请选择会员类型'), trigger: 'change' }
              ]"
              :label="$t('会员类型:')"
              prop="memberTypes">
              <ody-checkbox2
                v-if="memberTypes.length>0"
                v-model="growthRule.memberTypes"
                :is-show-all="true"
                :list="memberTypes"
                name="growthRule_memberTypes"
                label-key="name"
                value-key="type"/>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :rules="[
                { required: true, message: this.$t('请输入规则内容') },
                { pattern: /^[1-9][0-9]{0,2}$/, message: this.$t('最大') + '3' + this.$t('位正整数'), trigger: 'change' }
              ]"
              :label="$t('规则内容:')"
              class="num-input"
              style="width: 100%"
              prop="value">
              <ody-input-number v-model="growthRule.value" :min="1" :max="999" name="growthRule_value">
                <template slot="prepend">{{ $t('每笔订单获得消费金额') }}</template>
                <template slot="append">{{ '%'+$t('成长值') }}</template>
              </ody-input-number>
            </el-form-item>
          </el-row>
        </el-form>
        <div style="text-align: center;">
          <ody-button v-if="!disabled" name="OuserCenterGrowthValueListSave_save" code="OuserCenterGrowthValueListSave" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
          <el-button v-if="!disabled" name="cancel" size="small" type="primary" @click="cancel">{{ $t('取消') }}</el-button>
          <el-button v-if="disabled" name="cancel9" size="small" type="primary" @click="cancel">{{ $t('关闭') }}</el-button>
        </div>
      </el-main>

    </el-container>

  </el-card>
</template>

<script>
export default {
  data() {
    return {
      memberTypes: [],
      subTypes: [],
      channelList: [],
      growthRule: {
        name: null,
        channelCodes: [],
        memberTypes: [],
        value: null,
        subType: null
      },
      add: false,
      edit: false
    }
  },
  async mounted() {
    await this.$crm.$api.growthValueList.queryChannelMap().then((res) => {
      const data = res.data
      for (const key in data) {
        this.channelList.push({ id: key, label: data[key].channelName })
      }
    })
    await this.$crm.$api.crmService.listMemberType({}).then(res => {
      this.memberTypes = res.data
    })
    await this.$crm.$api.userService.configListMulti({
      categorys: ['GROWTH_RULE_TYPE'],
      pool: 'crm'
    }).then(resp => {
      if (resp.data['GROWTH_RULE_TYPE']) {
        const subTypes = []
        for (const i in resp.data['GROWTH_RULE_TYPE']) {
          subTypes.push({
            value: i,
            label: resp.data['GROWTH_RULE_TYPE'][i]
          })
        }
        this.subTypes = subTypes
      }
    })
    await this.init()
  },
  methods: {
    async init() {
      if (this.$route.query.add.toString() === '1') {
        this.add = true
      } else {
        this.edit = this.$route.query.edit.toString() === '1'
        this.$crm.$api.crmService.getPointRuleById({ id: this.$route.query.id }).then(res => {
          const parse = JSON.parse(res.data.param)
          this.growthRule = {
            name: res.data.name,
            id: res.data.id,
            subType: res.data.type.toString() + '_' + res.data.subType.toString(),
            channelCodes: parse.channelCodes,
            memberTypes: parse.memberTypes,
            value: parse.value
          }
        })
      }
    },
    async save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const {
            subType,
            channelCodes,
            memberTypes,
            value,
            ...params
          } = this.growthRule
          const sp = subType.split('_')
          params.type = sp[0]
          params.subType = sp[1]
          params.entityType = 2
          params.paramJson = {
            channelCodes: channelCodes,
            memberTypes: memberTypes,
            value: value
          }
          if (this.add) {
            this.$crm.$api.crmService.addRule(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('新增成功')
              })
              this.cancel()
            })
          } else {
            this.$crm.$api.crmService.updateRule(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('保存成功')
              })
              this.cancel()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    formValidate() {
      if (!this.growthRule.subType) {
        return this.$t('请选择规则类型')
      }

      if (!this.growthRule.name || this.growthRule.name === '') {
        return this.$t('请输入规则名称')
      }

      if (this.growthRule.paramJson.channelCodes.length <= 0) {
        return this.$t('请选择渠道')
      }

      if (this.growthRule.paramJson.memberTypes.length <= 0) {
        return this.$t('请选择会员类型')
      }

      if (!this.growthRule.paramJson.value || !/^[0-9]{1,3}$/.test(this.growthRule.paramJson.value)) {
        return this.$t('请输入规则内容') + this.$t('支持') + '0-999'
      }
    },
    cancel() {
      this.$portal.delActiveViewAndRefresh('OuserCenterGrowthValueList')
    },
    updateStatus(rule, status) {
      this.$confirm('确认启用/停用该条数据?', this.$t('提示'), {
        confirmButtonText: this.$t('确定'),
        cancelButtonText: this.$t('取消'),
        type: 'warning'
      }).then(() => {
        const growthValueList = this.$crm.$api.growthValueList
        rule.isAvailable = status
        growthValueList.updateRuleStatus(rule).then((res) => {
          if (res.code === 0) {
            this.queryRuleList()
          }
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .el-container {
    border: #b5bcc2 solid 1px;
  }

  .num-input {
    width: 100%;
  }
</style>
