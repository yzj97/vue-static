<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('商品列表')"
      width="80%"
      @open="init" >
      <section class="pg-productModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">

              <ody-search-item :label="$t('商品名称')" prop="chineseName">
                <el-input v-model="searchForm.chineseName" name="searchForm_chineseName"/>
              </ody-search-item>
              <ody-search-item :label="$t('商品编码')" prop="code">
                <el-input v-model="searchForm.code" name="searchForm_code" />
              </ody-search-item>
              <ody-search-item :label="$t('商品条码')" prop="barCode">
                <el-input v-model="searchForm.barCode" name="searchForm_barCode" />
              </ody-search-item>
              <!--<ody-search-item :label="$t('商品类目')" prop="categoryId">-->
              <!--<CategorySelect ref="categorySelect" v-model="searchForm.categoryId" name="searchForm_categoryId" @clean="cleanSelected" @select="selectedCategory" />-->
              <!--</ody-search-item>-->
              <ody-search-item :label="$t('商品品牌')" prop="brandName">
                <el-input v-model="searchForm.brandName" name="searchForm_brandName" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('重置') }}</el-button>
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('查询') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :data="list"
              :columns="columns"
              :checked="currentRow"
              :can-filter="false"
              :highlight-current-row="true"
              name="list046"
              @selection-change="handleSelectionChange"
            />
          </div>
          <div slot="page">
            <div class="block">
              <ody-pagination
                :current-page.sync="page.current"
                :list="list"
                :page-sizes="[10, 20, 30, 50]"
                :page-size.sync="page.size"
                :total.sync="page.total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handlePageSizeChange"
                @current-change="handlePageCurrentChange"/>
            </div>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('保存') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
import CategorySelect from '@/components/categorySelect'

export default {
  components: {
    CategorySelect
  },
  props: {
    merchantId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      multiple: true,
      searchForm: {},
      loading: false,
      checked: [],
      list: [],
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'chineseName',
          label: this.$t('商品名称'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'code',
          label: this.$t('商品编码'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'barCode',
          label: this.$t('商品条码'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'categoryFullNamePath',
          label: this.$t('商品类目'),
          align: 'center',
          minWidth: 140
        },
        {
          show: true,
          prop: 'brandName',
          label: this.$t('商品品牌'),
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  mounted() {
    this.mpApi = this.$product.$api.mpApi
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        this.queryProductInner(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handleSearchSubmit() {
      try {
        this.page.current = 1
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSearchReset() {
      // this.$refs['categorySelect'].cleanSelected()
      this.searchForm = {}
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleSelectionChange(val) {
      this.currentRow = val
    },
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      if (!this.currentRow) {
        this.$message({
          type: 'warn',
          message: this.$t('请选择一个商品')
        })
        return
      }
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.currentRow)
    },
    cleanSelected() {
      this.searchForm.categoryIds = []
      this.searchForm.categoryName = null
    },
    selectedCategory(nodes) {
      this.searchForm.categoryIds = []
      let selectedNode = null
      if (Array.isArray(nodes) && nodes.lengt > 0) {
        selectedNode = nodes[0]
      } else {
        selectedNode = nodes
      }

      if (selectedNode) {
        this.searchForm.categoryIds.push(selectedNode.id)
        this.searchForm.categoryName = selectedNode.fullNamePath
      }
    },
    async queryProductInner(vue) {
      const param = {
        itemsPerPage: vue.page.size,
        currentPage: vue.page.current,
        merchantId: vue.merchantId,
        brandName: vue.searchForm.brandName,
        code: vue.searchForm.code,
        barCode: vue.searchForm.barCode,
        categoryId: vue.searchForm.categoryId,
        chineseName: vue.searchForm.chineseName
      }
      return this.mpApi.listMpByBrandCategoryPage(param).then(
        res => {
          this.list = res.data.listObj
          this.page.total = res.data.total
        }
      )
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
