<template>
  <div>
    <el-form ref="employee" :model="employee" :rules="rules" label-position="left" label-width="auto">
      <el-row style="margin-top: 20px">
        <el-col :span="10" :offset="6">
          <el-form-item :label="$t('用户账号')+':'" prop="userName">
            <el-input
              :disabled="onlyRead"
              v-model="employee.userName"
              :placeholder="$t('请输入用户账号')"
              name="employee_userName"
              type="text"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('姓名')+':'" prop="identityCardName">
            <el-input
              :disabled="onlyRead"
              v-model="employee.identityCardName"
              :placeholder="$t('请输入姓名')"
              name="employee_identityCardName"
              type="text"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('手机号')+':'" prop="mobile">
            <el-input
              :disabled="onlyRead"
              v-model="employee.mobile"
              :placeholder="$t('请输入手机号')"
              name="employee_mobile"
              type="text"
              maxlength="11"/>
          </el-form-item>
          <el-form-item :label="$t('邮箱')+':'" prop="email">
            <el-input
              :disabled="onlyRead"
              v-model="employee.email"
              :placeholder="$t('请输入邮箱')"
              name="employee_email"
              type="text"
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('备注')+':'" prop="remarks">
            <el-input
              :disabled="onlyRead"
              v-model="employee.remarks"
              :placeholder="$t('请输入备注')"
              name="employee_remarks"
              type="textarea"
              maxlength="100"/>
          </el-form-item>
        </el-col>
      </el-row>
      <div v-if="!onlyRead" style="text-align: center; margin-top: 10px">
        <el-button name="saveEmployee" type="primary" @click="saveEmployee">{{ $t('保存') }}</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    orgId: {
      type: Number,
      default: null
    },
    onlyRead: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      identityType: '2',
      identitySubType: '20',
      employee: {},
      rules: {
        userName: [
          { required: true, message: this.$t('请输入用户账号'), trigger: 'change' }
        ],
        identityCardName: [
          { required: true, message: this.$t('请输入姓名'), trigger: 'change' }
        ],
        mobile: [
          { required: true, message: this.$t('请输入手机号'), trigger: 'change' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.queryEmployee()
    },
    queryEmployee() {
      const vue = this
      vue.$merchant.$api.employeeService.queryEmployee({ entityId: vue.orgId, identitySubType: vue.identitySubType, currentPage: 0, itemsPerPage: 10 }).then(res => {
        if (res && res.code === '0' && res.data) {
          vue.employee = res.data
        }
      })
    },
    saveEmployee() {
      const vue = this
      const employeeParam = Object.assign({}, vue.employee)
      employeeParam.identityType = vue.identityType
      employeeParam.identitySubType = vue.identitySubType
      employeeParam.entityId = vue.orgId
      if (vue.employee.userId) {
        vue.$merchant.$api.employeeService.updateEmployee(employeeParam).then(res => {
          if (res && res.code === '0') {
            vue.$message.success(this.$t('保存成功'))
          }
        })
      } else {
        vue.$merchant.$api.employeeService.addEmployee(employeeParam).then(res => {
          if (res && res.code === '0') {
            vue.$message.success(this.$t('保存成功'))
          }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
