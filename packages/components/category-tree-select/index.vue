<template>
  <ody-tree-select
    v-if="type === 'all'"
    :value="value"
    :z-index="10000"
    :normalizer="normalizer"
    :multiple="true"
    :options="categoryAllTreeData"
    v-bind="$attrs"
    @input="handleInput"
    v-on="$listeners"
    @search-change="searchChange"
  />
  <ody-tree-select
    v-else-if="type === 'need'"
    :value="value"
    :append-to-body="true"
    :z-index="10000"
    :multiple="true"
    :options="categoryList"
    :auto-load-root-options="false"
    :load-options="categoryLoadOptions"
    v-bind="$attrs"
    @input="handleInput"
    v-on="$listeners"
  />
  <ody-tree-select
    v-else-if="type === 'one'"
    :value="value"
    :append-to-body="true"
    :z-index="10000"
    :multiple="true"
    :options="categoryOneList"
    :auto-load-root-options="false"
    :load-options="categoryOneLoadOptions"
    v-bind="$attrs"
    @input="handleInput"
    v-on="$listeners"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => {}
    },
    type: {
      type: String,
      default: 'all' // need 按需加载, one 只有一级
    }
  },
  data() {
    return {
      categoryOneList: null,
      categoryList: null,
      categoryAllTreeData: [],
      normalizer(node) {
        return {
          id: node.id,
          label: node.name,
          children: node.children
        }
      },
      categorySearchKey: ''
    }
  },
  async mounted() {
    await this.setListBackCategoryTree()
  },
  methods: {
    async loadCategoryOne(parentNode) {
      const {
        data: listObj
      } = await this.$api.category.queryCategoryListByParent({
        parentId: parentNode.id
      })

      parentNode.children = listObj.map(x => {
        const rtv = {
          id: x.id,
          label: x.name
        }

        return rtv
      })
    },
    async categoryOneLoadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        await this.loadCategoryOne(parentNode)
        callback()
      } else if (action === 'LOAD_ROOT_OPTIONS') {
        await this.getCategoryOneList()
      }
    },
    async getCategoryOneList() {
      try {
        const {
          data: listObj
        } = await this.$api.category.queryBackedRootCategory()

        this.categoryOneList = [
          {
            id: listObj.id,
            label: listObj.name,
            children: null
          }
        ]
      } catch (ex) {
        console.log(ex)
      }
    },
    async categoryLoadOptions({ action, parentNode, callback }) {
      // Typically, do the AJAX stuff here.
      // Once the server has responded,
      // assign children options to the parent node & call the callback.
      if (action === 'LOAD_CHILDREN_OPTIONS') {
        await this.loadCategory(parentNode)
        callback()
      } else if (action === 'LOAD_ROOT_OPTIONS') {
        await this.getCategoryList()
      }
    },

    async loadCategory(parentNode) {
      const {
        data: listObj
      } = await this.$api.category.queryCategoryListByParent({
        parentId: parentNode.id
      })

      parentNode.children = listObj.map(x => {
        const rtv = {
          id: x.id,
          label: x.name
        }
        if (x.isLeaves === 2) {
          rtv.children = null
        }
        return rtv
      })
    },
    async getCategoryList() {
      try {
        const {
          data: listObj
        } = await this.$api.category.queryBackedRootCategory()

        this.categoryList = [
          {
            id: listObj.id,
            label: listObj.name,
            children: null
          }
        ]
      } catch (ex) {
        console.log(ex)
      }
    },
    async getLastIds() {
      const categoryArr = this.$portal.tree2arr(this.categoryList || [])
      const categoryMap = categoryArr.reduce((rtv, item) => {
        rtv[item.id] = item
        return rtv
      }, {})
      let categoryId
      const rtv = []
      const categoryList = [...this.value]

      while ((categoryId = categoryList.shift())) {
        const categoryItem = categoryMap[categoryId]
        if (categoryItem.children === null) {
          await this.loadCategory(categoryItem)
          categoryItem.children.forEach(x => {
            if (x.children === null) {
              categoryMap[x.id] = x
              categoryList.push(x.id)
            } else {
              rtv.push(x.id)
            }
          })
        } else {
          rtv.push(categoryId)
        }
      }

      return rtv
    },
    handleInput(newVal) {
      this.$emit('input', newVal)
    },
    async setListBackCategoryTree() {
      const { data: { categorys: categoryMap }} = await this.$api
        .groupManagement
        .getBackCategoryTree({ name: this.categorySearchKey })

      const categoryList = Object.keys(categoryMap).reduce((rtv, key) => {
        rtv.push(categoryMap[key])
        return rtv
      }, [])

      categoryList.forEach(x => {
        if (x.children === null) {
          delete x.children
        }
      })

      const categoryTreeList = this.$portal
        .arr2tree(categoryList, 'id', 'children', 'pId', '0')

      this.categoryAllTreeData = categoryTreeList
    },
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.setListBackCategoryTree()
    }

  }
}
</script>

<style lang="scss" scoped>
</style>
