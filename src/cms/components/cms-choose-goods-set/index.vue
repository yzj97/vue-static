<template>
  <ody-choose
    v-if="visible"
    ref="choose"
    :search-config="searchConfig"
    :search-value="searchValue"
    :request-url="requestUrl"
    :columns="columns"
    :search-format="changeParam"
    :selectable-out="selectable"
    :multiple="true"
    :title="$t('添加商品')"
    @heightChane="heightChane"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="channels" slot-scope="scope">
      <el-select v-model="scope.row.channels" :placeholder="$t('全部')" name="scope_row_channels" >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </template>
    <template slot="categoryIds" slot-scope="scope">
      <el-form-item prop="categoryIds" style="width: 480px">
        <!--  <ody-category-tree-select
          ref="category"
          :clear-on-select="true"
          v-model="scope.row.categoryIds"
          name="scope_row_categoryIds"
          class="choose-tree" />-->
        <ody-tree-select
          :normalizer="normalizer"
          :append-to-body="true"
          :z-index="10000"
          v-model="scope.row.categoryIds"
          :multiple="true"
          :async="isAsync"
          :options="categoryTreeData"
          :load-options="isAsync ? queryBackedRootCategory : null"
          :default-options="isAsync"
          :default-expand-level="9999"
          no-results-text="未查询出结果"
          no-options-text="没有可用的选项"
          search-prompt-text="请搜索你想选择的商品类目"
          open-on-focus
          name="queryParam_categoryIds"
          value-consists-of="LEAF_PRIORITY"
          @open="treeOpen"
          @search-change="searchChange"/>

      </el-form-item>

    </template>
    <template slot="storeSlot" slot-scope="scope">
      <el-form-item prop="storeIds" style="width: 180px" >
        <ody-store-select
          v-model="scope.row.storeIds"
          :multiple="false"
          :placeholder="$t('请输入查询')"
          name="scope_row_storeIds"
          collapse-tags
          value-key="storeId" />
      </el-form-item>
    </template>
  </ody-choose>

</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    moduleId: {
      type: String,
      default: ''
    },
    pageType: {
      type: String,
      default: ''
    },
    channelsOption: {
      type: Object,
      default: () => []
    },
    code: {
      type: String,
      default: ''
    }

  },
  data() {
    return {
      requestUrl: '/cms-web/cmsModule/selectionSearch2',
      options: this.channelsOption,
      searchConfig: [
        {
          label: this.$t('商品编码'),
          prop: 'codes',
          type: 'input'
        },
        {
          label: this.$t('商品名称'),
          prop: 'keyword',
          type: 'input'
        },
        {
          label: this.$t('商家名称'),
          prop: 'merchantName',
          type: 'input'
        },
        {
          label: this.$t('渠道'),
          slot: 'channels'
        },
        {
          label: this.$t('商品分类'),
          slot: 'categoryIds'
        },
        {
          label: this.$t('店铺'),
          slot: 'storeSlot'
        }

      ],
      searchValue: {
        categoryIds: [],
        channels: '',
        codes: '',
        keyword: '',
        merchantName: '',
        moduleId: this.moduleId,
        pageType: this.pageType,
        storeIds: []
      },
      columns: [
        {
          label: this.$t('商品名称'),
          prop: 'mpName',
          show: true
        },
        {
          label: this.$t('商品编码'),
          prop: 'mpCode',
          show: true
        },
        {
          label: this.$t('商家名称'),
          prop: 'merchantName',
          show: true
        },
        {
          label: this.$t('店铺'),
          prop: 'storeName',
          show: true
        },
        {
          label: this.$t('商品分类'),
          prop: 'categoryName',
          show: true
        },
        {
          label: this.$t('商品品牌'),
          prop: 'brandName',
          show: true
        },
        {
          label: this.$t('渠道'),
          prop: 'channel',
          show: true
        }
      ],
      isAsync: false,
      categoryTreeData: [],
      categorySearchKey: ''
    }
  },
  async mounted() {
    if (this.code === 'rank-landing-page') {
      this.searchConfig = [
        {
          label: this.$t('商品编码'),
          prop: 'codes',
          type: 'input'
        },
        {
          label: this.$t('商品名称'),
          prop: 'keyword',
          type: 'input'
        },
        {
          label: this.$t('商家名称'),
          prop: 'merchantName',
          type: 'input'
        },
        {
          label: this.$t('渠道'),
          slot: 'channels'
        },
        {
          label: this.$t('商品分类'),
          slot: 'categoryIds'
        },
        {
          label: this.$t('店铺'),
          slot: 'storeSlot'
        }

      ]
    } else {
      this.searchConfig = [
        {
          label: this.$t('商品编码'),
          prop: 'codes',
          type: 'input'
        },
        {
          label: this.$t('商品名称'),
          prop: 'keyword',
          type: 'input'
        },
        {
          label: this.$t('商家名称'),
          prop: 'merchantName',
          type: 'input'
        },
        {
          label: this.$t('渠道'),
          slot: 'channels'
        },
        {
          label: this.$t('商品分类'),
          slot: 'categoryIds'
        }

      ]
    }
    await this.getQueryBackedRootCategory()
  },
  methods: {
    remoteChildrenNull(data = []) {
      data.forEach(item => {
        if (item.children === null) {
          delete item.children
        } else {
          if (item.children && item.children.length) {
            item.children = this.remoteChildrenNull(item.children)
          } else {
            delete item.children
          }
        }
      })

      return data
    },
    async queryBackedRootCategory({ searchQuery: name, callback }) {
      return this.$cms.$api.cmsEdit.listBackCategoryTree({ name }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        console.log(newData, 'newData')
        callback(null, newData)
      })
    },

    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
    },
    // 查询后台类目树根节点
    async getQueryBackedRootCategory() {
      return this.$cms.$api.cmsEdit.listBackCategoryTree({ name: this.categorySearchKey }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        this.categoryTreeData = newData
      })
    },

    treeOpen() {
      this.isAsync = true
    },

    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },

    heightChane() {
      const box = this.$refs.choose.$refs.searchForm.$refs.box
      const isHeight = this.$refs.choose.$refs.searchForm.isHeight
      if (box && isHeight) {
        box.style.overflow = 'unset'
      } else {
        box.style.overflow = 'hidden'
      }
    },
    selectable(row, index) {
      return !row.exist
    },
    changeParam(val) {
      const obj = { ...val }
      if (val.channels) {
        obj.channels = [val.channels]
      } else {
        obj.channels = this.options.map(item => { return item.value })
      }
      return obj
    },
    handleClose() {
      this.$emit('update:visible', false)
    },
    async handleSubmit(val) {
      if (val.length === 0) {
        return
      }
      const arr = val.map(item => item.mpId)
      const params = {
        moduleId: this.moduleId,
        mpIds: arr,
        pageType: this.pageType
      }
      await this.$cms.$api.cmsEdit.addProducts(params)
      this.$emit('update:visible', false)
      this.$emit('ok')
    }
  }

}
</script>

<style lang="scss" scoped>

</style>
