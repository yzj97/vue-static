<template>
  <div>
    <section>
      <el-form ref="form" :model="form" label-width="160px">
        <!--用户密码-->
        <el-form-item :label="$t('密码')">
          <el-input
            v-model="form.password"
            :placeholder="$t('建议定期更改密码,以保账户安全')"
            name="form_password"
            disabled="true"
            style="width: 220px;"
            size="small"
          />
          <ody-button
            name="OuserOperaAccountInfoOperUpdate_initModifyPwdDialog"
            code="OuserOperaAccountInfoOperUpdate"
            style="width: 90px; height: 30px;"
            type="primary"
            size="small"
            @click="initModifyPwdDialog({},false)"
          >{{ $t('修改密码') }}
          </ody-button>
        </el-form-item>
      </el-form>
    </section>

    <!--修改密码弹出框-->
    <ody-dialog :visible.sync="editPwdObj.show" :title="editPwdObj.title" width="800px">
      <el-form
        ref="editPwdObj"
        :rules="rules"
        :model="editPwdObj.obj"
        :disabled="editPwdObj.edit === false"
      >
        <el-form-item :disabled="false" :label="$t('原密码')" label-width="200px" prop="password">
          <el-input
            v-model="editPwdObj.obj.password"
            :placeholder="$t('请输入密码')"
            name="editPwdObj_obj_password"
            style="width: 320px;"
            type="password"
          />
        </el-form-item>

        <el-form-item :disabled="false" :label="$t('新密码')" label-width="200px" prop="password1">
          <el-input
            v-model="editPwdObj.obj.password1"
            :placeholder="$t('请输入新密码')"
            name="editPwdObj_obj_password1"
            style="width: 320px;"
            type="password"
          />
        </el-form-item>

        <el-form-item :disabled="false" :label="$t('确认密码')" label-width="200px" prop="password2">
          <el-input
            v-model="editPwdObj.obj.password2"
            :placeholder="$t('请再次确认新密码')"
            name="editPwdObj_obj_password2"
            style="width: 320px;"
            type="password"
          />
        </el-form-item>
        <div style="width:100%;text-align:center;">
          <el-button name="editPwdObj_show" @click="editPwdObj.show = false">{{ $t('取消') }}</el-button>
          <ody-button
            name="OuserOperaAccountInfoOperConfirm_handleModifyPassword"
            type="primary"
            code="OuserOperaAccountInfoOperConfirm"
            @click="handleModifyPassword"
          >{{ $t('确定') }}
          </ody-button>
        </div>
      </el-form>
    </ody-dialog>

    <!--修改邮箱弹出框-->
    <ody-dialog :visible.sync="editEmailObj.show" :title="editEmailObj.title" width="600px">
      <el-form :model="editEmailObj.obj" :disabled="editEmailObj.edit === false">
        <el-form-item :disabled="false" :label="$t('新邮箱')" label-width="200px">
          <el-input
            v-model="editEmailObj.obj.email"
            :placeholder="$t('请输入新邮箱')"
            name="editEmailObj_obj_email"
            style="width: 220px;"
          />
        </el-form-item>
        <div style="width:100%;text-align:center">
          <el-button name="editEmailObj_show" @click="editEmailObj.show = false">{{ $t('取消') }}</el-button>
          <el-button name="handleSaveEmail" type="primary" @click="handleSaveEmail">{{ $t('确定') }}</el-button>
        </div>
      </el-form>
    </ody-dialog>

    <!--修改手机号弹出框-->
    <ody-dialog :visible.sync="editPhoneObj.show" :title="editPhoneObj.title" width="600px">
      <el-form :model="editPhoneObj.obj" :disabled="editPhoneObj.edit === false">
        <el-form-item :disabled="false" :label="$t('手机号')" label-width="200px">
          <el-input
            v-model="editPhoneObj.obj.mobile"
            :placeholder="$t('请输入手机号')"
            name="editPhoneObj_obj_mobile"
            style="width: 220px;"
          />
          <el-button
            name="sendMobileCaptchas"
            type="primary"
            size="mini"
            @disabled="editPhoneObj.show"
            @click="sendMobileCaptchas"
          >{{ $t('发送短信验证码') }}
          </el-button>
        </el-form-item>

        <el-form-item :disabled="false" :label="$t('验证码')" label-width="200px">
          <el-input
            v-model="editPhoneObj.obj.emailCode"
            :placeholder="$t('请输入验证码')"
            name="editPhoneObj_obj_emailCode"
            style="width: 220px;"
          />
        </el-form-item>
        <div style="width:100%;text-align:center">
          <el-button name="editPhoneObj_show" @click="editPhoneObj.show = false">{{ $t('取消') }}</el-button>
          <el-button name="handleSaveMobile" type="primary" @click="handleSaveMobile">{{ $t('确定') }}</el-button>
        </div>
      </el-form>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OuserOperaAccountInfo',
  data() {
    return {
      rules: {
        password: [
          { validator: this.checkPassword, trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'),
            trigger: 'change'
          }
        ],
        password1: [
          { validator: this.checkPassword1, trigger: 'change' },
          {
            min: 6,
            max: 20,
            message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'),
            trigger: 'change'
          }
        ],
        password2: [
          { validator: this.checkPassword2, trigger: 'blur' },
          {
            min: 6,
            max: 20,
            message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'),
            trigger: 'change'
          }
        ]
      },
      dialogVisible: false,
      passwordConfig: '',
      form: {},
      // 新增密码弹框对象
      editPwdObj: {
        show: false,
        obj: {
          password: '',
          password1: '',
          password2: ''
        }
      },
      // 新增邮件弹框对象
      editEmailObj: {
        show: false,
        obj: {}
      },
      // 新增手机号弹框对象
      editPhoneObj: {
        show: false,
        obj: {}
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const userService = this.$ouser.$api.userService
      const self = this
      this.gender = constants.sex
      this.datePickerOptions = constants.datePickerOptions
      try {
        // 查询用户信息
        await userService.getUserInfo({}).then(res => {
          // 手机号
          self.form.phone = res.data.mobile
          self.form.email = res.data.email
          self.editEmailObj.obj.id = res.data.id
        })
        // 查询员工列表
        // await this.queryEmployeePageByIdentityType()
      } catch (e) {
        console.log(e)
      }
      this.getPasswordConfig()
    },
    checkPassword(rule, value, callback) {
      // if (!this.obj.userId) {
      if (value == null) {
        return callback(new Error(this.$t('请输入密码')))
      } else if (!this.testPassword(value)) {
        return callback(new Error(this.$t('密码口令格式错误')))
      } else {
        return callback()
      }
      // } else {
      //   return callback()
      // }
    },
    checkPassword1(rule, value, callback) {
      // if (!this.obj.userId) {
      if (value == null) {
        return callback(new Error(this.$t('请确认密码')))
      } else if (!this.testPassword(value)) {
        return callback(new Error(this.$t('密码口令格式错误')))
      } else {
        return callback()
      }
    },
    checkPassword2(rule, value, callback) {
      // if (!this.obj.userId) {
      if (value == null) {
        return callback(new Error(this.$t('请确认密码')))
      } else if (!this.testPassword(value)) {
        return callback(new Error(this.$t('密码口令格式错误')))
      } else {
        if (value !== this.editPwdObj.obj.password1) {
          return callback(new Error(this.$t('两次密码输入必须相同')))
        } else {
          return callback()
        }
      }
    },
    async getPasswordConfig() {
      const vue = this
      const oscService = vue.$ouser.$api.oscService
      await oscService.pageGet({ key: 'userPasswordConfig', pool: 'ouser' }).then(res => {
        console.log(res.data.value)
        vue.passwordConfig = JSON.parse(res.data.value)
      })
    },
    testPassword(pw) {
      var noNecessaryNum = this.passwordConfig.noNecessaryNum
      var noNecessaryRex = this.passwordConfig.noNecessaryRex
      var necessaryRex = this.passwordConfig.necessaryRex

      for (var i = 0; i < necessaryRex.length; i++) {
        var rex = necessaryRex[i]
        var isMatch = new RegExp(rex).test(pw)
        if (!isMatch) {
          return false
        }
      }

      var passedNum = 0 // 记录已通过的数量, 默认0
      if (passedNum === noNecessaryNum) { // 为0则不校验非必选正则
        return true
      }

      for (var j = 0; j < noNecessaryRex.length; j++) {
        var rex1 = noNecessaryRex[j]
        var isMatch1 = new RegExp(rex1).test(pw)
        if (isMatch1) {
          passedNum += 1
        }
      }

      // 判断符合的数量
      if (passedNum >= noNecessaryNum) {
        return true
      } else {
        return false
      }
    },
    handleModifyPassword() {
      this.$refs['editPwdObj'].validate(valid => {
        if (valid) {
          const userService = this.$ouser.$api.userService
          const self = this
          const obj = util.copy(self.editPwdObj.obj)

          // 强度校验
          // if (!this.checkPassword1(self.editPwdObj.obj.password1)) {
          //   vue.$message({
          //     message: vue.$t('密码口令格式错误'),
          //     type: 'warning'
          //   })
          //   return
          // }

          obj.password = this.$portal.md5Encode(self.editPwdObj.obj.password)
          obj.password1 = this.$portal.md5Encode(self.editPwdObj.obj.password1)
          obj.password2 = this.$portal.md5Encode(self.editPwdObj.obj.password2)
          userService.modifyEmployeePasswordOnline(obj).then(res => {
            self.$message({
              message: this.$t('修改成功'),
              type: 'success'
            })
            self.editPwdObj = {
              show: false,
              obj: {}
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // checkPassword(pw) {
    //   var noNecessaryNum = this.passwordConfig.noNecessaryNum
    //   var noNecessaryRex = this.passwordConfig.noNecessaryRex
    //   var necessaryRex = this.passwordConfig.necessaryRex

    //   for (const rex of necessaryRex) {
    //     var isMatch = new RegExp(rex).test(pw)
    //     if (!isMatch) {
    //       return false
    //     }
    //   }

    //   var passedNum = 0 // 记录已通过的数量, 默认0
    //   if (passedNum === noNecessaryNum) { // 为0则不校验非必选正则
    //     return true
    //   }

    //   for (var i = 0; i < noNecessaryRex.length; i++) {
    //     var rex = noNecessaryRex[i]
    //     const isMatch = new RegExp(rex).test(pw)
    //     if (isMatch) {
    //       passedNum += 1
    //     }
    //   }

    //   // 判断符合的数量
    //   if (passedNum >= noNecessaryNum) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    sendMobileCaptchas() {
      const userService = this.$ouser.$api.userService
      const self = this
      console.log(util.copy(self.editPhoneObj.obj))
      userService
        .sendMobileCaptchas(util.copy(self.editPhoneObj.obj))
        .then(res => {
          console.log('发送短信验证码结果：' + res)
          this.$message({
            message: this.$t('验证码发送成功'),
            type: 'success'
          })
        })
        // self.
    },
    handleSaveMobile() {
      const userService = this.$ouser.$api.userService
      const self = this
      console.log(util.copy(self.editPhoneObj.obj))
      userService.saveMobile(util.copy(self.editPhoneObj.obj)).then(res => {
        console.log('修改手机号响应报文：' + res)
        this.$message({
          message: this.$t('修改成功'),
          type: 'success'
        })
      })
      self.editPhoneObj.show = false
    },
    handleSaveEmail() {
      const userService = this.$ouser.$api.userService
      const self = this
      console.log(util.copy(self.editEmailObj.obj))
      userService.saveEmail(util.copy(self.editEmailObj.obj)).then(res => {
        console.log('修改邮箱响应报文：' + res)
        this.$message({
          message: this.$t('修改成功'),
          type: 'success'
        })
      })
      self.editEmailObj.show = false
    },
    initModifyPwdDialog(obj, edit) {
      this.editPwdObj.show = true
      this.$refs['editPwdObj'].resetFields()
      this.editPwdObj.obj = {
        password: '',
        password1: '',
        password2: ''

      }
      this.editPwdObj.title = this.$t('修改密码')
    },
    initModifyPhoneDialog(obj, edit) {
      this.editPhoneObj.show = true
      this.editPhoneObj.title = this.$t('修改手机号')
    },
    initModifyEmailDialog(obj, edit) {
      console.log('修改邮箱')
      this.editEmailObj.show = true
      this.editEmailObj.title = this.$t('修改邮箱')
    }
  }
}
</script>

<style lang="scss" scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
