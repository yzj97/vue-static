<template>
  <div class="pg-supplier-detail-page">
    <ody-list-search-area>
      <div slot="content">
        <el-form
          ref="supplier"
          :inline="true"
          :rules="rules"
          :model="supplier.basicInfo"
          :disabled="isView"
        >
          <el-form-item :label="$t('组织架构')" prop="departmentId">
            <ody-organization-select
              :disabled="isEdit || isView"
              v-model="supplier.basicInfo.departmentId"
              name="supplier_basicInfo_departmentId"
              entity-type="SUPPLIER"
            />
          </el-form-item>
          <el-form-item :label="$t('供应商名称')" prop="orgName">
            <el-input v-model="supplier.basicInfo.orgName" name="supplier_basicInfo_orgName" maxlength="100" />
          </el-form-item>
          <el-form-item :label="$t('供应商简称')" prop="shortName">
            <el-input v-model="supplier.basicInfo.shortName" name="supplier_basicInfo_shortName" maxlength="100" />
          </el-form-item>
        </el-form>
      </div>
    </ody-list-search-area>
    <ody-box>
      <el-tabs v-model="editableTabsValue" name="editableTabsValue" type="card">
        <el-tab-pane
          v-for="item in editableTabs"
          :key="editComponents[item]"
          :label="$t(item)"
          :name="editComponents[item]"
        >
          <span slot="label" :class="{'has-error': errorMap[editComponents[item]]}">{{ $t(item) }}</span>
          <div
            v-if="loaded"
            :is="'opms-supplier-edit-' + editComponents[item]"
            :ref="editComponents[item]"
            :basic-info="supplier.basicInfo"
          />
        </el-tab-pane>
      </el-tabs>
    </ody-box>

    <ody-fixed>
      <ody-button
        :disabled="isView || !loaded"
        name="OpmsSupplierList07_handleSupplierSubmit"
        type="primary"
        code="OpmsSupplierList07"
        @click="handleSupplierSubmit"
      >{{ $t('保存') }}</ody-button>
      <el-button name="returnBack" @click="returnBack">{{ $t('关闭') }}</el-button>
    </ody-fixed>
  </div>
</template>

<script>
import OpmsSupplierEditInfo from '@/components/supplier-edit-info'
import OpmsSupplierEditLicenseInfo from '@/components/supplier-edit-license-info'
import OpmsSupplierEditQualificationInfo from '@/components/supplier-edit-qualification-info'
import OpmsSupplierEditFinancialInfo from '@/components/supplier-edit-financial-info'
import OpmsSupplierEditContactInfo from '@/components/supplier-edit-contact-info'
import OpmsSupplierEditAttachmentInfo from '@/components/supplier-edit-attachment-info'
import OpmsSupplierEditAddressInfo from '@/components/supplier-edit-address-info'
import OpmsSupplierEditOperationLog from '@/components/supplier-edit-operation-log'

