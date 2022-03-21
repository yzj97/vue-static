<template>
  <section class="context">
    <div class="header-div">
      <span>{{ $t('supplier_attach_type_qualification') }}</span>
    </div>
    <div v-if="(data1 != null && data1.length > 0) || (isFlag)">
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
    </div>
    <div v-show="!isFlag">
      <div class="title-div notaudit-div">
        <p>{{ $t('common_audit_status_wait') }}</p>
      </div>
      <ody-button name="auditorDialog" type="primary" size="small" style="margin-left: 10px;margin-bottom: 10px;" @click="auditorDialog = true">{{ $t('common_batch_audit') }}</ody-button>
      <ody-table
        :data="data2"
        :columns="columns"
        :operates="operates"
        :loading="loading"
        :checked.sync="checked"
        :can-filter="false"
        :multiple="true"
        name="data2795"/>
    </div>
    <!--<p class="p-prompt">
      上传格式：.jpg、.pdf、png 不能超过5M
    </p>-->
    <!--<div style="text-align: center;">
      <ody-button name="updateList" type="primary" size="medium" style="width: 120px" @click="updateList">{{$t('保存')}}</ody-button>
      <el-button size="medium" style="width: 120px;margin-left: 50px;">{{$t('取消')}}</el-button>
    </div>-->
    <ody-dialog
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :title="$t('common_message')"
      size="sm">
      <span>{{ message }}</span>
    </ody-dialog>
    <ody-dialog
      :visible.sync="auditorDialog"
      :before-close="handleClose"
      :title="$t('plRule_detail_confirm_title')"
      width="600px">
      <span>{{ $t('common_adudit_please_pass') }}</span>
      <span slot="footer" class="dialog-footer">
        <ody-button name="doAuditor" size="small" @click="doAuditor(0)">{{ $t('notpass') }}</ody-button>
        <ody-button name="doAuditor4" size="small" type="primary" @click="doAuditor(1)">{{ $t('pass') }}</ody-button>
      </span>
    </ody-dialog>
    <!-- 编辑表单 -->
    <ody-dialog :visible.sync="dialogFormVisible" :title="$t('common_edit')" width="650px">
      <el-form :model="form">
        <el-form-item :label-width="formLabelWidth" :label="$t('supplier_attach_type_qualification')">
          <ody-upload-image :file-list.sync="form.certificateUrl" :pic-type="['png', 'jpg', 'gif']" @success="uploadImgChange" />
          <span class="span-prompt">
            {{ $t('upload_images_specification') }}
          </span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('supplier_attach_qualification_code')">
          <el-input v-model="form.certificateCode" name="form_certificateCode" maxlength="100" autocomplete="off" style="max-width: 150px;"/>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" :label="$t('cert_validity_date')">
          <el-date-picker
            v-model="form.certificateDate"
            :picker-options="form.pickerOptions"
            :range-separator="$t('plDistributionRule_step1_to')"
            :start-placeholder="$t('start_date')"
            :end-placeholder="$t('end_date')"
            name="form_certificateDate"
            type="daterange"
            align="right"
            unlink-panels/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button name="dialogFormHandle" @click="dialogFormHandle(false)">{{ $t('common_cancel') }}</el-button>
        <ody-button name="dialogFormHandle4" type="primary" @click="dialogFormHandle(true)">{{ $t('common_save') }}</ody-button>
      </div>
    </ody-dialog>
  </section>
