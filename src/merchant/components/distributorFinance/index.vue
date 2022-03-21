<template>
  <div class="basic-content">
    <div>{{ $t('结算信息') }}</div>
    <el-divider/>
    <el-row>
      <el-col :span="17">
        <el-form ref="settlementFormRef" :model="settlementForm" :rules="settlementFormRules" label-width="240px">
          <el-form-item :label="$t('账户类型')" prop="accountType" required>
            <el-select
              v-model="settlementForm.accountType"
              :disabled="!isEdit"
              :placeholder="$t('请选择账户类型')"
              name="settlementForm_accountType"
              style="width: 100%">
              <el-option
                v-for="item in accountTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item v-if="settlementForm.accountType === 1" :label="$t('支付宝账号')" prop="alipayAccount" required>
            <el-input
              v-model="settlementForm.alipayAccount"
              :disabled="!isEdit"
              :placeholder="$t('请输入支付宝账号')"
              name="settlementForm_alipayAccount"
              maxlength="30"/>
          </el-form-item>
          <el-form-item v-if="settlementForm.accountType === 6" :label="$t('微信账号')" prop="wechatAccount" required>
            <el-input
              v-model="settlementForm.wechatAccount"
              :disabled="!isEdit"
              :placeholder="$t('请输入微信账号')"
              name="settlementForm_wechatAccount"
              maxlength="30"/>
          </el-form-item>
          <div v-if="settlementForm.accountType === 9 || !settlementForm.accountType">
            <el-form-item :label="$t('账户名称')" prop="accountName" required>
              <el-input
                v-model="settlementForm.accountName"
                :disabled="!isEdit"
                :placeholder="$t('请输入账户名称')"
                name="settlementForm_accountName"
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('银行账号')" prop="bankAccount" required>
              <el-input
                v-model="settlementForm.bankAccount"
                :disabled="!isEdit"
                :placeholder="$t('请输入银行账号')"
                name="settlementForm_bankAccount"
                maxlength="30"/>
            </el-form-item>

            <el-form-item :label="$t('开户银行')" prop="depositBank" required>
              <el-input
                v-model="settlementForm.depositBank"
                :disabled="!isEdit"
                :placeholder="$t('请输入开户银行')"
                name="settlementForm_depositBank"
                maxlength="30"/>
            </el-form-item>
            <el-form-item :label="$t('开户行网点')" prop="depositBankOutlets" required>
              <el-input
                v-model="settlementForm.depositBankOutlets"
                :disabled="!isEdit"
                :placeholder="$t('请输入开户行网点')"
                name="settlementForm_depositBankOutlets"
                maxlength="50"/>
            </el-form-item>
          </div>
        </el-form>
      </el-col>
    </el-row>
    <div>{{ $t('税务相关（结算）') }}</div>
    <el-divider/>
    <el-row>
      <el-col :span="17">
        <el-form ref="taxationFormRef" :model="taxationForm" :rules="taxationFormRules" label-width="240px">

          <div v-if="settlementForm.accountType === 1 || settlementForm.accountType === 6">
            <el-form-item :label="$t('银行账户')" prop="enterpriseName" required>
              <el-input
                v-model="taxationForm.enterpriseName"
                :disabled="!isEdit"
                :placeholder="$t('请输入银行账户')"
                name="taxationForm_enterpriseName"
                maxlength="30"/>
            </el-form-item>
            <el-form-item :label="$t('开户银行')" prop="depositBank" required>
              <el-input
                v-model="taxationForm.depositBank"
                :disabled="!isEdit"
                :placeholder="$t('请输入开户银行')"
                name="taxationForm_depositBank"
                maxlength="30"/>
            </el-form-item>
          </div>

          <el-form-item :label="$t('发票抬头')" prop="invoicePayabl" required>
            <el-input
              v-model="taxationForm.invoicePayabl"
              :disabled="!isEdit"
              :placeholder="$t('请输入发票抬头')"
              name="taxationForm_invoicePayabl"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('注册地址')" prop="registeredRegionCode" required>
            <province-city-region :span="7" :offset="1" :is-edit="isEdit" :data="adressData" :province-key="'province'" :city-key="'city'" :region-key="'region'" name="adressData986" @change="registeredRegionCodeChange"/>
          </el-form-item>
          <el-form-item :label="$t('详细地址')" prop="registeredDetailAddress" required>
            <el-input
              v-model="taxationForm.registeredDetailAddress"
              :disabled="!isEdit"
              :placeholder="$t('请输入详细地址')"
              name="taxationForm_registeredDetailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('联系电话')" prop="contactPhone" required>
            <el-input
              v-model="taxationForm.contactPhone"
              :disabled="!isEdit"
              :placeholder="$t('请输入联系电话')"
              name="taxationForm_contactPhone"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('邮箱')" prop="email" required>
            <el-input
              v-model="taxationForm.email"
              :disabled="!isEdit"
              :placeholder="$t('请输入邮箱')"
              name="taxationForm_email"
              type="text"
              show-word-limit
              maxlength="40"/>
          </el-form-item>
          <el-form-item :label="$t('纳税识别号')" prop="payDutyCode" required>
            <el-input
              v-model="taxationForm.payDutyCode"
              :disabled="!isEdit"
              :placeholder="$t('请输入纳税识别号')"
              name="taxationForm_payDutyCode"
              type="text"
              show-word-limit
              maxlength="50"/>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import constants from '@/utils/constants'
