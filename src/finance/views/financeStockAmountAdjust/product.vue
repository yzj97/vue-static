<!--  -->
<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('common_mp_choose')"
      width="60%"
      @open="init" >
      <section>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">

              <!-- 商品编码 -->
              <ody-search-item :label="$t('common_product_code')" prop="mpCode">
                <el-input v-model="searchForm.mpCode" name="searchForm_mpCode"/>
              </ody-search-item>

              <!-- 商品名称 -->
              <ody-search-item :label="$t('common_product_name')" prop="mpName">
                <el-input v-model="searchForm.mpName" name="searchForm_mpName"/>
              </ody-search-item>

            </el-form>
          </div>
          <div slot="btn">
            <!-- 查询 -->
            <el-button name="FinanceStockAmountAdjustProductList_handleSearchSubmit" code="FinanceStockAmountAdjustProductList" size="small" type="primary" @click="handleSearchSubmit">{{ $t('common_search') }}</el-button>
            <!-- 重置 -->
            <el-button name="handleSearchReset" size="small" @click="handleSearchReset">{{ $t('common_reset') }}</el-button>
          </div>
        </ody-list-search-area>

        <ody-list-table-area>
          <!-- 表格 -->
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="list"
              :columns="columns"
              :operates="operates"
              :multiple="true"
              :checked.sync="checked"
              :can-filter="false"
              name="list716"/>
          </div>
          <!-- 分页 -->
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
        <!-- 保存 -->
        <ody-button :disabled="checked.length<=0" name="FinanceStockAmountAdjustProductSave_handleSave" code="FinanceStockAmountAdjustProductSave" size="small" type="primary" @click="handleSave">{{ $t('common_save') }}</ody-button>
        <!-- 取消 -->
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
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
    warehouseId: {
      type: Number,
      default: null
    },
    merchantId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      fileList: [], // 导入
      searchForm: {},
      loading: false,
      list: [],
      currentRow: {},
      checked: [],
      page: { // 分页
        size: 10,
        current: 1,
        total: 0
      },
      columns: [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('common_product_code'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('common_mp_name'),
          align: 'center'
        },
        {
          show: true,
          prop: 'mpMeasureUnit',
          label: this.$t('mp_main_unit'),
          align: 'center'
        }
      ]
    }
  },
  created() {
    this.init()
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

    init() {
      this.updateList()
    },
    // 取消
    handleClose() {
      this.handleSearchReset()
      this.resetData()
    },
    // 保存
    handleSave() {
      // 发送数据到父组件
      this.$emit('ok', this.checked)
      this.resetData()
    },
    // 重置
    handleSearchReset() {
      this.searchForm = {}
    },
    // 查询
    handleSearchSubmit() {
      this.updateList()
    },
    // 分页
    async handlePageCurrentChange() {
      try {
        await this.updateList()
      } catch (ex) {
        console.log(ex)
      }
    },
    // 一页显示多少条数据
    async handlePageSizeChange(size) {
      try {
        this.$nextTick(function() {
          this.updateList()
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    resetData() {
      this.list = []
      this.page = {
        size: 10,
        current: 1,
        total: 0
      }
      this.$emit('update:visible', !this.visible)
    }

  }

}

async function loadList(vue) {
  const param = {
    limit: vue.page.size,
    page: vue.page.current,
    filters: {
      mpCode: vue.searchForm.mpCode, // 商品code
      mpName: vue.searchForm.mpName, // 商品name
      merchantId: vue.merchantId,
      warehouseId: vue.warehouseId
    }
  }
  if (vue.warehouseId && vue.merchantId) {
    const res = await vue.$finance.$api.inventory.listPageByMerchantAndWarehouse(param)
    if (res) {
      vue.list = res.data
      vue.page.total = res.total
    }
  }
}

</script>

<style lang="scss" scoped>
.cp-upload-image {
  display: inline-block;
}
.el-button {
  margin-left: 10px!important;
}
</style>
