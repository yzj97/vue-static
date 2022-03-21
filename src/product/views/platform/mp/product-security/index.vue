<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="100px" class="form">
          <ody-search-item v-if="platformId === '2'" :label="$t('商家') + ':'" prop="merchantId">
            <ody-merchant-select
              ref="selectMerchant"
              v-model="searchForm.merchantId"
              name="searchForm_merchantId"
              value-key="merchantId"
            />
          </ody-search-item>
          <ody-search-item :label="$t('保障名称') + ':'" prop="title">
            <el-input v-model="searchForm.title" name="searchForm_title" />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="handleReset" size="small" @click="handleReset">{{
          $t("重置")
        }}</el-button>
        <ody-button
          name="ProductProductSecurityPageQuery_handleQuery"
          size="small"
          type="primary"
          code="ProductProductSecurityPageQuery"
          @click="handleQuery"
        >{{ $t("查询") }}</ody-button
        >
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn-bottom">
        <ody-button
          name="ProductProductSecurityAdd_handleAdd"
          size="small"
          type="primary"
          code="ProductProductSecurityAdd"
          @click="handleAdd"
        >{{ $t("新增") }}</ody-button
        >
      </div>
      <div slot="table">
        <ody-table
          :data="data"
          :columns="columns"
          :loading="loading"
          :operates="operates"
          name="data564"
        >
          <template slot="title" slot-scope="scope">
            <el-button
              name="handleTitleClick"
              type="text"
              class="el-button-text"
              style="color: #409eff!important;"
              @click="handleTitleClick(scope.row)"
            >{{ scope.row.title }}</el-button
            >
          </template>
          <template slot="merchantName" slot-scope="scope">{{
            scope.row.merchantId | keyVal(getMerchantName)
          }}</template>
        </ody-table>
      </div>
      <div slot="page">
        <ody-pagination
          :current-page.sync="page.current"
          :list="data"
          :page-sizes="[10, 20, 30, 50]"
          :page-size.sync="page.size"
          :total.sync="page.total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
        />
      </div>
    </ody-list-table-area>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
const searchForm = {
  title: ''
}
export default {
  name: 'ProductProductSecurity',
  data() {
    const self = this
    return {
      platformId: '',
      searchForm: {
        ...searchForm
      },
      loading: false,
      data: [],
      columns: [
        {
          show: true,
          slot: 'title',
          label: this.$t('保障名称'),
          minWidth: 200,
          align: 'left'
        },
        {
          show: true,
          prop: 'titleLan2',
          label: this.$t('保障名称（第二语言）'),
          minWidth: 200,
          align: 'left'
        },
        {
          show() {
            return self.platformId === '2'
          },
          slot: 'merchantName',
          label: this.$t('商家名称'),
          align: 'left'
        }
      ],
      operates: {
        align: 'left',
        list: [
          {
            label: this.$t('编辑'),
            disabled: false,
            method(index, row) {
              self.handleEdit(row)
            },
            code: 'ProductProductSecurityEdit'
          },
          {
            label: this.$t('删除'),
            disabled: false,
            method(index, row) {
              self.handleDelete(row)
            },
            code: 'ProductProductSecurityDelete'
          }
        ]
      },
      page: {
        size: 10,
        current: 1,
        total: 0
      }
    }
  },
  computed: {
    getMerchantName() {
      return this.$refs.selectMerchant.$refs.select2.options.reduce(
        (rtv, item) => {
          rtv[item.merchantId] = item.merchantName
          return rtv
        },
        {}
      )
    }
  },
  mounted() {
    this.initPlatformId().then(() => {
      this.init()
    })
  },
  methods: {
    async initPlatformId() {
      this.platformId = Cookies.get('platformId')
      return Promise.resolve()
    },
    async init() {
      this.handleQuery()
    },
    async handleQuery() {
      const vue = this
      const param = Object.assign({}, vue.searchForm)
      param.currentPage = vue.page.current
      param.itemsPerPage = vue.page.size
      vue.loading = true

      try {
        let res = {}
        if (vue.platformId === '1') {
          res = await vue.$product.$api.mpApi.queryPlatformMpProtectionPage(
            param
          )
        } else {
          res = await vue.$product.$api.mpApi.queryMerchantProdSecurityPage(
            param
          )
        }
        if (res.data && res.data.listObj) {
          vue.data = res.data.listObj
        } else {
          vue.data = []
        }
        vue.page.total = res.data.total
      } finally {
        vue.loading = false
      }
    },
    handleAdd() {
      this.$router.push({ name: 'ProductProductSecurityEdit' })
    },
    handleEdit(row) {
      this.$router.push({
        name: 'ProductProductSecurityEdit',
        params: { id: row.id }
      })
    },
    handleTitleClick(row) {
      if (this.$portal.hasPermission('ProductProductSecurityView')) {
        this.$router.push({
          name: 'ProductProductSecurityEdit',
          params: { id: row.id, view: true }
        })
      }
    },
    handleDelete(row) {
      const vue = this
      vue
        .$confirm(
          vue.$t('common_msg_confirm_delete'),
          vue.$t('common_msg_delete'),
          {
            confirmButtonText: vue.$t('common_confirm'),
            cancelButtonText: vue.$t('common_cancel'),
            type: 'warning'
          }
        )
        .then(() => {
          if (vue.platformId === '1') {
            vue.$product.$api.mpApi
              .deletePlatformMpProtectionById({ id: row.id })
              .then(res => {
                vue.handleQuery()
                vue.$message.success(vue.$t('delete_success'))
              })
          } else {
            vue.$product.$api.mpApi
              .deleteMerchantProdSecurityById({ id: row.id })
              .then(res => {
                vue.handleQuery()
                vue.$message.success(vue.$t('delete_success'))
              })
          }
        })
    },
    handleReset() {
      this.searchForm = { ...searchForm }
    },
    async handlePageSizeChange(size) {
      try {
        this.page.size = size
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
    }
  }
}
</script>

<style scoped>
.el-button-text{
  padding-left: 0px;
  padding-right:0px;
}
</style>
