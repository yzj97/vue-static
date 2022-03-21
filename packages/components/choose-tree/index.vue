<template>
  <div class="cp-choose-tree">
    <section class="content">
      <div :style="{ height: height + 'px' }" class="content-panel">
        <span class="content-title">{{ $t(sourceLabel) }}</span>
        <div class="content-main">
          <el-input
            v-model="sourceFilterText"
            :placeholder="$t('components.tree_transfer_filter')"
          />
          <i class="el-icon-search" @click="handleSearch" />
          <el-tree
            v-show="showAll"
            ref="treeAll"
            :props="props"
            :load="load"
            :node-key="valueKey"
            :check-strictly="true"
            :show-checkbox="checkbox"
            lazy
            class="content-tree"
            @check="handleSourceCheck"
          />
          <el-tree
            v-show="!showAll"
            ref="treeSearch"
            :data="searchData"
            :props="props"
            :default-expanded-keys="searchAllCodeList"
            :check-strictly="true"
            :node-key="valueKey"
            :show-checkbox="checkbox"
            class="search-tree"
            @check="handleSearchCheck"
          />
          <ody-center>
            <slot name="left-footer" />
          </ody-center>
        </div>
      </div>
      <div
        :style="{ height: height + 'px', marginLeft: '30px' }"
        class="content-panel"
      >
        <span class="content-title">{{ $t(targetLabel) }}</span>
        <div class="content-main">
          <div
            v-for="(tag, tagIndex) in checkedNodes"
            :key="tagIndex"
            class="organization-tree__tag-item"
          >
            <el-tag type="info" closable @close="handleClose(tag)">
              {{ tag.actorName }}
            </el-tag>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  props: {
    valueKey: {
      type: String,
      default: 'id'
    },
    lableKey: {
      type: String,
      default: 'name'
    },
    value: {
      type: Array,
      default: () => []
    },
    type: {
      type: String,
      default: ''
    },
    props: {
      type: Object,
      default: null
    },
    height: {
      type: Number,
      default: 540
    },
    sourceLabel: {
      type: String,
      default: '来源'
    },
    targetLabel: {
      type: String,
      default: '目标'
    },
    load: {
      type: Function,
      default: () => {}
    },
    searchData: {
      type: Array,
      default: () => []
    },
    checkbox: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showAll: true, // 默认显示展示树
      sourceFilterText: '', // 左侧搜索关键字
      targetFilterText: '', // 右侧搜索关键字
      checkedNodes: [],
      searchAllCodeList: []
    }
  },
  computed: {},
  watch: {},

  mounted() {
    this.checkedNodes = this.value
    console.log('this.checkedNodes-2', this.checkedNodes)
    this.$refs.treeAll.setCheckedKeys([])
    this.$refs.treeSearch.setCheckedKeys([])
    this.$nextTick(() => {
      const checkedKeys = this.checkedNodes.map(x => x[this.valueKey])

      this.$refs.treeAll.setCheckedKeys(checkedKeys)
      this.$refs.treeSearch.setCheckedKeys(checkedKeys)
    })
  },

  methods: {
    handleSourceCheck(node, { checkedNodes }) {
      console.log(11111)
      console.log(node)
      console.log(checkedNodes)
      this.checkedNodes = checkedNodes
      this.$emit('input', checkedNodes)
    },
    handleSearchCheck(node, { checkedNodes }) {
      const noSearchCheckedNodes = this.checkedNodes.filter(
        x => !this.searchAllCodeList.includes(x.actorId)
      )

      this.checkedNodes = [...noSearchCheckedNodes, ...checkedNodes]
      this.$emit('input', this.checkedNodes)
    },
    async handleSearch() {
      if (!this.sourceFilterText) {
        this.showAll = true
        return false
      }
      this.$emit(
        'loadSearch',
        { sourceFilterText: this.sourceFilterText },
        val => {
          this.showAll = false
          console.log(val)
          this.searchAllCodeList = val.map(x => x[this.valueKey])
          debugger
          this.searchData = val
          const checkedKeys = this.checkedNodes.map(x => x[this.valueKey])
          this.$refs.treeSearch.setCheckedKeys(checkedKeys)
        }
      )
    },
    handleClose(tag, tagIndex) {
      const checkedKeysIndex = this.checkedNodes.findIndex(
        x => x[this.valueKey] === tag[this.valueKey]
      )

      this.checkedNodes.splice(checkedKeysIndex, 1)
      const checkedKeys = this.checkedNodes.map(x => x[this.valueKey])
      this.$refs.treeAll.setCheckedKeys(checkedKeys)
      this.$refs.treeSearch.setCheckedKeys(checkedKeys)
      this.$emit('input', this.checkedNodes)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-choose-tree {
  .content-title {
    padding: 0 15px;
    margin: 0;
    height: 40px;
    line-height: 40px;
    color: #303133;
    font-size: 16px;
    position: relative;
    .right {
      position: absolute;
      top: 50%;
      right: 20px;
      transform: translateY(-50%);
      font-weight: 400;
    }
  }
  .content-main {
    padding: 10px;
    height: calc(100% - 41px);
    box-sizing: border-box;
    overflow: auto;
  }
  .content-panel {
    border: 1px solid #ebeef5;
    background: #fff;
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    vertical-align: middle;
    display: inline-block;
  }
  .el-icon-search {
    position: relative;
    /* margin-right: 20px; */
    float: right;
    right: 10px;
    top: -24px;
  }
  .content-tree {
    margin-top: 15px;
    /deep/.el-icon-caret-right {
      display: none;
    }
  }
  .search-tree {
    margin-top: 15px;
  }

  // .el-tree-node {
  //   .is-leaf + .el-checkbox .el-checkbox__inner {
  //     display: none;
  //   }
  //   .el-checkbox .el-checkbox__inner {
  //     display: inline-block;
  //   }
  // }
}
</style>
