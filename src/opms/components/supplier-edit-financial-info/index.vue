<template>
  <div class="supplier-edit-financial-info">
    <!-- 税务信息 -->
    <div class="tax-information">
      <el-form
        ref="supplier"
        :rules="financialInfoRules"
        :model="basicInfo"
        :disabled="isView"
        label-width="200px"
        style="width: 640px;"
      >
        <opms-title>{{ $t('税务信息') }}</opms-title>
        <el-form-item :label="$t('企业纳税人类型')" prop="enterpriseTaxPayerType">
          <ody-select2
            v-model="basicInfo.enterpriseTaxPayerType"
            name="basicInfo_enterpriseTaxPayerType"
            list-key="enterpriseTaxPayerTypeMapping"
          />
        </el-form-item>
        <el-form-item :label="$t('企业纳税税率')" prop="enterpriseTaxRate">
          <el-input v-model="basicInfo.enterpriseTaxRate" name="basicInfo_enterpriseTaxRate" />
        </el-form-item>
        <el-form-item :label="$t('报价方式')" prop="isTaxIncluded">
          <ody-select2 v-model="basicInfo.isTaxIncluded" name="basicInfo_isTaxIncluded" list-key="isTaxIncludedMapping" />
        </el-form-item>

        <!-- 收款信息 -->
        <opms-title>{{ $t('收款信息') }}</opms-title>
        <el-form-item :label="$t('账户类型')" prop="supplierAccountInfo.receiverAccountType">
          <ody-select2
            v-model="basicInfo.supplierAccountInfo.receiverAccountType"
            name="basicInfo_supplierAccountInfo_receiverAccountType"
            list-key="receiverAccountTypeMapping"
          />
        </el-form-item>
        <div v-if="basicInfo.supplierAccountInfo.receiverAccountType !== 1 && basicInfo.supplierAccountInfo.receiverAccountType !== 6">
          <el-form-item :label="$t('收款人姓名')" prop="supplierAccountInfo.receiverEnterpriseName">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverEnterpriseName" name="basicInfo_supplierAccountInfo_receiverEnterpriseName" maxlength="100" />
          </el-form-item>
          <el-form-item :label="$t('收款账号')" prop="supplierAccountInfo.receiverAccountNo">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverAccountNo" name="basicInfo_supplierAccountInfo_receiverAccountNo" maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('开户银行')" prop="supplierAccountInfo.receiverBankName">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverBankName" name="basicInfo_supplierAccountInfo_receiverBankName" maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('开户银行支行名称')" prop="supplierAccountInfo.receiverSubBankName">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverSubBankName" name="basicInfo_supplierAccountInfo_receiverSubBankName" maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('收款人手机号')" prop="supplierAccountInfo.receiverMobile">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverMobile" name="basicInfo_supplierAccountInfo_receiverMobile" maxlength="100"/>
          </el-form-item>
        </div>
        <div v-if="basicInfo.supplierAccountInfo.receiverAccountType === 1">
          <el-form-item :label="$t('支付宝账号')" prop="supplierAccountInfo.receiverAccountNo">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverAccountNo" name="basicInfo_supplierAccountInfo_receiverAccountNo3" maxlength="100"/>
          </el-form-item>
        </div>
        <div v-if="basicInfo.supplierAccountInfo.receiverAccountType === 6">
          <el-form-item :label="$t('微信账号')" prop="supplierAccountInfo.receiverAccountNo">
            <el-input v-model="basicInfo.supplierAccountInfo.receiverAccountNo" name="basicInfo_supplierAccountInfo_receiverAccountNo31" maxlength="100"/>
          </el-form-item>
        </div>
        <!-- 结算信息 -->
        <opms-title>{{ $t('结算信息') }}</opms-title>
        <el-form-item :label="$t('默认结算地')" prop="settlementPartyType">
          <ody-select2
            v-model="basicInfo.settlementPartyType"
            name="basicInfo_settlementPartyType"
            list-key="settlementPartyTypeMapping"
          />
        </el-form-item>
        <el-form-item :label="$t('默认付款供应商')" prop="paymentSupplier">
          <ody-select2 v-model="basicInfo.paymentSupplier" name="basicInfo_paymentSupplier" list-key="paymentSupplierMapping" />
        </el-form-item>
        <el-form-item
          v-if="basicInfo.paymentSupplier === 2"
          :label="$t('选择付款供应商')"
          prop="paymentSupplierCode"
        >
          <ody-supplier-choose v-model="basicInfo.paymentSupplierCode" :placeholder="$t('请选择')" name="basicInfo_paymentSupplierCode" />
        </el-form-item>
        <el-form-item :label="$t('默认送货供应商')" prop="deliverySupplier">
          <ody-select2 v-model="basicInfo.deliverySupplier" name="basicInfo_deliverySupplier" list-key="paymentSupplierMapping" />
        </el-form-item>
        <el-form-item
          v-if="basicInfo.deliverySupplier === 2"
          :label="$t('选择送货供应商')"
          prop="deliverySupplierCode"
        >
          <ody-supplier-choose v-model="basicInfo.deliverySupplierCode" :placeholder="$t('请选择')" name="basicInfo_deliverySupplierCode" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import OpmsTitle from '@/components/title'

export default {
  components: {
    OpmsTitle
  },
  props: {
    basicInfo: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    return {
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      financialInfoRules: {
        enterpriseEmail: [
          {
            required: true,
            message: this.$t('请输入正确公司邮箱'),
            trigger: 'change',
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          }
        ],
        enterpriseTel: [
          {
            required: true,
            message: this.$t('请输入正确联系电话'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ],
        enterpriseTaxPayerType: [
          {
            required: true,
            message: this.$t('请选择企业纳税人类型'),
            trigger: 'change'
          }
        ],
        enterpriseTaxRate: [
          {
            required: true,
            message: this.$t('请输入企业纳税税率'),
            trigger: 'change',
            pattern: /^\d+$/
          }
        ],
        isTaxIncluded: [
          {
            required: true,
            message: this.$t('请选择报价方式'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverEnterpriseName': [
          {
            required: true,
            message: this.$t('请输入收款人姓名'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverAccountType': [
          {
            required: true,
            message: this.$t('请选择账户类型'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverAccountNo': [
          {
            required: true,
            message: this.$t('请输入收款账号'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverBankName': [
          {
            required: true,
            message: this.$t('请输入开户银行'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverSubBankName': [
          {
            required: true,
            message: this.$t('请输入开户银行支行名称'),
            trigger: 'change'
          }
        ],
        'supplierAccountInfo.receiverMobile': [
          {
            required: true,
            message: this.$t('请输入正确的收款人手机号'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.supplier-edit-financial-info {
  .tax-information {
    height: 170px;
  }
  .billing-message {
    height: 270px;
  }
  .billing-information {
    height: 240px;
  }
  /deep/ {
    .el-form {
      margin: auto;
    }
  }
}
</style>
