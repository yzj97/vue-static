<template>
  <div>
    <section>
      <el-card>
        <el-table
          v-loading="loading"
          :data="listTable.list"
          name="listTable_list775"
          border>
          <el-table-column
            :label="$t('消息发送节点')"
            align="center"
            fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.label }}</span>
              <el-tooltip :content="tips[scope.row.key]" class="item" effect="dark" placement="top">
                <i class="el-icon-question"/>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('消息编码')"
            align="center"
            fixed>
            <template slot-scope="scope">
              <span>{{ scope.row.key }}</span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('站内信')"
            align="center"
            fixed>
            <template slot-scope="scope">
              <div v-permission="'OscMessageWarenCanEdit'" v-if="scope.row.innerSms.id">
                <el-checkbox v-model="scope.row.innerSms.canSend" name="scope_row_innerSms_canSend"/>
                <el-link name="openDialog" style="color: blue;" @click="openDialog('innerSms',scope.row.innerSms)">{{
                $t('编辑') }}
                </el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('手机短信')"
            align="center"
            fixed>
            <template slot-scope="scope">
              <div v-permission="'OscMessageWarenCanEdit'" v-if="scope.row.sms.id">
                <el-checkbox v-model="scope.row.sms.canSend" name="scope_row_sms_canSend"/>
                <el-link name="openDialog2" style="color: blue;" @click="openDialog('sms',scope.row.sms)">{{ $t('编辑')
                }}
                </el-link>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('微信')"
            align="center"
            fixed>
            <template slot-scope="scope">
              <div v-permission="'OscMessageWarenCanEdit'" v-if="scope.row.wechat.id">
                <el-checkbox v-model="scope.row.wechat.canSend" name="scope_row_wechat_canSend"/>
                <WechatEdit
                  :row="scope.row.wechat"
                  :ok="init"
                  :stations="stations"
                  style="display:inline;"/>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div slot="btn">
        <el-row style="margin-top: 30px; text-align: center;">
          <ody-button
            name="OscMessageWarenSave_commit"
            code="OscMessageWarenSave"
            style="width: 150px;"
            size="small"
            type="primary"
            @click="commit">{{ $t('保存') }}
          </ody-button>
        </el-row>
      </div>
    </section>

    <ody-dialog
      v-if="editDialog.show"
      :visible.sync="editDialog.show"
      :before-close="initDialog"
      :title="$t('修改消息模版')"
      width="960px"
      @close="initDialog">
      <el-form ref="form" :model="editDialog.obj" :rules="rules" label-width="120px" label-position="right">
        <el-form-item :label="$t('用户变量')+':'">
          <el-button
            v-for="i in editDialog.obj.varList"
            :key="i"
            name="addMessageWar"
            size="mini"
            @click="addMessageWar(i)">{{ i }}
          </el-button>
        </el-form-item>
        <el-form-item :label="$t('标题')+':'">
          <el-input v-model="editDialog.obj.title" name="editDialog_obj_title"/>
        </el-form-item>
        <el-form-item :label="$t('是否营销类')+':'">
          <el-checkbox
            v-model="editDialog.obj.isMarket"
            :false-label="0"
            :true-label="1"
            name="editDialog_obj_isMarket"/>
        </el-form-item>
        <el-form-item v-if="editDialog.obj.showType === 'innerSms'" :label="$t('内容')+':'" prop="content">
          <div v-if="disabledMessage.indexOf(editDialog.obj.nodeCode) >= 0" v-html="editDialog.obj.content"/>
          <ody-tinymce
            v-if="disabledMessage.indexOf(editDialog.obj.nodeCode) === -1"
            ref="tinymce"
            v-model="editDialog.obj.content"
            name="editDialog_obj_content"
            height="300"/>
        </el-form-item>
        <el-form-item v-if="editDialog.obj.showType === 'sms'" :label="$t('内容')+':'" prop="content">
          <el-input
            :disabled="disabledMessage.indexOf(editDialog.obj.nodeCode) >= 0"
            v-model="editDialog.obj.content"
            :maxlength="100"
            :placeholder="$t('请输入内容')"
            name="editDialog_obj_content7"
            type="textarea"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <ody-button
          name="OscMessageWarenEdit_dialogCommit"
          code="OscMessageWarenEdit"
          type="primary"
          @click="dialogCommit">{{ $t('保存') }}</ody-button>
        <el-button name="initDialog" @click="initDialog">{{ $t('取消') }}</el-button>
      </span>
    </ody-dialog>

  </div>
</template>

<script>
import WechatEdit from '@/views/messageWarn/wechatEdit'

