<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="120px" class="simple-form">
      <el-form-item :label="$t('任务名称')" prop="name">
        <el-input v-model="form.name" name="form_name" type="text" maxlength="50" show-word-limit/>
      </el-form-item>
      <el-form-item :label="$t('任务类型')" prop="type">
        <el-select v-model="form.type" :placeholder="$t('请选择')" name="form_type">
          <el-option
            v-for="(k,v) in typeList"
            :key="v"
            :label="k"
            :value="v"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="$t('任务指标')" prop="targetNumber">
        <ody-input-number v-model="form.targetNumber" :decimal="2" :min="0.01" :max="9999999999.99" name="form_targetNumber"/>
      </el-form-item>
      <el-form-item :label="$t('发送范围')" prop="nameStr">
        <ody-button name="ui_handleAdd" code="ui" size="small" type="primary" @click="handleAdd">{{ $t('选择范围') }}</ody-button>
        <el-input v-model="form.nameStr" :autosize="{ minRows: 4, maxRows: 6}" name="form_nameStr" type="textarea" disabled="disabled"/>
      </el-form-item>
      <el-form-item :label="$t('任务内容')" prop="content">
        <el-input
          v-model="form.content"
          :autosize="{ minRows: 4, maxRows: 6}"
          name="form_content"
          type="textarea"
          maxlength="500"
          show-word-limit/>
      </el-form-item>
    </el-form>
    <ody-fixed>
      <el-button name="handleClose" size="small" type="default" @click="handleClose">{{ $t('close') }}</el-button>
      <ody-button name="ui_handleSubmit" code="ui" size="small" type="primary" @click="handleSubmit">{{ $t('save') }}</ody-button>
    </ody-fixed>
    <guide-user-list-dialog :visible.sync="guideUserListDialogVisible" @ok="handleSelectUser"/>
  </div>
</template>

<script>
import GuideUserListDialog from '@/components/guide-user-list-dialog'

export default {
  name: 'CrmGuideTaskUserAdd',
  components: {
    GuideUserListDialog
  },
  data() {
    return {
      typeList: [],
      guideUserListDialogVisible: false,
      form: {
        name: '',
        type: '',
        targetNumber: '',
        nameStr: '',
        userList: []
      },
      rules: {
        name: [
          { required: true, message: this.$t('请输入任务名称'), trigger: 'blur' }
        ],
        type: [
          { required: true, message: this.$t('请选择任务类型'), trigger: 'change' }
        ],
        targetNumber: [
          { required: true, message: this.$t('请输入任务指标'), trigger: 'blur' }
        ],
        nameStr: [
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
      const res = await this.$crm.$api.common.codeListMulti({ categories: ['GUIDE_TASK_TYPE'], pool: 'crm' })
      this.typeList = res.data.GUIDE_TASK_TYPE
    },
    handleSubmit() {
      const vue = this
      vue.$refs['form'].validate((valid) => {
        if (valid) {
          vue.$crm.$api.staticUserGroup.addGuideTaskUser(vue.form).then(res => {
            if (res.code === '0') {
              vue.$message.success(vue.$t('保存成功'))
              vue.$portal.delActiveViewAndRefresh()
            }
          })
        }
      })
    },
    handleClose() {
      this.$portal.delActiveViewAndRefresh()
    },
    handleSelectUser(selectUser) {
      const vue = this
      vue.form.userList = []
      vue.form.nameStr = ''
      selectUser.forEach(item => {
        const user = {
          identityCardName: item.identityCardName ? item.identityCardName : '',
          username: item.userName ? item.userName : item.mobile,
          userId: item.userId
        }
        if (indexOf(vue.form.userList, user, 'userId') <= -1) {
          if (vue.form.userList.length <= 99) {
            const name = item.identityCardName ? item.identityCardName : (item.username ? item.username : item.mobile)
            vue.form.userList.push(user)
            if (vue.form.nameStr === '') {
              vue.form.nameStr = vue.form.nameStr + name
            } else {
              vue.form.nameStr = vue.form.nameStr + '，' + name
            }
          } else {
            vue.$message.warning(vue.$t('最多选择100个导购员'))
          }
        }
      })
    },
    handleAdd() {
      this.guideUserListDialogVisible = true
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
