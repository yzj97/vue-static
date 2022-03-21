<template>
  <section>
    <ody-dialog
      :title="$t('common_contractProduct_choose')"
      :visible.sync="visible"
      :before-close="handleClose"
      width="840px"
      @open="handleSelect">
      <div>
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="100px" class="form">
              <el-row>
                <el-col :span="12">
                  <el-form-item :label="$t('common_product_code')+':'">
                    <el-input v-model="search.code" name="search_code" size="small"/>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="$t('common_product_name')+':'">
                    <el-input v-model="search.chineseName" name="search_chineseName" size="small"/>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleSelect" size="small" type="primary" @click="handleSelect">{{ $t('query') }}</el-button>
            <el-button name="handleReset" size="small" @click="handleReset">{{ $t('reset') }}</el-button>
          </div>
        </ody-list-search-area>
        <ody-list-table-area>
          <div slot="table">
            <el-table v-loading="loading" ref="productTable" :data="tableList" name="tableList996" size="small" @selection-change="handleSelectionChange">
              <el-table-column type="selection" width="60"/>
              <el-table-column :label="$t('common_product_code')" prop="mpCode"/>
              <el-table-column :label="$t('common_product_name')" prop="mpName"/>
              <el-table-column :label="$t('common_mp_spec')" prop="mpStandard"/>
              <el-table-column :label="$t('common_mp_barcode')" prop="barcode"/>
              <el-table-column :label="$t('common_mp_unit')" prop="mpUnit" width="80" align="center"/>
            </el-table>
          </div>
          <div slot="page">
            <ody-pagination
              :current-page="page.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size="page.size"
              :total="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="page.handleSizeChange"
              @current-change="page.handleCurrentChange"/>
          </div>
        </ody-list-table-area>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="selectedProducts.length<=0" name="ok" size="small" type="primary" @click="ok">{{ $t('common_save') }}</el-button>
      </span>
    </ody-dialog>
  </section>
</template>

<script>
export default {
  name: 'PurchasePlanTemplateProduct',
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    merchantId: {
      type: Object,
      required: true
    }
  },
  data() {
    const vue = this
    return {
      loading: false,
      selectedProducts: [],
      search: {
        code: null,
        chineseName: null
      },
      tableList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          vue.page.size = val
          vue.updateList()
        },
        handleCurrentChange(val) {
          vue.page.current = val
          vue.updateList()
        }
      }
    }
  },
  methods: {
    handleSelectionChange(rows) {
      this.selectedProducts = rows
    },
    handleClose() {
      this.search.code = null
      this.search.chineseName = null
      this.$refs.productTable.clearSelection()
      this.$emit('update:visible', false)
    },
    handleSelect() {
      this.page.current = 1
      this.updateList()
    },
    handleReset() {
      this.search.code = null
      this.search.chineseName = null
    },
    ok() {
      if (this.selectedProducts.length > 0) {
        this.$emit('ok', this.selectedProducts)
        this.handleClose()
      }
    },
    async updateList() {
      this.loading = true
      try {
        const data = {
          currentPage: this.page.current,
          itemsPerPage: this.page.size,
          obj: {
            merchantId: this.merchantId,
            ...this.search
          }
        }
        const { data: { listObj, total }} = await this.$opms.$api.purchasePlanTemplate.purchasePlanTemplateProductList(data)
        this.tableList = listObj
        this.page.total = total
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>

</style>
