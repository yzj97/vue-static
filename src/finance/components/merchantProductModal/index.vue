<template>
  <ody-dialog
    ref="input"
    :visible.sync="visible"
    :before-close="handleClose"
    :title="$t('common_mp_choose')"
    width="1000px">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" label-width="150px" class="form">
          <ody-search-item :label="$t('common_product_code') + ':'" prop="code">
            <el-input v-model="code" name="code"/>
          </ody-search-item>
          <ody-search-item :label="$t('common_product_name') + ':'" prop="chineseName">
            <el-input v-model="chineseName" name="chineseName"/>
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <el-button name="query" size="small" type="primary" @click="query">{{ $t('common_select') }}</el-button>
        <el-button name="reset" size="small" @click="reset">{{ $t('common_reset') }}</el-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <el-table
          ref="multipleTable"
          :data="productList"
          name="productList582"
          style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55"/>
          <el-table-column :label="$t('common_product_code')" prop="code"/>
          <el-table-column :label="$t('common_product_name')" prop="chineseName"/><!--englishName-->
          <el-table-column :label="$t('common_mp_unit')" prop="mainUnitName"/>
        </el-table>
      </div>
      <div slot="page">
        <div class="block">
          <ody-pagination
            :current-page="page.current"
            :page-sizes="[10, 20, 30, 50]"
            :page-size="page.size"
            :total="page.total"
            layout="total, sizes, prev, pager, next, jumper"
            class="pageStyle"
            @size-change="page.handleSizeChange"
            @current-change="page.handleCurrentChange"/>
        </div>
      </div>
    </ody-list-table-area>
    <div slot="footer" class="dialog-footer">
      <ody-button name="cancel" size="small" @click="cancel()">{{ $t('cancel') }}</ody-button>
      <ody-button :disabled="checkedProductList<=0" name="done" size="small" type="primary" @click="done()">{{ $t('ok') }}</ody-button>
    </div>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    dataType: {
      type: Number,
      default: 2 // 商家商品
    },
    merchantIds: {
      type: Array,
      required: false,
      default() {
        return null
      }
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const Vue = this
    return {
      chineseName: null,
      code: null,
      productDialogVisible: true,
      productList: [],
      checkedProductList: [],
      page: {
        current: 1,
        size: 10,
        total: 0,
        handleSizeChange(val) {
          Vue.page.size = val
          Vue.query()
        },
        handleCurrentChange(val) {
          Vue.page.current = val
          Vue.query()
        }
      }
    }
  },
  created() {
    this.query()
  },
  methods: {
    async query() {
      const req = {
        code: this.code,
        chineseName: this.chineseName,
        currentPage: this.page.current,
        itemsPerPage: this.page.size,
        dataType: this.dataType,
        merchantIds: this.merchantIds
      }
      const resp = await this.$finance.$api.common.merchantProductList(req)
      this.productList = resp.data.listObj
      this.page.total = resp.data.total
    },
    reset() {
      this.code = null
      this.chineseName = null
    },
    handleSelectionChange(checked) {
      this.checkedProductList = checked
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    cancel() {
      this.reset()
      this.$refs.multipleTable.clearSelection()
      this.$emit('update:visible', !this.visible)
    },
    done() {
      this.$emit('selected', this.checkedProductList)
      this.cancel()
    }
  }
}
</script>

<style scoped>

</style>
