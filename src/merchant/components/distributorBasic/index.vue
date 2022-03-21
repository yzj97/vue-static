<template>
  <div class="basic-content">
    <div>{{ $t('客户基本信息') }}</div>
    <el-divider/>
    <el-row>
      <el-col :span="17">
        <el-form ref="basicFormRef" :model="basicForm" :rules="basicFormRules" label-width="240px">
          <el-form-item :label="$t('客户编码')" prop="orgCode" required>
            <el-input v-model="basicForm.orgCode" :disabled="isDisabled" :placeholder="$t('请输入客户编码')" name="basicForm_orgCode" maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('客户名称')" prop="orgName" required>
            <el-input
              v-model="basicForm.orgName"
              :disabled="!isEdit"
              :placeholder="$t('请输入客户名称')"
              name="basicForm_orgName"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('客户类型')" prop="orgType" required>
            <el-select
              v-model="basicForm.orgType"
              :disabled="isDisabled"
              :placeholder="$t('请选择')"
              name="basicForm_orgType"
              style="width: 100%">
              <el-option
                v-for="item in orgTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('组织架构')" prop="departmentId" required>
            <ody-organization-select
              :disabled="isDisabled"
              v-model="basicForm.departmentId"
              name="basicForm_departmentId"
              entity-type="CUSTOMER" />
          </el-form-item>
          <el-form-item v-if="isDisabled" :label="$t('所属商家')" prop="merchantId" required>
            <el-select
              :placeholder="$t('请选择')"
              v-model="basicForm.merchantId"
              name="basicForm_merchantId"
              disabled="true"
              style="width: 100%">
              <el-option
                v-for="item in merchantIdList"
                :key="item.merchantId"
                :label="item.merchantName"
                :value="item.merchantId"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div>{{ $t('公司信息') }}</div>
    <el-divider/>
    <el-row>
      <el-col :span="17">
        <el-form ref="companyFormRef" :model="companyForm" :rules="companyFormRules" label-width="240px">
          <el-form-item :label="$t('公司名称')" prop="enterpriseName">
            <el-input
              v-model="companyForm.enterpriseName"
              :disabled="!isEdit"
              :placeholder="$t('请输入公司名称')"
              name="companyForm_enterpriseName"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('法人姓名')" prop="legalRepresentativeName">
            <el-input
              v-model="companyForm.legalRepresentativeName"
              :disabled="!isEdit"
              :placeholder="$t('请输入法人姓名')"
              name="companyForm_legalRepresentativeName"
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('法人证件类型')" prop="legalRepresentativeCertificateType">
            <el-select
              v-model="companyForm.legalRepresentativeCertificateType"
              :disabled="!isEdit"
              :placeholder="$t('请选择')"
              name="companyForm_legalRepresentativeCertificateType"
              style="width: 100%">
              <el-option
                v-for="item in certificateTypeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('法人证件号码')" prop="legalRepresentativeCertificateNo">
            <el-input
              v-model="companyForm.legalRepresentativeCertificateNo"
              :disabled="!isEdit"
              :placeholder="$t('请输入证件号码')"
              name="companyForm_legalRepresentativeCertificateNo"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('营业执照号码')" prop="businessLicenceNo">
            <el-input
              v-model="companyForm.businessLicenceNo"
              :disabled="!isEdit"
              :placeholder="$t('请输入营业执照号码')"
              name="companyForm_businessLicenceNo"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('公司类型')" >
            <el-select
              v-model="companyForm.enterpriseType"
              :disabled="!isEdit"
              :placeholder="$t('请选择')"
              name="companyForm_enterpriseType"
              style="width: 100%">
              <el-option
                v-for="one in enterpriseTypeList"
                :key="one.value"
                :label="one.label"
                :value="one.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('经营范围')" prop="businessScope">
            <el-input
              v-model="companyForm.businessScope"
              :disabled="!isEdit"
              :placeholder="$t('请输入经营范围')"
              name="companyForm_businessScope"
              type="textarea"
              show-word-limit
              maxlength="600"/>
          </el-form-item>
          <el-form-item :label="$t('营业期限')" class="business-time">
            <el-date-picker
              v-model="companyForm.businessLicencePeriodBegin"
              :disabled="!isEdit"
              :placeholder="$t('选择日期')"
              name="companyForm_businessLicencePeriodBegin"
              type="date"/>
            <span class="business-time-to"> {{ $t('至') }} </span>
            <el-date-picker
              :disabled="!isEdit"
              :placeholder="$t('选择日期')"
              v-model="companyForm.businessLicencePeriodEnd"
              name="companyForm_businessLicencePeriodEnd"
              type="date"/>
          </el-form-item>
          <el-form-item :label="$t('公司注册地址')" prop="registeredRegionCode">
            <province-city-region
              :span="7"
              :offset="1"
              :is-edit="isEdit"
              :data="adressData"
              :province-key="'province'"
              :city-key="'city'"
              :region-key="'region'"
              name="adressData421"
              @change="registeredRegionCodeChange"/>
          </el-form-item>
          <el-form-item :label="$t('详细地址')" prop="registeredDetailAddress">
            <el-input
              v-model="companyForm.registeredDetailAddress"
              :disabled="!isEdit"
              :placeholder="$t('请输入详细地址')"
              name="companyForm_registeredDetailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"/>
          </el-form-item>
          <el-form-item :label="$t('公司注册资金')">
            <el-select
              v-model="companyForm.registeredCapital"
              :disabled="!isEdit"
              :placeholder="$t('请选择')"
              name="companyForm_registeredCapital"
              style="width: 100%">
              <el-option
                v-for="one in registerMoney"
                :key="one.value"
                :label="one.label"
                :value="one.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('公司总人数')" >
            <el-select
              v-model="companyForm.enterpriseStaffNums"
              :disabled="!isEdit"
              :placeholder="$t('请选择')"
              name="companyForm_enterpriseStaffNums"
              style="width: 100%">
              <el-option
                v-for="one in enterpriseStaffNumsList"
                :key="one.value"
                :label="one.label"
                :value="one.value"
              />
            </el-select>
          </el-form-item>

        </el-form>
      </el-col>
    </el-row>
    <div>{{ $t('联系信息') }}</div>
    <el-divider/>
    <el-row>
      <el-col :span="17">
        <el-form ref="contactFormRef" :model="contactForm" :rules="contactFormRules" label-width="240px">
          <el-form-item :label="$t('联系人姓名')" prop="contactName" required>
            <el-input
              v-model="contactForm.contactName"
              :disabled="!isEdit"
              :placeholder="$t('请输入联系人姓名')"
              name="contactForm_contactName"
              type="text"
              show-word-limit
              maxlength="20"/>
          </el-form-item>
          <el-form-item :label="$t('联系人手机号')" prop="contactMobileNo" required>
            <el-input
              v-model="contactForm.contactMobileNo"
              :disabled="!isEdit"
              :placeholder="$t('请输入联系人手机号')"
              name="contactForm_contactMobileNo"
              type="number"
              show-word-limit
              maxlength="11"/>
          </el-form-item>
          <el-form-item :label="$t('联系人邮箱')" prop="contactEmail" required>
            <el-input
              v-model="contactForm.contactEmail"
              :disabled="!isEdit"
              :placeholder="$t('请输入联系人邮箱')"
              name="contactForm_contactEmail"
              type="text"
              show-word-limit
              maxlength="30"/>
          </el-form-item>
          <el-form-item :label="$t('联系地址')" prop="contactRegionCode" required>
            <province-city-region
              :span="7"
              :offset="1"
              :is-edit="isEdit"
              :data="contactAdressData"
              :province-key="'province'"
              :city-key="'city'"
              :region-key="'region'"
              name="contactAdressData819"
              @change="contactRegionCodeChange"/>
          </el-form-item>
          <el-form-item :label="$t('详细地址')" prop="contactDetailAddress" required>
            <el-input
              v-model="contactForm.contactDetailAddress"
              :disabled="!isEdit"
              :placeholder="$t('请输入详细地址')"
              name="contactForm_contactDetailAddress"
              type="textarea"
              show-word-limit
              maxlength="100"/>
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
    isEdit: { type: Boolean, default: false },
    distributionObj: {
      type: Object,
      default: () => {
        return {}
      }
    },
    orgType: { type: Number, default: 0 }
  },
  data() {
    return {
      adressData: {
        province: '', // 省编码
        city: '', // 市编码
        region: '' // 区编码
      },
      contactAdressData: {
        province: '', // 省编码
        city: '', // 市编码
        region: '' // 区编码
      },

      // 客户基本信息
      basicForm: {
        orgCode: '', // 客户编号
        orgName: '', // 客户名称
        merchantId: '', // 所属商家
        orgType: null, // 客户类型
        departmentId: null, // 组织架构
        channel: [] // 所属渠道
      },
      basicFormRules: {
        orgCode: [
          { required: true, message: '请输入客户编码', trigger: 'blur' },
          { required: true, message: '请输入客户编码', trigger: 'change' },
          { pattern: /^[*!$@\\()<>\-_^. [\]0-9a-zA-Z]+$/, message: '请不要输入带特殊字符的客户编码', trigger: 'change' }
        ],
        orgName: [
          { required: true, message: '请输入客户名称', trigger: 'blur' },
          { required: true, message: '请输入客户名称', trigger: 'change' }
        ],
        orgType: [
          { required: true, message: '请输入客户类型', trigger: 'blur' },
          { required: true, message: '请输入客户类型', trigger: 'change' }
        ],
        departmentId: [
          { required: true, message: '请选择组织架构', trigger: 'blur' },
          { required: true, message: '请选择组织架构', trigger: 'change' }
        ]
      },
      contactFormRules: {
        contactName: [
          { required: true, message: '请输入联系人姓名', trigger: 'blur' },
          { required: true, message: '请输入联系人姓名', trigger: 'change' }
        ],
        contactMobileNo: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
          { required: true, message: '请输入联系人手机号', trigger: 'change' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        contactEmail: [
          { required: true, message: '请输入联系人邮箱', trigger: 'blur' },
          { required: true, message: '请输入联系人邮箱', trigger: 'change' },
          { pattern: /^[0-9a-zA-Z_]+@[0-9a-zA-Z_]+\.[0-9a-zA-Z_]+/, message: '请输入正确的邮箱', trigger: 'change' }
        ],
        contactRegionCode: [
          { required: true, message: '请输入联系地址', trigger: 'blur' },
          { required: true, message: '请输入联系地址', trigger: 'change' }
        ],
        contactDetailAddress: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      },
      merchantIdList: [], // 所属商家列表
      orgTypeList: [], // 客户类型

      // 公司信息
      companyForm: {
        enterpriseName: '', // 公司名称
        legalRepresentativeName: '', // 法人姓名
        legalRepresentativeCertificateType: '', // 法人证件类型
        legalRepresentativeCertificateNo: '', // 法人证件号码
        businessLicenceNo: '', // 营业执照号码
        enterpriseType: '', // 公司类型
        businessScope: '', // 经营范围
        businessLicencePeriodBegin: '', // 营业期限-开始时间
        businessLicencePeriodEnd: '', // 营业期限-结束时间
        registeredProvinceCode: '', // 注册地址-省编码
        registeredCityCode: '', // 注册地址-市编码
        registeredRegionCode: '', // 注册地址-区编码
        registeredDetailAddress: '', // 详细地址
        registeredCapital: '', // 公司注册资金
        enterpriseStaffNums: '' // 公司总人数

      },
      companyFormRules: {
        legalRepresentativeCertificateNo: [
          { pattern: /^[0-9a-zA-Z]*$/, message: '仅支持英文，数字', trigger: 'change' }
        ]
      },
      certificateTypeList: [], // 法人证件类型列表
      enterpriseTypeList: [], // 公司类型列表
      registerMoney: [], // 公司注册资金

      // 联系信息
      contactForm: {
        contactName: '', // 联系人姓名
        contactMobileNo: '', // 联系人手机号
        contactEmail: '', // 联系人邮箱
        contactProvinceCode: '', // 联系人地址-省编码
        contactCityCode: '', // 联系人地址-市编码
        contactRegionCode: '', // 联系人地址-区编码
        contactDetailAddress: '' // 联系信息-详细地址
      },
      orgCodeLabel: null,
      orgNameLabel: null,
      orgCodePlaceholder: null,
      orgNamePlaceholder: null,
      isDisabled: false
    }
  },
  watch: {
    // 监控属性distributionObj的变化
    distributionObj: {
      handler: function(val) {
        this.setDistributionDetailInfo()
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.getMerchantIdList()
      if (!this.isEdit || this.editId !== -1) {
        this.isDisabled = true
      }
      this.certificateTypeList = constants.legalRepresentativeCertificateType
      this.enterpriseTypeList = constants.enterpriseType
      this.registerMoney = constants.registerMoney
      this.enterpriseStaffNumsList = constants.enterpriseStaffNums
      this.orgTypeList = constants.orgTypeList
      this.setDistributionDetailInfo()
    },
    // 获取商家列表
    getMerchantIdList() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.queryPlatformAuthMerchantPage({ 'currentPage': 1, 'itemsPerPage': 1000 }).then(res => {
        this.merchantIdList = res.data.listObj
      })
    },
    registeredRegionCodeChange(val) {
      this.companyForm.registeredProvinceCode = val.provinceCode
      this.companyForm.registeredCityCode = val.cityCode
      this.companyForm.registeredRegionCode = val.regionCode
    },
    contactRegionCodeChange(val) {
      this.contactForm.contactProvinceCode = val.provinceCode
      this.contactForm.contactCityCode = val.cityCode
      this.contactForm.contactRegionCode = val.regionCode
    },
    setDistributionDetailInfo() {
      if (this.distributionObj != null) {
        this.basicForm.orgCode = this.distributionObj.orgCode
        this.basicForm.orgName = this.distributionObj.orgName
        this.basicForm.merchantId = this.distributionObj.merchantId
        this.basicForm.orgType = this.distributionObj.orgType
        this.basicForm.departmentId = this.distributionObj.departmentId

        this.companyForm.enterpriseName = this.distributionObj.enterpriseName
        this.companyForm.legalRepresentativeName = this.distributionObj.legalRepresentativeName
        this.companyForm.legalRepresentativeCertificateType = this.distributionObj.legalRepresentativeCertificateType === 0 ? null : String(this.distributionObj.legalRepresentativeCertificateType)
        this.companyForm.legalRepresentativeCertificateNo = this.distributionObj.legalRepresentativeCertificateNo
        this.companyForm.businessLicenceNo = this.distributionObj.businessLicenceNo
        this.companyForm.enterpriseType = this.distributionObj.enterpriseType
        this.companyForm.businessScope = this.distributionObj.businessScope
        this.companyForm.businessLicencePeriodBegin = this.distributionObj.businessLicencePeriodBegin
        this.companyForm.businessLicencePeriodEnd = this.distributionObj.businessLicencePeriodEnd
        this.companyForm.registeredDetailAddress = this.distributionObj.registeredDetailAddress
        this.companyForm.registeredCapital = this.distributionObj.registeredCapital
        this.companyForm.enterpriseStaffNums = this.distributionObj.enterpriseStaffNums
        this.contactForm.contactName = this.distributionObj.contactName
        this.contactForm.contactMobileNo = this.distributionObj.contactMobileNo
        this.contactForm.contactEmail = this.distributionObj.contactEmail
        this.contactForm.contactDetailAddress = this.distributionObj.contactDetailAddress

        this.companyForm.registeredProvinceCode = this.distributionObj.registeredProvinceCode
        this.companyForm.registeredCityCode = this.distributionObj.registeredCityCode
        this.companyForm.registeredRegionCode = this.distributionObj.registeredRegionCode

        this.contactForm.contactProvinceCode = this.distributionObj.contactProvinceCode
        this.contactForm.contactCityCode = this.distributionObj.contactCityCode
        this.contactForm.contactRegionCode = this.distributionObj.contactRegionCode

        this.adressData = {
          province: this.distributionObj.registeredProvinceCode, // 省编码
          city: this.distributionObj.registeredCityCode, // 市编码
          region: this.distributionObj.registeredRegionCode // 区编码
        }
        this.contactAdressData = {
          province: parseInt(this.distributionObj.contactProvinceCode), // 省编码
          city: parseInt(this.distributionObj.contactCityCode), // 市编码
          region: parseInt(this.distributionObj.contactRegionCode) // 区编码
        }
      }
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
