<template>
  <section>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form">
          <ody-search-item :label="$t('品牌名称') + ':'" prop="name">
            <el-input v-model="queryParam.name" name="queryParam_name" />
          </ody-search-item>
          <ody-search-item :label="$t('发源国家') + ':'" prop="sourceCountry">
            <el-input v-model="queryParam.sourceCountry" name="queryParam_sourceCountry" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="reset" size="small" @click="reset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="Product1004Query_handleSearchSubmit"
          size="small"
          type="primary"
          code="Product1004Query"
          @click="handleSearchSubmit"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="Product1004Add_openAdd"
          size="small"
          type="primary"
          code="Product1004Add"
          @click="openAdd"
        >{{ $t("新增") }}</ody-button
        >
        <ody-button
          name="Product1004Import_toBatch"
          size="small"
          code="Product1004Import"
          @click="toBatch"
        >{{ $t("批量导入") }}</ody-button
        >
        <ody-button
          name="Product1004ViewTask_taskVisible"
          size="small"
          code="Product1004ViewTask"
          @click="taskVisible = true"
        >{{ $t("查看任务") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          :loading="loading"
          :data="list"
          :columns="columns"
          :operates="operates"
          :multiple="true"
          :checked.sync="checked"
          name="list077"
        />
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
    <importTask
      :import-type="1"
      :is-data-task="true"
      :visible.sync="taskVisible"
      task-type="brandImport"
    />
  </section>
</template>

<script>
import importTask from '@/components/downloadTask/ImportTask.vue'
export default {
  components: { importTask },
  data() {
    return {
      taskVisible: false,
      loading: false,
      lang: '第二语言',
      queryParam: {},
      list: [],
      page: {
        itemsPerPage: 10,
        currentPage: 1,
        total: 10
      },
      columns: [
        {
          show: true,
          prop: 'name',
          label: this.$t('品牌名称'),
          align: 'center',
          render: (h, params) => {
            return (
              <div on-click={e => this.queryBrand(params.row)}>
                <span style='white-space: nowrap;color: dodgerblue; cursor:pointer'>
                  {params.row.name}
                </span>
              </div>
            )
          }
        },
        {
          show: true,
          prop: 'logUrl',
          label: this.$t('品牌Logo'),
          align: 'center',
          minWidth: 200,
          formatter: param => {
            return param.logUrl ? `<img width="50" src="${param.logUrl}">` : ''
          }
        },
        {
          show: true,
          prop: 'nameLan2',
          label: this.$t('品牌名称(第二语言)'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'sourceCountry',
          label: this.$t('发源国家'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        fixed: 'right',
        list: [
          {
            label: this.$t('编辑'),
            disabled: false,
            method: (index, row) => {
              this.handleEdit(index, row)
            },
            code: 'Product1004Edit'
          }
        ]
      }
    }
  },
  activated() {
    if (this.$route.params.reload) {
      this.init()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      queryList(this)
    },
    reset() {
      this.queryParam = {}
    },
    async handlePageSizeChange() {
      try {
        await this.updateList()
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
    async updateList() {
      try {
        this.loading = true
        await queryList(this)
        this.loading = false
      } catch (ex) {
        console.log(ex)
      }
    },
    handleEdit(index, row) {
      this.$router.push({
        path: '/back-product-static/platfrom/mp/mainData/brand/edit',
        query: { id: row.id, viewStatus: 3 }
      })
    },
    openAdd() {
      this.$router.push({
        path: '/back-product-static/platfrom/mp/mainData/brand/edit',
        query: { viewStatus: 1 }
      })
    },
    queryBrand(row) {
      if (this.$portal.hasPermission('Product1004ViewDetail')) {
        this.$router.push({
          path: '/back-product-static/platfrom/mp/mainData/brand/edit',
          query: { id: row.id, viewStatus: 2 }
        })
      }
    },
    async handleSearchSubmit() {
      this.page.currentPage = 1
      await queryList(this)
    },
    toBatch() {
      this.$router.push({ name: 'BrandBatch' })
    }
  }
}
async function queryList(vue) {
  // var param = Object.assign({}, this.queryParam, this.page, obj)
  const param = {
    currentPage: vue.page.currentPage,
    itemsPerPage: vue.page.itemsPerPage,
    total: vue.page.total,
    isTrusted: true,
    name: vue.queryParam.name,
    sourceCountry: vue.queryParam.sourceCountry
  }

  vue.loading = true
  try {
    const res = await vue.$product.$api.mpApi.listBrand(param)
    vue.list = res.data.listObj
    vue.page.total = res.data.total
  } finally {
    vue.loading = false
  }
}
</script>

<style lang="scss" scoped></style>
