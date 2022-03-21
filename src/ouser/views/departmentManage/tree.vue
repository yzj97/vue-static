<template>
  <div class="left">
    <span
      :class="{active: searchTab === 'department'}"
      name="handleChangeSearchTab"
      class="input-tabs"
      @click="handleChangeSearchTab('department')"
    >{{ $t('部门') }}</span>
    <span
      :class="{active: searchTab === 'employee'}"
      name="handleChangeSearchTab5"
      class="input-tabs"
      @click="handleChangeSearchTab('employee')"
    >{{ $t('员工') }}</span>
    <el-row>
      <el-col :span="22">
        <el-input
          v-model="searchText"
          :placeholder="searchTab === 'department' ? $t('请输入组织名称'): $t('请输入员工账号')"
          name="filterText"
          @keydown.native.enter="findNode"
        >
          <i slot="suffix" name="findNode" class="el-icon-search el-input__icon" @click="findNode" />
        </el-input>
      </el-col>
      <el-col :span="2">
        <i name="refreshFindNode" class="el-icon-refresh" style="padding: 8px" @click="refreshFindNode" />
      </el-col>
    </el-row>
    <el-scrollbar
      v-if="treeType === 'normal'"
      :key="treeType"
      class="left-tree">
      <el-tree
        v-loading="loadingTree"
        ref="normalTree"
        :load="loadChildren"
        :data="treeData"
        lazy
        name="normalTree199"
        class="filter-tree"
        highlight-current="true"
        node-key="id"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
          <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
              <span>{{ data.name }}</span>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-if="data.pId !== '0' && $portal.hasPermission('OuserDepartmentManage200')"
                name="Ouser-DepartmentManage204"
                code="Ouser-DepartmentManage204"
                @click.native="openAddDialog(data)"
              >{{ $t('新增同级') }}</el-dropdown-item>
              <el-dropdown-item
                v-if="$portal.hasPermission('OuserDepartmentManage201')"
                name="Ouser-DepartmentManage205"
                code="Ouser-DepartmentManage205"
                @click.native="openAddChildDialog(data)"
              >{{ $t('新增下一级') }}</el-dropdown-item>
              <el-dropdown-item
                v-if="data.pId !== '0' && $portal.hasPermission('OuserDepartmentManage202')"
                name="Ouser-DepartmentManage206"
                code="Ouser-DepartmentManage206"
                @click.native="openConfirmDelete(data)"
              >{{ $t('删除') }}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </span>
      </el-tree>
    </el-scrollbar>
    <el-scrollbar
      v-if="treeType === 'search'"
      :key="treeType"
      class="left-tree">
      <el-tree
        ref="searchTree"
        :data="searchTreeData"
        name="searchTree199"
        default-expand-all
        class="filter-tree"
        highlight-current="true"
        node-key="id"
        @node-click="nodeClick"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node" style="width: 100%">
          <el-dropdown placement="bottom-start">
            <span class="el-dropdown-link">
              <span v-if="data.finded === 0">{{ data.name }}</span>
              <span v-if="data.finded === 1" style="color: red">{{ data.name }}</span>
            </span>
          </el-dropdown>
        </span>
      </el-tree>
    </el-scrollbar>
    <ody-dialog
      :visible.sync="editDialog.show"
      :before-close="closeDialog"
      :title="$t('新增组织节点')"
      width="600px"
      @close="closeDialog"
    >
      <div>
        <el-col :span="16" :offset="2">
          <el-form
            ref="addForm"
            :model="editDialog.obj"
            :rules="rules"
            label-position="right"
            label-width="100px"
          >
            <el-form-item :label="$t('编码')" prop="code">
              <el-input
                v-model="editDialog.obj.code"
                :maxlength="50"
                name="selectNode_addDialog_obj_code"
                show-word-limit
                type="text"
              />
            </el-form-item>
            <el-form-item :label="$t('名称')" prop="name">
              <el-input
                v-model="editDialog.obj.name"
                :maxlength="50"
                name="selectNode_addDialog_obj_name"
                show-word-limit
                type="text"
              />
            </el-form-item>
            <el-form-item :label="$t('状态')">
              <el-switch
                v-model="editDialog.obj.isAvailable"
                :active-value="1"
                :inactive-value="0"
                name="selectNode_addDialog_obj_isAvailable"
                active-color="#13ce66"
                inactive-color="#ff4949"
              />
            </el-form-item>
            <el-form-item>
              <ody-button
                name="Ouser-DepartmentManage207_commitAddDialog"
                code="ui"
                type="primary"
                size="mini"
                @click="commitAddDialog"
              >{{ $t('保存') }}</ody-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </ody-dialog>
  </div>
</template>

<script>
import util from '@/utils/util'

