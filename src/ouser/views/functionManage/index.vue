<template>
  <div>
    <el-row>
      <el-col :span="6">
        <el-row>
          <el-input
            v-model="filterText"
            :placeholder="$t('请输入组织名称')"
            name="filterText"/>
        </el-row>

        <el-row>
          <div style="height: 450px; overflow: auto;">
            <el-tree
              ref="tree"
              :data="treeData"
              :props="defaultProps"
              :filter-node-method="filterNode"
              name="treeData769"
              class="filter-tree"
              default-expand-all
              @node-click="nodeClick"
          /></div>
        </el-row>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
}
</script>

