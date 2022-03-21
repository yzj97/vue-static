<template>
  <div class>
    <el-form
      ref="supplier"
      :model="basicInfo"
      :rules="infoRules"
      :disabled="isView"
      label-width="200px"
      style="width: 640px;"
      class="inner-form"
    >
      <el-form-item :label="$t('供货商助记码')" prop="helpCode">
        <el-input v-model="basicInfo.helpCode" name="basicInfo_helpCode" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('供货商GLN码')" prop="otherCode">
        <el-input v-model="basicInfo.otherCode" name="basicInfo_otherCode" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('供应商类别')" prop="classificationId">
        <opms-tree-select-supplier
          v-model="basicInfo.classificationId"
          :merchant-id="merchant.merchantId"
          :selected.sync="supplierClassification"
          :disabled="isView"
          name="basicInfo_classificationId"
        />
      </el-form-item>
      <el-form-item :label="$t('企业类型')" prop="enterpriseType">
        <ody-select2
          v-model="basicInfo.enterpriseType"
          :placeholder="$t('请选择')"
          name="basicInfo_enterpriseType"
          list-key="enterpriseTypeMapping"
        />
      </el-form-item>
      <el-form-item :label="$t('公司邮箱')" prop="enterpriseEmail">
        <el-input v-model="basicInfo.enterpriseEmail" name="basicInfo_enterpriseEmail" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('公司网址')" prop="enterpriseWebsite">
        <el-input v-model="basicInfo.enterpriseWebsite" name="basicInfo_enterpriseWebsite" maxlength="100"/>
      </el-form-item>
      <el-form-item :label="$t('联系电话')" prop="enterpriseTel">
        <el-input
          v-model="basicInfo.enterpriseTel"
          :placeholder="$t('支持填写11个字符')"
          name="basicInfo_enterpriseTel"
          show-word-limit
          maxlength="11"
        />
      </el-form-item>
      <el-form-item :label="$t('传真号码')" prop="enterpriseFax">
        <el-input v-model="basicInfo.enterpriseFax" name="basicInfo_enterpriseFax" maxlength="50"/>
      </el-form-item>
      <el-form-item :label="$t('企业品牌名称')">
        <el-input v-model="basicInfo.enterpriseBrandName" name="basicInfo_enterpriseBrandName" maxlength="50"/>
      </el-form-item>
      <el-form-item v-if="!operPlatformId" :label="$t('内部供应商')" prop="isInnerMerchant">
        <ody-select2
          v-model="basicInfo.isInnerMerchant"
          :placeholder="$t('请选择')"
          name="basicInfo_isInnerMerchant"
          list-key="mainList"
        />
      </el-form-item>
      <el-form-item
        v-if="basicInfo.isInnerMerchant && basicInfo.isInnerMerchant === 1"
        :label="$t('商家名称')"
        prop="relMerchant.merchantId"
      >
        <ody-merchant-choose
          :selected.sync="basicInfo.relMerchant"
          :placeholder="$t('common_choose_please')"
        />
      </el-form-item>
      <el-form-item :label="$t('交易币别')" prop="currencyCode">
        <opms-select-currency v-model="basicInfo.currencyCode" :placeholder="$t('请选择')" name="basicInfo_currencyCode" />
      </el-form-item>
      <el-form-item :label="$t('采购方式')" prop="bussinessType">
        <ody-select2
          v-model="basicInfo.bussinessType"
          :placeholder="$t('请选择')"
          :list-key=" operPlatformId ? 'operPlatformPurchaseTypeMapping' : 'merchantPlatformPurchaseTypeMapping' "
          name="basicInfo_bussinessType"
        />
      </el-form-item>
      <el-form-item :label="$t('合作方式')" prop="cooperationMethod">
        <ody-select2
          v-model="basicInfo.cooperationMethod"
          :placeholder="$t('请选择')"
          name="basicInfo_cooperationMethod"
          list-key="cooperationMethodMapping"
        />
      </el-form-item>
      <el-form-item :label="$t('备注')" prop="remark">
        <el-input v-model="basicInfo.remark" name="basicInfo_remark" show-word-limit maxlength="300" type="textarea" />
      </el-form-item>
      <el-form-item :label="$t('状态')" prop="status">
        <ody-radio2 v-model="basicInfo.status" name="basicInfo_status" list-key="supplierBasicStatusList" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import OpmsSelectCurrency from '@/components/select-currency'
import OpmsTreeSelectSupplier from '@/components/tree-select-supplier'
import Cookies from 'js-cookie'

export default {
  components: {
    OpmsSelectCurrency,
    OpmsTreeSelectSupplier
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
      operPlatformId: Cookies.get('platformId') === '1',
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      supplierClassification: {},
      infoRules: {
        enterpriseEmail: [
          {
            message: this.$t('请输入正确公司邮箱'),
            trigger: 'change',
            pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
          }
        ],
        enterpriseTel: [
          {
            message: this.$t('请输入正确联系电话'),
            trigger: 'change',
            pattern: /^1\d{10}$/
          }
        ],
        currencyCode: [
          {
            required: true,
            message: this.$t('请选择交易币别'),
            trigger: 'change'
          }
        ],
        cooperationMethod: [
          {
            required: true,
            message: this.$t('请选择合作方式'),
            trigger: 'change'
          }
        ],
        'relMerchant.merchantId': [
          {
            required: true,
            message: this.$t('请选择商家名称'),
            trigger: 'change'
          }
        ]
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
