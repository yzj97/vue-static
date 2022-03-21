<template>
  <div class="category-edit">
    <el-input
      v-model="filterText"
      :placeholder="$t('请输入类目树名称')"
      name="filterText"
      class="margin"
      @input="searchChange"
    />
    <ody-left-right>
      <div slot="left">
        <el-button-group v-if="isEdit">
          <el-button
            v-if="!isRefer"
            name="toBatch"
            size="small"
            @click="toBatch"
          >{{ $t("批量导入") }}</el-button
          >
          <el-button
            v-if="!isRefer"
            name="taskVisible"
            size="small"
            @click="taskVisible = true"
          >{{ $t("查看任务") }}</el-button
          >
          <ody-category-transfer
            v-if="isRefer"
            :selected.sync="checkedNodes"
            :category-type="4"
            :show-checked-count="false"
            :params="{ id: data[0].refId }"
            :disabled-id-list="currentTreeIds"
            :label="$t('调整节点')"
            @ok="handleReferTreeChange"
          />
        </el-button-group>
      </div>
      <div slot="right">
        <el-button
          name="handleToggleExpand"
          type="text"
          size="mini"
          @click="handleToggleExpand"
        >
          <template v-if="defaultExpand">
            {{ $t("收起") }}<i class="el-icon-caret-bottom el-icon--right" />
          </template>
          <template v-else>
            {{ $t("展开") }}<i class="el-icon-caret-top el-icon--right" />
          </template>
        </el-button>
      </div>
    </ody-left-right>

    <el-tree
      v-if="openOrNot"
      ref="tree"
      :data="data"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      :default-expand-all="defaultExpand"
      :default-expanded-keys="defaultExpandedKeys"
      node-key="id"
      name="data911"
      class="filter-tree"
      highlight-current
      @node-expand="nodeExpandHandle"
      @node-click="handleNodeClick"
    >
      <span
        slot-scope="{ node, data }"
        class="custom-tree-node"
        style="width: 100%"
      >
        <span :dataType="data.level" class="levelIcon">
          <img
            v-if="data.level === 0"
            src="../../../../static/images/level-one.png"
            class="levelIcon-one"
          >
          <img
            v-if="data.level === 1"
            src="../../../../static/images/level-two.png"
            class="levelIcon-two"
          >
          <img
            v-if="data.level !== 0 && data.level !== 1"
            src="../../../../static/images/level-three.png"
            class="levelIcon-three"
          >
        </span>
        <span v-if="node.label.length <= 12">{{ node.label }}</span>
        <span
          v-if="node.label.length > 12"
          :title="node.label"
        >{{ node.label.substring(0, 10) }}...</span
        >
        <div v-if="!isRefer && isEdit" class="el-dropdown-wrap" @click.stop>
          <el-dropdown placement="bottom-start" trigger="click">
            <span class="el-dropdown-link">
              <span class="circle" />
              <span class="circle" />
              <span class="circle" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <div class="heightAuto" @click="append(data)">
                  <i
                    name="append"
                    class="el-icon-plus color-btn"
                  />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="heightAuto" @click="modifyCategory(data)">
                  <i
                    name="modifyCategory"
                    class="el-icon-edit color-btn"
                  />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="heightAuto" @click="treeAction(data, 'UP')">
                  <i
                    name="treeAction"
                    class="el-icon-arrow-up color-btn"
                  />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="heightAuto" @click="treeAction(data, 'DOWN')">
                  <i
                    name="treeAction1"
                    class="el-icon-arrow-down color-btn"
                  />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="heightAuto" @click="treeAction(data, 'TOP')">
                  <i
                    name="treeAction7"
                    class="el-icon-caret-top color-btn"
                  />
                </div>
              </el-dropdown-item>
              <el-dropdown-item>
                <div class="heightAuto" @click="treeAction(data, 'BOTTOM')">
                  <i
                    name="treeAction5"
                    class="el-icon-caret-bottom color-btn"
                  />
                </div>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </span>
    </el-tree>
    <category-dialog-children-add
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :parent-id="currentNode.id"
      :dialog-content-flg="dialogContentFlg"
      :category-type="data[0].type"
      @ok="addCategory"
      @closeDialog="closeDialog"
    />
    <category-dialog-modify
      v-if="modDialogVisible"
      :visible.sync="modDialogVisible"
      :mod-node="currentNode"
      :dialog-content-flg="dialogContentFlg"
      :category-type="data[0].type"
      @ok="addCategory"
      @closeDialog="closeDialog"
    />
    <importTask
      :import-type="importType"
      :task-type="taskType"
      :is-data-task="true"
      :visible.sync="taskVisible"
    />
  </div>
