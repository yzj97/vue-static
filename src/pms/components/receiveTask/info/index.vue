<template>
  <div>
    <el-form class="test" label-position="right" label-width="150px">
      <el-row>
        <el-col :span="8" class="receiveCode">
          <el-form-item :label="$t('收货任务单号')+':'" >
            <!--<span style="font-weight: bold;font-size: 20px" >{{ $t('收货任务单号') }}：</span><span class="f14">{{ receiveDetail.receiveCode }}</span>-->
            <span class="f14">{{ receiveDetail.receiveCode }}</span>
            <i v-clipboard:copy="receiveDetail.receiveCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('收货任务类型')+':'">
            <span class="f14">{{ getTypeStr() }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('商家')+':'">
            <span class="f14">{{ receiveDetail.merchantName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8" >
          <el-form-item :label="$t('创建人')+':'">
            <span class="f14">{{ receiveDetail.createUsername }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('采购单号')+':'">
            <span class="f14">{{ receiveDetail.purchaseOrderCode }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('settlementCurrencyCode')+':'">
            <span class="f14">{{ receiveDetail.currency }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('创建时间')+':'">
            <span v-if="receiveDetail.createTime" class="f14">{{ receiveDetail.createTime | parseTime }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('备注')+':'">
            <span class="f14">{{ receiveDetail.remark }}</span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    detailInfo: {
      type: Object,
      default: function() {
        return []
      }
    },
    receiveDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      labelPosition: 'right',
      receiveTypeStr: null,
      receiveTypeMap: {},
      showPurchaseOrderCode: true,
      logDialog: {
        show: false,
        form: {
          page: 1,
          limit: 10,
          filters: {}
        },
        list: [],
        columns: [
          {
            show: true,
            prop: 'timeStr',
            label: this.$t('操作时间'),
            align: 'center',
            minWidth: 100
          },
          {
            show: true,
            prop: 'userName',
            label: this.$t('操作人'),
            align: 'center'
          },
          {
            show: true,
            prop: 'note',
            label: this.$t('操作日志'),
            align: 'center',
            minWidth: 300
          }
        ],
        total: 0
      },
      dateRangePicker: null
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      const self = this
      if (self.receiveDetail.receiveType === 0) {
        self.showPurchaseOrderCode = false
      }
      const { data } = await this.$pms.$api.receiveTask.listMultiCode({
        categories: ['RECEIVE_TASK_TYPE']
      })
      self.receiveTypeMap = data.RECEIVE_TASK_TYPE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
    },
    getTypeStr() {
      return this.receiveTypeMap[this.receiveDetail.receiveType + '' ]
    },
    showLabel(key) {
      if (this.soDetail.orderLabel) {
        return this.soDetail.orderLabel.indexOf(key) >= 0
      } else {
        return false
      }
    },
    clipboardSuccess() {
      this.$message({
        message: this.$t('复制成功'),
        type: 'success',
        duration: 1500
      })
    },
    showLogDialog() {
      this.logDialog.show = true
      this.queryLog()
    },
    hideLogDialog() {
      this.logDialog.show = false
      this.queryLog()
    },
    queryLog() {
      /* this.logDialog.form.model = 'So'
      this.logDialog.form.modelId = this.soDetail.orderCode
      if (this.dateRangePicker) {
        this.logDialog.form.startDateStr = this.dateRangePicker[0] + ' 00:00:00'
        this.logDialog.form.endDateStr = this.dateRangePicker[1] + ' 23:59:59'
      }
      const self = this
      this.$oms.$api.common.listOperActionPage(this.logDialog.form).then(res => {
        self.logDialog.total = res.total
        self.logDialog.list = res.data
      })*/
    },
    resetLogForm() {
      this.logDialog.form = {
        page: 1,
        limit: 10,
        filters: {
          createUsername: null
        }
      }
      this.dateRangePicker = null
    }
  }
}
</script>

<style scoped lang="less">
  /deep/ .cp-list-search-area{
    box-shadow: none;
  }
  /deep/ .cp-list-table-area{
    box-shadow: none;
  }
  /deep/
    .el-form-item {
      margin-bottom: 6px;
  }
  /deep/
    .receiveCode div span{
    font-weight: bold;
    font-size: 20px!important; ;
  }
  /deep/
  .receiveCode div label{
    font-weight: bold;
    font-size: 20px!important; ;
  }
  .f14{
    font-size: 14px;
  }
  .detail {
    font-size: 14px;
    font-weight:400;
    color:#99ABB4;
  }
  .flex-center{
    display: flex;
    justify-content: center;
  }
</style>
