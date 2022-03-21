<template>
  <div>
    <el-row>
      <el-col :span="24">
        <el-form v-if="!isEdit" label-width="240px">
          <el-row v-if="contractInfo.changeUserType != null && contractInfo.changeUserType != ''">
            <el-col :span="8">
              <el-form-item :label="$t('contract_changeInitiator')">
                <!-- 变更发起方 -->
                <span>{{ contractInfo.changeUserTypeStr }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('reasonsChange')">
                <!-- 变更原因 -->
                <span>{{ contractInfo.changeReason }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <!--  <el-col :span="8">
              &lt;!&ndash; 外贸合同 &ndash;&gt;
              <el-form-item :label="$t('contract_Trade')">
               <span>{{ contractInfo.foreignTradeShow === true ? $t('common_yes') : $t('common_no') }}</span>
             </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item :label="$t('contract_designatedCategory')">
                <!-- 指定合同商品类目 -->
                <span>{{ contractInfo.isMerchantCategory === true ? $t('common_yes') : $t('common_no') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('effectiveDate-ExpirationDate')">
                <!-- 生效日期-失效日期 -->
                <span>{{ contractInfo.effectiveTime | parseTime('{y}-{m}-{d}') }} - {{ contractInfo.expireTime | parseTime('{y}-{m}-{d}') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('contract_settlementWay')">
                <!-- 结汇方式 -->
                <span>{{ settlementWayMap[contractInfo.paymentChannel] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item v-show="false" :label="$t('contract_paymentMethod')" >
                <!-- 结算方式 -->
                <span>{{ settleMethodMap[0] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_paymentPeriodDay')">
                <!-- 允许进结算单天数 -->
                <span>{{ contractInfo.paymentPeriodDay + $t('common_unit_day ') }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <!--              <el-form-item :label="$t('contract_settleRuleName')">
                              &lt;!&ndash; 付款账期 &ndash;&gt;
                              <span>{{ contractInfo.paymentPeriodName }}</span>
                            </el-form-item>-->
            </el-col>
            <el-col
              v-if="contractInfo.contractType == 1 || contractInfo.contractType == 2"
              :span="8"
            >
              <el-form-item v-show="false" :label="$t('contract_supportBilling')">
                <!-- 支持开票 -->
                <span>{{ invoiceTypeMap[0] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_settlementCurrency')">
                <!-- 结算货币 -->
                <span>{{ contractInfo.currencyCode }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              v-if="contractInfo.contractType == 1 || contractInfo.contractType == 2"
              :span="8"
            >
              <el-form-item :label="$t('contract_formsCommerce')">
                <!-- 贸易方式 -->
                <span>{{ tradeMethodText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('contract_deliveryMode')">
                <!-- 成交方式 -->
                <span>{{ deliveryModeMap[contractInfo.deliveryMode] }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item
                v-if="contractInfo.contractType == 1 || contractInfo.contractType == 2"
                :label="$t('contract_deliveryPort')"
              >
                <!-- 装运港 -->
                <span>{{ contractInfo.deliveryPortText }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('contract_distributionChannel')">
                <!-- 运输方式 -->
                <span>{{ modeTransportMap[contractInfo.distributionChannel] }}</span>
              </el-form-item>
            </el-col>
            <el-col
              v-if="contractInfo.contractType == 1 || contractInfo.contractType == 2"
              :span="8"
            >
              <el-form-item :label="$t('contract_receivePort')">
                <!-- 抵运港 -->
                <span>{{ contractInfo.receivePortText }}</span>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :label="$t('common_remark')">
                <!-- 备注 -->
                <span>{{ contractInfo.remark }}</span>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <el-form
          v-if="isEdit"
          ref="contractInfo"
          :model="contractInfo"
          :rules="rules"
          label-width="240px"
        >
          <el-row>
            <!-- <el-col :span="8">
              <el-form-item :label="$t('contract_Trade')">
                <el-checkbox v-model="contractInfo.foreignTradeShow" name="contractInfo_foreignTradeShow"/>
              </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item :label="$t('contract_contractTime')" prop="validDate">
                <el-date-picker
                  v-model="contractInfo.validDate"
                  :start-placeholder="$t('contractProduct_field_effectiveTime')"
                  :end-placeholder="$t('contractProduct_field_expireTime')"
                  name="contractInfo_validDate"
                  range-separator="-"
                  type="daterange"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item :label="$t('contract_designatedCategory')">
                <el-checkbox v-model="contractInfo.isMerchantCategory" name="contractInfo_isMerchantCategory"/>
              </el-form-item>
            </el-col>
          </el-row>

          <ody-top-title v-show="false" :title="$t('supplier_finance')">
            <el-row>
              <el-col v-if="contractInfo.foreignTradeShow" :span="8">
                <el-form-item :label="$t('contract_settlementWay')">
                  <el-select v-model="contractInfo.paymentChannel" name="contractInfo_paymentChannel">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option v-for="(v, k) in settlementWayMap" :key="k" :label="v" :value="k"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_paymentMethod')" >
                  <el-select v-model="contractInfo.paymentMethod" name="contractInfo_paymentMethod">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option v-for="(v, k) in settleMethodMap" :key="k" :label="v" :value="k"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_settleRuleName')">
                  <el-select v-model="contractInfo.paymentPeriodId" name="contractInfo_paymentPeriodId" filterable>
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option
                      v-for="item in periodList"
                      :key="item.id"
                      :label="item.ruleName"
                      :value="item.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_supportBilling')" prop="invoiceType">
                  <el-radio-group v-model="contractInfo.invoiceType" name="contractInfo_invoiceType">
                    <el-radio v-for="(v, k) in invoiceTypeMap" :key="k" :label="k" :value="k">{{ v }}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
          </ody-top-title>

          <ody-top-title
            v-if="contractInfo.foreignTradeShow"
            :title="$t('contract_tradeInformation')"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('contract_settlementCurrency')" prop="currencyCode">
                  <el-select v-model="contractInfo.currencyCode" name="contractInfo_currencyCode">
                    <el-option
                      v-for="item in currencyList"
                      :key="item.currencyCode"
                      :label="item.currencyCode"
                      :value="item.currencyCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_formsCommerce')">
                  <el-select v-model="contractInfo.tradeMethod" name="contractInfo_tradeMethod">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option
                      v-for="item in tradeList"
                      :key="item.tradeMethodCode"
                      :label="item.tradeMethodCnName"
                      :value="item.tradeMethodCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_wayClosing')">
                  <el-select v-model="contractInfo.deliveryMode" name="contractInfo_deliveryMode">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option v-for="(v, k) in deliveryModeMap" :key="k" :label="v" :value="k"/>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('contract_modeTransport')">
                  <el-select v-model="contractInfo.distributionChannel" name="contractInfo_distributionChannel">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option v-for="(v, k) in modeTransportMap" :key="k" :label="v" :value="k"/>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_portShipment')">
                  <el-select v-model="contractInfo.deliveryPort" name="contractInfo_deliveryPort">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option
                      v-for="item in portList"
                      :key="item.portCode"
                      :label="item.portCnName"
                      :value="item.portCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_portArrival')">
                  <el-select v-model="contractInfo.receivePort" name="contractInfo_receivePort">
                    <el-option value>{{ $t('please_choose') }}</el-option>
                    <el-option
                      v-for="item in portList"
                      :key="item.portCode"
                      :label="item.portCnName"
                      :value="item.portCode"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
          </ody-top-title>

          <ody-top-title
            v-if="contractInfo.isMerchantCategory"
            :title="$t('contract_categoryName')"
          >
            <el-form-item>
              <el-checkbox-group
                v-model="contractInfo.checkedContractCategory"
                name="contractInfo_checkedContractCategory">
                <el-checkbox
                  v-for="productCategory in productCategoryList"
                  :label="productCategory"
                  :key="productCategory.categoryCode"
                >{{ productCategory.categoryName }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </ody-top-title>

          <el-row>
            <el-col>
              <el-form-item :label="$t('common_remark')">
                <el-input
                  v-model="contractInfo.remark"
                  name="contractInfo_remark"
                  type="textarea"
                  maxlength="255"
                  show-word-limit
                />
              </el-form-item>
            </el-col>
          </el-row>

          <div style="text-align: center;">
            <ody-button
              name="OpmsJxContractList15_submitBasicInfo"
              type="primary"
              size="medium"
              code="OpmsJxContractList15"
              @click="submitBasicInfo"
            >{{ $t('common_save') }}
            </ody-button>
          </div>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    contractInfo: {
      type: Object,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    productCategoryList: {
      type: Object,
      default: null
    },
    periodList: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      deliveryPortText: null,
      receivePortText: null,
      tradeMethodText: null,
      settlementWayMap: {},
      settleMethodMap: { 3: '账期结算' },
      invoiceTypeMap: { 2: '普票 ' },
      deliveryModeMap: {},
      modeTransportMap: {},
      contractPropertyMap: {},
      currencyList: [],
      tradeList: [],
      portList: [],
      isIndeterminate: true,
      rules: {
        validDate: [
          {
            required: true,
            message: this.$t('please_choose_the_time_range'),
            trigger: 'change'
          }
        ],

        /* paymentMethod: [
           {
             required: true,
             message: this.$t('common_choose_please'),
             trigger: 'change'
           }
         ],*/
        /* invoiceType: [
           {
             required: true,
             message: this.$t('common_choose_please'),
             trigger: 'change'
           }
         ],*/
        currencyCode: [
          {
            required: true,
            message: this.$t('common_choose_please'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const vue = this
      vue.initCode()
      vue.initCurrencyList()
      vue.initTradeList()
      vue.initPortList()
    },
    initCode() {
      const vue = this
      vue.$opms.$api.code
        .selectMulti({
          categories: [
            'SETTLEMENT_WAY',
            'SETTLEMENT_METHOD',
            'INVOICE_TYPE_OPMS',
            'CONTRACT_DELIVERY_MODE',
            'MODE_TRANSPORT'
          ]
        })
        .then(res => {
          vue.settlementWayMap = res.data.SETTLEMENT_WAY
          // vue.settleMethodMap = res.data.SETTLEMENT_METHOD
          // vue.invoiceTypeMap = res.data.INVOICE_TYPE_OPMS
          console.log(vue.invoiceTypeMap)
          vue.deliveryModeMap = res.data.CONTRACT_DELIVERY_MODE
          vue.modeTransportMap = res.data.MODE_TRANSPORT
        })
    },
    initCurrencyList() {
      const vue = this
      vue.$opms.$api.common.queryCurrencyList({}).then(res => {
        if (res && res.code === '0') {
          vue.currencyList = res.data
        }
      })
    },
    initTradeList() {
      const vue = this
      vue.$opms.$api.jxContract.tradeDictionary({}).then(res => {
        if (res && res.code === '0') {
          vue.tradeList = res.data
          for (let i = 0; i < res.data.length; i++) {
            if (vue.contractInfo.tradeMethod === res.data[i].tradeMethodCode) {
              vue.contractInfo.tradeMethodText = res.data[i].tradeMethodCnName
              vue.tradeMethodText = res.data[i].tradeMethodCnName
            }
          }
        }
      })
    },
    initPortList() {
      const vue = this
      vue.$opms.$api.common.getPortList({}).then(res => {
        if (res && res.code === '0') {
          for (let i = 0; i < res.data.length; i++) {
            if (vue.contractInfo.deliveryPort === res.data[i].portCode) {
              vue.contractInfo.deliveryPortText = res.data[i].portCnName
              vue.deliveryPortText = res.data[i].portCnName
            }
            if (vue.contractInfo.receivePort === res.data[i].portCode) {
              vue.contractInfo.receivePortText = res.data[i].portCnName
              vue.receivePortText = res.data[i].portCnName
            }
          }
          vue.portList = res.data
        }
      })
    },
    submitBasicInfo() {
      const vue = this
      vue.$refs['contractInfo'].validate(valid => {
        vue.$emit('ok', valid)
      })
    },
    validateForm() {
      const vue = this
      let result = false
      vue.$refs['contractInfo'].validate(valid => {
        if (valid) {
          result = true
        } else {
          return false
        }
      })
      return result
    }
  }
}
</script>

<style scoped>
</style>
