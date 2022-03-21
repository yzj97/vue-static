<template>
  <div class="pg-oms-invoice-list-list">
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="search" :model="search" label-width="100px" class="form">
          <ody-search-item :label="$t('销售渠道') + ':'" prop="sysSource">
            <ody-channel-select v-model="search.sysSource" :placeholder="$t('全部')" name="search_sysSource" />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('销售店铺') + ':'" prop="storeName">
            <el-input
              v-model="search.storeName"
              :placeholder="$t('请输入销售店铺')"
              name="search_storeName"
              type="text"
              maxlength="50"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('订单编号') + ':'" prop="orderCode">
            <el-input
              v-model="search.orderCode"
              :placeholder="$t('请输入订单编号')"
              name="search_orderCode"
              type="text"
              maxlength="20"
            />
          </ody-search-item>
          <ody-search-item :space="1" :label="$t('外部订单编号') + ':'" prop="outOrderCode">
            <el-input
              v-model="search.outOrderCode"
              :placeholder="$t('请输入外部订单编号')"
              name="search_outOrderCode"
              type="text"
              maxlength="50"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('发票编码') + ':'" prop="invoiceCode">
            <el-input
              v-model="search.invoiceCode"
              :placeholder="$t('请输入发票编码')"
              name="search_invoiceCode"
              type="text"
              maxlength="50"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('纳税人识别码') + ':'" prop="taxpayerIdentificationCode">
            <el-input
              v-model="search.taxpayerIdentificationCode"
              :placeholder="$t('请输入纳税人识别码')"
              name="search_taxpayerIdentificationCode"
              type="text"
              maxlength="80"
            />
          </ody-search-item>

          <ody-search-item :space="1" :label="$t('发票抬头') + ':'" prop="invoiceTitleContent">
            <el-input
              v-model="search.invoiceTitleContent"
              :placeholder="$t('请输入发票抬头')"
              name="search_invoiceTitleContent"
              type="text"
              maxlength="80"
            />
          </ody-search-item>

          <ody-search-item :label="$t('开票方式') + ':'" prop="invoiceMode">
            <el-select v-model="search.invoiceMode" :placeholder="$t('common_all')" name="search_invoiceMode" clearable>
              <el-option v-for="(v,k) in invoiceModeList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('开票状态') + ':'" prop="invoiceStatus">
            <el-select v-model="search.invoiceStatus" :placeholder="$t('common_all')" name="search_invoiceStatus" clearable>
              <el-option v-for="(v,k) in invoiceStatusList" :label="v" :key="k" :value="k" />
            </el-select>
          </ody-search-item>
          <ody-search-item :label="$t('开票日期') + ':'" prop="invoiceDate">
            <ody-date-range-picker
              v-model="invoiceDate"
              :placeholder="$t('请选择开票日期')"
              :start-placeholder="$t('startDate')"
              :end-placeholder="$t('endDate')"
              name="invoiceDate"
              type="datetimer"/>
          </ody-search-item>

          <ody-search-item :label="$t('申请日期') + ':'" prop="createTime">
            <ody-date-range-picker
              ref="createTime"
              v-model="createTime"
              :placeholder="$t('请选择创建时间')"
              name="createTime"
              type="datetimer"
            />
          </ody-search-item>
        </el-form>
      </div>
      <div slot="btn">
        <ody-button name="ui_handleSearchReset" code="ui" size="small" @click="handleSearchReset">{{ $t('重置') }}</ody-button>
        <ody-button
          name="SoInvoice_query"
          code="SoInvoice_query"
          size="small"
          type="primary"
          @click.prevent="handleSearchSubmit"
        >{{ $t('查询') }}</ody-button>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="table">
        <ody-table
          ref="table"
          :columns="table.columns"
          request-url="/oms-web/soInvoice/listSoInvoicePage"
          request-page-type="page"
        >
          <template slot="invoiceCode" slot-scope="scope">
            <div
              v-if="scope.row.invoiceNum && scope.row.invoiceCode"
            >{{ scope.row.invoiceNum +"/"+ scope.row.invoiceCode }}</div>
          </template>
        </ody-table>
      </div>
    </ody-list-table-area>
  </div>
</template>
<script>
import ToOrderDetail from '@/components/so/toDetail'

