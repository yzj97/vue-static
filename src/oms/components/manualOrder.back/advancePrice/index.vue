<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('advance_price_detail')"
      width="60%"
      @open="init" >
      <section class="pg-advancePriceModal-list">
        <ody-list-table-area>
          <div slot="table">
            <ody-table
              :loading="loading"
              :data="product.advancePriceSteps"
              :columns="columns"
              :can-filter="false"
              name="product_advancePriceSteps927"
            />
          </div>
        </ody-list-table-area>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_close') }}</el-button>
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
    product: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      list: [],
      columns: [
        {
          show: true,
          label: this.$t('manual_order_product_name'),
          align: 'center',
          minWidth: 40,
          formatter: (row, column) => {
            return this.product.chineseName
          }
        },
        {
          show: true,
          prop: 'numberStartRange',
          label: this.$t('manual_order_quantity'),
          align: 'center',
          minWidth: 40,
          formatter: (row, column) => {
            return row.numberStartRange + this.$t('order_to') + row.numberEndRange
          }
        },
        {
          show: true,
          prop: 'price',
          label: this.$t('manual_order_sales_unit_price'),
          align: 'center',
          minWidth: 40,
          formatter: (row, column) => {
            return Number(row.price).toFixed(2)
          }
        }
      ]
    }
  },
  methods: {
    init() {
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