export default {
  components: {
    OpmsSupplierEditInfo,
    OpmsSupplierEditLicenseInfo,
    OpmsSupplierEditQualificationInfo,
    OpmsSupplierEditFinancialInfo,
    OpmsSupplierEditContactInfo,
    OpmsSupplierEditAttachmentInfo,
    OpmsSupplierEditAddressInfo,
    OpmsSupplierEditOperationLog
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    return {
      loaded: false,
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      errorMap: {},
      editableTabsValue: 'info',
      editableTabs: [
        '基本信息',
        '营业执照信息',
        '财务信息',
        '联系人信息',
        '附件信息',
        '发货地址信息',
        '操作日志'
      ],
      editComponents: {
        基本信息: 'info',
        营业执照信息: 'license-info',
        资质证照信息: 'qualification-info',
        财务信息: 'financial-info',
        联系人信息: 'contact-info',
        附件信息: 'attachment-info',
        发货地址信息: 'address-info',
        操作日志: 'operation-log'
      },
      supplier: {
        basicInfo: {
          orgName: '',
          shortName: '',
          departmentId: null,
          supplierAccountInfo: {
            receiverEnterpriseName: '', // 收款人姓名
            receiverAccountType: '', // 账户类型
            receiverAccountNo: '', // 收款账号
            receiverBankName: '', // 开户银行
            receiverSubBankName: '', // 开户银行支行名称
            receiverMobile: '' // 收款人手机号
          },
          /**
           * @description 基本信息
           */
          helpCode: '', // 供货商助记码
          otherCode: '', // 供货商GLN码
          classificationId: null, // 供应商类别
          enterpriseType: '', // 企业类型
          enterpriseEmail: '', // 公司邮箱
          enterpriseWebsite: '', // 公司网址
          enterpriseTel: '', // 联系电话
          enterpriseFax: '', // 传真号码
          enterpriseBrandName: '', // 企业品牌名称
          currencyCode: '', // 交易币别
          bussinessType: '', // 采购方式
          cooperationMethod: '', // 合作方式
          remark: '', // 备注
          status: 1, // 状态
          /**
           * @description 营业执照信息
           */
          enterpriseName: '', // 公司名称
          enterpriseTaxCode: '', // 企业税号
          legalRepresentativeName: '', // 法定代表人
          businessLicenceNo: '', // 营业执照号码
          enterpriseCode: '', // 企业编码
          registeredCapital: '', // 企业注册资金
          enterprisePostcode: '', // 邮政编码
          enterpriseArea: [], // 注册地址 - 省市区
          registeredProvinceCityRegion: [], // 注册地址 - 省市区(Object)
          registeredDetailAddress: '', // 详细地址
          businessScope: '', // 主营品类
          businessLicence: [], // 营业执照附件
          enterpriseLegalFrontAttach: [], // 法定代表人证件正面（国徽面）
          enterpriseLegalReverseAttach: [], // 法定代表人证件反面（头像面）
          businessLicencePeriodEnd: '', // 营业执照失效时间
          enterpriseLegalAttachExpireTime: '', // 法定代表人证件失效时间
          /**
           * @description 财务信息
           */
          enterpriseTaxPayerType: '', // 企业纳税人类型
          enterpriseTaxRate: '', // 企业纳税税率
          isTaxIncluded: '', // 报价方式
          receiverEnterpriseName: '', // 收款人姓名
          receiverAccountType: '', // 账户类型
          receiverAccountNo: '', // 收款账号
          receiverBankName: '', // 开户银行
          receiverSubBankName: '', // 开户银行支行名称
          receiverMobile: '', // 收款人手机号
          settlementPartyType: '', // 默认结算地
          paymentSupplier: '', // 默认付款供应商
          deliverySupplier: '' // 默认送货供应商
        }
      },
      rules: {
        departmentId: [
          { required: true, message: '请选择组织架构', trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请输入供应商名称', trigger: 'blur' }
        ]
      }
    }
  },
  async mounted() {
    if (this.isEdit || this.isView) {
      // 请求接口获取数据
      const {
        data: basicInfo = {}
      } = await this.$opms.$api.supplier.queryDistributionDetailInfoByOrgId({
        orgId: this.supplierId,
        merchantId: this.merchant.merchantId
      })

      const {
        data: supplierAccountInfo = {}
      } = await this.$opms.$api.supplier.selectMerchantAccount({
        merchantId: this.supplierId
      })
      const {
        registeredProvinceCode,
        registeredProvinceName,
        registeredCityCode,
        registeredCityName,
        registeredRegionCode,
        registeredRegionName,
        businessLicenceUrl,
        businessLicenceName,
        enterpriseLegalFrontAttachPath,
        enterpriseLegalFrontAttachName,
        enterpriseLegalReverseAttachPath,
        enterpriseLegalReverseAttachName,
        innerOrgName,
        innerOrgId,
        ...params
      } = basicInfo || {}

      params.enterpriseArea = [
        registeredProvinceCode,
        registeredCityCode,
        registeredRegionCode
      ]
      params.registeredProvinceCityRegion = [
        {
          value: registeredProvinceCode,
          name: registeredProvinceName
        },
        {
          value: registeredCityCode,
          name: registeredCityName
        },
        {
          value: registeredRegionCode,
          name: registeredRegionName
        }
      ]
      params.businessLicence = businessLicenceUrl
        ? [{ url: businessLicenceUrl, fileName: businessLicenceName }]
        : []
      params.enterpriseLegalFrontAttach = enterpriseLegalFrontAttachPath
        ? [
          {
            url: enterpriseLegalFrontAttachPath,
            fileName: enterpriseLegalFrontAttachName
          }
        ]
        : []
      params.enterpriseLegalReverseAttach = enterpriseLegalReverseAttachPath
        ? [
          {
            url: enterpriseLegalReverseAttachPath,
            fileName: enterpriseLegalReverseAttachName
          }
        ]
        : []
      params.orgId = basicInfo.id
      params.supplierAccountInfo = supplierAccountInfo || {
        receiverEnterpriseName: '', // 收款人姓名
        receiverAccountType: '', // 账户类型
        receiverAccountNo: '', // 收款账号
        receiverBankName: '', // 开户银行
        receiverSubBankName: '', // 开户银行支行名称
        receiverMobile: '' // 收款人手机号
      }
      params.relMerchant = {
        merchantId: innerOrgId,
        merchantName: innerOrgName
      }

      this.supplier.basicInfo = params
    }
    this.loaded = true
  },
  methods: {
    async handleSupplierSubmit() {
      const [err] = await this.formValidate('supplier')
      const [errorMap] = await this.allTabFormValidate()

      if (err || errorMap) {
        this.errorMap = errorMap
        console.log('批量验证失败', errorMap)
        return
      }
      const {
        supplierAccountInfo,
        enterpriseArea: [
          registeredProvinceCode,
          registeredCityCode,
          registeredRegionCode
        ],
        registeredProvinceCityRegion: [
          registeredProvince,
          registeredCity,
          registeredRegion
        ],
        businessLicence: [
          { url: businessLicenceUrl, name: businessLicenceName } = {
            url: '',
            name: ''
          }
        ],
        enterpriseLegalFrontAttach: [
          {
            url: enterpriseLegalFrontAttachPath,
            name: enterpriseLegalFrontAttachName
          } = { url: '', name: '' }
        ],
        enterpriseLegalReverseAttach: [
          {
            url: enterpriseLegalReverseAttachPath,
            name: enterpriseLegalReverseAttachName
          } = { url: '', name: '' }
        ],
        ...basicInfo
      } = this.supplier.basicInfo

      if (basicInfo.paymentSupplier === 2 && !basicInfo.paymentSupplierCode) {
        this.errorMap = {
          'financial-info': true
        }
        this.$message.error('选择付款供应商')
        return false
      }

      if (basicInfo.deliverySupplier === 2 && !basicInfo.deliverySupplierCode) {
        this.errorMap = {
          'financial-info': true
        }
        this.$message.error('选择送货供应商')
        return false
      }

      const supplierClassification = this.$refs['info'][0]
        .supplierClassification

      if (supplierClassification && supplierClassification.isParent) {
        this.errorMap = {
          info: true
        }
        this.$message.error('选择供应商类别子节点')
        return false
      }

      if (
        basicInfo.isInnerMerchant &&
        basicInfo.isInnerMerchant === 1 &&
        !basicInfo.relMerchant
      ) {
        this.errorMap = {
          info: true
        }
        this.$message.error('选择商家名称')
        return false
      }

      // 清除错误
      this.errorMap = {}

      const contactData = this.$refs['contact-info'][0].$refs.table.tableData
      const attachData = this.$refs['attachment-info'][0].$refs.table.tableData
      const {
        deliveryAddressInfo: {
          area: [provinceCode, cityCode, regionCode],
          ...addressData
        },
        provinceCityRegion: [province, city, region]
      } = this.$refs['address-info'][0]

      const params = {
        businessLicenceUrl,
        businessLicenceName,
        enterpriseLegalFrontAttachPath,
        enterpriseLegalFrontAttachName,
        enterpriseLegalReverseAttachPath,
        enterpriseLegalReverseAttachName,
        registeredProvinceCode: registeredProvinceCode || '',
        registeredCityCode: registeredCityCode || '',
        registeredRegionCode: registeredRegionCode || '',
        registeredProvinceName:
          (registeredProvince && registeredProvince.name) || '',
        registeredCityName: (registeredCity && registeredCity.name) || '',
        registeredRegionName: (registeredRegion && registeredRegion.name) || '',
        ...basicInfo,
        contactInfo: contactData,
        attachInfo: attachData,
        addressInfo: [
          {
            provinceCode: provinceCode || '',
            cityCode: cityCode || '',
            regionCode: regionCode || '',
            provinceName: province.name || '',
            cityName: city.name || '',
            regionName: region.name || '',
            addressType: 0,
            ...addressData
          }
        ]
      }

      params.merchantId = this.merchant.merchantId
      params.merchantCode = this.merchant.merchantCode
      params.merchantName = this.merchant.merchantName
      params.dataSource = 1
      params.orgType = 7

      if (this.supplierId) {
        params.id = this.supplierId
        params.orgId = this.supplierId
      }

      if (
        params.isInnerMerchant &&
        params.isInnerMerchant === 1 &&
        params.relMerchant
      ) {
        params.innerOrgId = params.relMerchant.merchantId
      }

      var saveReturnData = await this.$opms.$api.supplier.saveOrUpdateDistribution(
        params
      )

      if (saveReturnData.code !== '0') {
        this.$message({
          message: saveReturnData.message,
          type: 'error'
        })
        return false
      }

      if (!this.supplierId && saveReturnData.data != null) {
        this.supplierId = saveReturnData.data
      }

      var saveAccountData = await this.saveSupplierAccount(supplierAccountInfo)
      if (saveAccountData.code !== '0') {
        this.$message({
          message: saveReturnData.message,
          type: 'error'
        })
        return false
      }

      this.$message({
        message: this.$t('供应商基本信息保存成功！'),
        type: 'success'
      })
      if (this.isAdd) {
        this.returnBack()
      }
    },
    saveSupplierAccount(supplierAccountInfo) {
      const { ...params } = supplierAccountInfo

      params.merchantId = this.supplierId
      params.merchantType = 7 // 供应商是7

      return this.$opms.$api.supplier.saveMerchantAccount(params)
    },
    allTabFormValidate() {
      const formValidates = []

      this.editableTabs.forEach(cnName => {
        const name = this.editComponents[cnName]
        formValidates.push(this.tabFormValidate(name))
      })

      return Promise.all(formValidates).then(result => {
        const allErrorMap = {}
        const allValid = []
        result.forEach(([err, valid, name]) => {
          if (err) {
            allErrorMap[name] = true
          }
          allValid.push(valid)
        })
        return Object.keys(allErrorMap).length > 0 ? [allErrorMap] : [false]
      })
    },
    tabFormValidate(name) {
      return new Promise((resolve, reject) => {
        // console.log('name', name)
        // console.log(' this.$refs[name][0].$refs', this.$refs[name][0].$refs)

        if (this.$refs[name][0].$refs.supplier) {
          this.$refs[name][0].$refs.supplier.validate(valid => {
            if (valid) {
              resolve([null, valid])
            } else {
              resolve([true, false, name])
            }
          })
        } else {
          resolve([null])
        }
      })
    },
    returnBack() {
      this.$portal.delActiveViewAndRefresh()
    }
  }
}
</script>

<style lang="scss" scoped>
.pg-supplier-detail-page {
  background: #fff;
  .has-error {
    color: red;
  }

  .el-tabs__header {
    margin: 0 0 32px;
  }
  .cp-list-search-area {
    margin-bottom: 0;
    box-shadow: none;
  }
  .cp-box {
    box-shadow: none;
    padding-bottom: 0;
  }
  /deep/ {
    .el-form.inner-form {
      margin: auto;
    }
    .el-tabs__content {
      padding-top: 16px;
    }
    .el-tabs .el-tabs__item {
      padding: 0 30px 3px 30px !important;
    }
    .el-tabs .el-tabs__item.is-active {
      padding: 0 30px 3px 30px !important;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item {
      border-top: 3px solid #fff;
    }
    .el-tabs--card > .el-tabs__header .el-tabs__item.is-active {
      border-top-color: var(--themeColor);
    }
  }
}
</style>