</template>
<script>
import categoryDialogChildrenAdd from '@/components/category-dialog-children-add'
import categoryDialogModify from '@/components/category-dialog-modify'
import importTask from '@/components/downloadTask/ImportTask.vue'
export default {
  components: {
    categoryDialogChildrenAdd,
    categoryDialogModify,
    importTask
  },
  props: {
    categoryId: {
      type: 'string',
      default: ''
    },
    isEdit: {
      type: 'Boolean',
      default: true
    }
  },
  data() {
    return {
      openOrNot: true,
      defaultExpand: true,
      dialogVisible: false,
      dialogContentFlg: 2,
      modDialogVisible: false,
      taskVisible: false,
      importType: 4,
      taskType: 'categoryImport',
      filterText: '',
      isRefer: false,
      data: [],
      currentNode: {},
      currentTreeIds: [],
      checkedNodes: [],
      refMap: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      defaultExpandedKeys: ['1623404572875008']
    }
  },
  /* watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },*/
  mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.queryTree()
  },
  methods: {
    searchChange() {
      this.queryTree()
    },
    closeDialog() {
      this.dialogContentFlg = 2
    },
    handleToggleExpand() {
      this.defaultExpand = !this.defaultExpand
      if (this.defaultExpand === false) {
        this.defaultExpandedKeys = []
      }
      this.openOrNot = false
      this.$nextTick(() => {
        this.openOrNot = true
      })
    },
    handleReferTreeChange(val) {
      var arr = this.$portal.tree2arr(val)
      var addedNodes = []
      arr.map(item => {
        if (!this.refMap[item.id]) {
          addedNodes.push(item)
        }
      })
      if (addedNodes.length === 0) {
        this.$message({
          type: 'info',
          message: this.$t('没有新增的节点')
        })
        return
      }
      this.mpApi
        .appendCopyCategory({
          type: this.data[0].type,
          storeId: this.data[0].storeId,
          checkedNodes: addedNodes
        })
        .then(res => {
          if (res.code === '0') {
            this.queryTree()
          }
        })
    },
    queryTree() {
      this.mpApi.newListCategoryTree({ id: this.categoryId, name: this.filterText }).then(res => {
        if (res.data === null) {
          this.data = []
        } else {
          this.data = new Array(res.data)
        }

        if (res.data.type === 1) {
          this.importType = 4
          this.taskType = 'categoryImport'
        } else if (res.data.type === 2) {
          this.importType = 5
          this.taskType = 'frontCategoryImport'
        } else if (res.data.type === 4) {
          this.importType = 6
          this.taskType = 'merchantCategoryImport'
        } else if (res.data.type === 6) {
          this.importType = 7
          this.taskType = 'storeCategoryImport'
        }
        if (res.data.refId && res.data.refId > 0) {
          this.isRefer = true
          this.currentTreeIds = []
          var arr = this.$portal.tree2arr(this.data)
          arr.map(item => {
            this.refMap[item.refId] = item
            this.currentTreeIds.push(item.refId)
          })
        }
        this.handleNodeClick(this.data[0])
      })
    },
    addCategory() {
      this.defaultExpandedKeys = [this.currentNode.id]
      this.dialogContentFlg = 2
      this.queryTree()
    },
    append(data) {
      this.currentNode = JSON.parse(JSON.stringify(data))
      // 如果是前台移动端类目
      console.log(data)
      console.log(this.currentNode)
      console.log(data.type === 2)
      console.log(data.level === 1)
      if (data.type === 2 && data.level === 1) {
        this.dialogContentFlg = 0
      }
      this.dialogVisible = true
    },
    modifyCategory(data) {
      this.currentNode = JSON.parse(JSON.stringify(data))
      console.log(data)
      console.log(this.currentNode)
      console.log(data.type === 2)
      console.log(data.level === 2)
      if (data.type === 2 && data.level === 2) {
        this.dialogContentFlg = 0
      }
      this.modDialogVisible = true
    },
    filterNode(value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    },
    handleNodeClick(data) {
      this.currentNode = JSON.parse(JSON.stringify(data))
      this.$emit('getData', JSON.parse(JSON.stringify(data)))
    },
    treeAction(data, action) {
      this.mpApi
        .updateCategorySortNode({
          firstCategoryId: this.categoryId,
          id: data.id,
          moveType: action
        })
        .then(res => {
          this.queryTree()
        })
    },
    toBatch() {
      this.$emit('toBatch', this.importType, this.taskType, this.categoryId)
    },
    getTask(param) {
      const data = {
        currentPage: param.limitStart / param.limitCount + 1,
        itemsPerPage: param.limitCount,
        importType: this.importType // 前后台类目导入
      }
      return this.$product.$api.mpApi.listImportTaskByPage(data)
    },
    nodeExpandHandle(nodes, node, self) {
      this.defaultExpandedKeys = [node.data.id]
    }
  }
}
</script>
<style lang="scss" scoped>
.margin {
  margin: 12px 0;
}
.color-btn {
  color: var(--themeColor);
  margin-left: 4px;
}
.custom-tree-node {
  display: flex;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.levelIcon {
  margin-right: 10px;
}
.levelIcon-one,
.levelIcon-two {
  width: 20px;
  display: inline-block;
}
.levelIcon-three {
  width: 14px;
  display: inline-block;
}
.el-dropdown {
  display: flex;
  align-items: center;
  margin-left: auto;
}
.el-dropdown-link {
  margin-left: 15px;
  display: flex;
  align-items: center;
  height: 20px;
  margin-right: 20px;
}
.el-dropdown-link .circle {
  width: 4px;
  height: 4px;
  display: flex;
  border-radius: 2px;
  font-size: 20px;
  background-color: #999999;
  display: inline-block;
  margin-right: 3px;
}
.el-dropdown-wrap {
  position: relative;
  display: flex;
  margin-left: auto;
}
/deep/ .el-dropdown-menu__item{
   width: 57px;
   padding: 0;
   height: 30px;
}
.heightAuto{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
