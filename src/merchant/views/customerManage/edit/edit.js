
import DistributorBasic from '@/components/distributorBasic'
import DistributorFinance from '@/components/distributorFinance'
import DistributorAccount from '@/components/distributorAccount'
import DistributorAddress from '@/components/distributorAddress'

export default {
  name: 'MerchantCustomerManageEdit',
  components: {
    DistributorBasic,
    DistributorFinance,
    DistributorAccount,
    DistributorAddress
  },
  data() {
    return {
      activeName: 'first',
      isEdit: true,
      editId: null,
      accountId: null,
      qualificationId: null,
      distributionObj: null,
      loginObj: null,
      accountObj: null,
      qualificationObj: null
    }
  },
  created() {
    const { isEdit } = this.$route.params
    this.editId = +this.$route.params.id
    if (+isEdit === 1) {
      this.isEdit = true
    } else {
      this.isEdit = false
    }
    if (this.editId !== null && this.editId !== -1) {
      this.queryDistributionDetailInfo()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {},
    queryDistributionDetailInfo() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.queryDistributionDetailInfo({ orgId: this.editId }).then(res => {
        this.distributionObj = res.data
        if (res.data.loginUser) {
          this.queryUserAccount(res.data.loginUser, res.data.orgType)
        }
        this.queryAccountInfo()
        this.queryQualificationo()
      })
    },
    firstSave() {
      const vue = this
      const distributorService = this.$merchant.$api.distributorService
      this.$refs['distributorBasic'].$refs['basicFormRef'].validate((basicValid) => {
        if (basicValid) {
          this.$refs['distributorBasic'].$refs['contactFormRef'].validate((valid) => {
            if (valid) {
              var saveParam = {}
              saveParam.orgCode = this.$refs.distributorBasic.basicForm.orgCode
              saveParam.orgName = this.$refs.distributorBasic.basicForm.orgName
              saveParam.orgType = this.$refs.distributorBasic.basicForm.orgType
              saveParam.departmentId = this.$refs.distributorBasic.basicForm.departmentId
              saveParam.merchantId = this.$refs.distributorBasic.basicForm.merchantId
              saveParam.enterpriseName = this.$refs.distributorBasic.companyForm.enterpriseName
              saveParam.legalRepresentativeName = this.$refs.distributorBasic.companyForm.legalRepresentativeName
              saveParam.legalRepresentativeCertificateType = this.$refs.distributorBasic.companyForm.legalRepresentativeCertificateType
              saveParam.legalRepresentativeCertificateNo = this.$refs.distributorBasic.companyForm.legalRepresentativeCertificateNo
              saveParam.businessLicenceNo = this.$refs.distributorBasic.companyForm.businessLicenceNo
              saveParam.enterpriseType = this.$refs.distributorBasic.companyForm.enterpriseType
              saveParam.businessScope = this.$refs.distributorBasic.companyForm.businessScope
              saveParam.businessLicencePeriodBegin = this.$refs.distributorBasic.companyForm.businessLicencePeriodBegin
              saveParam.businessLicencePeriodEnd = this.$refs.distributorBasic.companyForm.businessLicencePeriodEnd
              saveParam.registeredDetailAddress = this.$refs.distributorBasic.companyForm.registeredDetailAddress
              saveParam.registeredCapital = this.$refs.distributorBasic.companyForm.registeredCapital
              saveParam.enterpriseStaffNums = this.$refs.distributorBasic.companyForm.enterpriseStaffNums
              saveParam.contactName = this.$refs.distributorBasic.contactForm.contactName
              saveParam.contactMobileNo = this.$refs.distributorBasic.contactForm.contactMobileNo
              saveParam.contactEmail = this.$refs.distributorBasic.contactForm.contactEmail
              saveParam.contactDetailAddress = this.$refs.distributorBasic.contactForm.contactDetailAddress
              saveParam.contactProvinceCode = this.$refs.distributorBasic.contactForm.contactProvinceCode
              saveParam.contactCityCode = this.$refs.distributorBasic.contactForm.contactCityCode
              saveParam.contactRegionCode = this.$refs.distributorBasic.contactForm.contactRegionCode
              saveParam.registeredProvinceCode = this.$refs.distributorBasic.companyForm.registeredProvinceCode
              saveParam.registeredCityCode = this.$refs.distributorBasic.companyForm.registeredCityCode
              saveParam.registeredRegionCode = this.$refs.distributorBasic.companyForm.registeredRegionCode
              saveParam.status = 1
              if (this.editId === -1) {
                distributorService.addDistributionInfo(saveParam).then(res => {
                  vue.$message({
                    type: 'success',
                    message: '新增成功！'
                  })
                  this.editId = res.data
                })
              } else {
                saveParam.orgId = this.editId
                distributorService.updateDistributionInfo(saveParam).then(res => {
                  vue.$message({
                    type: 'success',
                    message: '更新成功！'
                  })
                })
              }
            } else {
              vue.$message({
                type: 'error',
                message: '请输入必填项！'
              })
            }
          })
        } else {
          vue.$message({
            type: 'error',
            message: '请输入必填项！'
          })
        }
      })
    },
    secondSave() {
      const vue = this
      var flag = true
      this.$refs['distributorBasic'].$refs['basicFormRef'].validate((basicValid) => {
        if (basicValid) {
          this.$refs['distributorBasic'].$refs['contactFormRef'].validate((valid) => {
            if (!valid) {
              flag = false
              return
            }
          })
        } else {
          flag = false
          return
        }
      })

      if (!flag || this.editId === -1) {
        vue.$message({
          type: 'error',
          message: vue.$t('基本信息未保存')
        })
        return
      }

      const distributorService = this.$merchant.$api.distributorService
      this.$refs['distributorFinance'].$refs['settlementFormRef'].validate((valid) => {
        if (valid) {
          var saveAccount = {}
          saveAccount.merchantId = this.editId
          saveAccount.merchantType = this.$refs.distributorBasic.basicForm.orgType
          var accountType = this.$refs.distributorFinance.settlementForm.accountType
          saveAccount.receiverAccountType = accountType
          if (accountType === 1) {
            saveAccount.receiverAccountNo = this.$refs.distributorFinance.settlementForm.alipayAccount
          } else if (accountType === 6) {
            saveAccount.receiverAccountNo = this.$refs.distributorFinance.settlementForm.wechatAccount
          } else {
            saveAccount.receiverAccountNo = this.$refs.distributorFinance.settlementForm.bankAccount
            saveAccount.receiverBankName = this.$refs.distributorFinance.settlementForm.depositBank
            saveAccount.receiverSubBankName = this.$refs.distributorFinance.settlementForm.depositBankOutlets
            saveAccount.receiverEnterpriseName = this.$refs.distributorFinance.settlementForm.accountName
          }
          if (this.accountId != null) {
            saveAccount.id = this.accountId
          }
          distributorService.saveMerchantAccount(saveAccount).then(() => {
            if (this.accountId === null) {
              distributorService.selectMerchantAccount({ merchantId: this.editId }).then(res => {
                this.accountId = res.data.id
              })
            }
          })
        } else {
          vue.$message({
            type: 'error',
            message: '请输入必填项！'
          })
        }
      })
      this.$refs['distributorFinance'].$refs['taxationFormRef'].validate((valid) => {
        if (valid) {
          var saveQualification = {}
          saveQualification.invoiceDrawerId = this.editId
          saveQualification.invoiceDrawerCode = this.$refs.distributorBasic.basicForm.orgCode
          saveQualification.invoiceDrawerName = this.$refs.distributorBasic.basicForm.orgName
          saveQualification.drawerType = this.$refs.distributorBasic.basicForm.orgType
          saveQualification.invoiceTitle = this.$refs.distributorFinance.taxationForm.invoicePayabl
          saveQualification.invoiceType = 2
          saveQualification.taxpayerIdentificationCode = this.$refs.distributorFinance.taxationForm.payDutyCode
          saveQualification.provinceCode = this.$refs.distributorFinance.taxationForm.registeredProvinceCode
          saveQualification.cityCode = this.$refs.distributorFinance.taxationForm.registeredCityCode
          saveQualification.regionCode = this.$refs.distributorFinance.taxationForm.registeredRegionCode
          saveQualification.detailAddress = this.$refs.distributorFinance.taxationForm.registeredDetailAddress
          saveQualification.registerAddress = this.$refs.distributorFinance.taxationForm.registeredDetailAddress
          saveQualification.registerPhone = this.$refs.distributorFinance.taxationForm.contactPhone
          saveQualification.bankDeposit = this.$refs.distributorFinance.taxationForm.depositBank
          saveQualification.bankAccount = this.$refs.distributorFinance.taxationForm.enterpriseName
          saveQualification.email = this.$refs.distributorFinance.taxationForm.email

          if (this.qualificationId != null) {
            saveQualification.id = this.qualificationId
          }
          distributorService.saveQualification(saveQualification).then(() => {
            vue.$message({
              type: 'success',
              message: '更新成功！'
            })
            if (this.qualificationId === null) {
              distributorService.getInvoiceQualification({ invoiceDrawerId: this.editId }).then(res => {
                this.qualificationId = res.data.id
              })
            }
          })
        } else {
          vue.$message({
            type: 'error',
            message: '请输入必填项！'
          })
        }
      })
    },
    thirdSave() {
      const vue = this
      const distributorService = this.$merchant.$api.distributorService
      this.$refs['distributorAccount'].$refs['accountFormRef'].validate((valid) => {
        if (valid) {
          var userPara = {}
          userPara.userName = this.$refs.distributorAccount.accountForm.accountNumber
          userPara.identityCardName = this.$refs.distributorAccount.accountForm.name
          userPara.mobile = this.$refs.distributorAccount.accountForm.mobileNo
          userPara.email = this.$refs.distributorAccount.accountForm.email
          userPara.remarks = this.$refs.distributorAccount.accountForm.remark
          userPara.password = this.$refs.distributorAccount.accountForm.password
          userPara.password1 = this.$refs.distributorAccount.accountForm.password1
          userPara.entityId = this.editId
          userPara.identityType = this.$refs.distributorBasic.basicForm.orgType
          if (userPara.identityType === 4) {
            userPara.identitySubType = 41
          } else if (userPara.identityType === 5) {
            userPara.identitySubType = 51
          } else if (userPara.identityType === 6) {
            userPara.identitySubType = 61
          }
          if (this.loginObj != null) {
            distributorService.updateEmployee(userPara).then(res => {
              vue.$message({
                type: 'success',
                message: '更新成功！'
              })
            })
          } else {
            distributorService.addEmployee(userPara).then(res => {
              vue.$message({
                type: 'success',
                message: '新增成功！'
              })
              this.loginObj = {}
              this.loginObj.userName = this.$refs.distributorAccount.accountForm.accountNumber
              this.loginObj.identityCardName = this.$refs.distributorAccount.accountForm.name
              this.loginObj.mobile = this.$refs.distributorAccount.accountForm.mobileNo
              this.loginObj.email = this.$refs.distributorAccount.accountForm.email
              this.loginObj.remarks = this.$refs.distributorAccount.accountForm.remark

              var distributionParam = {}
              distributionParam.orgId = this.editId
              distributionParam.loginUser = userPara.userName
              distributionParam.loginUserId = res.data
              distributorService.updateLoginUser(distributionParam)
            })
          }
        } else {
          vue.$message({
            type: 'error',
            message: '请输入必填项！'
          })
        }
      })
    },
    queryUserAccount(loginUser, orgType) {
      const distributorService = this.$merchant.$api.distributorService
      var userQuery = {}
      if (orgType === 4) {
        userQuery.identitySubType = 41
      } else if (orgType === 5) {
        userQuery.identitySubType = 51
      } else if (orgType === 6) {
        userQuery.identitySubType = 61
      }
      userQuery.currentPage = 1
      userQuery.itemsPerPage = 10
      userQuery.userName = loginUser
      distributorService.queryEmployee(userQuery).then(res => {
        this.loginObj = res.data
      })
    },
    queryAccountInfo() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.selectMerchantAccount({ merchantId: this.editId }).then(res => {
        if (res.data !== null) {
          console.log(res)
          this.accountObj = res.data
          this.accountId = this.accountObj.id
        }
      })
    },
    queryQualificationo() {
      const distributorService = this.$merchant.$api.distributorService
      distributorService.getInvoiceQualification({ invoiceDrawerId: this.editId }).then(res => {
        if (res.data !== null) {
          this.qualificationObj = res.data
          this.qualificationId = this.qualificationObj.id
        }
      })
    }
  }
}
