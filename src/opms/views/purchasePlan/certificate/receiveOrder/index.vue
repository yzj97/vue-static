<template>
  <section class="context">
    <div class="header-div">
      <span>{{ $t('supplier_attach_type_qualification') }}</span>
    </div>
    <div class="title-div">
      <span>{{ $t('common_audit_pass') }}</span>
    </div>
    <ody-table
      :data="data1"
      :columns="columns"
      :loading="loading"
      :can-filter="false"
      :multiple="false"
      name="data1360"/>
    <div class="block pagination-border-component page-div">
      <ody-pagination
        :current-page.sync="page.current"
        :list="data1"
        :page-sizes="[10, 20, 30, 50]"
        :page-size="page.size"
        :total="page.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
  </section>
</template>
<script>
import dateUtil from '@/utils/dateUtil'
var purchaseReceiveOrderId = null
export default {
  name: 'OpmsPurchaseOrderProductCertificate',
  data() {
    return {
      data1: [],
      checked: [],
      page: {
        size: 10,
        current: 1,
        total: 1
      },
      form: {
        id: 0,
        index: -1,
        certificateUrl: [],
        certificateCode: '',
        certificateUrlName: '',
        certificateDate: [],
        pickerOptions: {
        }
      },
      formLabelWidth: '110px',
      message: '',
      dialogVisible: false,
      auditorDialog: false,
      dialogFormVisible: false,
      loading: false,
      columns: [
        {
          show: true,
          prop: 'mpCode',
          label: this.$t('plMpResult_mpCode'),
          align: 'center',
          minWidth: 130
        },
        {
          show: true,
          prop: 'mpName',
          label: this.$t('plMpResult_mpName'),
          align: 'center',
          minWidth: 160
        },
        {
          show: true,
          prop: 'mpSpec',
          label: this.$t('purchaseOrderProduct_mpSpec'),
          align: 'center',
          minWidth: 80
        },
        {
          show: true,
          prop: 'categoryName',
          label: this.$t('purchaseOrderProduct_categoryName'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'certificateName',
          label: this.$t('supplier_attach_qualification_type'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'certificateUrlName',
          label: this.$t('supplier_attach_type_qualification'),
          align: 'center',
          minWidth: 120,
          formatter: (row, column, cellValue) => {
            return `<a style="white-space: nowrap;color: dodgerblue;" href="${row.certificateUrl}">${row.certificateUrlName != null ? row.certificateUrlName : ''}</a>`
            // if (!row.certificateUrl) {
            //   return '<a>{{$t('上传')}}</a>'
            // } else {
            //   return `<a style="white-space: nowrap;color: dodgerblue;" href="${row.certificateUrl}">${row.certificateUrlName}</a>`
            // }
          }
        },
        {
          show: true,
          prop: 'certificateCode',
          label: this.$t('supplier_attach_qualification_code'),
          align: 'center',
          minWidth: 120
        },
        {
          show: true,
          prop: 'certificateStartDate',
          label: this.$t('cert_start_date'),
          align: 'center',
          minWidth: 140,
          formatter: (row, column, cellValue) => {
            return this.dateFormat(row.certificateStartDate)
            // return this.$utils.Common.dateFormat(row.certificateStartDate, 'YYYY年MM月DD日 hh:mm')
          }
        },
        {
          show: true,
          prop: 'certificateEndDate',
          label: this.$t('cert_end_date'),
          align: 'center',
          minWidth: 140,
          formatter: (row, column, cellValue) => {
            return this.dateFormat(row.certificateEndDate)
            // return this.$utils.Common.dateFormat(row.certificateEndDate, 'YYYY年MM月DD日 hh:mm')
          }
        },
        {
          show: true,
          prop: 'auditor',
          label: this.$t('common_audit_person'),
          align: 'center',
          minWidth: 100
        },
        {
          show: true,
          prop: 'auditorDate',
          label: this.$t('common_audit_time'),
          align: 'center',
          minWidth: 140,
          formatter: (row, column, cellValue) => {
            return this.dateFormat(row.auditorDate)
            // return this.$utils.Common.dateFormat(row.auditorDate, 'YYYY年MM月DD日 hh:mm')
          }
        },
        {
          show: true,
          prop: 'auditorStatusInfo',
          label: this.$t('store_distribution_order_audit_status'),
          align: 'center',
          minWidth: 100
        }
      ]
    }
  },
  async mounted() {
    purchaseReceiveOrderId = this.$route.query.purchaseReceiveOrderId
    this.init()
  },
  methods: {
    async updateListPage() {
      try {
        this.loading = true
        await this.loadListPage()
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    handleSizeChange(val) {
      this.updateListPage()
    },
    handleCurrentChange(val) {
      this.updateListPage()
    },
    handleClose(done) {
      done()
    },
    async loadListPage() {
      const param = {
        filters: {
          auditorStatus: 1,
          purchaseReceiveOrderId: purchaseReceiveOrderId
        },
        limit: this.page.size,
        page: this.page.current
      }
      const purchasePlan = this.$opms.$api.purchasePlan
      const res = await purchasePlan.purchaseReceiveProductCertificateListPage(param)
      if (res) {
        this.data1 = res.data
        this.page.total = res.total
      }
    },
    dateFormat(time) {
      if (!time) {
        return ''
      }
      return dateUtil.dateFormatForTime(time, false)
    },
    init() {
      this.loadListPage()
    }
  }
}
</script>

<style lang="scss" scoped>
  .context {
    border: #666 solid 1px;
    margin-top: 20px;
    padding-bottom: 50px;
  }

  .header-div {
    height: 40px;
    line-height: 40px;
    padding-left: 8px;
    width: 100%;
    background-color: #6699FF;
    color: white;
    font-size: 1.15em;
  }

  .title-div {
    height: 70px;
    line-height: 70px;
    text-align: center;
    font-size: 1.32em;
    color: black;
  }

  .page-div {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .notaudit-div p {
    height: 40px;
  }

  .p-prompt {
    margin-top: 16px;
    padding-left: 50px;
    font-size: 0.8em;
    color: #999999;
  }

  .span-prompt {
    margin-top: 2px;
    font-size: 0.8em;
    color: #999999;
  }
</style>
