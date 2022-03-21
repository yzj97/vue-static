<template>
  <div class="organization-tree">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-input
          v-model="filterText"
          placeholder="输入关键字进行过滤">
          <i slot="suffix" class="el-input__icon el-icon-search" @click="handleSearch"/>
        </el-input>
        <div class="organization-tree__list">
          <el-tree
            v-show="showAll"
            ref="treeAll"
            :props="props"
            :load="loadNode"
            :check-strictly="true"
            lazy
            node-key="code"
            show-checkbox
            @check="handleCheck"
          />
          <el-tree
            v-show="!showAll"
            ref="treeSearch"
            :data="searchData"
            :props="props"
            :default-expanded-keys="searchAllCodeList"
            :check-strictly="true"
            node-key="code"
            show-checkbox
            @check="handleSearchCheck"
          />
        </div>

      </el-col>
      <el-col :span="12">
        <div
          v-for="(tag, tagIndex) in checkedNodes"
          :key="tagIndex"
          class="organization-tree__tag-item">
          <el-tag
            type="info"
            closable
            @close="handleClose(tag, tagIndex)"
          >
            {{ tag.name }}
          </el-tag>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      filterText: '',
      checkedKeys: [],
      checkedNodes: [],
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      searchData: [],
      searchAllCodeList: [],
      showAll: true
    }
  },
  methods: {
    handleSearchCheck(node, { checkedKeys, checkedNodes }) {
      const noSearchCheckedKeys = this.checkedKeys.filter(x => !this.searchAllCodeList.includes(x))
      const noSearchCheckedNodes = this.checkedNodes.filter(x => !this.searchAllCodeList.includes(x.code))

      this.checkedKeys = [...noSearchCheckedKeys, ...checkedKeys]
      this.$emit('input', this.checkedKeys)
      this.checkedNodes = [...noSearchCheckedNodes, ...checkedNodes]
      this.$refs.treeAll.setCheckedKeys(this.checkedKeys)
    },
    async handleSearch() {
      if (!this.filterText) {
        this.showAll = true
        return false
      }

      const { data } = await this.$api.department.search({ name: this.filterText })

      this.showAll = false
      this.searchAllCodeList = data.map(x => x.code)
      this.searchData = this.$portal.arr2tree(data, 'code', 'children', 'parentCode', '0')
      this.$refs.treeSearch.setCheckedKeys(this.checkedKeys)
      // console.log('filterText', this.filterText)
    },
    handleClose(tag, tagIndex) {
      const checkedKeysIndex = this.checkedKeys.findIndex(x => x === tag.code)

      this.checkedNodes.splice(tagIndex, 1)
      this.checkedKeys.splice(checkedKeysIndex, 1)
      this.$refs.treeAll.setCheckedKeys(this.checkedKeys)
      this.$refs.treeSearch.setCheckedKeys(this.checkedKeys)
      this.$emit('input', this.checkedKeys)
    },
    handleCheck(node, { checkedKeys, checkedNodes }) {
      this.checkedKeys = checkedKeys
      this.$emit('input', checkedKeys)
      this.checkedNodes = checkedNodes
    },
    async loadNode(node, resolve) {
      if (node.level === 0) {
        const { data } = await this.$api.department.listUserDepartment({})
        return resolve(data)
      }
      // if (node.level > 1) return resolve([])

      console.log('node', node)

      const { data } = await this.$api.department.listByParentCode({ parentCode: node.data.code })
      return resolve(data)

      // setTimeout(() => {
      //   const data = [{
      //     name: 'leaf',
      //     leaf: true
      //   }, {
      //     name: 'zone'
      //   }]

      //   resolve(data)
      // }, 500)
    }
  }
}
</script>

<style lang="scss" scoped>
.organization-tree {
  &__list {
    height: 500px;
    overflow: auto;
  }
  &__tag-item {
    margin-bottom: 10px;
  }
}
</style>
