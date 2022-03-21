<template>
  <div>
    <section>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <!--用户头像-->
        <el-form-item :label="$t('头像')">
          <ody-upload-image :file-list.sync="upImg" />
        </el-form-item>

        <!--用户姓名-->
        <el-form-item :label="$t('姓名')" prop="identityCardName">
          <el-input v-model="form.identityCardName" name="form_identityCardName" style="width: 220px;" size="small" />
        </el-form-item>

        <!--用户手机号-->
        <!--用户姓名-->
        <el-form-item :label="$t('手机')">
          <!--<span v-model="form.mobile" name="form_mobile"></span>-->
          <el-input :disabled="true" v-model="form.mobile" name="form_mobile6" style="width: 220px;" type="text" />
        </el-form-item>

        <!--性别单选框-->
        <el-form-item :label="$t('性别')">
          <el-select v-model="form.sex" name="form_sex" style="width: 220px;">
            <el-option
              v-for="item in sex"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              @change="clickitem(item.value)"
            />
          </el-select>
        </el-form-item>

        <!--用户生日-->
        <el-form-item :label="$t('生日')">
          <el-date-picker
            v-model="form.birthday"
            :placeholder="$t('选择日期')"
            :picker-options="datePickerOptions"
            name="form_birthday"
            style="width: 220px;"
            align="right"
            type="date"
          />
        </el-form-item>

        <el-form-item>
          <ody-button
            name="OuserOperaUserInfoSave_handleSaveAction"
            code="OuserOperaUserInfoSave"
            size="medium"
            align="right"
            type="primary"
            @click="handleSaveAction"
          >{{ $t('保存') }}</ody-button>
        </el-form-item>
      </el-form>
    </section>
  </div>
</template>

<script>
import util from '@/utils/util'
import constants from '@/utils/constants'

export default {
  name: 'OuserOperaUserInfo',
  data() {
    return {
      rules: {
        identityCardName: [
          {
            min: 1,
            max: 20,
            message: this.$t('长度在 1 到 20 个字符'),
            trigger: 'change'
          }
        ]
      },
      form: {},
      upImg: [],
      // 生日日期选择器设置
      datePickerOptions: [],

      // 性别列表
      sex: [],
      gender: 2
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const userService = this.$ouser.$api.userService
      const self = this

      self.sex = constants.sex
      self.datePickerOptions = constants.datePickerOptions

      try {
        // 查询用户信息
        await userService.getUserInfo({}).then(res => {
          self.form = res.data
          self.form.mobile = res.data.mobile2
          if (self.form.headPicUrl) {
            self.upImg = [{ url: self.form.headPicUrl }]
          }
        })
        // 查询员工列表
        // await this.queryEmployeePageByIdentityType();
      } catch (e) {
        console.log(e)
      }
    },
    handleSaveAction() {
      const userService = this.$ouser.$api.userService
      const self = this
      if (self.upImg.length > 0) {
        self.form.headPicUrl = self.upImg[0].url
      } else {
        self.form.headPicUrl = null
      }
      this.$refs['form'].validate(valid => {
        if (valid) {
          userService.saveUserInfo(util.copy(self.form)).then(() => {
            this.$message({
              message: this.$t('修改成功'),
              type: 'success'
            })
            self.init()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clickitem(item) {
      const self = this
      console.log('click: ' + item)
      self.gender = item
      console.log(self.gender)
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
