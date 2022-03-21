<template>
  <el-form
    v-show="editNew"
    ref="tableForm"
    :model="tableForm"
    :rules="dbRules"
    :disabled="!editNew"
    label-width="120px"
    class="demo-ruleForm"
  >
    <ody-title title="数据库信息" />
    <div class="form-item-list">
      <el-row>
        <el-col :span="6">
          <el-form-item label="数据库主机" prop="host" class="form-item">
            <el-input v-model="tableForm.host" name="tableForm_host" />
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item label="数据库端口" prop="port" class="form-item">
            <ody-input-number v-model="tableForm.port" name="tableForm_port" />
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="账号" prop="username" class="form-item">
            <el-input v-model="tableForm.username" name="tableForm_username" />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item label="密码" prop="password" class="form-item">
            <el-input v-model="tableForm.password" name="tableForm_password" type="password"/>
          </el-form-item>
        </el-col>
      </el-row>
    </div>
    <el-form-item>
      <ody-button name="ui_handleDbFormSubmit" size="small" code="ui" type="primary" @click="handleDbFormSubmit">连接</ody-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'DbInfo',
  components: {},
  props: {
    editNew: { type: Boolean, default: false },
    isConnected: { type: Boolean, default: false },
    tableForm: { type: Object, default: function() { return {} } }
  },
  data() {
    return {
      dbRules: []
    }
  },
  methods: {
    // 连接
    async handleDbFormSubmit() {
      await this.sleep(100)
      const codeModelService = this.$ouser.$api.codeModelService
      try {
        const params = {}
        params.host = this.tableForm.host
        params.port = this.tableForm.port
        params.username = this.tableForm.username
        params.password = this.tableForm.password
        params.db = ''
        const res = await codeModelService.listDatabase(params)

        this.isConnected = true
        this.$emit('update:isConnected', this.isConnected)
        this.$emit('ok', res.data)
      } catch (e) {
        console.log(e)
      }
    },
    sleep(timer) {
      return new Promise(resolve => setTimeout(resolve, timer))
    }
  }
}
</script>