export default {
  name: 'OscMessageWaren',
  components: {
    WechatEdit
  },
  data() {
    const self = this
    return {
      loading: false,
      tips: {},
      stations: [],
      disabledMessage: [],
      rules: {
        nodeCode: [
          { required: true, message: this.$t('请输入消息编号'), trigger: 'change' }
        ],
        title: [
          { required: true, message: this.$t('请输入消息名称'), trigger: 'change' },
          { min: 1, max: 20, message: self.$t('长度在_到_个字符', { min: 1, max: 20 }), trigger: 'change' }
        ],
        content: [
          { required: true, message: this.$t('请输入消息内容'), trigger: 'change' },
          { min: 1, max: 300, message: self.$t('长度在_到_个字符', { min: 1, max: 300 }), trigger: 'change' }
        ]
      },
      listTable: {
        list: []
      },
      editDialog: { obj: {}}
    }
  },
  async mounted() {
    this.loading = true
    await this.initDialog()
    await this.$osc.$api.userService.getStringValue({ key: 'station_config', pool: 'cms' }).then(res => {
      this.stations = JSON.parse(res.data)
      this.stations.push({ 'label': this.$t('输入固定字段'), 'value': '_fixed' })
    })
    await this.$osc.$api.userService.getStringValue({ key: 'disabledMessage', pool: 'osc' }).then(res => {
      this.disabledMessage = JSON.parse(res.data)
    })
    await this.init()
    this.loading = false
  },
  methods: {
    async init() {
      const self = this
      try {
        this.loading = true
        await this.$osc.$api.messageWarnService.configListMulti({
          categorys: ['MC_NODE', 'MC_NODE_TIPS'],
          pool: 'osc'
        }).then(res => {
          self.listTable.list = []
          for (const i in res.data.MC_NODE) {
            self.listTable.list.push({ key: i, label: res.data.MC_NODE[i], sms: {}, innerSms: {}, wechat: {}})
          }
          self.tips = res.data.MC_NODE_TIPS
        })
        await this.$osc.$api.messageWarnService.smsGetAll({}).then(res => {
          res.data.forEach(i => {
            i.varList = i.var.split(',')
            i.canSend = i.canSend === 1
            self.listTable.list.forEach(j => {
              if (j.key === i.nodeCode) {
                if (i.type === 0) {
                  j.innerSms = i
                } else if (i.type === 1) {
                  j.sms = i
                } else if (i.type === 2) {
                  const vars = []
                  i.varList.forEach(k => {
                    vars.push({
                      key: k,
                      value: k
                    })
                  })
                  vars.push({
                    key: '_fixed',
                    value: this.$t('输入固定字段')
                  })
                  i.vars = vars
                  j.wechat = i
                }
              }
            })
          })
        })
      } catch (e) {
        console.log(e)
      } finally {
        this.loading = false
      }
    },
    commit() {
      const self = this
      const canSendParam = { ids: [], canSend: 1 }
      const canNotSendParam = { ids: [], canSend: 0 }
      this.listTable.list.forEach(i => {
        if (i.sms.id) {
          if (i.sms.canSend === false) {
            canNotSendParam.ids.push(i.sms.id)
          } else {
            canSendParam.ids.push(i.sms.id)
          }
        }
        if (i.innerSms.id) {
          if (i.innerSms.canSend === false) {
            canNotSendParam.ids.push(i.innerSms.id)
          } else {
            canSendParam.ids.push(i.innerSms.id)
          }
        }
        if (i.wechat.id) {
          if (i.wechat.canSend === false) {
            canNotSendParam.ids.push(i.wechat.id)
          } else {
            canSendParam.ids.push(i.wechat.id)
          }
        }
      })
      this.$osc.$api.messageWarnService.batchUpdateCanSend(canSendParam).then(res => {
        self.$osc.$api.messageWarnService.batchUpdateCanSend(canNotSendParam).then(res => {
          self.$message({
            message: self.$t('common.saveSuccess'),
            type: 'success'
          })
          self.init()
        })
      })
    },
    openDialog(type, row) {
      this.initDialog()
      this.editDialog.show = true
      this.editDialog.obj = row
      this.editDialog.obj.showType = type
    },
    changeType() {
      this.editDialog.obj = this.editDialog.objList[this.editDialog.selectType]
    },
    initDialog() {
      this.editDialog = {
        show: false,
        obj: {
          messageWarnType: null,
          title: null,
          messageVarList: null,
          content: null
        },
        objList: {},
        selectType: null
      }
    },
    dialogCommit() {
      const self = this
      const param = {}
      param.title = self.editDialog.obj.title
      param.id = self.editDialog.obj.id
      param.content = self.editDialog.obj.content
      param.isMarket = self.editDialog.obj.isMarket
      this.$refs['form'].validate((valid) => {
        if (valid) {
          self.$osc.$api.messageWarnService.smsUpdate(param).then(res => {
            self.$message({
              message: self.$t('common.saveSuccess'),
              type: 'success'
            })
            self.editDialog.show = false
            self.init()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    addMessageWar(messageWar) {
      this.editDialog.obj.content = this.editDialog.obj.content + '{' + messageWar + '}'
      this.$refs.tinymce.setContent(this.editDialog.obj.content)
    }
  }
}
</script>