export default {
  data() {
    return {
      searchTab: 'department',
      searchText: null,
      loadingTree: false,
      selectNode: null,
      treeData: [],
      searchTreeData: [],
      treeType: 'normal',
      editDialog: {
        show: false,
        opera: 'add',
        obj: {
          code: null,
          name: null,
          isAvailable: 1,
          parentCode: null
        }
      },
      rules: {
        code: [
          { required: true, message: this.$t('请输入编码'), trigger: 'change' },
          {
            pattern: /^[0-9a-zA-Z_]*$/,
            message: this.$t('仅支持字母数字下划线'),
            trigger: 'change'
          },
          {
            min: 1,
            max: 50,
            message:
              this.$t('长度在') +
              ' 1 ' +
              this.$t('到') +
              ' 50 ' +
              this.$t('个字符'),
            trigger: 'change'
          }
        ],
        name: [
          { required: true, message: this.$t('请输入名称'), trigger: 'change' },
          {
            min: 1,
            max: 50,
            message:
              this.$t('长度在') +
              ' 1 ' +
              this.$t('到') +
              ' 50 ' +
              this.$t('个字符'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.loadingTree = true
      // 初始化
      await this.init()
      this.loadingTree = false
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    async init() {
      try {
        this.searchText = null
        this.treeType = 'normal'
        await this.$ouser.$api.departmentService.listUserDepartment({}).then(res => {
          const data = res.data
          data.forEach(i => {
            i.finded = 0
          })
          this.treeData = util.arr2tree(data, 'code', 'parentCode', 'name')
        })
      } catch (e) {
        console.log(e)
      }
    },
    handleChangeSearchTab(searchTab) {
      this.searchTab = searchTab
    },
    findNode() {
      if (this.searchText === null || this.searchText === '') {
        this.$message({ type: 'warn', message: this.searchTab === 'department' ? this.$t('请输入组织名称') : this.$t('请输入员工账号') })
        return
      }
      const param = {}
      if (this.searchTab === 'department') {
        param.name = this.searchText
      } else {
        param.username = this.searchText
      }

      this.$ouser.$api.departmentService.search(param).then(res => {
        this.treeType = 'search'
        const data = res.data
        this.searchTreeData = util.arr2tree(data, 'code', 'parentCode', 'name')
      })
    },
    refreshFindNode() {
      this.searchText = null
      this.treeType = 'normal'
      this.searchTreeData = []
      this.init()
    },
    nodeClick(node) {
      node.entityName = ''
      this.selectNode = node
      this.$emit('onSelectNode', node)
    },
    closeDialog() {
      this.$refs['addForm'].resetFields()
      this.editDialog.show = false
      this.editDialog.opera = 'add'
      this.editDialog.obj = {
        code: null,
        name: null,
        isAvailable: 1,
        parentCode: null
      }
    },
    openAddDialog(obj) {
      this.editDialog.show = true
      this.editDialog.opera = 'add'
      this.editDialog.obj.parentCode = obj.pId
    },
    openAddChildDialog(obj) {
      this.editDialog.show = true
      this.editDialog.opera = 'addChildren'
      this.editDialog.obj.parentCode = obj.id
    },
    openConfirmDelete(data) {
      this.$confirm(
        this.$t('此操作将永久删除该节点') + ',' + this.$t('是否继续') + '?',
        this.$t('提示'),
        {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        }
      )
        .then(() => {
          this.deleteNode(data)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('已取消删除')
          })
        })
    },
    deleteNode(obj) {
      this.$ouser.$api.departmentService
        .delete({ id: obj.originalId })
        .then(res => {
          this.$message({
            message: this.$t('删除成功'),
            type: 'success'
          })
          this.init()
        })
    },
    loadChildren(node, resolve) {
      this.$ouser.$api.departmentService.listByParentCode({ parentCode: node.data.code }).then(res => {
        const data = res.data
        data.forEach(o => {
          o.originalId = o.id
          o.originalPId = o.pId
          o.originalLabel = o.label
          o.id = o.code
          o.label = o.name
          o.pId = o.parentCode
          o.finded = 0
        })
        resolve(data)
      })
    },
    commitAddDialog() {
      const self = this
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          this.$ouser.$api.departmentService
            .add(this.editDialog.obj)
            .then(res => {
              self.$message({
                message: self.$t('新增成功'),
                type: 'success'
              })
              self.init()
              self.closeDialog()
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.left {
  position: absolute;
  top: 0;
  left: 0;
  width: 300px;
  bottom: 0;
  min-height: 700px;
  border-right: 1px solid #eff2f7;
  padding: 20px;
  .input-tabs {
    width: 32px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    display: inline-block;
    margin-right: 10px;
    font-size: 12px;
    cursor: pointer;
    &.active {
      background-color: var(--themeColor);
      color: #fff;
    }
  }
  .left-tree {
    position: absolute;
    top: 90px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    height: auto;
    /deep/ {
      .el-scrollbar__wrap {
        overflow: auto;
      }
    }
  }
}
</style>
