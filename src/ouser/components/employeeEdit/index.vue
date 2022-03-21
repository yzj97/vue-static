<template>
  <div>
    <ody-dialog
      :visible="show"
      :title="$t('员工详情')"
      width="600px"
      @hide-dialog="editDialogCancel"
      @close="editDialogCancel">
      <div slot="content" @click="doBlur">
        <el-form ref="editEmployee" :rules="rules" :model="obj" :disabled=" add === false && edit === false" label-position="right" label-width="80px">
          <ody-title :title="$t('员工信息')" />
          <el-form-item :label="$t('用户账号')" prop="userName">
            <el-input
              v-model="obj.userName"
              :maxlength="20"
              :disabled="obj.userId"
              name="editObj_obj_userName"
              type="text"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('姓名')" prop="identityCardName">
            <el-input
              v-model="obj.identityCardName"
              :maxlength="20"
              name="editObj_obj_identityCardName"
              type="text"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('手机号')" prop="mobile">
            <el-input
              v-model="obj.mobile"
              :disabled="obj.userId"
              :maxlength="11"
              name="editObj_obj_mobile"
              type="text"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('登录密码')" class="is-required" prop="password">
            <el-input
              v-model="obj.password"
              :disabled="obj.userId"
              :maxlength="20"
              name="editObj_obj_password"
              type="text"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('确认密码')" class="is-required" prop="password1">
            <el-input
              v-model="obj.password1"
              :disabled="obj.userId"
              :maxlength="20"
              name="editObj_obj_password1"
              type="text"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email">
            <el-input
              v-model="obj.email"
              :maxlength="30"
              name="editObj_obj_email"
              type="textarea"
              show-word-limit/>
          </el-form-item>
          <el-form-item :label="$t('工号')">
            <el-input
              v-model="obj.employeNum"
              :maxlength="15"
              name="editObj_obj_employeNum"
              type="textarea"
              show-word-limit
            />
          </el-form-item>
          <el-form-item :label="$t('岗位')">
            <el-select ref="positionSelect" v-model="obj.positionIds" :placeholder="$t('请选择')" multiple name="editObj_obj_positionId">
              <el-option
                v-for="item in positions"
                :key="item.id"
                :label="item.positionName"
                :value="item.id"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('部门主管')">
            <el-checkbox v-model="obj.isDirector" :true-label="1" :false-label="0"/>
          </el-form-item>
          <el-form-item :label="$t('状态')">
            <el-switch
              v-model="obj.isAvailable"
              :active-value="1"
              :inactive-value="0"
              active-color="#13ce66"
              inactive-color="#ff4949"/>
          </el-form-item>
          <ody-title :title="$t('其他信息')" />

          <el-form-item :label="$t('头像')">
            <ody-upload-image :file-list.sync="uploadImg"/>
          </el-form-item>

          <el-form-item :label="$t('性别')">
            <el-select v-model="obj.sex" :placeholder="$t('请选择')" name="editObj_obj_sex">
              <el-option
                v-for="item in sex"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('生日')">
            <el-date-picker
              v-model="obj.birthday"
              :picker-options="datePickerOptions"
              :placeholder="$t('选择日期')"
              name="editObj_obj_birthday"
              align="right"
              type="date"/>
          </el-form-item>
          <el-form-item :label="$t('有效期')">
            <el-date-picker
              v-model="obj.expireDay"
              :picker-options="futureDatePickerOptions"
              :placeholder="$t('选择日期')"
              name="editObj_obj_expireDay"
              align="right"
              type="date"/>
          </el-form-item>
          <el-form-item :label="$t('备注')">
            <el-input
              :rows="2"
              v-model="obj.remarks"
              :maxlength="100"
              :placeholder="$t('请输入内容')"
              name="editObj_obj_remarks"
              type="textarea"
              show-word-limit/>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <el-button name="editDialogCancel" size="small" @click="editDialogCancel">{{ $t('关闭') }}</el-button>
        <el-button v-if="add !== true && edit === true" name="resetPassword" size="small" type="primary" @click="resetPassword">{{ $t('重置密码') }}</el-button>
        <ody-button
          v-if="add === true || edit === true"
          code="ui"
          name="editDialogCommit"
          size="small"
          type="primary"
          @click="editDialogCommit">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import util from '@/utils/util'
