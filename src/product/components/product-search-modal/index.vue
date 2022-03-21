<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('选择商品')"
      width="65%"
      @change-max-height="handleMaxHeight"
    >
      <ody-list-search-area>
        <div slot="content">
          <el-form ref="form">
            <ody-search-item v-show="searchItems.includes('商品名称')" :label="$t('商品名称')" prop="chineseName">
              <el-input v-model="queryParam.chineseName" name="queryParam_chineseName" />
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品编码')" :label="$t('商品编码')" prop="code">
              <el-input v-model="queryParam.code" name="queryParam_code" />
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品条码')" :label="$t('商品条码')" prop="barCode">
              <el-input v-model="queryParam.barCode" name="queryParam_barCode" />
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('货号')" :label="$t('货号')" prop="artNo">
              <el-input v-model="queryParam.artNo" name="queryParam_artNo" />
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品类目')" :span="2" :label="$t('商品类目')" prop="categoryIds">
              <ody-tree-select
                v-model="queryParam.categoryIds"
                :multiple="true"
                :disable-branch-nodes="true"
                :load-options="loadOptions"
                :options="options"
                :append-to-body="true"
                :z-index="3000"
                name="queryParam_categoryIds"
                @open="handleCategoryTreeSelect"
              />
            </ody-search-item>
            <ody-search-item v-show="searchItems.includes('商品品牌')" :label="$t('商品品牌')" prop="brandId">
              <el-select
                v-model="queryParam.brandId"
                :remote-method="loadBrandList"
                name="queryParam_brandId"
                filterable
                remote
                @focus="loadBrandList()"
                @change="changeBrand"
              >
                <el-option
                  v-for="item in brandIdList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </ody-search-item>
          </el-form>
        </div>
        <div slot="btn">
          <el-button name="reset" size="small" @click="reset">{{ $t('重置') }}</el-button>
          <el-button name="query" size="small" type="primary" @click="query(1)">{{ $t('查询') }}</el-button>
        </div>
      </ody-list-search-area>
      <div>
        <div>
          <ody-table
            ref="table"
            :loading="loading"
            :checked.sync="checkedList"
            :can-filter="false"
            :multiple="multiple"
            :highlight-current-row="!multiple"
            :columns="columns"
            :data="list"
            :selectable="canSelect"
            :max-height="tableMaxHeight"
            name="list753"
            @selection-change="handleSelected"
          />
        </div>
        <div>
          <ody-pagination
            :current-page.sync="page.currentPage"
            :list="list"
            :page-sizes="[10, 20, 30, 50]"
            :page-size.sync="page.itemsPerPage"
            :total.sync="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="sizeChange"
            @current-change="query"
          />
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-row type="flex" justify="center">
          <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
          <el-button
            :disabled="!checkedList || checkedList.length === 0"
            name="handleOk"
            size="small"
            type="primary"
            @click="handleOk"
          >{{ $t('确定') }}</el-button>
        </el-row>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: true
    },
    ids: {
      type: Array,
      default: () => {
        return []
      }
    },
    searchItems: {
      type: Array,
      default: () => {
        return [
          '商品名称',
          '商品编码',
          '商品条码',
          '货号',
          '商品类目',
          '商品品牌'
        ]
      }
    },
    columnItems: {
      type: Array,
      default: () => {
        return [
          '商品名称',
          '商品编码',
          '商品条码',
          '货号',
          '商品类目',
          '商品品牌',
          '供应商名称'
        ]
      }
    },
    merchantId: {
      type: Number,
      default: null
    },
    type: {
      // 商品类型:1-常规商品;2卡券;3海购;4赠品;10实体卡;11虚拟卡;20券;5生鲜产品;6增值服务;7其他;21积分商品;31-称重商品;32-餐饮商品
      type: Object,
      default: null
    },
    dataType: {
      // 商品数据类型:1-运营商品;2-商家商品;3-店铺商品
      type: Number,
      default: null
    },
    useType: {
      // 用途类型:0-成品;1-原料
      type: Number,
      default: null
    },
    typeOfProducts: {
      // 0-普通商品;2-系列子品;3-系列主品;4-组合商品
      type: Array,
      default: () => {
        return [0, 2, 4]
      }
    },
    status: {
      // 状态
      type: Array,
      default: null
    },
    extraFilters: {
      type: Object,
      default: () => {
        return {}
      }
    },
    categoryFilters: {
      type: Object,
      default: () => {
        return {}
      }
    },
    productQuery: {
      type: Function,
      default: null
    }
  },
  data() {
    const vue = this
    return {
      tableMaxHeight: 100,
      loading: false,
      list: [],
      brandIdList: [],
      options: null,
      allData: [],
      checkedList: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          show: this.columnItems.includes('商品名称'),
          label: vue.$t('商品名称'),
          prop: 'chineseName',
          minWidth: 150
        },
        {
          show: this.columnItems.includes('商品编码'),
          label: vue.$t('商品编码'),
          prop: 'code',
          minWidth: 150
        },
        {
          show: this.columnItems.includes('商品条码'),
          label: vue.$t('商品条码'),
          prop: 'barCode',
          minWidth: 100,
          formatter(row, column) {
            return row.merchantProductBarCodes
              ? row.merchantProductBarCodes.map(i => i.barCode).join(',')
              : ''
          }
        },
        {
          show: this.columnItems.includes('货号'),
          label: vue.$t('货号'),
          prop: 'artNo',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('商品类目'),
          label: vue.$t('商品类目'),
          prop: 'categoryName',
          minWidth: 150
        },
        {
          show: this.columnItems.includes('商品品牌'),
          label: vue.$t('商品品牌'),
          prop: 'brandName',
          minWidth: 100
        },
        {
          show: this.columnItems.includes('供应商名称'),
          label: vue.$t('供应商名称'),
          prop: 'supplierName',
          minWidth: 100
        }
      ],
      queryParam: getDefaultForm(),
      defaultFilters: Object.assign(
        {
          merchantId: this.merchantId,
          type: this.type,
          dataType: this.dataType,
          useType: this.useType,
          typeOfProducts: this.typeOfProducts,
          status: this.status
        },
        this.extraFilters
      )
    }
  },
  async mounted() {
    this.mpApi = this.$product.$api.mpApi
    this.productQuery = this.productQuery || this.mpApi.listProductInfoByPage
    this.query()
  },
  methods: {
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight - dialogHeight - dialogPaddingTop - dialogPaddingBottom - 270

      this.tableMaxHeight = tableMaxHeight
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$emit('ok', this.checkedList)
      this.$emit('update:visible', !this.visible)
    },
    query(currentPage) {
      if (currentPage) {
        this.page.currentPage = currentPage
      }
      var filters = Object.assign({}, this.queryParam, this.defaultFilters)
      const params = {
        page: this.page.currentPage,
        limit: this.page.itemsPerPage,
        filters: { ...filters, canSale: 1 }
      }
      this.loading = true
      return this.productQuery(params).then(res => {
        this.loading = false
        this.list = res.data
        this.page.total = res.total
      })
    },
    handleSelected(arr) {
      if (Array.isArray(arr)) {
        this.checkedList = arr
      } else {
        this.checkedList = [arr]
      }
    },
    canSelect(row, index) {
      return this.ids.indexOf(row.id) === -1
    },
    selectRow(selection, row) {
      row.checked = !row.checked
    },
    reset() {
      this.queryParam = getDefaultForm()
    },
    sizeChange(val) {
      this.page.itemsPerPage = val
      this.query()
    },
    async loadOptions({ action, parentNode, callback }) {
      switch (action) {
        case 'LOAD_ROOT_OPTIONS':
          await this.loadRootCategory()
          break
        case 'LOAD_CHILDREN_OPTIONS':
          await this.loadChildrenCategory(parentNode)
          break
        default:
      }
    },
    async loadRootCategory() {
      const result = await this.mpApi.queryBackedRootCategory()
      let datas = result.data
      if (!datas) {
        return
      }
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      datas.forEach(element => {
        if (element.isLeaves === 2) {
          element.children = null
        }
        element.label = element.name
        this.allData.push(element)
      })
      this.options = datas
    },
    async loadChildrenCategory(parentNode) {
      let param = { parentId: parentNode.id }
      if (parentNode.level === 1) {
        param = Object.assign(param, this.categoryFilters)
      }
      const result = await this.mpApi.queryCategoryListByParent(param)
      if (!result.data) {
        return
      }
      let datas = result.data
      if (!Array.isArray(datas)) {
        datas = [datas]
      }
      datas.forEach(element => {
        if (element.isLeaves === 2) {
          element.children = null
        }
        element.label = element.name
        this.allData.push(element)
      })
      this.$set(parentNode, 'children', datas)
    },
    select(node, instanceId) {
      this.$emit('select', node)
    },
    async loadBrandList(name) {
      const param = { currentPage: 1, itemsPerPage: 100, name: name }
      const promise = this.mpApi.listBrand
      const { data } = await promise(param)
      this.brandIdList = data.listObj || []
    }
  }
}
function getDefaultForm() {
  return Object.assign(
    {},
    {
      chineseName: null,
      code: null,
      barCode: null,
      artNo: null,
      categoryId: null,
      categoryIds: null,
      brandId: null,
      status: 2 // 查询审核通过的
    }
  )
}
</script>

<style lang="scss" scoped>
</style>
