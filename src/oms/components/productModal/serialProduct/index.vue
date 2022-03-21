<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('please_choose')"
      width="600px"
      @open="init" >
      <section class="pg-productModal-list">
        <ody-list-table-area>
          <div slot="table">
            <el-form-item :label="$t('order_ports_product_name')">
              {{ product.chineseName }}
            </el-form-item>
            <el-table
              v-loading="loading"
              :data="serialProductList"
              name="serialProductList730"
              style="width: 100%">
              <el-table-column
                :label="this.$t('manual_order_product_attr')"
                prop="saleAttribute"
                align="center"
                width="120">
                <!--<template slot-scope="scope">
                  <span>
                    {{ !scope.row.attributeList ? '' : scope.row.attributeList.map((item, index) => {
                      return item['attName'] + ':' + item['attValue']
                    }).join(";") }}
                  </span>
                </template>-->
              </el-table-column>
              <el-table-column
                :label="$t('manual_order_salable_stock')"
                prop="virtualAvailableStockNum"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="$t('do_unit')"
                prop="mainUnitName"
                align="center"
                min-width="100"/>
              <el-table-column
                v-if="!isGiftMode"
                :label="$t('order_start_num')"
                prop="orderStartNum"
                align="center"
                min-width="100"/>
              <el-table-column
                v-if="!isGiftMode"
                :label="$t('order_multiple_num')"
                prop="orderMultipleNum"
                align="center"
                min-width="100"/>
              <el-table-column
                :label="$t('manual_order_quantity')"
                align="center"
                min-width="140">
                <template slot-scope="scope">
                  <el-input-number
                    v-model="scope.row.productItemNum"
                    :step="isNaN(Number(scope.row.orderMultipleNum)) || !Number(scope.row.orderMultipleNum) ? 1 : Number(scope.row.orderMultipleNum)"
                    :step-strictly="true"
                    :min="0"
                    :max="isNaN(Number(scope.row.virtualAvailableStockNum)) ? 0 : Number(scope.row.virtualAvailableStockNum)"
                    name="scope_row_productItemNum"
                    controls-position="right"
                    size="small"
                    style="width: 120px;"/>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('common_append') }}</el-button>
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>

export default {
  props: {
    product: {
      type: Object,
      default: () => {
        return {}
      }
    },
    serialProductList: {
      type: Array,
      default: () => {
        return []
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    isGiftMode: { // 赠品，只是隐藏最小起订量，订货倍数，订购数量字段
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
    }
  },
  async mounted() {
    try {
      // this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    init() {
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      this.$emit('update:visible', !this.visible)
      this.$emit('ok')
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