export default {
  props: {
    userId: {
      type: Number,
      default: -1
    },
    add: {
      type: Boolean,
      default: true
    },
    show: {
      type: Boolean,
      default: false
    },
    departmentId: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      uploadImg: [],
      obj: { isAvailable: 1 },
      positions: [],
      passwordConfig: '',
      rules: {
        userName: [
          { required: true, message: this.$t('请输入用户账号'), trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: this.$t('仅支持字母数字下划线'), trigger: 'change' },
          { min: 6, max: 20, message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
        ],
        password: [
          { validator: this.checkPassword, trigger: 'change' },
          { min: 6, max: 20, message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
        ],
        password1: [
          { validator: this.checkPassword1, trigger: 'change' },
          { min: 6, max: 20, message: this.$t('长度在') + ' 6 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
        ],
        identityCardName: [
          { required: true, message: this.$t('请输入真实姓名'), trigger: 'change' },
          { min: 1, max: 20, message: this.$t('长度在') + ' 1 ' + this.$t('到') + ' 20 ' + this.$t('个字符'), trigger: 'change' }
        ],
        mobile: [
          { required: true, message: this.$t('请输入手机号'), trigger: 'change' },
          { pattern: /^1[0-9]{10}$/, message: this.$t('请输入正确的手机号'), trigger: 'change' }
        ],
        email: [
          { pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/, message: this.$t('请输入正确的邮箱'), trigger: 'change' }
        ]
      },
      // 性别列表
      sex: [],
      edit: false
    }
  },
  async mounted() {
    try {
      await this.$ouser.$api.positionService.queryNearlyMerchantPosition({ departmentId: this.departmentId }).then(res => {
        this.positions = res.data
        // this.$set(this, 'positions', res.data)
      })
      if (this.userId !== -1) {
        await this.$ouser.$api.userService.getUserPosition({ userId: this.userId, departmentId: this.departmentId }).then(res => {
          this.obj = res.data
          this.uploadImg.push({ url: this.obj.headPicUrl })
        })
      }
      await this.init()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async init() {
      this.edit = this.$portal.hasPermission('OuserDepartmentManage207')
      this.sex = constants.sex
      this.datePickerOptions = constants.datePickerOptions
      this.futureDatePickerOptions = constants.futureDatePickerOptions
      this.getPasswordConfig()
    },
    resetPassword() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      employeeService.resetPassword(this.obj).then(() => {
        self.$message({
          message: self.$t('重置后密码为：Aa123456'),
          type: 'success',
          duration: 3000
        })
      })
    },
    async editDialogCommit() {
      const [err] = await this.formValidate('editEmployee')

      if (err) {
        return
      }

      await this.doCommit()
    },
    async doCommit() {
      const employeeService = this.$ouser.$api.employeeService
      const self = this
      if (this.uploadImg.length > 0) {
        this.obj.headPicUrl = this.uploadImg[0].url
      } else {
        this.obj.headPicUrl = ''
      }
      const obj = util.copy(this.obj)
      obj.departmentId = this.departmentId
      if (this.add) {
        obj.password = this.$portal.md5Encode(this.obj.password)
        obj.password1 = this.$portal.md5Encode(this.obj.password1)
        await employeeService.addEmployee(obj).then(() => {
          self.$message({
            message: self.$t('添加成功'),
            type: 'success'
          })
          self.editDialogCancel()
        })
      } else {
        await employeeService.updateEmployee(obj).then(() => {
          self.$message({
            message: self.$t('信息更新成功'),
            type: 'success'
          })
          self.editDialogCancel()
        })
      }
    },
    editDialogCancel() {
      this.$refs['editEmployee'].resetFields()
      this.$emit('close')
    },
    checkPassword(rule, value, callback) {
      if (!this.obj.userId) {
        if (value == null) {
          return callback(new Error(this.$t('请输入密码')))
        } else if (!this.testPassword(value)) {
          return callback(new Error(this.$t('密码口令格式错误')))
        } else if (value === this.obj.userName) {
          return callback(new Error(this.$t('密码不能和用户名相同')))
        } else {
          return callback()
        }
      } else {
        return callback()
      }
    },
    checkPassword1(rule, value, callback) {
      if (!this.obj.userId) {
        if (value == null) {
          return callback(new Error(this.$t('请确认密码')))
        } else if (!this.testPassword(value)) {
          return callback(new Error(this.$t('密码口令格式错误')))
        } else if (value === this.obj.userName) {
          return callback(new Error(this.$t('密码不能和用户名相同')))
        } else {
          if (value !== this.obj.password) {
            return callback(new Error(this.$t('两次密码输入必须相同')))
          } else {
            return callback()
          }
        }
      } else {
        return callback()
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
    doBlur() {
      this.$refs.positionSelect.blur()
    }
  }
}
</script>

<style scoped>

</style>
