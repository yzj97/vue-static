<template>
  <div>
    <el-form ref="baseInfo" :label-position="left" :model="baseInfo" :rules="onlyRead ? null : rules" label-width="120px">
      <el-row>
        <ody-top-title :title="$t('商家基本信息')" />
        <el-col :span="10" :offset="6">
          <el-form-item :label="$t('商家编码')+'：'" prop="orgCode">
            <el-input
              v-model="baseInfo.orgCode"
              :disabled="baseInfo.id || onlyRead"
              :placeholder="$t('请输入商家编码')"
              name="baseInfo_orgCode"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('商家名称')+'：'" prop="orgName">
            <el-input
              v-model="baseInfo.orgName"
              :disabled="onlyRead"
              :placeholder="$t('请输入商家名称')"
              name="baseInfo_orgName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('组织架构')+'：'">
            <el-input v-model="baseInfo.departmentName" name="baseInfo_departmentName" disabled/>
          </el-form-item>
          <el-form-item :label="$t('商家类型')+'：'" prop="merchantType">
            <el-select :disabled="onlyRead" v-model="baseInfo.merchantType" :placeholder="$t('请选择')" name="baseInfo_merchantType">
              <el-option
                v-for="one in orgType"
                :key="one.code"
                :label="one.name"
                :value="one.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('商家价格策略')+'：'" prop="priceStrategy">
            <el-select :disabled="baseInfo.id || onlyRead" v-model="baseInfo.priceStrategy" :placeholder="$t('请选择')" name="baseInfo_priceStrategy">
              <el-option
                v-for="one in priceStrategyList"
                :key="one.code"
                :label="one.name"
                :value="one.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('核算组织')+'：'" prop="accountingUnitId">
            <el-select id="accountingUnitId" :disabled="onlyRead" v-model="baseInfo.accountingUnitId" :placeholder="$t('请选择')" name="baseInfo_accountingUnitId">
              <el-option
                v-for="one in accountingUnits"
                :key="one.id"
                :label="one.unitName"
                :value="one.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <ody-top-title :title="$t('公司信息')" />
        <el-col :span="10" :offset="6">
          <el-form-item :label="$t('公司名称')+'：'" prop="enterpriseName">
            <el-input
              id="enterpriseName"
              v-model="baseInfo.enterpriseName"
              :disabled="onlyRead"
              :placeholder="$t('请输入公司名称')"
              name="baseInfo_enterpriseName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('法人姓名')+'：'" prop="legalRepresentativeName">
            <el-input
              id="legalRepresentativeName"
              v-model="baseInfo.legalRepresentativeName"
              :disabled="onlyRead"
              :placeholder="$t('请输入法人姓名')"
              name="baseInfo_legalRepresentativeName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('法人证件类型')+'：'" prop="legalRepresentativeCertificateType">
            <el-select id="legalRepresentativeCertificateType" :disabled="onlyRead" v-model="baseInfo.legalRepresentativeCertificateType" :placeholder="$t('请选择')" name="baseInfo_legalRepresentativeCertificateType">
              <el-option
                v-for="one in certificateType"
                :key="one.code"
                :label="one.name"
                :value="one.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('法人证件号码')+'：'" prop="legalRepresentativeCertificateNo">
            <el-input
              id="legalRepresentativeCertificateNo"
              :disabled="onlyRead"
              v-model="baseInfo.legalRepresentativeCertificateNo"
              :placeholder="$t('请输入证件号码')"
              name="baseInfo_legalRepresentativeCertificateNo"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('营业执照号码')+'：'" prop="businessLicenceNo">
            <el-input
              id="businessLicenceNo"
              :disabled="onlyRead"
              v-model="baseInfo.businessLicenceNo"
              :placeholder="$t('请输入营业执照号码')"
              name="baseInfo_businessLicenceNo"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('公司类型')+'：'">
            <el-select id="enterpriseType" :disabled="onlyRead" v-model="baseInfo.enterpriseType" :placeholder="$t('请选择')" name="baseInfo_enterpriseType">
              <el-option
                v-for="one in enterpriseType"
                :key="one.code"
                :label="one.name"
                :value="one.code"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('经营范围')+'：'" prop="businessScope">
            <el-input
              id="businessScope"
              :disabled="onlyRead"
              v-model="baseInfo.businessScope"
              :placeholder="$t('请输入经营范围')"
              name="baseInfo_businessScope"
              type="textarea"
              show-word-limit
              maxlength="600"/>
          </el-form-item>
          <el-form-item :label="$t('营业期限')+'：'">
            <!-- <el-col :span="10">
              <el-date-picker
                :disabled="onlyRead"
                v-model="baseInfo.businessLicencePeriodBegin"
                name="baseInfo_businessLicencePeriodBegin"
                type="date"
                :placeholder="$t('选择日期')"/>
            </el-col>
            <el-col :span="1">{{$t('至')}}</el-col>
            <el-col :span="10">
              <el-date-picker
                :disabled="onlyRead"
                v-model="baseInfo.businessLicencePeriodEnd"
                name="baseInfo_businessLicencePeriodEnd"
                type="date"
                :placeholder="$t('选择日期')"/>
            </el-col> -->
            <el-date-picker
              v-model="baseInfo.businessTime"
              :range-separator="$t('至')"
              :start-placeholder="$t('开始日期')"
              :end-placeholder="$t('结束日期')"
              name="baseInfo_businessTime"
              type="datetimerange"/>
          </el-form-item>
          <el-form-item :label="$t('公司注册地址')+'：'" prop="registerArea">
            <el-row>
              <ody-province-city-region-select :disabled="onlyRead" v-model="baseInfo.registerArea" name="baseInfo_registerArea" />
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('详细地址')+'：'" prop="registeredDetailAddress">
            <el-input
              id="registeredDetailAddress"
              :disabled="onlyRead"
              v-model="baseInfo.registeredDetailAddress"
              :placeholder="$t('请输入详细地址')"
              name="baseInfo_registeredDetailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('公司注册资金')+'：'">
            <el-select id="registeredCapital" :disabled="onlyRead" v-model="baseInfo.registeredCapital" :placeholder="$t('请选择')" name="baseInfo_registeredCapital">
              <el-option
                v-for="one in registerMoney"
                :key="one.value"
                :label="one.label"
                :value="one.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('公司总人数')+'：'" >
            <el-select id="enterpriseStaffNums" :disabled="onlyRead" v-model="baseInfo.enterpriseStaffNums" :placeholder="$t('请选择')" name="baseInfo_enterpriseStaffNums">
              <el-option
                v-for="one in enterpriseStaffNums"
                :key="one.value"
                :label="one.label"
                :value="one.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <ody-top-title :title="$t('联系信息')" />
        <el-col :span="10" :offset="6">
          <el-form-item :label="$t('联系人姓名')+'：'" prop="contactName">
            <el-input
              id="contactName"
              :disabled="onlyRead"
              v-model="baseInfo.contactName"
              :placeholder="$t('请输入联系人姓名')"
              name="baseInfo_contactName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('联系人手机号')+'：'" prop="mobileNo">
            <el-input
              id="mobileNo"
              :disabled="onlyRead"
              v-model="baseInfo.mobileNo"
              :placeholder="$t('请输入联系人手机号')"
              name="baseInfo_mobileNo"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('联系人邮箱')+'：'" prop="email">
            <el-input
              id="email"
              :disabled="onlyRead"
              v-model="baseInfo.email"
              :placeholder="$t('请输入联系人邮箱')"
              name="baseInfo_email"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('联系地址')+'：'" prop="contactArea">
            <el-row>
              <ody-province-city-region-select :disabled="onlyRead" v-model="baseInfo.contactArea" name="baseInfo_contactArea" />
            </el-row>
          </el-form-item>
          <el-form-item :label="$t('详细地址')+'：'" prop="contactDetailAddress">
            <el-input
              id="contactDetailAddress"
              :disabled="onlyRead"
              v-model="baseInfo.contactDetailAddress"
              :placeholder="$t('请输入详细地址')"
              name="baseInfo_contactDetailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>
          <el-form-item prop="checked">
            <el-checkbox id="checked" :disabled="onlyRead" v-model="baseInfo.checked" name="baseInfo_checked">{{ $t('我已阅读并同意') }}</el-checkbox>
            <el-link name="showEntryTerms" type="primary" @click="showEntryTerms">《{{ entryTerms.title }}》</el-link>
            <ody-dialog :visible="entryTermsVisible" :before-close="hiddenEntryTerms" :title="entryTerms.title">
              <div v-html="entryTerms.content" />
            </ody-dialog>
          </el-form-item>
        </el-col>
      </el-row>

      <div v-if="!onlyRead" style="text-align: center">
        <el-button name="returnBack" @click="returnBack">{{ $t('取消') }}</el-button>
        <ody-button id="merchantManageBaseSave" name="MerchantManageBaseSave_onSubmit" code="MerchantManageBaseSave" type="primary" @click="onSubmit">{{ $t('保存') }}</ody-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import constants from '@/utils/constants'

