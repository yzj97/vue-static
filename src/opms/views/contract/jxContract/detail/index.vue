<template>
  <section>
    <ContractInfo
      v-if="contractInfo.contractCode"
      ref="contractInfo"
      :contract-info.sync="contractInfo"
      :platform-id.sync="platformId"
      :is-edit="isEdit"
      :contract-property-map.sync="contractPropertyMap"
    />

    <el-card>
      <el-tabs v-model="activeName" name="activeName" @tab-click="handleClick">
        <el-tab-pane :label="$t('essentialInformation')" name="0">
          <BasicInfo
            v-if="contractInfo.contractCode"
            ref="basicInfo"
            :contract-info.sync="contractInfo"
            :is-edit.sync="isEdit"
            :product-category-list.sync="productCategoryList"
            :period-list.sync="periodList"
            @ok="submitContract"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('contract_contractGoodsDy')" name="1">
          <Product v-if="id" :contract-id.sync="id" />
        </el-tab-pane>
        <el-tab-pane :label="$t('contract_feeBillInfo')" name="2">
          <Fee v-if="id" :contract-id.sync="id" :is-edit.sync="isEdit" />
        </el-tab-pane>
        <el-tab-pane :label="$t('contract_accessory')" name="3">
          <Attachment
            v-if="contractInfo.contractCode"
            :contract-id.sync="id"
            :contract-code.sync="contractInfo.contractCode"
            :is-edit.sync="isEdit"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('contract_template')" name="4">
          <Templates
            v-if="contractInfo.merchantId"
            :contract-id.sync="id"
            :contract-type.sync="contractInfo.contractType"
            :is-edit.sync="isEdit"
            :merchant-id.sync="contractInfo.merchantId"
            :contract="contractInfo"
          />
        </el-tab-pane>
        <el-tab-pane :label="$t('operationLog')" name="5">
          <Log v-if="contractInfo.merchantId" :contract-id.sync="id" />
        </el-tab-pane>
        <el-tab-pane :label="$t('contacts')" name="6">
          <Contact v-if="id" :contract-id.sync="id" :is-edit.sync="isEdit" />
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <ody-fixed>
      <ody-button
        v-if="contractInfo.contractStatus === 0"
        name="OpmsJxContractList06_confirm"
        size="small"
        code="OpmsJxContractList06"
        @click="confirm"
      >{{ $t('common_confirm') }}</ody-button>
      <ody-button
        v-if="contractInfo.contractStatus === 0"
        name="OpmsJxContractList07_deletes"
        size="small"
        code="OpmsJxContractList07"
        @click="deletes"
      >{{ $t('common_delete') }}</ody-button>
      <el-button name="returnBack" size="small" @click="returnBack">{{ $t('common_return') }}</el-button>
    </ody-fixed>
  </section>
</template>
<script>
import ContractInfo from '@/components/contract/contractInfo'
import BasicInfo from '@/components/contract/basicInfo'
import Product from '@/components/contract/product'
import Fee from '@/components/contract/fee'
import Attachment from '@/components/contract/attachment'
import Templates from '@/components/contract/templates'
import Log from '@/components/contract/log'
import Contact from '@/components/contract/contact'

