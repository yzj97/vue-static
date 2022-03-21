<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header_span">{{ $t('收款单号') + '：' + obj.paymentVoucherCode }}</span>
        &nbsp;&nbsp;
        <i v-clipboard:copy="obj.paymentVoucherCode" v-clipboard:success="clipboardSuccess" class="el-icon-document-copy" style="cursor: pointer" size="mini" type="primary" icon="document"/>
        &nbsp;&nbsp;
        <!--<a href="#">{{ $t('日志') }}</a>-->
      </div>
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('商家') + '：'">
                <span>{{ obj.merchantName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('店铺') + '：'">
                <span>{{ obj.storeName }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('结算币种') + '：'">
                <span>{{ obj.currencyCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('创建人') + '：'">
                <span>{{ obj.createUsername }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('创建时间') + '：'">
                <span>{{ $portal.parseTime(obj.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('备注') + '：'">
                <span>{{ obj.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header_span">{{ $t('收款信息') }}</span>
      </div>
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('收款金额') + '：'">
                <span>{{ obj.paymentAmount }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('支付方式') + '：'">
                <span>{{ obj.receiverAccountTypeText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('转账流水') + '：'">
                <span>{{ obj.payerTransOrderNo }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
    <!--<el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header_span">{{ $t('收款对象信息') }}</span>
      </div>
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('收款对象编码') + '：'">
                <span>{{ obj.receiverAccountNo }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('收款对象名称') + '：'">
                <span>{{ obj.receiverEnterpriseName }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>-->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="header_span">{{ $t('其他信息') }}</span>
      </div>
      <div>
        <el-form>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('关联单据类型') + '：'">
                <span>{{ obj.businessTypeText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('关联单据') + '：'">
                <!-- 订单 -->
                <span v-if="obj.businessType === 1" style="color:#1890FF;cursor: pointer;" @click="toOrder(obj.businessOrderCode)">{{ obj.businessOrderCode }}</span>
                <span v-else>{{ obj.businessOrderCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item :label="$t('附件') + '：'">
                &nbsp;&nbsp;
                <a v-for="item in files" :key="item.id" :href="item.url">{{ item.name }}</a>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-card>
  </section>
</template>

<script>
import soUtils from '@/utils/soUtils'
export default {
  name: 'ArPaymentVoucherDetail',
  data() {
    return {
      obj: {},
      files: []
    }
  },
  mounted() {
    this.init()
  },
  activated() {
    this.init()
  },
  methods: {
    async init() {
      if (!this.$route.params.id) {
        return
      }
      // 加载详情
      const res = await this.$finance.$api.arPaymentVoucher.queryArPaymentVoucherList({
        currentPage: 1,
        itemsPerPage: 1,
        obj: { id: this.$route.params.id }
      })
      if (res && res.data && res.data.listObj) {
        this.obj = res.data.listObj[0]
        this.selectAttachList(this.obj.paymentVoucherCode)
      }
    },
    selectAttachList(paymentVoucherCode) {
      if (!paymentVoucherCode) {
        return
      }
      const vue = this
      this.$finance.$api.arPaymentVoucher.selectAttachList({ attachmentType: 1, businessOrderCode: paymentVoucherCode }).then(res => {
        if (res && res.data) {
          const fileList = []
          for (const i in res.data) {
            const item = res.data[i]
            fileList.push({ id: item.id, name: item.attachmentName, url: item.attachmentUrl })
          }
          vue.files = fileList
        }
      })
    },
    toOrder(orderCode) {
      soUtils.toOrderDetail(this, orderCode)
    },
    clipboardSuccess() {
      this.$message({
        message: 'Copy successfully',
        type: 'success',
        duration: 1000
      })
    }
  }
}
</script>

<style scoped>
  .box-card {
    margin-bottom: 8px;
  }
  .box-card .el-card__header {
    border-bottom: none;
  }
  .header_span {
    font-weight: bold;
  }
</style>