import ProvinceCityRegion from '@/components/provinceCityRegion'
export default {
  components: {
    ProvinceCityRegion
  },
  props: {
    editId: { type: Number, default: 0 },
    isEdit: {
      type: Boolean,
      default: false
    },
    orgType: {
      type: Number,
      default: 0
    },
    accountObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    qualificationObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      // 结算信息
      settlementForm: {
        accountType: '', // 账户类型
        alipayAccount: '', // 支付宝账号
        wechatAccount: '', // 微信账号
        accountName: '', // 账户名称
        bankAccount: '', // 银行账号
        depositBank: '', // 开户银行
        depositBankOutlets: '' // 开户行网点
      },
      accountTypeList: [], // 账户类型列表

      // 税务相关（结算）
      taxationForm: {
        enterpriseName: '', // 银行账户
        depositBank: '', // 开户银行
        invoicePayabl: '', // 发票抬头
        registeredProvinceCode: '', // 注册地址-省编码
        registeredCityCode: '', // 注册地址-市编码
        registeredRegionCode: '', // 注册地址-区编码
        registeredDetailAddress: '', // 详细地址
        contactPhone: '', // 联系电话
        email: '', // 邮箱
        payDutyCode: '' // 纳税识别号
      },

      // 信用额度
      creditForm: {
        creditLine: '', // 信用额度
        creditLineUnit: '$' // 信用额度单位
      },
      settlementFormRules: {
        accountType: [
          { required: true, message: '请选择账户类型', trigger: 'blur' },
          { required: true, message: '请选择账户类型', trigger: 'change' }
        ],
        alipayAccount: [
          { required: true, message: '请输入支付宝账号', trigger: 'blur' },
          { required: true, message: '请输入支付宝账号', trigger: 'change' }
        ],
        wechatAccount: [
          { required: true, message: '请输入微信账号', trigger: 'blur' },
          { required: true, message: '请输入微信账号', trigger: 'change' }
        ],
        accountName: [
          { required: true, message: '请输入账户名称', trigger: 'blur' },
          { required: true, message: '请输入账户名称', trigger: 'change' }
        ],
        bankAccount: [
          { required: true, message: '请输入银行账号', trigger: 'blur' },
          { required: true, message: '请输入银行账号', trigger: 'change' }
        ],
        depositBank: [
          { required: true, message: '请输入开户银行', trigger: 'blur' },
          { required: true, message: '请输入开户银行', trigger: 'change' }
        ],
        depositBankOutlets: [
          { required: true, message: '请输入开户行网点', trigger: 'blur' },
          { required: true, message: '请输入开户行网点', trigger: 'change' }
        ]
      },
      taxationFormRules: {
        enterpriseName: [
          { required: true, message: '请输入银行账户', trigger: 'blur' },
          { required: true, message: '请输入银行账户', trigger: 'change' }
        ],
        depositBank: [
          { required: true, message: '请输入开户银行', trigger: 'blur' },
          { required: true, message: '请输入开户银行', trigger: 'change' }
        ],
        invoicePayabl: [
          { required: true, message: '请输入发票抬头', trigger: 'blur' },
          { required: true, message: '请输入发票抬头', trigger: 'change' }
        ],
        registeredRegionCode: [
          { required: true, message: '请输入注册地址', trigger: 'blur' },
          { required: true, message: '请输入注册地址', trigger: 'change' }
        ],
        registeredDetailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入联系电话', trigger: 'blur' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' },
          { pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/, message: '请输入正确的邮箱', trigger: 'change' }
        ],
        payDutyCode: [
          { required: true, message: '请输入纳税识别号', trigger: 'blur' },
          { required: true, message: '请输入纳税识别号', trigger: 'change' }
        ]
      },
      adressData: {
        province: '', // 省编码
        city: '', // 市编码
        region: '' // 区编码
      }

    }
  },
  watch: {
    // 监控属性accountObj的变化
    accountObj: {
      handler: function(val) {
        this.setAccountInfo()
      },
      deep: true
    },
    qualificationObj: {
      handler: function(val) {
        this.setQualificationo()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.accountTypeList = constants.accountTypeList
      this.setAccountInfo()
      this.setQualificationo()
    },
    setAccountInfo() {
      if (this.accountObj) {
        var accountType = this.accountObj.receiverAccountType
        this.settlementForm.accountType = accountType
        if (accountType === 1) {
          this.settlementForm.alipayAccount = this.accountObj.receiverAccountNo
        } else if (accountType === 6) {
          this.settlementForm.wechatAccount = this.accountObj.receiverAccountNo
        } else {
          this.settlementForm.bankAccount = this.accountObj.receiverAccountNo
          this.settlementForm.depositBank = this.accountObj.receiverBankName
          this.settlementForm.depositBankOutlets = this.accountObj.receiverSubBankName
          this.settlementForm.accountName = this.accountObj.receiverEnterpriseName
        }
      }
    },
    setQualificationo() {
      if (this.qualificationObj) {
        this.taxationForm.invoicePayabl = this.qualificationObj.invoiceTitle
        this.taxationForm.payDutyCode = this.qualificationObj.taxpayerIdentificationCode
        this.taxationForm.registeredProvinceCode = this.qualificationObj.provinceCode
        this.taxationForm.registeredCityCode = this.qualificationObj.cityCode
        this.taxationForm.registeredRegionCode = this.qualificationObj.regionCode
        this.taxationForm.registeredDetailAddress = this.qualificationObj.detailAddress
        this.taxationForm.registeredDetailAddress = this.qualificationObj.registerAddress
        this.taxationForm.contactPhone = this.qualificationObj.registerPhone
        this.taxationForm.depositBank = this.qualificationObj.bankDeposit
        this.taxationForm.enterpriseName = this.qualificationObj.bankAccount
        this.taxationForm.email = this.qualificationObj.email
        this.adressData = {
          province: this.qualificationObj.provinceCode, // 省编码
          city: this.qualificationObj.cityCode, // 市编码
          region: this.qualificationObj.regionCode // 区编码
        }
      }
    },
    registeredRegionCodeChange(val) {
      this.taxationForm.registeredProvinceCode = val.provinceCode
      this.taxationForm.registeredCityCode = val.cityCode
      this.taxationForm.registeredRegionCode = val.regionCode
    }
  }
}
</script>

<style lang="less">
  .business-time{
    .el-form-item__content{
      display: flex;
    }
    &-to{
      padding: 0 10px;
    }
  }
</style>
