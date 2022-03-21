<template>
  <section>
    <el-form id="soReturn" style="width: 100%">
      <ody-table
        :loading="loading"
        :data="returnList"
        :columns="columns"
        :operates="operates"
        name="returnList894"/>
    </el-form>
    <!--发起售后模态框-->
    <AfterSaleModal ref="afterSaleModal" :visible.sync="showApplyReturnModal" :form-data.sync="formData" :collect.sync="collect" :so-info.sync="soInfo" :support-return-types="supportReturnTypes" :is-edit="isEdit" @ok="saveAfterSale" @soReturnChange="init" />
  </section>
</template>

<script>
import AfterSaleModal from './afterSaleModal'
export default {
  components: {
    AfterSaleModal
  },
  props: {
    soInfo: {
      type: Object,
      required: true
    },
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    const vue = this
    return {
      returnList: [],
      showApplyReturnModal: false,
      noSupportsReturn: true,
      supportReturnTypes: {},
      isEdit: false,
      orderStatus: '',
      columns: [
        {
          show: true,
          prop: 'returnCode',
          label: this.$t('order_sales_code'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'typeStr',
          label: this.$t('so_return_type'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'returnStatusStr',
          label: this.$t('order_sales_status'),
          align: 'center',
          minWidth: 200
        },
        {
          show: true,
          prop: 'applyReturnAmount',
          label: this.$t('sales_order_refund_amount'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            return (vue.roundingNum(row.applyReturnAmount))
          }
        },
        {
          show: true,
          prop: 'showActualReturnAmount',
          label: this.$t('actual_refund_amount'),
          align: 'center',
          minWidth: 200,
          formatter: (row, column) => {
            return (vue.roundingNum(row.showActualReturnAmount))
          }
        },
        {
          show: true,
          prop: 'createTime',
          label: this.$t('common_create_time'),
          align: 'center',
          minWidth: 200
        }
      ],
      operates: {
        width: 200,
        align: 'center',
        fixed: 'right',
        list: [
          {
            label: this.$t('view'),
            disabled: false,
            method(index, row) {
              vue.$router.push({
                name: 'OmsOrderSalesListManagementDetail',
                params: {
                  id: row.id
                }
              })
            },
            code: 'OmsOrderList_ReturnView'
          },
          {
            label: this.$t('cancel'),
            method: (index, row) => {
              vue.selectedItem = row
              vue.returnCancel(row)
            },
            hidden: (index, row) => {
              if (row.returnStatus === 4000 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderList_ReturnCancel'
          },
          {
            label: this.$t('common_update'),
            method: (index, row) => {
              this.isEdit = true
              this.showApplyReturnModal = true
              this.$refs['afterSaleModal'].returnEdit(row)
            },
            hidden: (index, row) => {
              if (row.returnStatus === 4000 && !row.outReturnCode) {
                return false
              } else {
                return true
              }
            },
            code: 'OmsOrderList_ReturnUpdate'
          }
        ]
      }
    }
  },
  methods: {
    launchAfterSale() { // 显示发起售后模态框
      this.showApplyReturnModal = true
      this.isEdit = false
    },
    init() {
      const vue = this
      this.$oms.$api.soReturn.soReturnList({
        filters: { orderCode: this.orderCode },
        sorts: [{ field: 'createTime', asc: false }]
      }).then((data) => {
        const listItem = data.data
        vue.returnList = listItem
        vue.returnList.forEach((item) => {
          item.showActualReturnAmount = parseFloat(0)
          if (item.returnStatus === 4010 || item.returnStatus === 4040 || item.returnStatus === 4099) {
            if (item.freight == null) {
              item.freight = parseFloat(0)
            }
            item.showActualReturnAmount = (item.actualReturnAmount + item.freight)
          }
        })
        this.noSupportsReturn = true
        // todo 发起售后按钮判断条件
        if (data.extraData) {
          vue.supportReturnTypes = {}
          vue.noSupportsReturn = data.extraData.length === 0
          data.extraData.forEach(function(item) {
            vue.supportReturnTypes[item.type] = true
          })
        }
      })
    },
    roundingNum(value) {
      value = Number(value)
      return value.toFixed(2)
    },
    returnCancel: function(row) {
      this.$confirm(this.$t('cancel_so_return'), this.$t('common_tip'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel')
      }).then(() => {
        const baseUrl = 'oms-web/soReturn/cancel'
        this.$portal.get(baseUrl + '?id=' + row.id + '&cancelSource=1', {})
          .then((result) => {
            if (result.code === '0') {
              this.$message({
                type: 'success',
                message: this.$t('common_cancel_success')
              })
              this.init()
            } else {
              this.$message({
                type: 'error',
                message: result.message
              })
            }
          })
      }).catch(() => {
        this.init()
      })
    }
  }
}
</script>
