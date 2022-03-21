<template>
  <div>
    <el-row>
      <el-col :span="8">
        <el-input
          v-model="filterText"
          :placeholder="$t('请输入层级名称')"
          name="filterText"/>
        <div style="height: 450px; overflow: auto;">
          <el-tree
            ref="tree"
            :data="treeData"
            :filter-node-method="filterNode"
            name="treeData864"
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
                    <el-dropdown-item @click.native="addOrg(data)">{{ $t('新增下级层级') }}</el-dropdown-item>
                    <el-dropdown-item @click.native="editOrg(data)">{{ $t('编辑层级') }}</el-dropdown-item>
                    <el-dropdown-item v-if="data.pId" @click.native="deleteOrg(data)">{{ $t('删除层级') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </span>
            </span>
        </el-tree></div>
      </el-col>
      <el-col :span="8" style="margin-left: 3%">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('层级详情') }}</span>
          </div>
          <label>{{ $t('层级编码') }}</label>
          <el-input v-model="selectObj.levelCode" :disabled="true" name="selectObj_levelCode" size="small" style="width: 200px;"/>
          <br>
          <div style="margin-top: 3%">
            <label>{{ $t('层级名称') }}</label>
            <el-input v-model="selectObj.levelName" :disabled="true" name="selectObj_levelName" size="small" style="width: 200px;"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <ody-dialog v-if="editObj.show" :visible.sync="editObj.show" :title="editObj.title">
      <el-form ref="edit" :label-position="left" :rules="rules" :model="editObj.obj" >
        <el-form-item v-if="editObj.obj.parentLevelCode" :label="$t('上级编码')">
          <el-input v-model="editObj.obj.parentLevelCode" name="editObj_obj_parentLevelCode" disabled="true"/>
        </el-form-item>
        <el-form-item v-if="editObj.obj.parentLevelName" :label="$t('上级名称')">
          <el-input v-model="editObj.obj.parentLevelName" name="editObj_obj_parentLevelName" disabled="true"/>
        </el-form-item>
        <el-form-item :label="$t('层级编码')" prop="levelCode">
          <el-input v-model="editObj.obj.levelCode" name="editObj_obj_levelCode" />
        </el-form-item>
        <el-form-item :label="$t('层级名称')" prop="levelName">
          <el-input v-model="editObj.obj.levelName" name="editObj_obj_levelName"/>
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
  name: 'OuserOrgLevel',
  data() {
    return {
      // 树过滤对象
      filterText: '',
      // 树源数据
      treeData: [],
      // 新增编辑框对象
      editObj: { },
      // 当前选择的组织节点对象
      selectObj: {
        levelCode: null,
        levelName: null
      },
      rules: {
        levelCode: [
          { required: true, message: '请输入层级编码', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: '仅支持字母数字下划线', trigger: 'change' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ],
        levelName: [
          { required: true, message: '请输入层级名称', trigger: 'change' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    // 监控层级树搜索框值的变化
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
      const orgLevelService = this.$ouser.$api.orgLevelService
      this.initEditObj()
      orgLevelService.queryOrgLevelInfoList({}).then(res => {
        this.treeData = util.arr2tree(res.data, 'id', 'pId', 'name')
      })
    },
    initEditObj() {
      this.editObj = { show: false, title: '', obj: {}}
    },
    addOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = '新增层级'
      this.editObj.obj = {
        parentLevelCode: data.id,
        parentLevelName: data.name
      }
    },
    editOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = '编辑层级'
      this.editObj.obj = {
        levelName: data.levelName,
        levelCode: data.levelCode,
        oldLevelCode: data.oldLevelCode,
        id: data.id
      }
    },
    cancel() {
      this.initEditObj()
    },
    commit() {
      this.$refs['edit'].validate((valid) => {
        if (valid) {
          const orgLevelService = this.$ouser.$api.orgLevelService
          const self = this
          if (this.editObj.obj.parentLevelCode) {
            orgLevelService.addOrgLevelInfo(this.editObj.obj).then(res => {
              self.$message({
                message: '添加成功',
                type: 'success'
              })
              this.init()
            })
          } else {
            orgLevelService.updateOrgLevelInfo(this.editObj.obj).then(res => {
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
      const orgLevelService = this.$ouser.$api.orgLevelService
      const self = this
      orgLevelService.delOrgLevelInfo({ levelCode: data.levelCode }).then(res => {
        self.$message({
          message: '删除成功',
          type: 'success'
        })
        this.init()
      })
    },
    // 层级树搜索框触发方法
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    // 点击某个部门的回调方法
    nodeClick(data, node, arr) {
      this.selectObj = data
    }
  }
}
</script>
