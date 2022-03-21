<template>
  <section>
    <ody-dialog
      :title="$t(type)"
      :visible.sync="visible"
      :before-close="handleBack"
      width="960px"
      @open="init">
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" class="form" >
        <el-form-item :label="$t('同义词')" prop="terms">
          <el-input v-model="form.terms" :placeholder="$t('多个同义词用逗号隔开')" name="form_terms" maxlength="200" show-word-limit @input="replaceInputChar"/>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button name="handleBack" size="small" @click="handleBack">{{ $t('返回') }}</el-button>
        <el-button name="handleSave" size="small" type="primary" @click="handleSave">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    dict: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      type: '新增',
      form: {
        id: '',
        term: ''
      },
      rules: {
        terms: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.checkInput, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.form = this.$portal.deepClone(this.dict)
      delete this.form.updatedTimeStr
      this.type = this.form.id ? '编辑' : '新增'
    },
    handleBack() {
      this.$refs['form'].resetFields()
      this.$emit('update:visible', !this.visible)
    },
    checkInput(rule, value, callback) {
      let result = true
      if (value) {
        const arr = value.split(',')
        if (arr && arr.length < 2) {
          callback(new Error(this.$t('同义词至少两个以上')))
          return
        } else {
          for (let i = 0; i < arr.length; i++) {
            const item = arr[i]
            if (!item) {
              callback(new Error(this.$t('同义词至少两个以上')))
              return
            }
          }
        }
        for (let i = 0; i < value.length; i++) {
          const reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g')
          const ch = value.charAt(i)
          if (reg.test(ch)) {
            continue
          } if ((ch >= 'A' && ch <= 'Z') || (ch >= 'a' && ch <= 'z')) {
            continue
          } if (ch === ',' || (ch >= '0' && ch <= '9')) {
            continue
          }
          result = false
          break
        }
      }
      if (!result) {
        callback(new Error(this.$t('只能输入汉字,英文字母,英文逗号,数字')))
      } else {
        callback()
      }
    },
    async handleSave() {
      const vue = this
      vue.$refs['form'].validate(valid => {
        if (valid) {
          if (this.form.id) {
            vue.$social.$api.indexApi.updateSynonymyDict(this.form).then(res => {
              vue.saveSuccess()
            })
          } else {
            vue.$social.$api.indexApi.addSynonymyDict(this.form).then(res => {
              vue.saveSuccess()
            })
          }
        }
      })
    },
    replaceInputChar(value) {
      if (value) {
        this.form.terms = value.replace(/，/g, ',')
      }
    },
    saveSuccess() {
      const vue = this
      vue.$message.success(vue.$t('保存成功'))
      vue.$refs['form'].resetFields()
      vue.$emit('update:visible', !vue.visible)
      vue.$emit('ok')
    }
  }
}
</script>

<style scoped>

</style>
