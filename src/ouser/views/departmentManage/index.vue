<template>
  <ody-box :title="$t('组织架构')" class="pg-department-manage">
    <section class="left">
      <tree @onSelectNode="onSelectNode"/>
    </section>
    <section class="right">
      <detail v-if="selectNode !== null" :key="selectNode.id" :node="selectNode"/>
      <employee v-if="selectNode !== null" :key="selectNode.id" :node-id="selectNode.originalId"/>
    </section>
  </ody-box>
</template>

<script>

import Tree from '@/views/departmentManage/tree'
import Detail from '@/views/departmentManage/detail'
import Employee from '@/views/departmentManage/employee'
export default {
  components: {
    Tree,
    Detail,
    Employee
  },
  data() {
    return {
      selectNode: null
    }
  },
  methods: {
    onSelectNode(node) {
      this.selectNode = node
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-department-manage {
  min-height: 700px;
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
      top: 120px;
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
  .right {
    margin-left: 300px;
    // padding: 20px;
    min-height: 700px;
  }
  .expand-right {
    margin-top: 20px;
    float: right;
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
  .custom-tree-node {
    font-size: 14px;
    display: flex;
    align-items: center;
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
  .el-dropdown-wrap {
    position: relative;
    display: flex;
    margin-left: auto;
  }
}
</style>