export default {
  name: 'OpmsJxContractDetail',
  components: {
    ContractInfo,
    BasicInfo,
    Product,
    Fee,
    Attachment,
    Templates,
    Log,
    Contact
  },
  data() {
    return {
      isEdit: false,
      id: null,
      activeName: '0',
      contractInfo: {
        isMerchantCategory: false,
        foreignTradeShow: false,
        checkedContractCategory: [],
        contractCategoryDTOS: [],
        validDate: [],
        paymentMethod: '',
        contractProperty: '',
        invoiceType: '2'
      },
      productCategoryList: [],
      periodList: [],
      contractTypeMap: {},
      contractStatusMap: {},
      contractPropertyMap: {}
    }
  },
  mounted() {
    const vue = this
    vue.$opms.$api.common.getDomainInfo().then(res => {
      if (res.data && res.code === '0') {
        vue.platformId = res.data.platformId
      }
    })
    vue.init()
  },
  methods: {
    async init() {
      const vue = this
      const params = vue.$route.params
      vue.id = params.id
      vue.isEdit = params.isEdit
      await vue._initCodes()
      await vue.initProductCategoryList()
      vue.initPeriodList()
      vue.initContract()
    },
    _initCodes() {
      const vue = this
      vue.$opms.$api.code
        .selectMulti({
          categories: ['CONTRACT_TYPE', 'CONTRACT_STATUS', 'CONTRACT_PROPERTY']
        })
        .then(res => {
          vue.contractTypeMap = res.data.CONTRACT_TYPE
          vue.contractStatusMap = res.data.CONTRACT_STATUS
          vue.contractPropertyMap = res.data.CONTRACT_PROPERTY
        })
    },
    initPeriodList() {
      const vue = this
      const params = {
        isValid: 1,
        settleType: 1,
        limit: 2000,
        offset: 0
      }
      vue.$opms.$api.common
        .selectComSettlePeriodList(params)
        .then(res => {
          if (res && res.code === '0') {
            vue.periodList = res.data.listObj
          }
        })
    },
    initContract() {
      const vue = this
      if (vue.id != null) {
        this.$opms.$api.jxContract.findById({ id: vue.id }).then(res => {
          if (res.code === '0') {
            res.data.contractTypeText =
              vue.contractTypeMap[res.data.contractType]
            res.data.contractStatusText =
              vue.contractStatusMap[res.data.contractStatus]
            if (res.data.contractStatus !== 0) {
              vue.isEdit = false
            }
            res.data.checkedContractCategory = []
            res.data.invoiceType = res.data.invoiceType
              ? res.data.invoiceType + ''
              : null
            res.data.isMerchantCategory = false
            res.data.validDate = []
            vue.contractInfo = res.data
            // 合同详情基本信息逻辑处理
            if (
              vue.contractInfo.contractCategoryDTOS != null &&
              vue.contractInfo.contractCategoryDTOS.length > 0
            ) {
              vue.contractInfo.isMerchantCategory = true
              if (
                vue.productCategoryList &&
                vue.productCategoryList.length > 0
              ) {
                for (
                  let i = 0;
                  i < vue.contractInfo.contractCategoryDTOS.length;
                  i++
                ) {
                  const checkedCategory =
                    vue.contractInfo.contractCategoryDTOS[i]
                  for (let j = 0; j < vue.productCategoryList.length; j++) {
                    const category = vue.productCategoryList[j]
                    console.log(category.categoryTreeId)
                    category.categoryId = category.categoryTreeId
                    if (
                      checkedCategory.categoryCode === category.categoryCode
                    ) {
                      vue.contractInfo.checkedContractCategory.push(category)
                      break
                    }
                  }
                }
              }
            } else {
              vue.contractInfo.isMerchantCategory = false
            }
            if (vue.contractInfo.effectiveTime && vue.contractInfo.expireTime) {
              vue.contractInfo.validDate = [
                vue.contractInfo.effectiveTime,
                vue.contractInfo.expireTime
              ]
            }
          }
        })
      }
    },
    async initProductCategoryList() {
      const vue = this
      const res = await vue.$opms.$api.common.categoryList({})
      if (res && res.code === '0') {
        vue.productCategoryList = res.data
      }
    },
    handleClick(tab, event) {
      this.activeName = tab.name
    },
    returnBack() {
      const vue = this
      vue.$portal.delActiveViewAndRefresh()
    },
    submitContract(valid) {
      const vue = this
      const result = vue.$refs['contractInfo'].validateForm()

      if (result && valid) {
        const params = vue.getContractParams()
        vue.$opms.$api.jxContract.updateContractInfo(params).then(res => {
          if (res && res.code === '0') {
            vue.initContract()
            vue.$message.success(vue.$t('save_success'))
          }
        })
      }
    },
    getContractParams() {
      const vue = this
      const params = {
        contractCode: vue.contractInfo.contractCode,
        contractProperty: vue.contractInfo.contractProperty,
        currencyCode: vue.contractInfo.currencyCode,
        deliveryMode: vue.contractInfo.deliveryMode,
        deliveryPort: vue.contractInfo.deliveryPort,
        distributionChannel: vue.contractInfo.distributionChannel,
        effectiveTime: vue.contractInfo.validDate[0],
        expireTime: vue.contractInfo.validDate[1],
        id: vue.contractInfo.id,
        invoiceType: vue.contractInfo.invoiceType,
        isForeignTrade: vue.contractInfo.foreignTradeShow ? 1 : 0,
        paymentChannel: vue.contractInfo.paymentChannel,
        paymentMethod: vue.contractInfo.paymentMethod,
        receivePort: vue.contractInfo.receivePort,
        remark: vue.contractInfo.remark,
        tradeMethod: vue.contractInfo.tradeMethod,
        contractCategoryDTOS: vue.contractInfo.checkedContractCategory
      }

      for (const item of vue.periodList) {
        if (item.id === vue.contractInfo.paymentPeriodId) {
          params.paymentPeriodId = item.id
          params.paymentPeriodName = item.ruleName
          params.paymentPeriodType = item.settlePeriodType || 1
          params.paymentPeriodDay = item.cycleDay || 0
          break
        }
      }
      if (!vue.contractInfo.paymentPeriodId) {
        params.paymentPeriodType = 1
        params.paymentPeriodDay = 0
      }

      return params
    },
    confirm() {
      const vue = this
      if (!vue.contractInfo.contractProperty) {
        vue.$refs['contractInfo'].validateForm()
        return
      }

      const result = vue.$refs['basicInfo'].validateForm()
      if (result) {
        vue
          .$confirm(
            vue.$t('confirm_contract_confirm'),
            vue.$t('operation_hints'),
            {
              confirmButtonText: vue.$t('common_confirm'),
              cancelButtonText: vue.$t('common_cancel'),
              type: 'warning'
            }
          )
          .then(() => {
            const params = vue.getContractParams()
            vue.$opms.$api.jxContract.updateContractInfo(params).then(res => {
              if (res && res.code === '0') {
                vue.$opms.$api.jxContract
                  .confirmContractInfo({ id: vue.id })
                  .then(res => {
                    if (res && res.code === '0') {
                      vue.initContract()
                      vue.$message({
                        type: 'success',
                        message: vue.$t('successful_operation')
                      })
                    }
                  })
              }
            })
          })
      }
    },
    deletes() {
      const vue = this
      vue
        .$confirm(
          vue.$t('common_msg_confirm_delete'),
          vue.$t('common_msg_delete'),
          {
            confirmButtonText: vue.$t('common_confirm'),
            cancelButtonText: vue.$t('common_cancel'),
            type: 'warning'
          }
        )
        .then(() => {
          vue.$opms.$api.jxContract
            .deleteContractInfo({ id: vue.id })
            .then(res => {
              if (res && res.code === '0') {
                vue.$portal.delActiveViewAndRefresh()
                vue.$message({
                  type: 'success',
                  message: vue.$t('delete_success')
                })
              }
            })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
