<template>
  <ody-tree-select
    v-model="value"
    :append-to-body="true"
    :multiple="true"
    :options="categoryList"
    :auto-load-root-options="false"
    :load-options="categoryLoadOptions"
    name="value"
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      categoryList: null
    }
  },
  methods: {
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
      } = await this.$product.$api.mpApi.queryCategoryListByParent({
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
        } = await this.$product.$api.mpApi.queryBackedRootCategory()

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
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
