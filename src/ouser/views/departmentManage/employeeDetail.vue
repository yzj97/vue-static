<template>
  <div>
    <ody-title :title="$t('权限配置')" />
    <el-form>
      <el-form-item :label="$t('员工独立权限')+':'">
        <el-checkbox
          v-model="operaOn"
          :true-label="1"
          :false-label="0"
          name="operaOn">{{ $t('功能权限') }}</el-checkbox>
        <el-checkbox
          v-model="authOn"
          :true-label="1"
          :false-label="0"
          name="authOn">{{ $t('数据权限') }}</el-checkbox>
      </el-form-item>
    </el-form>
    <ody-title :title="$t('员工权限')" />
    <el-tabs v-model="activeName" name="activeName" tab-position="left">
      <el-tab-pane :label="$t('功能权限')" name="opera">
        <opera-add-role
          v-if="activeName === 'opera'"
          ref="editOn"
          :key="operaOn"
          :can-edit="operaOn === 1"
          :user-id="operaOn === 1?userId:null"
          :opera-department-id="operaOn === 1?null:nodeId"
          :department-id="nodeId"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('商家权限')" name="1">
        <auth
          v-if="activeName === '1'"
          ref="editOn"
          :key="authOn"
          :can-edit="authOn === 1"
          :entity-type="1"
          :user-id="userId"
          :department-id="nodeId"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('店铺权限')" name="2">
        <auth
          v-if="activeName === '2'"
          ref="editOn"
          :key="authOn"
          :can-edit="authOn === 1"
          :entity-type="2"
          :user-id="userId"
          :department-id="nodeId"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('仓库权限')" name="3">
        <auth
          v-if="activeName === '3'"
          ref="editOn"
          :key="authOn"
          :can-edit="authOn === 1"
          :entity-type="3"
          :user-id="userId"
          :department-id="nodeId"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('客户权限')" name="4">
        <auth
          v-if="activeName === '4'"
          ref="editOn"
          :key="authOn"
          :can-edit="authOn === 1"
          :entity-type="4"
          :user-id="userId"
          :department-id="nodeId"/>
      </el-tab-pane>
      <el-tab-pane :label="$t('供应商权限')" name="5">
        <auth
          v-if="activeName === '5'"
          ref="editOn"
          :key="authOn"
          :can-edit="authOn === 1"
          :entity-type="5"
          :user-id="userId"
          :department-id="nodeId"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import OperaAddRole from '@/views/operaAddRole'
import Auth from '@/views/departmentManage/auth'
export default {
  components: {
    OperaAddRole,
    Auth
  },
  props: {
    nodeId: {
      type: Number,
      default: null
    },
    userId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      operaOn: 0,
      authOn: 0,
      activeName: 'opera'
    }
  },
  mounted() {
    this.queryEmployeeOn()
  },
  methods: {
    queryEmployeeOn() {
      this.$ouser.$api.userService.getEmployeeOn({ userId: this.userId }).then(res => {
        this.operaOn = res.data.operaOn
        this.authOn = res.data.authOn
      })
    },
    async updateEmployeeOn() {
      await this.$ouser.$api.userService.updateEmployeeOn({ userId: this.userId, authOn: this.authOn, operaOn: this.operaOn }).then(res => {
        this.queryEmployeeOn()
      })
      await this.$refs.editOn.updateRole()
      await this.$message({ type: 'success', message: this.$t('保存成功') })
    }
  }
}
</script>

<style scoped>

</style>
