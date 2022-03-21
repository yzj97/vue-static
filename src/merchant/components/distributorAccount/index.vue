<template>
  <div class="account-content">
    <el-row>
      <el-col :span="17">
        <el-form ref="accountFormRef" :model="accountForm" :rules="accountFormRules" label-width="240px">
          <el-form-item :label="$t('用户账号')" prop="accountNumber" required>
            <el-input
              v-model="accountForm.accountNumber"
              :disabled="isDisabled"
              :placeholder="$t('请输入用户账号')"
              name="accountForm_accountNumber"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('姓名')" prop="name" required>
            <el-input
              v-model="accountForm.name"
              :disabled="isDisabled"
              :placeholder="$t('请输入姓名')"
              name="accountForm_name"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <div v-if="!isDisabled">
            <el-form-item :label="$t('登录密码')" prop="password" required>
              <el-input
                v-model="accountForm.password"
                :disabled="isDisabled"
                :placeholder="$t('请输入登录密码')"
                name="accountForm_password"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('确认密码')" prop="password1" required>
              <el-input
                v-model="accountForm.password1"
                :disabled="isDisabled"
                :placeholder="$t('请输入确认密码')"
                name="accountForm_password1"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
          </div>
          <el-form-item :label="$t('手机号')" prop="mobileNo" required>
            <el-input
              v-model="accountForm.mobileNo"
              :disabled="isDisabled"
              :placeholder="$t('请输入手机号')"
              name="accountForm_mobileNo"
              type="text"
              maxlength="11"/>
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email">
            <el-input
              v-model="accountForm.email"
              :disabled="!isEdit"
              :placeholder="$t('请输入邮箱')"
              name="accountForm_email"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('备注')" prop="remark">
            <el-input
              v-model="accountForm.remark"
              :disabled="!isEdit"
              :placeholder="$t('请输入备注')"
              name="accountForm_remark"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    editId: { type: Number, default: 0 },
    isEdit: {
      type: Boolean,
      default: false
    },
    orgType: {
      type: Number,
      default: 0
    },
    loginObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {

      // 账号信息
      accountForm: {
        accountNumber: '', // 用户账号
        name: '', // 姓名
        mobileNo: '', // 手机号
        email: '', // 邮箱
        remark: '' // 备注
      },
      accountFormRules: {
        accountNumber: [
          { required: true, message: '请输入用户账号', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持英文，数字，下划线', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { required: true, message: '请输入姓名', trigger: 'change' }
        ],
        mobileNo: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        password: [
          { required: true, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { required: true, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ],
        password1: [
          { required: true, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { required: true, message: '长度在 6 到 20 个字符', trigger: 'change' }
        ],
        email: [
          { pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/, message: '请输入正确的邮箱', trigger: 'change' }
        ]
      },
      isDisabled: false
    }
  },
  watch: {
    // 监控属性loginObj的变化
    loginObj: {
      handler: function(val) {
        this.setUserAccount()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setUserAccount()
      if (!this.isEdit || (this.editId !== -1 && this.loginObj !== null)) {
        this.isDisabled = true
      }
    },
    setUserAccount() {
      if (this.loginObj !== null) {
        this.accountForm.accountNumber = this.loginObj.userName
        this.accountForm.name = this.loginObj.identityCardName
        this.accountForm.mobileNo = this.loginObj.mobile
        this.accountForm.email = this.loginObj.email
        this.accountForm.remark = this.loginObj.remarks
        this.isDisabled = true
      }
    }
  }
}
</script>

<style lang="less">

</style>