export default {
  props: {
    id: {
      type: Number,
      default: null
    },
    orgCode: {
      type: String,
      default: null
    },
    orgName: {
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
      registerMoney: [],
      enterpriseStaffNums: [],
      certificateType: [],
      enterpriseType: [],
      orgType: [],
      provinceCode: [],
      registeredCityCode: [],
      registeredRegionCode: [],
      contactCityCode: [],
      contactRegionCode: [],
      orgTree: [],
      entryTermsVisible: false,
      entryTerms: {},
      baseInfo: {
        registerArea: [],
        contactArea: [],
        checked: null
      },
      accountingUnits: [],
      priceStrategyList: [],
      rules: {
        orgName: [
          { required: true, message: '请输入商家名称', trigger: 'change' }
        ],
        merchantType: [
          { required: true, message: '请选择商家类型', trigger: 'change' }
        ],
        enterpriseName: [
          { required: true, message: '请输入公司名称', trigger: 'change' }
        ],
        legalRepresentativeName: [
          { required: true, message: '请输入法人姓名', trigger: 'change' }
        ],
        legalRepresentativeCertificateType: [
          { required: true, message: '请选择法人证件类型', trigger: 'change' }
        ],
        legalRepresentativeCertificateNo: [
          { required: true, validator: this.validateCertificateNo, trigger: ['blur', 'change'] }
        ],
        businessLicenceNo: [
          { required: true, message: '请输入营业执照号码', trigger: 'change' }
        ],
        registeredRegionCode: [
          { required: true, message: '请选择公司注册地址', trigger: 'change' }
        ],
        contactRegionCode: [
          { required: true, message: '请选择联系地址', trigger: 'change' }
        ],
        registeredDetailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        contactDetailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ],
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'change' }
        ],
        mobileNo: [
          { required: true, message: '请输入联系人手机号', trigger: 'change' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入联系人邮箱', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/, message: '请输入正确的邮箱', trigger: 'change' }
        ],
        checked: [
          { required: true, message: '请勾选入驻条款', trigger: 'change' },
          { pattern: /^(true)/, message: '请勾选入驻条款', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    validateCertificateNo(rule, value, callback) {
      if (value === '' || value === undefined) {
        callback(new Error('请输入法人证件号码'))
      } else {
        if (+this.baseInfo.legalRepresentativeCertificateType === 1) {
          if (/^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))((0[1-9])|([1-2][0-9])|(3[0-1]))\d{3}(\d|x|X)$/.test(value)) {
            callback()
          } else {
            callback(new Error('请输入合法的证件号码'))
          }
        } else {
          callback()
        }
      }
    },
    init() {
      const vue = this
      vue.queryAreaCode('100000')
      vue.initCodes()
      vue.queryBaseInfo()
      const accountUnitService = this.$merchant.$api.accountUnitService
      accountUnitService.queryAccountUnitInfoPage({ currentPage: 1, itemsPerPage: 9999 }).then(res => {
        vue.accountingUnits = res.data.listObj
      })
    },
    initCodes() {
      const vue = this
      vue.$merchant.$api.commonService.listMultiCode({ categories: ['MERCHANT_TYPE', 'ENTERPRISE_TYPE', 'LEGAL_PERSON_CERTIFICATE_TYPE', 'MERCHANT_PRICE_STRATEGY'] }).then(res => {
        vue.orgType = res.data.MERCHANT_TYPE
        vue.certificateType = res.data.LEGAL_PERSON_CERTIFICATE_TYPE
        vue.enterpriseType = res.data.ENTERPRISE_TYPE
        vue.priceStrategyList = res.data.MERCHANT_PRICE_STRATEGY
      })
      vue.registerMoney = constants.registerMoney
      vue.enterpriseStaffNums = constants.enterpriseStaffNums
    },
    queryAreaCode(parentCode) {
      const vue = this
      vue.$portal.get('/ouser-web/area/queryArea.do?parentCode=' + parentCode).then(res => {
        vue.provinceCode = res.data
      })
    },
    queryBaseInfo() {
      const vue = this
      const merchantService = vue.$merchant.$api.merchantService
      merchantService.queryMerchantOrgBaseInfoByOrgId(vue.id).then(res => {
        res.data.checked = false
        const baseInfo = res.data
        baseInfo.orgId = baseInfo.id
        baseInfo.priceStrategy = baseInfo.priceStrategy + ''
        if (baseInfo.registeredRegionCode) {
          baseInfo.registerArea = [baseInfo.registeredProvinceCode, baseInfo.registeredCityCode, baseInfo.registeredRegionCode]
        }
        if (baseInfo.contactRegionCode) {
          baseInfo.contactArea = [baseInfo.contactProvinceCode, baseInfo.contactCityCode, baseInfo.contactRegionCode]
        }
        vue.baseInfo = baseInfo

        vue.queryEntryTerms()
        this.$set(this.baseInfo, 'businessTime', [baseInfo.businessLicencePeriodBegin || '', baseInfo.businessLicencePeriodEnd || ''])
      })
    },
    registeredProvinceCodeChange(keep) {
      const vue = this
      if (!vue.baseInfo.registeredProvinceCode) {
        return
      }
      vue.$portal.get('/ouser-web/area/queryArea.do?parentCode=' + vue.baseInfo.registeredProvinceCode).then(res => {
        vue.registeredCityCode = res.data
        vue.registeredRegionCode = []
        if (!keep) {
          vue.baseInfo.registeredCityCode = null
          vue.baseInfo.registeredRegionCode = null
        }
      })
    },
    contactProvinceCodeChange(keep) {
      const vue = this
      if (!vue.baseInfo.contactProvinceCode) {
        return
      }
      vue.$portal.get('/ouser-web/area/queryArea.do?parentCode=' + vue.baseInfo.contactProvinceCode).then(res => {
        vue.contactCityCode = res.data
        vue.contactRegionCode = []
        if (!keep) {
          vue.baseInfo.contactCityCode = null
          vue.baseInfo.contactRegionCode = null
        }
      })
    },
    registeredCityCodeChange(keep) {
      const vue = this
      if (!vue.baseInfo.registeredCityCode) {
        return
      }
      vue.$portal.get('/ouser-web/area/queryArea.do?parentCode=' + vue.baseInfo.registeredCityCode).then(res => {
        vue.registeredRegionCode = res.data
        if (!keep) {
          vue.baseInfo.registeredRegionCode = null
        }
      })
    },
    contactCityCodeChange(keep) {
      const vue = this
      if (!vue.baseInfo.contactCityCode) {
        return
      }
      vue.$portal.get('/ouser-web/area/queryArea.do?parentCode=' + vue.baseInfo.contactCityCode).then(res => {
        vue.contactRegionCode = res.data
        if (!keep) {
          vue.baseInfo.contactRegionCode = null
        }
      })
    },
    queryEntryTerms() {
      const vue = this
      const entryTermsService = vue.$merchant.$api.entryTermsService
      entryTermsService.list({ filters: { entryType: 1, status: 1 }}).then(res => {
        if (res.data && res.data.length > 0) {
          vue.entryTerms = res.data[0]
          vue.baseInfo.checked = vue.baseInfo.entryTermsId === vue.entryTerms.id.toString()
        }
      })
    },
    showEntryTerms() {
      this.entryTermsVisible = true
    },
    hiddenEntryTerms() {
      this.entryTermsVisible = false
    },
    onSubmit() {
      const vue = this
      vue.$refs['baseInfo'].validate((valid) => {
        if (valid) {
          if (vue.baseInfo.checked) {
            vue.baseInfo.entryTermsId = vue.entryTerms.id
          }
          if (vue.baseInfo.registerArea && vue.baseInfo.registerArea.length > 0) {
            vue.baseInfo.registeredProvinceCode = vue.baseInfo.registerArea[0]
            vue.baseInfo.registeredCityCode = vue.baseInfo.registerArea[1]
            vue.baseInfo.registeredRegionCode = vue.baseInfo.registerArea[2]
          }
          if (vue.baseInfo.contactArea && vue.baseInfo.contactArea.length > 0) {
            vue.baseInfo.contactProvinceCode = vue.baseInfo.contactArea[0]
            vue.baseInfo.contactCityCode = vue.baseInfo.contactArea[1]
            vue.baseInfo.contactRegionCode = vue.baseInfo.contactArea[2]
          }

          if (this.baseInfo.businessTime && this.baseInfo.businessTime.length > 0) {
            this.baseInfo.businessLicencePeriodBegin = this.baseInfo.businessTime[0]
            this.baseInfo.businessLicencePeriodEnd = this.baseInfo.businessTime[1]
          }
          const merchantService = vue.$merchant.$api.merchantService
          merchantService.updateMerchantOrgBaseInfoById(vue.baseInfo).then(res => {
            if (res && res.code === '0') {
              vue.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style scoped>

</style>
