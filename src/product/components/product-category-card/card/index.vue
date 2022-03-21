<template>
  <section class="section">
    <div>
      <el-input v-model="categoryName" :placeholder="$t('请输入名称')" name="categoryName" suffix-icon="el-icon-search" />
    </div>
    <el-table
      ref="table"
      :data="category.children.filter(data => !categoryName || data.name.toLowerCase().includes(categoryName.toLowerCase()))"
      :show-header="false"
      :highlight-current-row="true"
      name="category_children_filter(data => !categoryName || data_name_toLowerCase()_includes(categoryName_toLowerCase()))194"
      row-class-name="category_item"
      height="400px"
      @current-change="autoChecked"
      @row-click="selectedCategory">
      <el-table-column>
        <template slot-scope="scope">
          <div >
            <el-col :span="22">
              <!-- {{ scope.row.name }} -->
              <div v-html="processName(scope.row)"/>
            </el-col>
            <el-col v-if="scope.row.isLeaves !== 1" :span="2">
              <el-button
                type="text"
                size="mini"
                icon="el-icon-arrow-right" />
            </el-col>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </section>
</template>

<script>
export default {
  components: {

  },
  props: {
    category: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      categoryName: null
    }
  },
  watch: {
    'category.checkedId': {
      handler(value, oldValue) {
        // console.info('checkedId change: new: ' + value + ', old: ' + oldValue)
        if (value) {
          this.checkItem(true)
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.category.checkedId) {
        // console.info('init checkedId: ' + this.category.checkedId)
        this.checkItem(true)
      }
    },
    checkItem(checkedEvent) {
      if (this.category && this.category.children) {
        for (var i = 0; i < this.category.children.length; i++) {
          const item = this.category.children[i]
          if (item.id && this.category.checkedId && item.id.toString() === this.category.checkedId.toString()) {
            if (checkedEvent) {
              this.checkedCategory(item, true)
            }
            this.setCurrentRow(item)
            return
          }
        }
      }
    },
    autoChecked() {
      this.checkItem(false)
    },
    setCurrentRow(category) {
      if (this.$refs['table']) {
        this.$refs['table'].setCurrentRow(category)
      }
    },
    selectedCategory(category) {
      if (category && category.id) {
        this.$emit('clearAutoSelected')
        this.category.checkedId = category.id
      }
    },
    async checkedCategory(category, auto) {
      // console.info('checked category: ' + category.id)
      if (category && category.id) {
        this.category.checkedId = category.id
        this.$emit('checkedCategory', this.category, category, auto === true)
        // this.setCurrentRow(category)
      }
    },
    processName(row) { // 搜索结果高亮查询值
      let name = row.name
      if (this.categoryName) {
        name = name.replace(new RegExp('(' + this.categoryName + ')', 'g'), '<span style="color:blue; font-weight: bold">$1</span>')
      }
      return name
    }
  }
}

</script>
<style lang="less" scoped>
.section {
  border: 1px solid rgb(199, 199, 199);
  margin: 10px;
  padding: 10px;
}
/deep/
.category_item {
  cursor: pointer !important;
}
</style>
