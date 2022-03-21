<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('店铺')" prop="storeId">
            <el-select v-model="search.storeId" :placeholder="$t('全部')" name="search_storeId">
              <el-option
                v-for="item in storeList"
                :key="item.storeId"
                :label="item.storeName"
                :value="item.storeId"
              />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('类目树名称')" prop="name">
            <el-input v-model="search.name" name="search_name" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="StoreCategoryListQuery"
          size="small"
          type="primary"
          code="StoreCategoryListQuery"
          @click.prevent="handleSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="StoreCategoryListAdd_dialogVisible"
          size="small"
          type="primary"
          code="StoreCategoryListAdd"
          @click="dialogVisible = true"
        >{{ $t("新增") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          :data="list"
          :operates="table.operates"
          name="list284"
        >
          <template slot="categoryType" slot-scope="scope">{{
            scope.row.categoryType | keyVal(getCategoryOptions)
          }}</template>
          <template slot="name" slot-scope="scope">
            <div>
              <router-link
                :to="
                  $portal.hasPermission('StoreCategoryTreeDetail')
                    ? {
                      name: 'StoreCategoryTreeDetail',
                      query: { id: scope.row.id, isView: true }
                    }
                    : {}
                "
              >
                <span style="color: blue">{{ scope.row.name }}</span>
              </router-link>
            </div>
          </template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.currentPage"
          :list="list"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.itemsPerPage"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
    <category-dialog-store-add
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :category-type="6"
      @ok="addCategory"
    />
  </div>
</template>
<script>
import categoryDialogStoreAdd from '@/components/category-dialog-store-add'
import constant from '@/utils/constants'
import mpConstant from '@/constant/mpConstant.js'
export default {
  components: {
    categoryDialogStoreAdd
  },
  data() {
    return {
      dialogVisible: false,
      categoryOptions: constant.categoryOptions,
      typeMap: mpConstant.MERCHANT_CATEGORY_TYPE,
      storeList: [],
      storeMap: {},
      merchantList: [],
      lang: '第二语言',
      merchantMap: {},
      search: {},
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      list: [],
      table: {
        columns: [
          {
            label: this.$t('类目树名称'),
            slot: 'name',
            align: 'center',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('类目树（第二语言）'),
            prop: 'nameLan2',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('类目树编码'),
            prop: 'categoryCode',
            align: 'center',
            minWidth: 320,
            show: true
          },
          {
            label: this.$t('类目树类型'),
            align: 'center',
            prop: 'type',
            minWidth: 120,
            show: true,
            formatter: row => {
              return this.typeMap[row.type]
            }
          },
          {
            label: this.$t('店铺名称'),
            align: 'center',
            prop: 'storeName',
            minWidth: 120,
            show: true,
            formatter: row => {
              if (this.storeMap[row.storeId]) {
                return this.storeMap[row.storeId].storeName
              }
              return ''
            }
          },
          {
            label: this.$t('店铺编码'),
            align: 'center',
            prop: 'storeCode',
            minWidth: 120,
            show: true,
            formatter: row => {
              if (this.storeMap[row.storeId]) {
                return this.storeMap[row.storeId].storeCode
              }
              return ''
            }
          },
          {
            label: this.$t('商家名称'),
            align: 'center',
            prop: 'merchantName',
            minWidth: 120,
            show: true,
            formatter: row => {
              if (this.merchantMap[row.merchantId]) {
                return this.merchantMap[row.merchantId].merchantName
              }
              return ''
            }
          },
          {
            label: this.$t('商家编码'),
            align: 'center',
            prop: 'merchantCode',
            minWidth: 120,
            show: true,
            formatter: row => {
              if (this.merchantMap[row.merchantId]) {
                return this.merchantMap[row.merchantId].merchantCode
              }
              return ''
            }
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.$router.push({
                  name: 'StoreCategoryTreeDetail',
                  query: { id: row.id, isView: false }
                })
              },
              code: 'StoreCategoryListEdit'
            },
            {
              label: this.$t('删除'),
              hidden: function(index, row) {
                return row.type === 1
              },
              method: (index, row) => {
                this.deleteCategory(row)
              },
              code: 'StoreCategoryListDelete'
            }
          ]
        }
      }
    }
  },
  computed: {
    getCategoryOptions() {
      return this.categoryOptions.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  async mounted() {
    try {
      this.mpApi = this.$product.$api.mpApi
      await this.getStoreList()
      await this.getMerchantList()
      await this.query()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    handleReset() {
      this.search = {}
    },
    async handleSubmit() {
      await this.query()
    },
    async query(obj = {}) {
      const param = Object.assign({}, this.search, this.page, obj)

      this.loading = true
      try {
        const res = await this.mpApi.listStoreCategory(param)
        this.list = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.query()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.query()
      } catch (ex) {
        console.log(ex)
      }
    },
    addCategory() {
      this.query()
    },
    deleteCategory(val) {
      this.loading = true
      try {
        this.$confirm('是否确认删除?', this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        })
          .then(() => {
            this.mpApi.deleteRootCategoryTreeBack({ id: val.id }).then(res => {
              this.query()
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      } finally {
        this.loading = false
      }
    },
    async getMerchantList() {
      await this.$product.$api.merchantApi
        .queryPlatformAuthMerchantPage({
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.merchantList = res.data.listObj
          this.merchantList.map(item => {
            this.merchantMap[item.merchantId] = item
          })
        })
    },
    async getStoreList() {
      await this.$product.$api.merchantApi
        .queryPlatformAuthStorePage({
          currentPage: 1,
          itemsPerPage: 500
        })
        .then(res => {
          this.storeList = res.data.listObj
          this.storeList.map(item => {
            this.storeMap[item.storeId] = item
          })
        })
    }
  }
}
</script>
