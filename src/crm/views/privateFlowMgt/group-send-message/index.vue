<template>
  <section>
    <el-card>
      <div slot="header" class="clearfix">
        <span>{{ $t('新建消息') }}</span>
      </div>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="simple-form">
        <el-form-item :label="$t('微信号')" prop="wxId" style="width:300px" >
          <el-select v-model="form.wechatId" :placeholder="$t('全部')" name="form_wechatId" @change="handleWechatIdChange">
            <el-option
              v-for="item in guideDeviceList"
              :key="item.wechatId"
              :label="item.alias"
              :value="item.wechatId"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('消息内容')" prop="content">
          <el-input v-model="form.content" :autosize="{ minRows: 4, maxRows: 10}" name="form_content" style="width:400px" maxlength="100" type="textarea" show-word-limit/>
        </el-form-item>
        <el-form-item :label="$t('发送范围')" prop="groupNameStr">
          <ody-button name="GroupSendMessageListPage01_handleAdd" code="GroupSendMessageListPage01" size="small" type="primary" @click="handleAdd">{{ $t('选择群组') }}</ody-button>
          <el-tag type="info" class="el-icon-user-solid" style="margin-left:10px">    {{ $t('已选择') }} {{ chooseNum }} {{ $t('群组') }}</el-tag>
        </el-form-item>
      </el-form>
    </el-card>

    <ody-fixed>
      <el-button name="handleClose" size="small" type="default" @click="handleClose">{{ $t('关闭') }}</el-button>
      <ody-button name="GroupSendMessageBatchSendMessage01_handleSubmit" code="GroupSendMessageBatchSendMessage01" size="small" type="primary" @click="handleSubmit">{{ $t('发送') }}</ody-button>
    </ody-fixed>
    <wechat-group-choose :visible.sync="wechatGroupChooseVisible" :wechat-id="form.wechatId" @ok="handleSelectGroup"/>
  </section>
</template>

<script>
import WechatGroupChoose from '@/components/wechat-group-choose'

export default {
  name: 'CrmGroupSendMessage',
  components: {
    WechatGroupChoose
  },
  data() {
    return {
      chooseNum: 0,
      guideDeviceList: [],
      wechatGroupChooseVisible: false,
      form: {
        wechatId: '',
        content: '',
        groupNameStr: '',
        wechatGroupList: []
      },
      rules: {
        content: [
          { required: true, message: this.$t('请输入消息内容'), trigger: 'blur' }
        ],
        groupNameStr: [
          { required: true, message: this.$t('请选择发送范围'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.initCode()
    },
    async initCode() {
      const guideDeviceRel = this.$crm.$api.guideDeviceRel
      const res = await guideDeviceRel.getUserRelList({ page: 1, limit: 99999 })
      if (res) {
        this.guideDeviceList = res.data
      }
    },
    handleSubmit() {
      const vue = this
      vue.$refs['form'].validate((valid) => {
        if (valid) {
          const wechatChatroomIdList = []
          vue.form.wechatGroupList.map(item => {
            wechatChatroomIdList.push(item.wechatChatroomId)
          })
          const params = {
            wechatId: vue.form.wechatId,
            msgType: 1,
            msgSubType: 0,
            wechatChatroomIdList: wechatChatroomIdList,
            content: vue.form.content
          }

          vue.$crm.$api.wechat.batchSendMessage(params).then(res => {
            if (res.data && res.data.length > 0) {
              let failureMessage = ''
              res.data.map(item => {
                failureMessage = failureMessage + item.errMsg + '</br>'
              })

              if (failureMessage) {
                vue.$message.error(failureMessage)
              }
            } else {
              vue.form.content = ''
              vue.$message.success(vue.$t('发送成功'))
            }
          })
        }
      })
    },
    handleClose() {
      this.$portal.delActiveViewAndRefresh()
    },
    handleSelectGroup(selectGroup) {
      const vue = this
      vue.form.wechatGroupList = []
      vue.form.groupNameStr = ''
      selectGroup.forEach(item => {
        const wechatGroup = {
          wechatChatroomId: item.wechatChatroomId,
          groupName: item.groupName
        }
        if (indexOf(vue.form.wechatGroupList, wechatGroup, 'wechatChatroomId') <= -1) {
          vue.form.wechatGroupList.push(wechatGroup)
        }
      })
      vue.chooseNum = vue.form.wechatGroupList.length
      if (vue.chooseNum > 0) {
        vue.form.groupNameStr = vue.chooseNum + ''
      }
    },
    handleAdd() {
      if (!this.form.wechatId) {
        this.$message({
          message: this.$t('请选择微信号'),
          type: 'warning'
        })
        return
      }
      this.wechatGroupChooseVisible = true
    },
    async handleWechatIdChange() {
      this.chooseNum = 0
      this.form.groupNameStr = ''
      this.form.wechatGroupList = []
    }
  }
}

function indexOf(sourceArr, target, field) {
  for (let i = 0; i < sourceArr.length; i++) {
    const item = sourceArr[i]
    if (item[field] === target[field]) {
      return i
    }
  }
  return -1
}
</script>

<style scoped>
  .simple-form {
    width: 800px;
  }
</style>
