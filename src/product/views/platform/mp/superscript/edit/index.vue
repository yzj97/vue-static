<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="240px">
      <el-row>
        <el-col :span="13">
          <el-form-item :label="$t('角标编码')" prop="code">
            <el-input v-model="form.code" name="form_code" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('角标名称')" prop="name">
            <el-input v-model="form.name" name="form_name" maxlength="50" show-word-limit />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('生效时间')" prop="validTime">
            <el-date-picker
              v-model="form.validTime"
              name="form_validTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="-"
            />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('显示位置')" prop="displayType">
            <el-select v-model="form.displayType" :placeholder="$t('显示位置')" name="form_displayType">
              <el-option v-for="(v, k) in displayType" :key="k" :label="v" :value="k" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('优先级')">
            <ody-input-number
              v-model="form.priority"
              :step="0.1"
              :min="0"
              :max="100"
              :controls="false"
              :empty-tip="false"
              name="form_priority"
            />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('图片')" prop="iconUrl">
            <ody-upload-image
              v-model="form.iconUrl"
              :pic-type="picType"
              :pic-size="4096"
              :draggable="false"
              :multiple="false"
              name="form_iconUrl"
              @error="error"
            />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('图片（第二语言）')" prop="iconUrlLan2">
            <ody-upload-image
              v-model="form.iconUrlLan2"
              :pic-type="picType"
              :pic-size="4096"
              :multiple="false"
              name="form_iconUrlLan2"
              @error="error"
            />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('备注')">
            <el-input v-model="form.description" name="form_description" type="textarea" maxlength="100" show-word-limit />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ody-fixed>
      <el-button name="handleClose" @click="handleClose">{{ $t('返回') }}</el-button>
      <ody-button name="SuperscriptPageSave_handleSubmit" type="primary" code="SuperscriptPageSave" @click="handleSubmit">{{ $t('保存') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
export default {
  name: 'SuperscriptEdit',
  data() {
    const vue = this
    return {
      form: { code: '', name: '', iconUrl: '', validTime: [] },
      picType: ['png', 'jpg', 'jpeg'],
      id: null,
      rules: {
        code: [
          {
            required: true,
            message: vue.$t('请输入') + ' ' + vue.$t('角标编码'),
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: vue.$t('请输入') + ' ' + vue.$t('角标名称'),
            trigger: 'change'
          }
        ],
        validTime: [
          {
            required: true,
            message: vue.$t('请输入') + ' ' + vue.$t('生效时间'),
            trigger: 'change'
          }
        ],
        displayType: [
          {
            required: true,
            message: vue.$t('请输入') + ' ' + vue.$t('显示位置'),
            trigger: 'change'
          }
        ],
        iconUrl: [
          {
            required: true,
            message: vue.$t('请输入') + ' ' + vue.$t('图片'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  async mounted() {
    await this._initCodes()
    if (this.id) {
      this.query(this.id)
    }
  },
  created() {
    this.mpApi = this.$product.$api.mpApi
    this.id = this.$route.query.id
  },
  methods: {
    async handleSubmit() {
      const [err] = await this.formValidate('form')
      if (err) {
        return false
      }
      this.form.id = this.id
      // this.form.iconUrl = this.form.iconUrl.join(',')
      const {
        validTime: [validTimeBegin, validTimeEnd],
        ...params
      } = this.form
      params.validFrom = validTimeBegin
      params.validTo = validTimeEnd
      const { iconUrl, iconUrlLan2 } = params
      if (iconUrl && iconUrl.constructor === Array) {
        params.iconUrl = params.iconUrl[0]
      }
      if (iconUrlLan2 && iconUrlLan2.constructor === Array) {
        params.iconUrlLan2 = params.iconUrlLan2[0]
      }
      return this.mpApi.saveSuperscriptWithTx(params).then(res => {
        this.$message({
          showClose: true,
          message: this.$t('保存成功'),
          type: 'success'
        })
        this.$portal.delActiveView()
        this.$router.push({ name: 'Superscript' })
      })
    },
    handleClose() {
      this.$portal.delActiveView()
      this.$router.push({ name: 'Superscript' })
    },
    async query(id) {
      const {
        data: { validFrom, validTo, displayType, ...form }
      } = await this.mpApi.getSuperscriptById({ id: id })

      if (validFrom && validTo) {
        form.validTime = [validFrom, validTo]
      } else {
        form.validTime = []
      }

      if (displayType >= 0) {
        form.displayType = '' + displayType
      }

      this.form = form
    },
    async _initCodes() {
      const vue = this
      this.$product.$api.common
        .listMultiCode({ categorys: ['DISPLAY_TYPE'] })
        .then(data => {
          if (data.code === '0') {
            vue.displayType = data.data.DISPLAY_TYPE
          }
        })
    }
  }
}
</script>
