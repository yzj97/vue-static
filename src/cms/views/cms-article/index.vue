<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item :label="$t('文章编号:')" prop="filters.id">
            <el-input v-model="searchForm.filters.id" :placeholder="$t('请输入文章编号')" name="searchForm_filters_id"/>
          </ody-search-item>
          <ody-search-item :label="$t('文章标题:')" prop="filters.name">
            <el-input v-model="searchForm.filters.name" :placeholder="$t('请输入文章标题')" name="searchForm_filters_displayTitle"/>
          </ody-search-item>
          <ody-search-item :label="$t('所属分类:')" prop="categoryIdList">
            <el-cascader
              v-model="categoryIdList"
              :options="categoryTree"
              :placeholder="$t('全部')"
              :props="{ value:'id', label: 'categoryName', checkStrictly: true, expandTrigger: 'hover' }"
              name="value"/>
          </ody-search-item>
          <ody-search-item :label="$t('支持终端:')" prop="filters.platform">
            <el-select v-model="searchForm.filters.platform" :placeholder="$t('全部')" name="searchForm_filters_platform">
              <el-option
                v-for="item in platfroms"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
        <ody-button name="CmsConsultationList01_handlePageCurrentChange" code="CmsConsultationList01" size="small" type="primary" @click="handlePageCurrentChange">{{ $t('common_select') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button name="CmsConsultationList02_handleAdd" code="CmsConsultationList02" size="small" type="primary" @click="handleAdd">{{ $t('新增文章') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :can-filter="false"
          :operates="operates"
          name="list273"
        >
          <template slot="categoryId" slot-scope="scope">{{ scope.row.categoryId | keyVal(categoryMap) }}</template>
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

    <el-dialog :visible.sync="dialogViewVisible" :title="$t('浏览')" width="300px">
      <el-row type="flex" class="row-bg" justify="center">
        <ody-qrcode :value="urlValue" name="qrcode5" >
          <el-button v-clipboard:copy="urlValue" v-clipboard:success="clipboardSuccess" type="text">
            {{ $t('复制链接') }}
          </el-button>
        </ody-qrcode>
      </el-row>
    </el-dialog>
  </section>
</template>

<script>

export default {
  name: 'CmsArticleList',
  components: {
  },
  data() {
    // const vue = this
    return {
      categoryIdList: [],
      categoryTree: [],
      categoryList: [],
      platfroms: [{ code: 1, name: 'PC' }, { code: 2, name: 'H5' }],
      loading: false,
      list: [],
      searchForm: getDefaultSearchForm(this),
      dialogViewVisible: false,
      urlValue: '',
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'id',
          label: this.$t('文章编号'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('文章标题'),
          align: 'center'
        },
        {
          show: true,
          slot: 'categoryId',
          label: this.$t('所属分类'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('页面类型'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'platformStr',
          label: this.$t('支持终端'),
          align: 'center',
          minWidth: 88
        },
        {
          show: true,
          prop: 'price',
          label: this.$t('有效期'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column, cellValue) => {
            if (row.startDate && row.endDate) {
              return this.$portal.parseTime(new Date(row.startDate), '{y}-{m}-{d} {h}:{i}:{s}') + ' - ' + this.$portal.parseTime(new Date(row.endDate), '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        },
        {
          show: true,
          prop: 'mobile',
          label: this.$t('上一次操作时间'),
          align: 'center',
          minWidth: 88,
          formatter: (row, column, cellValue) => {
            if (row.updateTime) {
              return this.$portal.parseTime(new Date(row.updateTime), '{y}-{m}-{d} {h}:{i}:{s}')
            } else {
              return this.$portal.parseTime(new Date(row.createTime), '{y}-{m}-{d} {h}:{i}:{s}')
            }
          }
        }
      ],
      operates: {
        fixed: 'right',
        width: 300,
        align: 'center',
        list: [
          {
            label: this.$t('浏览'),
            code: 'CmsConsultationList03',
            method: (index, row) => {
              this.urlValue = `http:${row.channelList[0].previewUrl}&preview=1`
              this.dialogViewVisible = true
            }
          },
          {
            label: this.$t('编辑'),
            code: 'CmsConsultationList04',
            method: (index, row) => {
              this.$router.push({
                name: 'CmsH5Edit',
                params: {
                  templateId: row.templateId,
                  type: row.type
                }
              })
            }
          },
          {
            label: this.$t('删除'),
            code: 'CmsConsultationList05',
            method: (index, row) => {
              this.$confirm(this.$t('delete_cannot_revert_confirm_delete'), this.$t('提示'), {
                confirmButtonText: this.$t('确定'),
                cancelButtonText: this.$t('取消'),
                type: 'warning'
              }).then(() => {
                this.del(row)
              }).catch(() => {
                this.$message({
                  type: 'info',
                  message: this.$t('已取消')
                })
              })
            }
          }
        ]
      }
    }
  },
  computed: {
    categoryMap() {
      return this.categoryList.reduce((rtv, item) => {
        rtv[item.id] = item.categoryName
        return rtv
      }, {})
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
      this.listCategoryTree()
      this.handlePageCurrentChange()
    },
    async handleAdd() {
      const res = await this.$cms.$api.cmsEdit.addCmsTemplate({
        platform: 2,
        pageType: 8 // 质询列表页
      })
      const id = res.data.id
      this.$router.push({
        name: 'CmsH5Edit',
        params: {
          templateId: id,
          type: 8
        }
      })
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    async handlePageCurrentChange() {
      var vue = this
      vue.searchForm.page = vue.page.currentPage
      vue.searchForm.limit = vue.page.itemsPerPage
      if (vue.categoryIdList.length > 0) {
        vue.searchForm.filters.categoryId = vue.categoryIdList[vue.categoryIdList.length - 1]
      }
      const article = this.$cms.$api.article
      await article.queryCmsArticleList(vue.searchForm).then(res => {
        const data = res
        vue.page.total = data.total
        vue.list = data.data
      })
    },
    async del(row) {
      var vue = this
      const article = this.$cms.$api.article
      await article.deletePCCmsPage([row.id]).then(res => {
        if (res) {
          this.$message({
            type: 'success',
            message: this.$t('删除成功')
          })
          vue.handlePageCurrentChange()
        }
      })
    },
    async listCategoryTree() {
      const vue = this
      const res = await vue.$cms.$api.category.listTree({ filters: { categoryType: 1 }})
      vue.categoryTree = res.data
      const categoryList = res.data[0].children
      const childCategoryList = []
      categoryList.forEach(i => {
        if (i.children) {
          childCategoryList.push(...i.children)
        }
      })
      categoryList.push(...childCategoryList)
      vue.categoryList = categoryList
    },
    handleSearchReset() {
      this.categoryIdList = []
      this.searchForm = getDefaultSearchForm()
    },
    handlePageSizeChange() {
      this.handlePageCurrentChange()
    }
  }
}
function getDefaultSearchForm(vue) {
  return Object.assign(
    {
      page: 1,
      limit: 10,
      filters: {
        type: 8 // 资讯详情页
      }
    }
  )
}

</script>

<style lang="less" scoped>
.cp-date-range-picker .data-time-name .el-button {
  line-height: 32px !important;
  height: 32px !important;
}
.info_class {
  font-size: 14px;
  height: 20px;
  width: 20px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  color: #109fff;
  border: 1px solid #19a3ff;
  border-radius: 12px;
  margin-left: 10px;
  cursor: default;
}
</style>