</template>
<script>
import dateUtil from '@/utils/dateUtil'
var vue = null
var purchaseOrderId = null
var isTrue = null
export default {
  name: 'OpmsPurchaseOrderProductCertificate',
  data() {
    return {
      data1: [],
      isFlag: false,
      data2: [],
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
          // shortcuts: [{
          //   text: '近一个月',
          //   onClick(picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          //     picker.$emit('pick', [start, end])
          //   }
          // }, {
          //   text: '近三个月',
          //   onClick(picker) {
          //     const end = new Date()
          //     const start = new Date()
          //     start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          //     picker.$emit('pick', [start, end])
          //   }
          // }]
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
            return dateFormat(row.certificateStartDate)
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
            return dateFormat(row.certificateEndDate)
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
            return dateFormat(row.auditorDate)
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
      ],
      operates: {
        width: 100,
        fixed: 'right',
        list: [
          {
            label: '编辑',
            disabled: false,
            method(index, row) {
              vue.handleEdit(index, row)
            }
          }
        ]
      }
    }
  },
  async mounted() {
    try {
      vue = this
      purchaseOrderId = this.$route.query.purchaseOrderId
      isTrue = this.$route.query.isTrue
      console.log('purchaseOrderId==>' + purchaseOrderId + '....' + isTrue)
      if (isTrue === '1') {
        this.isFlag = true
        this.updateListPage()
      } else {
        this.updateList()
      }
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async updateList() {
      try {
        this.loading = true
        await loadListPage(this)
        await loadList(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async updateListPage() {
      try {
        this.loading = true
        await loadListPage(this)
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async loadList() {
      await loadList(this)
    },
    handleSizeChange(val) {
      this.updateListPage()
    },
    handleCurrentChange(val) {
      this.updateListPage()
    },
    doAuditor(auditorStatus) {
      this.auditorDialog = false
      const list = []
      for (let i = 0; i < this.checked.length; i++) {
        const obj = this.checked[i]
        if (auditorStatus === 1) {
          if (obj.needCert === 1 && !obj.certificateUrl) {
            // 证书必传
            this.message = this.$t('plMpResult_mpCode') + obj.mpCode + this.$t('cert_is_not_null')
            this.dialogVisible = true
            return
          }
          if (obj.needCert === 1 && !obj.certificateCode) {
            // 证书编号必传
            this.message = this.$t('plMpResult_mpCode') + obj.mpCode + this.$t('cert_code_is_not_null')
            this.dialogVisible = true
            return
          }
          if (obj.needExpiryDate === 1 && (!obj.certificateStartDate || !obj.certificateEndDate)) {
            // 证书有效期必填
            this.message = this.$t('plMpResult_mpCode') + obj.mpCode + this.$t('cert_validity_date_is_not_null')
            this.dialogVisible = true
            return
          }
        }
        list.push({ id: obj.id, auditorStatus: auditorStatus })
      }
      if (list.length > 0) {
        const purchasePlan = this.$opms.$api.purchasePlan
        purchasePlan.updateOrderProductCertificateAuditorStatus({ list: list }).then((data) => {
          console.log(JSON.stringify(data))
          this.updateList()
        })
      }
    },
    handleClose(done) {
      done()
    },
    handleEdit(index, row) {
      console.log('index:', index)
      console.log(' row:', row)
      this.form.id = row.id
      this.form.index = index
      this.form.certificateCode = row.certificateCode
      if (row.certificateStartDate == null || row.certificateEndDate == null) {
        this.form.certificateDate = []
      } else {
        this.form.certificateDate = [row.certificateStartDate, row.certificateEndDate]
      }
      this.form.certificateUrlName = row.certificateUrlName
      if (row.certificateUrl != null && row.certificateUrl !== '') {
        this.form.certificateUrl = [{ url: row.certificateUrl }]
      } else {
        this.form.certificateUrl = []
      }
      this.dialogFormVisible = true
    },
    uploadImgChange(e, e2, e3) {
      console.log('change：====>' + e)
      console.log(e2)
      console.log(e3)
    },
    dialogFormHandle(ok) {
      if (ok && this.dialogFormVisible) {
        const data = { id: this.form.id, certificateCode: '', certificateUrl: '', certificateUrlName: '', certificateStartDate: null, certificateEndDate: null }
        data.certificateCode = this.form.certificateCode
        if (this.form.certificateUrl.length > 0) {
          data.certificateUrl = this.form.certificateUrl[0].url
          data.certificateUrlName = this.form.certificateUrl[0]['fileName']
          if (data.certificateUrlName == null || data.certificateUrlName === '') {
            data.certificateUrlName = data.certificateUrl.substring(data.certificateUrl.lastIndexOf('/') + 1)
            if (data.certificateUrlName.indexOf('@')) {
              data.certificateUrlName = data.certificateUrlName.substring(0, data.certificateUrlName.indexOf('@'))
            }
            if (data.certificateUrlName.length > 50) {
              data.certificateUrlName = data.certificateUrlName.substring(data.certificateUrlName.length - 50)
            }
          }
          if (data.certificateUrlName != null && data.certificateUrlName.length > 50) {
            data.certificateUrlName = data.certificateUrlName.substring(0, 50)
          }
        }
        if (!data.certificateUrl) {
          data.certificateUrlName = null
        }
        data.certificateStartDate = this.form.certificateDate[0]
        data.certificateEndDate = this.form.certificateDate[1]
        console.log('req：' + JSON.stringify(data))
        const purchasePlan = this.$opms.$api.purchasePlan
        purchasePlan.updateOrderProductCertificateInfo(data).then((res) => {
          console.log(JSON.stringify(res))
          try {
            this.loadList()
          } catch (ex) {
            console.log('修改数据发生错误：' + ex)
          }
        })
      }
      this.dialogFormVisible = false
      this.form.id = ''
      this.form.index = -1
      this.form.certificateCode = ''
      this.form.certificateDate = []
      this.form.certificateUrl = []
      this.form.certificateUrlName = ''
    }
  }
}

async function loadListPage(vue) {
  const param = {
    filters: {
      auditorStatus: 1,
      purchaseOrderId: purchaseOrderId
    },
    limit: vue.page.size,
    page: vue.page.current
  }
  const purchasePlan = vue.$opms.$api.purchasePlan
  const res = await purchasePlan.purchaseOrderProductCertificateListPage(param)
  if (res) {
    vue.data1 = res.data
    vue.page.total = res.total
  }
}

async function loadList(vue) {
  const param = {
    filters: {
      auditorStatus: 0,
      purchaseOrderId: purchaseOrderId
    }
  }
  const purchasePlan = vue.$opms.$api.purchasePlan
  const res = await purchasePlan.purchaseOrderProductCertificateList(param)
  if (res) {
    vue.data2 = res.data
  }
}

function dateFormat(time) {
  if (!time) {
    return ''
  }
  return dateUtil.dateFormatForTime(time, false)
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
