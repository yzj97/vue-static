<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="240px">
      <el-row>
        <el-col :span="13">
          <el-form-item :label="$t('角标编码')" prop="code">
            {{ form.code }}
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('角标名称')" prop="name">
            {{ form.name }}
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('生效时间')" prop="validTime">
            <span v-if="form.validTime && form.validTime.length>1">
              {{ form.validTime[0] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} - {{ form.validTime[1] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
            </span>
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('显示位置')" prop="displayType">
            {{ displayType[`${form.displayType}`] }}
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('优先级')">
            {{ form.priority }}
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('图片')" prop="iconUrl">
            <ody-upload-image
              v-model="form.iconUrl"
              :pic-type="picType"
              :pic-size="4096"
              :multiple="false"
              name="form_iconUrl"
              disabled
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
              disabled
              @error="error"
            />
          </el-form-item>
        </el-col>
        <el-col :span="13">
          <el-form-item :label="$t('备注')">
            {{ form.description }}
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <ody-fixed>
      <el-button name="handleClose" @click="handleClose">{{ $t('返回') }}</el-button>
    </ody-fixed>
  </div>
</template>

<script>
export default {
  name: 'SuperscriptDetail',
  data() {
    return {
      form: { code: '', name: '', iconUrl: '', validTime: [] },
      picType: ['png', 'jpg', 'jpeg'],
      id: null
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
