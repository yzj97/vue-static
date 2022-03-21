<template>
  <section class="pg-basicSummary-list">
    <el-card shadow="never">
      <!-- 经销商下单 -->
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_base_info') }}</span><!--基本信息-->
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_order_syssource')" required><!--销售渠道-->
            <span>{{ $t('distributor_platform') }}</span><!--分销平台-->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('经销商')" :rules="rules.customerId" prop="customerId" ><!--经销商-->
            <el-select v-model="formData.customerId" name="formData_customerId" @change="loadMerchantIdList">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in distributorList" :label="item.customerName" :key="item.customerId" :value="item.customerId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('distributor_code')"><!--经销商编码-->
            <span>{{ formData.distributorCode }}</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('do_merchant_name')" :rules="rules.merchantId" prop="merchantId" > <!-- 销售商家 -->
            <el-select v-model="formData.merchantId" name="formData_merchantId" @change="loadStoreIdList">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in merchantIdList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_store')" :rules="rules.storeId" prop="storeId"> <!-- 销售店铺 -->
            <el-select v-model="formData.storeId" name="formData_storeId" @change="modifyStore">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in storeIdList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('currencyType')" :rules="rules.coinType" prop="coinType"> <!-- 币别码 -->
            <el-select v-model="formData.coinType" name="formData_coinType" @change="cleanProduct">
              <el-option v-for="item in coinTypeListTemp" :key="item.targetCurrencyCode" :label="item.targetCurrencyNameLabel" :value="item.targetCurrencyCode" >
                {{ item.targetCurrencyName }}<span class="error"> {{ item.targetSymbol }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-card>
  </section>
</template>
<script>

export default {
  props: {
    collect: {
      type: Object,
      default: null
    },
    formData: {
      type: Object,
      default: null
    },
    forCustomer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      distributorList: [],
      merchantIdList: [],
      storeIdList: [],
      coinTypeListTemp: [],
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        customerId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        coinType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async _initDistributorList() { // 初始化经销商列表
      const result = await this.$oms.$api.common.disOrgInfoList({ 'currentPage': 1, 'itemsPerPage': 1000, 'orgType': 4 })
      if (result.code === '0' && result.data && result.data.listObj) {
        this.distributorList = result.data.listObj
      } else {
        console.info('获取经销商信息异常')
      }
    },
    async loadMerchantIdList() { // 切换经销商，获取商家列表
      this.setDistributorInfo()
      this.cleanProduct()
      const vue = this
      vue.storeIdList = []
      vue.merchantIdList = []
      vue.formData.merchantId = null
      vue.formData.storeId = null
      if (!vue.formData.customerId) {
        return
      }

      const result = await this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 })
      if (result.code === '0') {
        this.merchantIdList = result.data.listObj
      } else {
        console.info('获取商家信息异常')
      }
    },
    async _initCoinTypeList() { // 初始化币种信息
      const result = await this.$oms.$api.common.getCurrencies({})
      if (result.code === '0') {
        this.coinTypeList = result.data
        this.modifyCoinTypeList()
        this.coinTypeListTemp = this.coinTypeList.map((item, index) => {
          item.targetCurrencyNameLabel = item.targetCurrencyName + ' ' + item.targetSymbol
          return item
        })

        this.collect.coinTypeMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.targetCurrencyName; return m }, {})
        this.collect.coinTypeSignMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.targetSymbol; return m }, {})
        this.collect.coinExchangeMap = result.data.reduce((m, i) => { m[i.targetCurrencyCode] = i.exchangeRate; return m }, {})
      }
    },
    modifyCoinTypeList() {
      const result = []
      for (let index = 0; index < this.coinTypeList.length; index++) {
        if (this.coinTypeList[index].targetCurrencyCode === 'CNY') {
          result.push(this.coinTypeList[index])
        }
      }

      if (result.length === 0) {
        this.coinTypeList.push({
          targetCurrencyCode: 'CNY',
          targetCurrencyName: '人民币',
          targetSymbol: '￥',
          exchangeRate: 1
        })
      }
    },
    loadStoreIdList() { // 切换商家，获取店铺列表
      this.cleanProduct()
      this.setMerchantName()
      const vue = this
      vue.storeIdList = []
      vue.formData.storeId = null
      if (!vue.formData.merchantId || !vue.formData.orderSysSource) {
        return
      }
      const queryParam = {
        merchantId: vue.formData.merchantId,
        channelCode: vue.formData.orderSysSource,
        currentPage: 1,
        itemsPerPage: 500
      }
      this.$oms.$api.common.storeList(queryParam).then((data) => {
        if (data.code === '0') {
          vue.storeIdList = data.data.listObj
        }
      })
    },
    modifyStore() { // 切换店铺
      this.formData.storeName = null
      if (this.formData.storeId) {
        this.storeIdList.forEach(element => {
          if (element.storeId === this.formData.storeId) {
            this.formData.storeName = element.storeName
            return
          }
        })
      }
      this.cleanProduct()
    },
    setDistributorInfo() { // 设置选中的经销商其他信息
      this.formData.customerName = null
      this.formData.customerCode = null
      this.formData.distributorCode = null
      if (this.formData.customerId) {
        this.distributorList.forEach(element => {
          if (element.customerId === this.formData.customerId) {
            this.formData.customerName = element.customerName
            this.formData.customerCode = element.customerCode
            this.formData.distributorCode = element.customerCode
            return
          }
        })
      }
    },
    setMerchantName() { // 设置选中的商家名
      this.formData.merchantName = null
      if (this.formData.merchantId) {
        this.merchantIdList.forEach(element => {
          if (element.merchantId === this.formData.merchantId) {
            this.formData.merchantName = element.merchantName
            return
          }
        })
      }
    },
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    init() {
      this._initDistributorList()
      this._initCoinTypeList()
      // 客户类型为经销商
      this.formData.customerType = 4
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
