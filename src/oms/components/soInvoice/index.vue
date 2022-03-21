<template>
  <section>
    <el-form ref="invoiceModel" label-width="240px">
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('invoiceInqurity_receiveInfo') }}</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('invoiceInqurity_deliveryName') + ':' ">
              <div>
                {{ invoiceInfo.goodReceiverName }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoiceInqurity_deliveryMobile') + ':' ">
              <div>
                {{ invoiceInfo.goodReceiverMobile }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoiceInqurity_receiveAddress') + ':' ">
              <div>
                {{ invoiceInfo.goodReceiverProvince }} {{ invoiceInfo.goodReceiverCity }} {{ invoiceInfo.goodReceiverArea }} <br> {{ invoiceInfo.goodReceiverAddress }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('manual_order_product_info') }}</span>
        </div>
        <el-table :data="invoiceModelList" name="invoiceModelList025" style="width: 100%">
          <el-table-column
            :label="$t('so_invoice_product')"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span v-if="scope.row.productPicPath">
                <img :src="scope.row.productPicPath" alt="" style="width: 50px;height: 50px">
              </span>
              <br>
              <span>
                {{ $t('invoiceInqurity_productName') }}：{{ scope.row.productCname }} <br>
                {{ $t('manual_order_product_attr') }}：{{ scope.row.productStandardStr }}<br>
                {{ $t('so_invoice_unit') }}：{{ scope.row.productUnit }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('do_product_code')"
            prop="productCode"
            align="center"
            width="200"/>
          <el-table-column
            :label="$t('so_invoice_item_num')"
            prop="itemQuantity"
            align="center"
            width="200"/>
          <el-table-column
            :label="$t('manual_order_purchase_amount')"
            prop="productItemAmount"
            align="center"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.productItemAmount | roundingNum }}
            </template>
          </el-table-column>
          <el-table-column
            :label="$t('so_invoice_item_amount')"
            prop="productAmountWithtax"
            align="center"
            width="200">
            <template slot-scope="scope">
              {{ scope.row.productAmountWithtax | roundingNum }}
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <el-card shadow="never">
        <div slot="header" class="clearfix">
          <span>{{ $t('invoiceDetail') }}</span>
        </div>
        <el-row>
          <el-col :span="24">
            <el-form-item :label="$t('so_invoice_mode') + ':' ">
              <div>
                {{ invoiceInfo.invoiceModeStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('order_ports_invoice_type') + ':' ">
              <div>
                {{ invoiceInfo.invoiceTypeStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoiceInqurity_invoiceTitle') + ':' ">
              <div>
                {{ invoiceInfo.invoiceTitleContent }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('so_invoice_tax_num') + ':' ">
              <div>
                {{ invoiceInfo.taxpayerIdentificationCode }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoice_inqurity_company_add') + ':' ">
              <div>
                {{ invoiceInfo.registerAddress }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoice_inqurity_billing_phone') + ':' ">
              <div>
                {{ invoiceInfo.registerPhone }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoice_inqurity_bank_name') + ':' ">
              <div>
                {{ invoiceInfo.bankDeposit }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoice_inqurity_bank_accno') + ':' ">
              <div>
                {{ invoiceInfo.bankAccount }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('invoiceInqurity_invoiceContent') + ':' ">
              <div>
                {{ invoiceInfo.invoiceContent }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('orderInvoiceInfo_invoice_status') + ':' ">
              <div>
                {{ invoiceInfo.isInvoiceStr }}
              </div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('orderInvoiceInfo_invoice_no') + ':' ">
              <div>
                {{ invoiceInfo.invoiceNum }}
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-card>
    </el-form>
  </section>
</template>

<script>
export default {
  filters: {
    roundingNum: function(value) {
      value = Number(value)
      return value.toFixed(2)
    }
  },
  props: {
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      invoiceModelList: [],
      invoiceInfo: {}
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      this.$oms.$api.soInvoice.soInvoiceListWithItem({
        filters: { orderCode: this.orderCode }
      }).then((data) => {
        const listItem = data.data
        if (listItem != null && listItem.length > 0) {
          this.invoiceInfo = listItem[0]
          listItem.forEach((item) => {
            item.soInvoiceItemVOList.forEach((pItem) => {
              if (pItem.productStandard != null) {
                const result = JSON.parse(pItem.productStandard)
                pItem.productStandardStr = ''
                result.forEach((res) => {
                  pItem.productStandardStr += res.attName + ':' + res.attValue + ','
                })
                if (pItem.productStandardStr !== '') {
                  pItem.productStandardStr = pItem.productStandardStr.substr(0, pItem.productStandardStr.length - 1)
                }
              }
              this.invoiceModelList.push(pItem)
            })
          })
        }
      }).finally(() => {
        this.loading = false
      })
    }
  }
}
</script>
