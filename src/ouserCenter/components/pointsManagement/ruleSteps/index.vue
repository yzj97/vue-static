<template>
  <el-card>
    <ody-steps :list="stepList" :active="step" />
    <el-container>
      <el-main >
        <el-row>
          <el-col v-if="step === 1" :span="10" :offset="7">
            <el-form ref="typeForm" :disabled="!add && !edit" :model="obj" label-width="100px" class="form" label-position="right">
              <el-form-item :label="$t('规则类别')+':'" :rules="[{ required: true, message: this.$t('请选择规则类型'), trigger: 'change' }]" prop="subType">
                <el-select v-model="obj.subType" :placeholder="$t('请选择')" :disabled="!add" name="obj_subType" @change="changeType">
                  <el-option
                    v-for="item in subTypes"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('规则名称')+':'" :rules="[{ required: true, message: this.$t('请输入规则名称'), trigger: 'change' }]" prop="name">
                <el-input
                  v-model="obj.name"
                  :maxlength="20"
                  name="obj_name"
                  type="text"
                  show-word-limit/>
              </el-form-item>
            </el-form>
          </el-col>
          <register v-if="step === 2 && obj.subType === '1_3'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit"/>
          <user-info v-if="step === 2 && obj.subType === '1_4'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
          <sign v-if="step === 2 && obj.subType === '1_2'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
          <do-order v-if="step === 2 && obj.subType === '1_5'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
          <pay v-if="step === 2 && obj.subType === '2_1'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
          <feedback-member v-if="step === 2 && obj.subType === '1_9'" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
          <common-rule v-if="step === 2 && commonRuleSubTypes.includes(obj.subType)" ref="detailForm" :param="obj.paramJson" :disabled="!add && !edit" />
        </el-row>
        <el-row v-if="step !== 3">
          <el-col :span="8" :offset="10">
            <div>
              <ody-button v-if="step === 1" name="PointsRuleManagementNext_nextStep" code="PointsRuleManagementNext" type="primary" size="mini" @click="nextStep">{{ $t('下一步') }}</ody-button>
              <ody-button v-if="step === 2" name="PointsRuleManagementLast_lastStep" code="PointsRuleManagementLast" type="primary" size="mini" @click="lastStep">{{ $t('上一步') }}</ody-button>
              <ody-button v-if="step === 2 && (add||edit)" name="PointsRuleManagementSave_save" code="PointsRuleManagementSave" type="primary" size="mini" @click="save">{{ $t('保存') }}</ody-button>
              <el-button name="cancel" size="mini" @click="cancel">{{ $t('返回') }}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="step === 3" style="text-align: center">
          <h1>
            {{ $t('创建成功') }}！
          </h1>
        </el-row>
        <el-row v-if="step === 3">
          <el-col :span="4" :offset="11">
            <div>
              <el-button name="cancel7" size="mini" @click="cancel">{{ $t('返回规则列表页') }}</el-button>
            </div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-card>
</template>
<script>
import Register from '@/components/pointsManagement/ruleSteps/register'
import UserInfo from '@/components/pointsManagement/ruleSteps/userInfo'
import Sign from '@/components/pointsManagement/ruleSteps/sign'
import Pay from '@/components/pointsManagement/ruleSteps/pay'
import DoOrder from '@/components/pointsManagement/ruleSteps/doOrder'
import CommonRule from '@/components/pointsManagement/ruleSteps/commonRule'
import FeedbackMember from '@/components/pointsManagement/ruleSteps/feedback/member'

export default {
  components: {
    Register,
    UserInfo,
    Sign,
    Pay,
    DoOrder,
    CommonRule,
    FeedbackMember
  },
  data() {
    return {
      stepList: [
        { title: this.$t('选择规则类型') },
        { title: this.$t('设置规则') },
        { title: this.$t('创建成功') }
      ],
      step: 1,
      obj: {
        subType: null,
        name: null,
        paramJson: {},
        entityType: 1,
        id: null
      },
      add: false,
      edit: false,
      subTypes: [],
      commonRuleSubTypes: [
        '1_6', '1_7', '1_8'
      ],
      ruleForm: null
    }
  },
  async mounted() {
    if (this.$route.query.add.toString() === '1') {
      this.add = true
    } else {
      if (this.$route.query.edit.toString() === '1') {
        this.edit = true
      }
      await this.$ouserCenter.$api.crmService.getPointRuleById({ id: this.$route.query.id }).then(res => {
        this.obj = {
          id: res.data.id,
          subType: res.data.type.toString() + '_' + res.data.subType.toString(),
          paramJson: JSON.parse(res.data.param),
          entityType: 1,
          name: res.data.name
        }
      })
    }
    await this.$ouserCenter.$api.userService.configListMulti({ categorys: ['POINT_RULE_TYPE_NEW'], pool: 'crm' }).then(resp => {
      if (resp.data['POINT_RULE_TYPE_NEW']) {
        const subTypes = []
        for (const i in resp.data['POINT_RULE_TYPE_NEW']) {
          subTypes.push({
            value: i,
            label: resp.data['POINT_RULE_TYPE_NEW'][i]
          })
        }
        this.subTypes = subTypes
      }
    })
  },
  methods: {
    nextStep() {
      this.$refs['typeForm'].validate((valid) => {
        if (valid) {
          this.step = 2
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    save() {
      this.$refs.detailForm.$refs.form.validate((valid) => {
        if (valid) {
          if (this.$refs.detailForm.validateData && !this.$refs.detailForm.validateData()) {
            return false
          }

          const {
            subType,
            ...params
          } = this.obj
          const sp = subType.split('_')
          params.type = sp[0]
          params.subType = sp[1]
          params.paramJson = this.$refs.detailForm.getParamJson()

          if (params.id) {
            this.$ouserCenter.$api.crmService.updateRule(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('更新成功')
              })
              this.step = 3
            })
          } else {
            this.$ouserCenter.$api.crmService.addRule(params).then(res => {
              this.$message({
                type: 'success',
                message: this.$t('新增成功')
              })
              this.step = 3
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    lastStep() {
      this.step = 1
    },
    cancel() {
      this.$router.push({
        path: '/ouser-center/pointsManagement/pointsRule'
      })
      this.$portal.delActiveViewAndRefresh()
    },
    changeType() {
      this.obj.paramJson = {
        type: null,
        value: null,
        values: []
      }
    }
  }
}
</script>
<style scoped>
  .el-container {
    border: #b5bcc2 solid 1px;
  }

  .num-input {
    width: 100%;
  }
</style>
