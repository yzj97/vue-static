<template>
  <ody-choose
    ref="choose"
    :visible.sync="visible"
    :search-config="getSearchConfig"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="getColumns"
    :checked="selected"
    :choose-key="chooseKey"
    :multiple="multiple"
    :highlight-current-row="!multiple"
    :title="$t('选择商品')"
    :search-format="searchFormat"
    :overflow-hidden="false"
    @heightChane="heightChane"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="categoryType" slot-scope="scope">
      <el-form-item prop="categoryType">
        <el-select
          v-model="scope.row.categoryType"
          :clearable="false"
          :placeholder="$t('请选择')"
          name="scope_row_categoryType"
          style="width: 100px;"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="categoryIds">
        <!-- <ody-category-tree-select
          ref="category"
          :clear-on-select="true"
          v-model="scope.row.categoryIds"
          no-results-text="未查询出结果"
          no-options-text="没有可用的选项"
          value-consists-of="LEAF_PRIORITY"
          name="scope_row_categoryIds"
          class="choose-tree"
        />-->
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
    <template slot="brandType" slot-scope="scope">
      <el-form-item prop="brandType">
        <el-select
          v-model="scope.row.brandType"
          :clearable="false"
          :placeholder="$t('请选择')"
          name="scope_row_brandType"
          style="width: 100px;"
        >
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="brandIds">
        <ody-brand-select
          v-model="scope.row.brandIds"
          :multiple="true"
          :placeholder="$t('请输入查询')"
          name="scope_row_brandIds"
          collapse-tags
        />
      </el-form-item>
    </template>
    <template slot="merchantIds" slot-scope="scope">
      <el-form-item prop="merchantIds">
        <ody-merchant-select
          v-model="scope.row.merchantIds"
          :multiple="false"
          :placeholder="$t('请输入查询')"
          name="scope_row_merchantIds"
          value-key="merchantId"
        />
      </el-form-item>
    </template>
    <template slot="storeIds" slot-scope="scope">
      <el-form-item prop="storeIds">
        <ody-store-select
          v-model="scope.row.storeIds"
          :multiple="false"
          :placeholder="$t('请输入查询')"
          name="scope_row_storeIds"
          collapse-tags
          value-key="storeId"
        />
      </el-form-item>
    </template>
    <template slot="mpName" slot-scope="scope">
      <span v-if="scope.row.markChoosed" style="color: red;">
        [已选]
      </span>
      {{ scope.row.mpName }}
    </template>
  </ody-choose>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    },
    searchField: {
      type: Array,
      default: () => [
        'mpName',
        'mpCode',
        'barcode',
        'categoryType',
        'brandType',
        'merchantIds',
        'storeIds'
      ]
    },
    promType: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      isAsync: false,
      options: [],
      brandIdsOptions: [],
      merchantIdsOptions: [],
      categoryOptions: [
        {
          value: '1',
          label: this.$t('包含')
        },
        {
          value: '0',
          label: this.$t('不包含')
        }
      ],
      merchantSelected: [],
      choose: {
        searchConfig: [
          {
            label: this.$t('商家名称'),
            slot: 'merchantIds'
          },
          {
            label: this.$t('店铺名称'),
            slot: 'storeIds'
          },
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            type: 'input'
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            type: 'input'
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            type: 'input'
          },
          {
            label: this.$t('类目选择'),
            slot: 'categoryType'
          },
          {
            label: this.$t('商品品牌'),
            slot: 'brandType'
          }
        ],
        searchValue: {
          mpName: null, // 商品名称
          mpCode: null, // 商品编码
          barcode: null, // 商品条码
          categoryType: null, // 分类 包含 不包含
          categoryIds: [], // 分类
          brandType: null, // 品牌 包含 不包含
          brandIds: [], // 品牌
          merchantIds: null, // 商家id
          storeIds: null, // 店铺storeIds
          ...this.params
        },
        requestUrl:
          '/back-promotion-web/promotionChannelRead/queryOmnichannelProductList.do',
        columns: [
          {
            label: this.$t('商品名称'),
            slot: 'mpName',
            show: true,
            minWidth: 260
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('计量单位'),
            prop: 'measurementUnit',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品品牌'),
            prop: 'brandName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品类目'),
            prop: 'categoryName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('所属商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('店铺名称'),
            prop: 'storeName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('原价(元)'),
            prop: 'price',
            show: true,
            minWidth: 120
          }
        ],
        searchs: [
          'mpName',
          'mpCode',
          'barcode',
          'categoryType',
          'brandType',
          'merchantIds',
          'storeIds'
        ]
      },
      categorySearchKey: '',
      categoryTreeData: []
    }
  },
  computed: {
    getColumns() {
      if (this.canStoreShow()) {
        return this.choose.columns
      }
      return this.choose.columns.filter(x => x.prop !== 'storeName')
    },
    getSearchConfig() {
      if (this.canStoreShow()) {
        return this.choose.searchs.map(x => {
          return this.choose.searchConfig.find(y => x === (y.prop || y.slot))
        })
      }

      return this.choose.searchs.filter(x => x !== 'storeIds').map(x => {
        return this.choose.searchConfig.find(y => x === (y.prop || y.slot))
      })
    }
  },
  watch: {
  },
  mounted() {
    this.getQueryBackedRootCategory()
  },
  methods: {
    treeOpen() {
      this.isAsync = true
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
    canStoreShow() {
      return +this.promType === 10000 || // 会员限购  -- ok
        +this.promType === 5001 || // 抽奖  -- ok
        +this.promType === 2000 || // 拼团 -- ok
        +this.promType === 3001 || // 砍价 -- ok
        +this.promType === -2 // 营销活动查询 -- ok
    },
    selectable(row, index) {
      return !row.markChoosed
    },
    searchFormat(params) {
      // if (params.categoryIds[0] === '20032721374129') {
      //   params.categoryIds = []
      // }
      const { merchantIds, storeIds, ...otherParmas } = params
      // const categoryAllTreeData = this.$refs.category.categoryAllTreeData || []
      // const categoryArr = this.$portal.tree2arr(categoryAllTreeData, 'id', 'children', 'pId')
      // const categoryIds = categoryArr.filter(x => !x.children).map(x => x.id)
      // console.log('categoryIds', categoryIds)
      otherParmas.merchantIds = merchantIds ? [merchantIds] : []
      otherParmas.storeIds = Array.isArray(storeIds) ? storeIds : (storeIds ? [storeIds] : [])
      return {
        obj: {
          ...otherParmas
          // categoryIds
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('cancel')
    },
    handleSubmit(val) {
      this.$emit('ok', val)
      this.$emit('update:selected', val)
      this.handleClose()
    },
    changeInput(node) {
      this.choose.searchValue.categoryIds = node
    },
    async queryBackedRootCategory({ searchQuery: name, callback }) {
      return this.$promotion.$api.promotion.listBackCategoryTree({ name }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        console.log(newData, 'newData')
        callback(null, newData)
      })
    },
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
    searchChange(searchQuery) {
      this.categorySearchKey = searchQuery
      this.getQueryBackedRootCategory()
    },
    async getQueryBackedRootCategory() {
      return this.$promotion.$api.promotion.listBackCategoryTree({ name: this.categorySearchKey }).then(async(res) => {
        let newData = []
        if (res.data !== null) {
          newData = await this.remoteChildrenNull([res.data])
        }

        this.categoryTreeData = newData
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    }
  }
}
</script>
<style lang="less" scoped>
/deep/ .box {
  max-height: none !important;
  overflow: unset !important;
}
/deep/ .cp-dynamic-form .box {
  overflow: unset !important;
}
.cp-tree-select {
  width: 200px;
  display: inline-block;
}
</style>
