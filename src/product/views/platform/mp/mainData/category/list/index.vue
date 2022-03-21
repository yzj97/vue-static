<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('类目树名称') + ':'" prop="name">
            <el-input v-model="search.name" name="search_name" />
          </ody-search-item>
          <ody-search-item :label="$t('类目类型') + ':'" prop="type">
            <el-select v-model="search.type" :placeholder="$t('全部')" name="search_type">
              <el-option
                v-for="item in categoryOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{ $t('重置') }}</el-button>
        <ody-button
          name="ProductCategoryListPageQuery"
          size="small"
          type="primary"
          code="ProductCategoryListPageQuery"
          @click.prevent="handleSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ProductCategoryAdd_dialogVisible"
          size="small"
          type="primary"
          code="ProductCategoryAdd"
          @click="dialogVisible=true"
        >{{ $t('新增') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table ref="table" :columns="table.columns" :data="list" :operates="table.operates" name="list153">
          <template
            slot="categoryType"
            slot-scope="scope"
          >{{ scope.row.categoryType | keyVal(getCategoryOptions) }}</template>
          <template slot="name" slot-scope="scope">
            <div>
              <router-link
                v-if="scope.row.type === 1"
                :to=" $portal.hasPermission('ProductCategoryBehide') ? { name: 'ProductCategoryBehide', query: { id: scope.row.id, isView: true } }:{}"
              >
                <span style="color: dodgerblue;">{{ scope.row.name }}</span>
              </router-link>
              <router-link
                v-if="scope.row.type === 2"
                :to="$portal.hasPermission('ProductCategoryFront') ? { name: 'ProductCategoryFront', query: { id: scope.row.id, isView: true } }:{}"
              >
                <span style="color: dodgerblue;">{{ scope.row.name }}</span>
              </router-link>
            </div>
          </template>
        </ody-table>
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
      </div>
    </ody-list-table-area>
    <category-dialog-add
      v-if="dialogVisible"
      :visible.sync="dialogVisible"
      :category-type="2"
      :lang="lang"
      @ok="addCategory"
    />
  </div>
</template>
<script>
import categoryDialogAdd from '@/components/category-dialog-add'
export default {
  components: {
    categoryDialogAdd
  },
  data() {
    return {
      dialogVisible: false,
      categoryOptions: [
        {
          value: 1,
          label: this.$t('后台类目')
        },
        {
          value: 2,
          label: this.$t('前台类目')
        }
      ],
      typeMap: { 1: this.$t('后台类目'), 2: this.$t('前台类目') },
      lang: this.$t('第二语言'),
      search: {},
      list: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      table: {
        columns: [
          {
            label: this.$t('类目树名称'),
            slot: 'name',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('类目树名称（第二语言）'),
            prop: 'nameLan2',
            align: 'center',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('类目树ID'),
            prop: 'id',
            align: 'center',
            minWidth: 200,
            show: true
          },
          {
            label: this.$t('类目类型'),
            align: 'center',
            prop: 'type',
            show: true,
            formatter: row => {
              return this.typeMap[row.type]
            }
          }
        ],
        operates: {
          align: 'left',
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              hidden: function(index, row) {
                return row.type !== 1
              },
              method: (index, row) => {
                this.$router.push({
                  name: 'ProductCategoryBehide',
                  query: { id: row.id, isView: false }
                })
              },
              code: 'ProductCategoryBehide'
            },
            {
              label: this.$t('编辑'),
              hidden: function(index, row) {
                return row.type === 1
              },
              method: (index, row) => {
                this.$router.push({
                  name: 'ProductCategoryFront',
                  query: { id: row.id, isView: false }
                })
              },
              code: 'ProductCategoryFront'
            },
            {
              label: this.$t('删除'),
              hidden: function(index, row) {
                return row.type === 1
              },
              method: (index, row) => {
                if (row.type === 1) {
                  this.$message({
                    showClose: true,
                    message: this.$t('后台类目不能删除'),
                    type: 'error'
                  })
                } else {
                  this.deleteCategory(row)
                }
              },
              code: 'ProductCategoryListDelete'
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
        const res = await this.mpApi.listRootCategoryTreeBack(param)
        this.list = res.data.listObj
        this.page.total = res.data.total
      } finally {
        this.loading = false
      }
    },
    async handlePageSizeChange() {
      try {
        await this.query()
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
    addCategory(val) {
      console.log(val)
      this.query()
    },
    deleteCategory(val) {
      this.loading = true
      try {
        this.$confirm(this.$t('是否确认删除?'), this.$t('提示'), {
          confirmButtonText: this.$t('确定'),
          cancelButtonText: this.$t('取消'),
          type: 'warning'
        })
          .then(() => {
            this.mpApi.deleteRootCategoryTreeBack({ id: val.id }).then(res => {
              this.query()
              this.$message({
                type: 'success',
                message: this.$t('删除成功!')
              })
            })
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: this.$t('已取消删除')
            })
          })
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