export default {
  name: 'OmsInvoiceList',
  components: {
    ToOrderDetail
  },
  data() {
    return {
      search: {
        sysSource: null,
        storeName: null,
        invoiceMode: null,
        invoiceStatus: null,
        outOrderCode: null,
        orderCode: null,
        invoiceCode: null,
        invoiceTitleContent: null,
        taxpayerIdentificationCode: null
      },
      invoiceDate: [],
      createTime: [],
      invoiceModeList: [],
      invoiceStatusList: [],
      table: {
        columns: [
          {
            label: this.$t('销售渠道'),
            prop: 'sysSourceName',
            show: true
          },

          {
            label: this.$t('销售店铺'),
            prop: 'storeName',
            show: true
          },

          {
            label: this.$t('发票抬头'),
            prop: 'invoiceTitleContent',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('纳税人识别码'),
            prop: 'taxpayerIdentificationCode',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('开票方式'),
            prop: 'invoiceModeStr',
            show: true
          },
          {
            label: this.$t('发票记录号'),
            prop: 'extraCode',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('申请时间'),
            prop: 'createTimeStr',
            show: true,
            minWidth: 200
          },

          {
            label: this.$t('订单编号'),
            prop: 'orderCode',
            show: true,
            minWidth: 200,
            render: (h, params) => {
              return (
                <ToOrderDetail
                  orderCode={params.row.orderCode}
                  orderSource={params.row.orderSource}
                  sysSource={params.row.sysSource}
                >
                  <span>{params.row.orderCode}</span>
                </ToOrderDetail>
              )
            }
          },
          {
            label: this.$t('外部订单号'),
            prop: 'outOrderCode',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('订单金额'),
            prop: 'orderAmount',
            show: true,
            formatter: (row, column) => {
              var orderAmount = row.orderAmount ? row.orderAmount : 0
              var deliveryFee = row.orderDeliveryFee ? row.orderDeliveryFee : 0
              return (Number(orderAmount) + Number(deliveryFee)).toFixed(2)
            }
          },
          {
            label: this.$t('订单状态'),
            prop: 'orderStatusStr',
            show: true
          },
          {
            label: this.$t('已开票金额'),
            prop: 'invoiceValue',
            show: true
          },
          {
            label: this.$t('开票日期'),
            prop: 'invoiceDateStr',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('发票代码/编码'),
            slot: 'invoiceCode',
            show: true,
            minWidth: 200
          },
          {
            label: this.$t('注册地址'),
            prop: 'registerAddress',
            show: true
          },

          {
            label: this.$t('注册电话'),
            prop: 'registerPhone',
            show: true
          },

          {
            label: this.$t('开户银行'),
            prop: 'bankDeposit',
            show: true
          },

          {
            label: this.$t('银行账户'),
            prop: 'bankAccount',
            show: true
          },
          {
            label: this.$t('收货人姓名'),
            prop: 'goodReceiverName',
            show: true
          },
          {
            label: this.$t('收货人地址'),
            prop: 'goodReceiverAddress',
            show: true
          },
          {
            label: this.$t('收货人手机'),
            prop: 'goodReceiverMobile',
            show: true
          },
          {
            label: this.$t('收货人邮箱'),
            prop: 'goodReceiverMail',
            show: true
          },
          {
            label: this.$t('发票状态'),
            prop: 'invoiceStatusStr',
            show: true
          },
          {
            label: this.$t('开票失败原因'),
            prop: 'invoiceFailedReason',
            show: true
          }
        ]
      }
    }
  },
  computed: {},
  async mounted() {
    this.$refs.createTime.setDefault(30)
    await this.initCodes()
    await this.init()
  },
  methods: {
    // 初始化
    init() {
      const params = this.$portal.deepClone(this.search)

      if (this.invoiceDate && this.invoiceDate.length > 0) {
        params.startInvoiceDate = this.invoiceDate[0]

        params.endInvoiceDate = this.invoiceDate[1]
      }
      if (this.createTime && this.createTime.length > 0) {
        params.startCreateTime = this.createTime[0]

        params.endCreateTime = this.createTime[1]
      }

      console.log('search-params', this.formHasValue(params))
      // 有值才传递
      return this.$refs.table.getList({
        filters: this.formHasValue(params)
      })
    },
    async initCodes() {
      const vue = this
      vue.$oms.$api.common
        .listMultiCode({
          categorys: ['INVOICE_MODE', 'INVOICE_STATUS']
        })
        .then(data => {
          if (data.code === '0') {
            vue.invoiceModeList = data.data.INVOICE_MODE
            vue.invoiceStatusList = data.data.INVOICE_STATUS
          }
        })
    },
    // search重置
    handleSearchReset() {
      this.formReset('search')
      this.$refs.createTime.setDefault(30)
    },
    // 查询
    async handleSearchSubmit() {
      const [err] = await this.formValidate('search')

      if (err) {
        return
      }
      await this.init()
    }
  }
}
</script>
