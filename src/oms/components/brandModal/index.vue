<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('goods_goods_good_brand')"
      width="60%"
      @open="init" >
      <section class="pg-brandModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('product_brand_name')" prop="name">
                <el-input v-model="searchForm.name" name="searchForm_name" />
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSearchSubmit" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_select') }}</el-button>
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :multiple="multiple"
              :checked.sync="checked"
              name="list530"
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="checked.length != 1" name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('common_confirm_search') }}</el-button>
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
    }
  },
  data() {
    return {
      multiple: true,
      searchForm: getDefaultSearchForm(),
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
          prop: 'code',
          label: this.$t('product_brand_code'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'name',
          label: this.$t('product_brand_name'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'englishName',
          label: this.$t('product_brand_nameEn'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'alias',
          label: this.$t('product_brand_alias'),
          align: 'center',
          minWidth: 40
        },
        {
          show: true,
          prop: 'trademarkUrl',
          label: this.$t('product_brand_logo'),
          align: 'center',
          minWidth: 40,
          render: (h, params) => {
            return (
              <img src={ params.row.trademarkUrl } style='width: 60px; height: 60px;'/>
            )
          }
        }
      ]
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadList(this)
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
      this.searchForm = getDefaultSearchForm()
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
    init() {
      this.handleSearchSubmit()
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$emit('update:visible', !this.visible)
      this.$emit('ok', this.checked[0])
    }
  }
}
async function loadList(vue) {
  const param = {
    itemsPerPage: vue.page.size,
    currentPage: vue.page.current,
    ...vue.searchForm
  }
  const common = vue.$oms.$api.common
  const result = await common.brandList(param)
  if (result && result.data) {
    const data = result.data
    vue.list = data.listObj
    vue.page.total = data.total
  }
}

function getDefaultSearchForm() {
  return Object.assign({}, {})
}
</script>

<style lang="scss" scoped>

</style>
