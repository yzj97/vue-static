<template>
  <div>
    <ody-title :title="$t('基本信息')" />
    <ody-left-right>
      <div id="selectNodeName" slot="left">{{ node.name }}</div>
      <div slot="right">
        <ody-button
          :disabled="!node.label"
          name="OuserDepartmentManage203_handleBaseInfoOpen"
          size="small"
          code="OuserDepartmentManage203"
          @click="handleBaseInfoOpen"
        >{{ $t('编辑') }}</ody-button>
      </div>
    </ody-left-right>

    <ody-dialog-full-right :visible.sync="dialogShow" :title="$t('编辑部门')" size="big">
      <ody-title :title="$t('部门信息')" />
      <el-row>
        <el-col :span="16" :offset="4">
          <el-form
            ref="editForm"
            :model="node"
            :rules="rules"
            label-position="right"
            label-width="120px"
          >
            <el-form-item :label="$t('编码')">
              <el-input
                v-model="node.code"
                :maxlength="50"
                name="selectNode_node_code"
                show-word-limit
                disabled="true"
                type="text"
              />
            </el-form-item>
            <el-form-item :label="$t('名称')" prop="name">
              <el-input v-model="node.name" :maxlength="50" name="selectNode_node_name" show-word-limit type="text" />
            </el-form-item>
            <el-form-item :label="$t('组织类型')">
              <el-select v-model="node.entityType" name="selectNode_node_entityType" disabled="selectNode.node.entityType">
                <el-option
                  v-for="item in entityTypeList"
                  :key="item.code"
                  :label="item.name"
                  :value="item.code"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="node.entityType !== 0" :label="$t('关联的组织名称')">
              <el-input
                v-model="node.entityName"
                name="node_entityName"
                disabled="true"/></el-form-item>
            <el-form-item :label="$t('状态')">
              <el-switch
                v-model="node.isAvailable"
                :active-value="1"
                :inactive-value="0"
                name="selectNode_node_isAvailable"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="conformDisabled"
              />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <ody-title :title="$t('部门权限')" />
      <div v-if="dialogShow" :key="node.originalId">
        <el-tabs v-model="activeName" name="activeName" tab-position="left">
          <el-tab-pane :label="$t('功能权限')" name="opera">
            <opera-add-role
              v-if="activeName === 'opera'"
              ref="opera"
              :can-edit="true"
              :department-id="node.originalId"
              :opera-department-id="node.originalId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('商家权限')" name="1">
            <auth
              v-if="activeName === '1'"
              :entity-type="1"
              :department-id="node.originalId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('店铺权限')" name="2">
            <auth
              v-if="activeName === '2'"
              :entity-type="2"
              :department-id="node.originalId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('仓库权限')" name="3">
            <auth
              v-if="activeName === '3'"
              :entity-type="3"
              :department-id="node.originalId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('客户权限')" name="4">
            <auth
              v-if="activeName === '4'"
              :entity-type="4"
              :department-id="node.originalId"/>
          </el-tab-pane>
          <el-tab-pane :label="$t('供应商权限')" name="5">
            <auth
              v-if="activeName === '5'"
              :entity-type="5"
              :department-id="node.originalId"/>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div slot="footer">
        <ody-button name="OuserDepartmentManage203_handleBaseInfoClose" code="OuserDepartmentManage203" @click="handleBaseInfoClose">{{ $t('取消') }}</ody-button>
        <ody-button name="OuserDepartmentManage203_updateNode" code="OuserDepartmentManage203" type="primary" @click="updateNode">{{ $t('保存') }}</ody-button>
      </div>
    </ody-dialog-full-right>
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
    node: {
      type: Object,
      default: function() {
        return {
        }
      }
    }
  },
  data() {
    return {
      dialogShow: false,
      activeName: 'opera',
      entityTypeList: []
    }
  },
  mounted() {
    this.$portal
      .get(
        '/ouser-web/public/config/select?category=DEPARTMENT_TYPE&pool=ouser'
      )
      .then(res => {
        this.entityTypeList = []
        for (const i in res.data) {
          this.entityTypeList.push({
            name: res.data[i],
            code: parseInt(i)
          })
        }
      })
  },
  methods: {
    handleBaseInfoOpen() {
      this.dialogShow = true
      if (this.node.entityType === 0) {
        console.log()
      } else if (this.node.entityType === 3) {
        this.$ouser.$api.warehouseService.getStockDetail(JSON.stringify(this.node.entityId)).then(res => {
          this.$set(this.node, 'entityName', res.data.warehouseName)
          this.$forceUpdate()
        })
      } else {
        this.$ouser.$api.orgService.getOrgById({ id: this.node.entityId }).then(res => {
          this.$set(this.node, 'entityName', res.data.orgName)
          this.$forceUpdate()
        })
      }
    },
    conformDisabled(isAvaliable) {
      if (isAvaliable === '0') {
        const self = this
        this.$confirm(
          this.$t('禁用组织可能造成用户数据权限丢失') +
          ',' +
          this.$t('请谨慎操作'),
          this.$t('提示'),
          {
            confirmButtonText: this.$t('确定'),
            cancelButtonText: this.$t('取消'),
            type: 'warning'
          }
        )
          .then(() => {
            self.node.isAvailable = 0
          })
          .catch(() => {
            self.node.isAvailable = 1
          })
      }
    },
    async updateNode() {
      const self = this
      const param = {}

      param.name = this.node.name
      param.id = this.node.originalId
      param.isAvailable = this.node.isAvailable

      const [err] = await this.formValidate('editForm')

      if (err) {
        return
      }

      await this.$ouser.$api.departmentService.update(param)
      await this.$refs.opera.updateRole()

      this.$message({
        message: self.$t('更新成功'),
        type: 'success'
      })
    },
    handleBaseInfoClose() {
      this.dialogShow = false
    }
  }
}
</script>

<style scoped>

</style>
