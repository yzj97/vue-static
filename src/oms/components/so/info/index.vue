<template>
  <div>
    <el-row>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" ><!--订单号-->{{ $t('orderNumber') }}：</span><span class="f14">{{ soDetail.orderCode }}</span>
        <i v-clipboard:copy="soDetail.orderCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
        <el-tag v-if="showLabel('vip')" type="warning">vip</el-tag>
        <el-tag v-if="showLabel('sos')" type="danger">{{ $t('紧急') }}</el-tag>
        <el-tag v-if="showLabel('special')" effect="dark">{{ $t('特别') }}</el-tag>
        <el-tag v-if="showLabel('focusOn')" type="success">{{ $t('关注') }}</el-tag>
        <el-tag v-if="showLabel('putOnHold')">{{ $t('搁置') }}</el-tag>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" ><!--外部订单号-->{{ $t('order_difference_channel_order_code') }}：</span><span class="f14">{{ soDetail.outOrderCode }}</span>
        <i v-clipboard:copy="soDetail.outOrderCode" v-clipboard:success="clipboardSuccess" v-if="soDetail.outOrderCode" class="el-icon-document-copy" size="mini" type="primary" icon="document"/>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('订单类型') }}：</span><span class="f14">{{ orderType }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('商家') }}：</span><span class="f14">{{ soDetail.merchantName }}</span>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('店铺') }}：</span><span class="f14">{{ soDetail.storeName }}</span>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" ><!--订单来源-->{{ $t('manul_order_channel') }}：</span><span class="f14">{{ orderSource }}</span>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('渠道') }}：</span><span class="f14">{{ soDetail.sysSourceStr }}</span>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" ><!--来源-->{{ $t('source') }}：</span><span class="f14">{{ orderChannel }}</span>
      </el-col>
      <el-col v-for="item in detailInfo" :span="8" :key="item.title" style="margin-bottom:10px;">
        <span class="detail">{{ item.title }}：</span><span>{{ item.content }}</span>
      </el-col>
      <el-col v-show="soDetail && soDetail.sourceOrderCode" :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('原销售订单号') }}：</span>
        <span class="f14">
          <a name="seeOrder" style="color: #1890FF" @click="seeOrder(soDetail.sourceOrderCode)">
            {{ soDetail.sourceOrderCode }}
          </a>
        </span>
      </el-col>
      <el-col v-if="soDetail && soDetail.sourceReturnCode" :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('关联的售后单') }}：</span>
        <span class="f14">
          <a v-if="$portal.hasPermission('OmsOrderSalesList_Query')" name="seeReturn" style="color: #1890FF" @click="seeReturn(soDetail.sourceReturnCode)">
            {{ soDetail.sourceReturnCode }}
          </a>
          <span v-else>{{ soDetail.sourceReturnCode }}</span>
        </span>
      </el-col>
      <el-col :span="8" style="margin-bottom:10px;">
        <span class="detail" >{{ $t('操作') }}：</span>&nbsp;&nbsp;<el-link name="showLogDialog" type="primary" @click="showLogDialog"><!--日志-->{{ $t('showLog') }}</el-link>
      </el-col>
    </el-row>

    <ody-dialog :visible.sync="logDialog.show" :title="$t('showLog')" width="960px"><!--日志-->
      <div>
        <el-form ref="form" :inline="true" label-width="100px">
          <el-form-item :label="$t('操作时间')+'：'">
            <el-date-picker
              v-model="dateRangePicker"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="-"
              start-placeholder=""
              end-placeholder=""/>
          </el-form-item>
          <el-form-item :label="$t('操作人')+'：'">
            <el-input v-model="logDialog.form.filters.createUsername" name="logDialog_form_filters_createUsername"/>
          </el-form-item>
        </el-form>
        <div class="flex-center">
          <el-button name="resetLogForm" size="small" @click="resetLogForm">{{ $t('重置') }}</el-button>
          <el-button name="queryLog" size="small" type="primary" @click="queryLog">{{ $t('查询') }}</el-button>
        </div>
      </div>
      <ody-list-table-area>
        <div slot="table">
          <ody-table
            :data="logDialog.list"
            :columns="logDialog.columns"
            name="logDialog_list948"
          />
        </div>
        <div slot="page">
          <div v-if="logDialog.list.length" class="block">
            <ody-pagination
              :current-page.sync="logDialog.form.page"
              :list="logDialog.list"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="logDialog.form.limit"
              :total.sync="logDialog.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="queryLog"
              @current-change="queryLog"/>
          </div>
        </div>
      </ody-list-table-area>
      <span slot="footer">
        <el-button name="hideLogDialog" size="small" @click="hideLogDialog">{{ $t('关闭') }}</el-button>
      </span>
    </ody-dialog>

  </div>
</template>

<script>
import soUtils from '@/utils/soUtils'
export default {
  props: {
    detailInfo: {
      type: Object,
      default: function() {
        return []
      }
    },
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      orderType: null,
      orderChannel: null,
      orderSource: null,
      codeMap: {},
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
      await this.$oms.$api.common.listByCategorysForOrder({ categorys: ['ORDER_CHANNEL', 'ORDER_SOURCE'] }).then(res => {
        self.codeMap = res.data
      })
      await this.$oms.$api.soType.soTypeList({}).then(res => {
        self.codeMap.ORDER_TYPE = res.data
      })
      this.orderType = this.getNameFromCodeMap(this.soDetail.orderType, this.codeMap.ORDER_TYPE)
      this.orderChannel = this.getNameFromCodeMap(this.soDetail.orderChannel, this.codeMap.ORDER_CHANNEL)
      this.orderSource = this.getNameFromCodeMap(this.soDetail.orderSource, this.codeMap.ORDER_SOURCE)
    },
    getNameFromCodeMap(code, codeMap) {
      let name = null
      if (codeMap && (code !== undefined && code !== null)) {
        codeMap.forEach(c => {
          if (c.code === code.toString()) {
            name = c.name
          }
        })
      }
      return name
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
      this.logDialog.form.model = 'So'
      this.logDialog.form.modelId = this.soDetail.orderCode
      if (this.dateRangePicker) {
        this.logDialog.form.startDateStr = this.dateRangePicker[0] + ' 00:00:00'
        this.logDialog.form.endDateStr = this.dateRangePicker[1] + ' 23:59:59'
      }
      const self = this
      this.$oms.$api.common.listOperActionPage(this.logDialog.form).then(res => {
        self.logDialog.total = res.total
        self.logDialog.list = res.data
      })
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
    },
    seeOrder(orderCode) {
      soUtils.toOrderDetail(this, orderCode)
    },
    seeReturn(returnCode) {
      debugger
      this.$router.push({
        name: 'OmsOrderSalesListManagementDetail',
        params: {
          returnCode: returnCode
        }
      })
    }
  }
}
</script>

<style scoped>
  /deep/ .cp-list-search-area{
    box-shadow: none;
  }
  /deep/ .cp-list-table-area{
    box-shadow: none;
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
