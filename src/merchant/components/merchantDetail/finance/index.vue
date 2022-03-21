<template>
  <div>
    <el-form
      ref="finance"
      :model="finance"
      :rules="financeRules"
      label-position="left"
      label-width="auto"
    >
      <el-row>
        <ody-top-title :title="$t('结算信息')" />
        <el-col span="10" offset="6">
          <el-form-item :label="$t('账户类型')+':'" prop="receiverAccountType">
            <el-select
              id="receiverAccountType"
              :disabled="onlyRead"
              v-model="finance.receiverAccountType"
              :placeholder="$t('请选择')"
              name="finance_receiverAccountType">
              <el-option
                v-for="(k, v) in receiverAccountTypeMapping"
                :key="v"
                :label="k"
                :value="v"
              />
            </el-select>
          </el-form-item>
          <div v-if="finance.receiverAccountType !== '1' && finance.receiverAccountType !== '6'">
            <el-form-item :key="1" :label="$t('账户名称')+':'" prop="receiverEnterpriseName">
              <el-input
                id="receiverEnterpriseName"
                :disabled="onlyRead"
                v-model="finance.receiverEnterpriseName"
                :placeholder="$t('请输入账户名称')"
                name="finance_receiverEnterpriseName"
                type="text"
                show-word-limit
                maxlength="20"
              />
            </el-form-item>
            <el-form-item :label="$t('开户银行')+':'" prop="receiverBankName">
              <el-input
                id="receiverBankName"
                :disabled="onlyRead"
                v-model="finance.receiverBankName"
                :placeholder="$t('请输入开户银行')"
                name="finance_receiverBankName"
                type="text"
                show-word-limit
                maxlength="30"
              />
            </el-form-item>
            <el-form-item :label="$t('开户行网点')+':'" prop="receiverSubBankName">
              <el-input
                id="receiverSubBankName"
                :disabled="onlyRead"
                v-model="finance.receiverSubBankName"
                :placeholder="$t('请输入开户行网点')"
                name="finance_receiverSubBankName"
                type="text"
                show-word-limit
                maxlength="50"/>
            </el-form-item>
            <el-form-item
              :key="2"
              :label="$t('银行账号')+':'"
              prop="receiverAccountNo">
              <el-input
                id="receiverAccountNo"
                :disabled="onlyRead"
                v-model="finance.receiverAccountNo"
                :placeholder="$t('请输入银行账号')"
                name="finance_receiverAccountNo"
                type="text"
                show-word-limit
                maxlength="30"/>
            </el-form-item>
          </div>
          <div v-if="finance.receiverAccountType === '1'">
            <el-form-item
              :key="3"
              :label="$t('支付宝账号')+':'"
              prop="receiverALiAccountNo">
              <el-input
                id="receiverALiAccountNo"
                :disabled="onlyRead"
                v-model="finance.receiverALiAccountNo"
                :placeholder="$t('请输入支付宝账号')"
                name="finance_receiverALiAccountNo"
                type="text"
                show-word-limit
                maxlength="30"
              />
            </el-form-item>
          </div>
          <div v-if="finance.receiverAccountType === '6'">
            <el-form-item
              :key="4"
              :label="$t('微信账号')+':'"
              prop="receiverWxAccountNo">
              <el-input
                id="receiverWxAccountNo"
                :disabled="onlyRead"
                v-model="finance.receiverWxAccountNo"
                :placeholder="$t('请输入微信账号')"
                name="finance_receiverWxAccountNo"
                type="text"
                show-word-limit
                maxlength="30"
              />
            </el-form-item>
          </div>
        </el-col>
      </el-row>
    </el-form>

    <el-form
      ref="invoiceQualification"
      :model="invoiceQualification"
      :rules="invoiceQualificationRules"
      label-position="left"
      label-width="auto"
    >
      <el-row>
        <ody-top-title :title="$t('税务信息')" />
        <el-col :span="10" :offset="6">
          <el-form-item :label="$t('发票抬头：')" prop="invoiceTitle">
            <el-input
              id="invoiceTitle"
              :disabled="onlyRead"
              v-model="invoiceQualification.invoiceTitle"
              :placeholder="$t('请输入发票抬头')"
              name="invoiceQualification_invoiceTitle"
              type="text"
              show-word-limit
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="$t('联系电话')+':'" prop="registerPhone">
            <el-input
              id="registerPhone"
              :disabled="onlyRead"
              v-model="invoiceQualification.registerPhone"
              :placeholder="$t('请输入联系电话')"
              name="invoiceQualification_registerPhone"
              type="text"
              show-word-limit
              maxlength="20"
            />
          </el-form-item>
          <el-form-item :label="$t('邮箱')+':'" prop="email">
            <el-input
              id="email"
              :disabled="onlyRead"
              v-model="invoiceQualification.email"
              :placeholder="$t('请输入邮箱')"
              name="invoiceQualification_email"
              type="text"
              show-word-limit
              maxlength="40"
            />
          </el-form-item>
          <el-form-item :label="$t('纳税识别号')+':'" prop="taxpayerIdentificationCode">
            <el-input
              id="taxpayerIdentificationCode"
              :disabled="onlyRead"
              v-model="invoiceQualification.taxpayerIdentificationCode"
              :placeholder="$t('请输入纳税识别号')"
              name="invoiceQualification_taxpayerIdentificationCode"
              type="text"
              show-word-limit
              maxlength="50"
            />
          </el-form-item>
          <el-form-item :label="$t('开户银行')+':'" prop="bankDeposit">
            <el-input
              id="bankDeposit"
              :disabled="onlyRead"
              v-model="invoiceQualification.bankDeposit"
              :placeholder="$t('请输入开户银行')"
              name="invoiceQualification_bankDeposit"
              type="text"
              show-word-limit
              maxlength="30"
            />
          </el-form-item>
          <el-form-item :label="$t('银行账号')+':'" prop="bankAccount">
            <el-input
              id="bankAccount"
              :disabled="onlyRead"
              v-model="invoiceQualification.bankAccount"
              :placeholder="$t('请输入银行账号')"
              name="invoiceQualification_bankAccount"
              type="text"
              show-word-limit
              maxlength="30"
            />
          </el-form-item>
          <el-form-item :label="$t('注册地址')+':'" prop="address">
            <el-row>
              <ody-province-city-region-select :disabled="onlyRead" v-model="invoiceQualification.address" name="invoiceQualification_address" />
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('详细地址')+':'" prop="detailAddress">
            <el-input
              id="detailAddress"
              :disabled="onlyRead"
              v-model="invoiceQualification.detailAddress"
              :placeholder="$t('请输入详细地址')"
              name="invoiceQualification_detailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div v-if="!onlyRead" style="text-align: center; margin-top: 10px">
      <ody-button id="merchantManageFinanceSave" name="MerchantManageFinanceSave_saveFinance" code="MerchantManageFinanceSave" type="primary" @click="saveFinance">{{ $t('保存') }}</ody-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    orgId: {
      type: Number,
      default: null
    },
    orgName: {
      type: String,
      default: null
    },
    orgCode: {
      type: String,
      default: null
    },
    onlyRead: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      receiverAccountTypeMapping: {
        '1': this.$t('支付宝'),
        '6': this.$t('微信'),
        '9': this.$t('网银')
      },
      provinceCode: [],
      cityCode: [],
      regionCode: [],
      merchantType: '2',
      finance: {
        receiverAccountType: null,
        receiverEnterpriseName: null,
        receiverBankName: null,
        receiverSubBankName: null,
        receiverAccountNo: null,
        receiverALiAccountNo: null,
        receiverWxAccountNo: null
      },
      financeRules: {
        receiverAccountType: [
          { required: true, message: this.$t('请选择账户类型'), trigger: 'change' }
        ],
        receiverEnterpriseName: [
          { required: true, message: this.$t('请输入账户名称'), trigger: 'change' }
        ],
        receiverBankName: [
          { required: true, message: this.$t('请输入开户银行'), trigger: 'change' }
        ],
        receiverSubBankName: [
          { required: true, message: this.$t('请输入开户行网点'), trigger: 'change' }
        ],
        receiverAccountNo: [
          { required: true, message: this.$t('请输入银行账号'), trigger: 'change' }
        ],
        receiverALiAccountNo: [
          { required: true, message: this.$t('请输入支付宝账号'), trigger: 'change' }
        ],
        receiverWxAccountNo: [
          { required: true, message: this.$t('请输入微信账号'), trigger: 'change' }
        ]
      },
      invoiceQualification: {
        address: []
      },
      invoiceQualificationRules: {
        invoiceTitle: [
          { required: true, message: this.$t('请输入发票抬头'), trigger: 'change' }
        ],
        registerPhone: [
          { required: true, message: this.$t('请输入联系电话'), trigger: 'change' },
          {
            pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8|9][0-9]))\d{8}$/,
            message: this.$t('请输入正确的联系电话'),
            trigger: 'change'
          }
        ],
        email: [
          { required: true, message: this.$t('请输入邮箱'), trigger: 'change' },
          {
            pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/,
            message: this.$t('请输入正确的邮箱'),
            trigger: 'change'
          }
        ],
        taxpayerIdentificationCode: [
          { required: true, message: this.$t('请输入纳税识别号'), trigger: 'change' }
        ],
        bankDeposit: [
          { required: true, message: this.$t('请输入开户银行'), trigger: 'change' }
        ],
        bankAccount: [
          { required: true, message: this.$t('请输入银行账号'), trigger: 'change' }
        ],
        address: [
          { required: true, message: this.$t('请选择注册地址'), trigger: 'change' },
          {
            validator(rule, value, callback) {
              if (!value || !value[0] || !value[1] || !value[2]) {
                callback(new Error('请选择注册地址'))
              } else {
                callback()
              }
            }, trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: this.$t('请输入详细地址'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      // this.queryAreaCode('100000')
      this.selectMerchantAccount()
      this.getInvoiceQualification()
    },
    selectMerchantAccount() {
      const vue = this
      const finance = vue.$merchant.$api.financeService
      finance.selectMerchantAccount({ merchantId: vue.orgId }).then(res => {
        if (res && res.code === '0' && res.data) {
          res.data.receiverALiAccountNo = null
          res.data.receiverWxAccountNo = null
          if (res.data.receiverAccountType === 1) {
            res.data.receiverALiAccountNo = res.data.receiverAccountNo
          } else if (res.data.receiverAccountType === 6) {
            res.data.receiverWxAccountNo = res.data.receiverAccountNo
          }
          res.data.receiverAccountNo = null
          vue.finance = res.data
          vue.finance.receiverAccountType = vue.finance.receiverAccountType.toString()
        }
      })
    },
    getInvoiceQualification() {
      const vue = this
      const finance = vue.$merchant.$api.financeService
      finance
        .getInvoiceQualification({ invoiceDrawerId: vue.orgId })
        .then(res => {
          if (res && res.code === '0' && res.data) {
            res.data.address = []
            vue.invoiceQualification = res.data
            if (res.data.regionCode) {
              vue.invoiceQualification.address = [res.data.provinceCode, res.data.cityCode, res.data.regionCode]
            }
          }
        })
    },
    saveFinance() {
      const vue = this
      vue.$refs['finance'].validate(fValid => {
        if (fValid) {
          vue.$refs['invoiceQualification'].validate(iValid => {
            if (iValid) {
              const accountParams = Object.assign({}, vue.finance)
              accountParams.merchantId = vue.orgId
              accountParams.merchantType = vue.merchantType
              if (accountParams.receiverAccountType === '1') {
                accountParams.receiverAccountNo = accountParams.receiverALiAccountNo
              } else if (accountParams.receiverAccountType === '6') {
                accountParams.receiverAccountNo = accountParams.receiverWxAccountNo
              }
              vue.$merchant.$api.financeService
                .saveMerchantAccount(accountParams)
                .then(res => {
                  const qualificationParam = Object.assign(
                    {},
                    vue.invoiceQualification
                  )
                  qualificationParam.invoiceDrawerId = vue.orgId
                  qualificationParam.invoiceDrawerCode =
                    vue.orgCode
                  qualificationParam.invoiceDrawerName =
                    vue.orgName
                  qualificationParam.drawerType = vue.merchantType
                  qualificationParam.invoiceType = vue.merchantType

                  qualificationParam.provinceCode = qualificationParam.address[0]
                  qualificationParam.cityCode = qualificationParam.address[1]
                  qualificationParam.regionCode = qualificationParam.address[2]
                  delete qualificationParam.address

                  vue.$merchant.$api.financeService
                    .saveQualification(qualificationParam)
                    .then(qualificationRes => {
                      if (qualificationRes && qualificationRes.code === '0') {
                        vue.$message.success('保存成功')
                      }
                    })
                })
            }
          })
        }
      })
    },
    receiverAccountTypeChange() {
      this.finance.receiverAccountNo = ''
      const type = this.finance.receiverAccountType
      this.$refs['finance'].resetFields()
      this.finance.receiverAccountType = type
    },
    queryAreaCode(parentCode) {
      const vue = this
      vue.$portal
        .get('/ouser-web/area/queryArea.do?parentCode=' + parentCode)
        .then(res => {
          vue.provinceCode = res.data
        })
    },
    provinceCodeChange(keep) {
      const vue = this
      if (!vue.invoiceQualification.provinceCode) {
        return
      }
      vue.$portal
        .get(
          '/ouser-web/area/queryArea.do?parentCode=' +
            vue.invoiceQualification.provinceCode
        )
        .then(res => {
          vue.cityCode = res.data
          vue.regionCode = []
          if (!keep) {
            vue.invoiceQualification.cityCode = null
            vue.invoiceQualification.regionCode = null
          }
        })
    },
    cityCodeChange(keep) {
      const vue = this
      if (!vue.invoiceQualification.cityCode) {
        return
      }
      vue.$portal
        .get(
          '/ouser-web/area/queryArea.do?parentCode=' +
            vue.invoiceQualification.cityCode
        )
        .then(res => {
          vue.regionCode = res.data
          if (!keep) {
            vue.invoiceQualification.regionCode = null
          }
        })
    }
  }
}
</script>

<style scoped>
</style>
