<template>
  <div>
    <el-link name="openDialog2" style="color: blue;" @click="openWechatDialog">{{ $t('编辑') }}
    </el-link>
    <ody-dialog
      :visible.sync="show"
      :title="$t('修改消息模版')"
      append-to-body="true"
      width="960px">
      <div>
        <el-form ref="form" :model="contentJson" :rules="wechatRules" label-width="120px" label-position="right">
          <el-form-item :label="$t('模板选择')+':'" prop="template_id">
            <el-col :span="4">
              <el-select
                v-model="contentJson.template_id"
                :placeholder="$t('请选择')"
                style="width: 300px"
                name="wechatDialog_obj_template_id"
                @change="templateIdChange">
                <el-option
                  v-for="i in wechatTemplates"
                  :key="i.template_id"
                  :label="i.title"
                  :value="i.template_id"
                />
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item v-if="contentJson.template_id" :label="$t('模板内容')+':'">
            <el-col :span="4">
              <el-input
                v-model="wechatContent"
                :disabled="true"
                :autosize="true"
                name="wechatContent"
                style="width: 300px"
                type="textarea"/>
            </el-col>
          </el-form-item>
          <el-form-item v-if="contentJson.template_id" :label="$t('模板变量更改')+':'" prop="wechatVars">
            <el-row v-for="(i,index) in contentJson.wechatVars" :key="index">
              <el-col :span="4">
                <span>{{ i.key }}</span>
              </el-col>
              <el-col :span="6">
                <el-select
                  v-model="contentJson.wechatVars[index].value"
                  :placeholder="$t('请选择')"
                  size="mini"
                  style="width: 180px"
                  name="wechatDialog_obj_template_id">
                  <el-option
                    v-for="j in row.vars"
                    :key="j.key"
                    :label="j.value"
                    :value="j.key"
                  />
                </el-select>
              </el-col>
              <el-col :span="4">
                <el-input
                  v-if="contentJson.wechatVars[index].value === '_fixed'"
                  v-model="contentJson.wechatVars[index].extraValue"
                  name="contentJson_wechatVars_index__extraValue"
                  maxlength="50"
                  style="width: 180px"
                  size="mini"/>
              </el-col>
            </el-row>
          </el-form-item>
          <el-form-item v-if="contentJson.template_id" :label="$t('模板跳转页面')+':'" prop="url">
            <el-col :span="6">
              <el-select
                v-model="contentJson.url"
                :placeholder="$t('请选择')"
                size="mini"
                style="width: 180px"
                name="wechatDialog_obj_template_id">
                <el-option
                  v-for="j in stations"
                  :key="j.value"
                  :label="j.label"
                  :value="j.value"
                />
              </el-select>
            </el-col>
            <el-col :span="4">
              <el-input
                v-if="contentJson.url === '_fixed'"
                v-model="contentJson.extraUrl"
                name="contentJson_extraUrl"
                style="width: 180px"
                maxlength="50"
                size="mini"/>
            </el-col>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer">
        <ody-button name="ui_initWechatDialog" code="ui" @click="initWechatDialog">{{ $t('取消') }}</ody-button>
        <ody-button name="ui_wechatDialogCommit" code="ui" type="primary" @click="wechatDialogCommit">{{ $t('确定') }}</ody-button>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    row: {
      type: Object,
      default: function() {
        return {
          varList: [],
          content: '{}'
        }
      }
    },
    stations: {
      type: Object,
      default: function() {
        return []
      }
    },
    ok: {
      type: Function,
      default: function() {

      }
    }
  },
  data() {
    return {
      wechatTemplates: [],
      wechatContent: '',
      contentJson: {
        template_id: null,
        url: null,
        extraUrl: null,
        wechatVars: []
      },
      vars: [],
      show: false,
      wechatRules: {
        template_id: [{ required: true, message: this.$t('请选择消息模板'), trigger: 'change' }],
        wechatVars: [{ validator: this.checkWechatVars, trigger: 'change' }]
      }
    }
  },
  async mounted() {
    await this.initWechatDialog()
    await this.init()
  },
  methods: {
    async searchWechatList() {
      if (this.wechatTemplates.length === 0) {
        await this.$osc.$api.userService.getPrivateTemplate({}).then(res => {
          this.wechatTemplates = res.data.template_list
        })
      }
    },
    checkWechatVars(rule, value, callback) {
      for (const i of this.contentJson.wechatVars) {
        if (i.value === null) {
          return callback(new Error(this.$t('模板变量不能为空')))
        }
        if (i.value === '_fixed' || i.value === '') {
          if (i.extraValue === null || i.extraValue === '') {
            return callback(new Error(this.$t('模板变量不能为空')))
          }
        }
      }
      return callback()
    },
    init() {
      this.contentJson = JSON.parse(this.row.content)
      this.wechatTemplates.forEach(i => {
        if (i.template_id === this.contentJson.template_id) {
          this.wechatContent = i.content
        }
      })
    },
    initWechatDialog() {
      this.show = false
    },
    openWechatDialog() {
      this.initWechatDialog()
      this.searchWechatList()
      this.show = true
    },
    wechatDialogCommit() {
      const param = {}
      param.title = this.row.title
      param.id = this.row.id
      param.content = JSON.stringify(this.contentJson)
      param.isMarket = this.row.isMarket
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$osc.$api.messageWarnService.smsUpdate(param).then(res => {
            this.$message({
              message: this.$t('common.saveSuccess'),
              type: 'success'
            })
            this.initWechatDialog()
            this.ok()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    templateIdChange(value) {
      this.contentJson = { }
      this.contentJson.template_id = value
      this.wechatTemplates.forEach(i => {
        if (i.template_id === value) {
          this.wechatContent = i.content
          const match = i.content.match(/{{.*}}/g)
          const wechatVars = []
          match.forEach(j => {
            wechatVars.push({
              key: j,
              value: null,
              extraValue: null
            })
          })
          this.$set(this.contentJson, 'wechatVars', wechatVars)
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
