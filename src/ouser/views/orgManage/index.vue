<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="filterText"
          :placeholder="$t('请输入部门名称')"
          name="filterText"/>
        <div style="height: 450px; overflow: auto;">
          <el-tree
            ref="tree"
            :data="treeData"
            :filter-node-method="filterNode"
            name="treeData562"
            class="filter-tree"
            default-expand-all
            @node-click="nodeClick"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
              <span style="font-size: 14px">
                <span>{{ node.label }}</span>
              </span>
              <span style="float: right;padding-right: 4px">
                <el-dropdown>
                  <span class="el-dropdown-link">
                    <i class="el-icon-more"/>
                  </span>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item @click.native="addOrg(data)">{{ $t('新增下级部门') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="editOrg(data)">{{ $t('编辑部门') }}</el-dropdown-item>
                    <el-dropdown-item v-if="data.pId" @click.native="deleteOrg(data)">{{ $t('删除部门') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
        </el-tree></div>
      </el-col>
      <el-col :span="16" style="margin-left: 5%"/>
    </el-row>
    <ody-dialog v-if="editObj.show" :visible.sync="editObj.show" :title="editObj.title">
      <el-form ref="edit" :label-position="left" :rules="rules" :model="editObj.obj" >
        <el-form-item v-if="editObj.obj.parentCode" :label="$t('上级编码')">
          <el-input v-model="editObj.obj.parentCode" name="editObj_obj_parentCode" disabled="true"/>
        </el-form-item>
        <el-form-item v-if="editObj.obj.parentName" :label="$t('上级名称')">
          <el-input v-model="editObj.obj.parentName" name="editObj_obj_parentName" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('部门编码')" prop="code">
          <el-input v-model="editObj.obj.code" name="editObj_obj_code" />
        </el-form-item>
        <el-form-item :label="$t('部门名称')" prop="orgName">
          <el-input v-model="editObj.obj.orgName" name="editObj_obj_orgName"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="commit" type="primary" @click="commit">{{ $t('保存') }}</el-button>
        <el-button name="cancel" @click="cancel">取 消</el-button>
      </div>
    </ody-dialog>

  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'OuserOrgManage',
  data() {
    return {
      // 树过滤对象
      filterText: '',
      // 树源数据
      treeData: [],
      // 新增编辑框对象
      editObj: { },
      // 当前选择的组织节点对象
      selectObj: { },
      rules: {
        code: [
          { required: true, message: '请输入部门编码', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持字母数字下划线', trigger: 'change' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ],
        orgName: [
          { required: true, message: '请输入部门名称', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 监控部门树搜索框值的变化
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted() {
    // 初始化
    this.init()
  },
  methods: {
    async init() {
      const orgService = this.$ouser.$api.orgService
      this.initEditObj()
      orgService.getCurrentOrg({}).then(res => {
        this.treeData = util.arr2tree(res.data, 'id', 'pId', 'name')
      })
    },
    initEditObj() {
      this.editObj = { show: false, title: '', obj: {}}
    },
    addOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = '新增部门'
      this.editObj.obj = {
        parentCode: data.id,
        parentName: data.name
      }
    },
    editOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = '编辑部门'
      this.editObj.obj = {
        orgName: data.name,
        code: data.id,
        id: data.orgId
      }
    },
    cancel() {
      this.initEditObj()
    },
    commit() {
      this.$refs['edit'].validate((valid) => {
        if (valid) {
          const orgService = this.$ouser.$api.orgService
          const self = this
          if (this.editObj.obj.parentCode) {
            orgService.addOneOrg(this.editObj.obj).then(res => {
              self.$message({
                message: '添加成功',
                type: 'success'
              })
              this.init()
            })
          } else {
            orgService.editOneOrg(this.editObj.obj).then(res => {
              self.$message({
                message: '修改成功',
                type: 'success'
              })
              this.init()
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    deleteOrg(data) {
      const orgService = this.$ouser.$api.orgService
      const self = this
      orgService.deleteOneOrg({ id: data.orgId }).then(res => {
        self.$message({
          message: '删除成功',
          type: 'success'
        })
        this.init()
      })
    },
    // 部门树搜索框触发方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    }
  }
}
</script>
