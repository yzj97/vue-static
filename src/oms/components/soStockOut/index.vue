<template>
  <div>
    <el-button name="showDialog" size="mini" @click="showDialog">{{ $t('缺货明细') }}</el-button>
    <ody-dialog-full-right
      :visible.sync="dialogVisible"
      :title="$t('缺货明细')">
      <el-table
        ref="singleTable"
        :data="soItemStockItemList"
        name="soItemStockItemList760"
        border
        highlight-current-row
        style="width: 100%">
        <el-table-column
          :label="$t('do_product_name')"
          prop="productCname"
          align="center"
          width="150"/>
        <el-table-column
          :label="$t('order_ports_product_code')"
          prop="code"
          align="center"
          width="150"/>
        <el-table-column
          :label="$t('bar_code')"
          prop="barCode"
          align="center"
          width="150"/>
        <el-table-column
          :label="$t('manual_order_product_attr')"
          prop="standard"
          align="center"
          width="150"/>
        <el-table-column
          :label="$t('do_product_item_num')"
          prop="productItemNum"
          align="center"
          width="150"/>
        <el-table-column
          :label="$t('do_delivered_num')"
          align="center"
          width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.productItemNum - scope.row.unDeliveryNum }}</span>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('stock_out_num')"
          prop="stockOutAmount"
          align="center"
          width="150"/>
      </el-table>
      <div slot="footer">
        <el-button name="handleCloseDialog" type="primary" @click="handleCloseDialog">{{ $t('关闭') }}</el-button>
      </div>
  </ody-dialog-full-right></div>
</template>

<script>
export default {
  props: {
    orderCode: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      soItemStockItemList: [],
      dialogVisible: false
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$oms.$api.soItemStockOut.soItemStockOutList({ orderCode: this.orderCode }).then((result) => {
        this.soItemStockItemList = result.data
      })
    },
    showDialog() {
      this.dialogVisible = true
    },
    handleCloseDialog() {
      this.dialogVisible = false
    }
  }
}
</script>

