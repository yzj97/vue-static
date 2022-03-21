<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-input
          v-model="filterText"
          :placeholder="$t('请输入层级名称')"
          name="filterText"/>
        <div style="height: 450px; overflow: auto;">
          <el-tree
            ref="tree"
            :data="treeData"
            :filter-node-method="filterNode"
            name="treeData628"
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
      <el-col :span="16" style="margin-left: 5%">
        <el-form>
          <el-form-item :label="$t('层级编码')">
            <el-input v-model="selectObj.levelCode" name="selectObj_levelCode" disabled="true" />
          </el-form-item>
          <el-form-item :label="$t('层级名称')">
            <el-input v-model="selectObj.levelName" name="selectObj_levelName" disabled="true" />
          </el-form-item>
        </el-form>
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
        <el-button name="cancel" @click="cancel">{{ $t('取消') }}</el-button>
      </div>
    </ody-dialog>

  </div>
</template>

<script>
import util from '@/utils/util'
export default {
  name: 'MerchantOrgManage',
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
        levelCode: [
          { required: true, message: this.$t('请输入层级编码'), trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]*$/, message: this.$t('仅支持字母数字下划线'), trigger: 'change' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }
        ],
        levelName: [
          { required: true, message: this.$t('请输入层级名称'), trigger: 'change' },
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
      const orgService = this.$merchant.$api.orgService
      this.initEditObj()
      orgService.queryOrgLevelInfoList({}).then(res => {
        this.treeData = util.arr2tree(res.data, 'levelCode', 'parentLevelCode', 'levelName')
      })
    },
    initEditObj() {
      this.editObj = { show: false, title: '', obj: {}}
    },
    addOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = this.$t('新增层级')
      this.editObj.obj = {
        parentLevelCode: data.levelCode,
        parentLevelName: data.levelName
      }
    },
    editOrg(data) {
      this.initEditObj()
      this.editObj.show = true
      this.editObj.title = this.$t('编辑层级')
      this.editObj.obj = {
        levelName: data.levelName,
        levelCode: data.levelCode,
        oldLevelCode: data.levelCode
      }
    },
    cancel() {
      this.initEditObj()
    },
    commit() {
      this.$refs['edit'].validate((valid) => {
        if (valid) {
          const orgService = this.$merchant.$api.orgService
          const self = this
          if (this.editObj.obj.parentLevelCode) {
            orgService.addOrgLevelInfo(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('添加成功'),
                type: 'success'
              })
              this.init()
            })
          } else {
            orgService.updateOrgLevelInfo(this.editObj.obj).then(res => {
              self.$message({
                message: this.$t('修改成功'),
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
      const orgService = this.$merchant.$api.orgService
      const self = this
      orgService.delOrgLevelInfo({ levelCode: data.levelCode, isDeleted: 1 }).then(res => {
        self.$message({
          message: this.$t('删除成功'),
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
    nodeClick(data, node, tree) {
      this.selectObj = data
    }
  }
}
</script>
