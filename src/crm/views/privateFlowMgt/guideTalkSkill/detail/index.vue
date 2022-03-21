<template>
  <section>
    <section>
      <el-form ref="form" :model="edit" :rules="rules" label-width="100px" class="form">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('话术类型')" :required="true" prop="category">
              <el-select :disabled="readonly" v-model="edit.category" :placeholder="$t('请选择')" name="edit_category">
                <el-option
                  v-for="(value, key) in categories"
                  :key="key"
                  :label="value"
                  :value="parseInt(key)"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="18">
            <el-form-item :label="$t('话术内容')" :required="true" prop="content">
              <el-input :disabled="readonly" :rows="10" v-model="edit.content" name="edit_content" type="textarea" maxlength="1000" show-word-limit/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center" style="margin-top: 10px">
          <el-button name="back" size="small" @click="back">{{ $t('关闭') }}</el-button>
          <ody-button v-loading="saving" v-show="!readonly" name="GuideTalkSkill_Save_save" code="GuideTalkSkill_Save" size="small" type="primary" @click="save">{{ $t('保存') }}</ody-button>
        </el-row>
      </el-form>
    </section>
  </section>
</template>

<script>
export default {
  name: 'GuideTalkSkillDetail',
  data() {
    return {
      saving: false,
      readonly: false,
      update: false,
      categories: {},
      edit: {
        type: 0,
        category: null,
        content: ''
      },
      rules: {
        category: [{ required: true, message: this.$t('请输入') + this.$t('话术类型') }],
        content: [{ required: true, message: this.$t('请输入') + this.$t('话术内容') }]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.readonly = this.$route.params.readonly
      if (this.$route.params.id) {
        this.update = !this.readonly
        this.saving = true
        const res = await this.$crm.$api.guide.guideTalkSkill_getById({ id: this.$route.params.id })
        this.saving = false
        this.edit = res.data
      }

      const res = await this.$crm.$api.common.codeListMulti({ 'categories': ['GUIDE_TALK_SKILL'] })
      this.categories = res.data['GUIDE_TALK_SKILL']
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.saving = true
          const api = this.edit.id ? this.$crm.$api.guide.guideTalkSkill_update : this.$crm.$api.guide.guideTalkSkill_add
          api(this.edit).then((res) => {
            this.saving = false
            this.$alert(this.$t('保存成功'), this.$t('系统信息'), {
              confirmButtonText: this.$t('确定'),
              callback: action => {
                this.back()
              }
            })
          }, (res) => {
            this.saving = false
          })
        }
      })
    },
    back() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

