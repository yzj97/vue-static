<template>
  <section class="pg-basicSummary-list">
    <el-card shadow="never" style="overflow: unset;">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_base_info') }}</span> <!-- 基本信息 -->
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('do_merchant_name') + ':'" :rules="rules.merchantId" prop="merchantId"> <!-- 销售商家 -->
            <el-select v-model="formData.merchantId" :popper-append-to-body="false" name="formData_merchantId" @change="loadMerchantStoreList">
              <el-option v-for="item in merchantIdList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_customer') + ':'" :rules="rules.customerId" prop="customerId"> <!-- 客户 -->
            <el-select v-model="formData.customerId" name="formData_customerId" filterable @change="changeCustomer">
              <el-option v-for="item in customerList" :label="item.customerName" :key="item.customerCode" :value="item.customerId" >
                <span style="float: left">{{ item.customerCode }}</span>
                <span style="float: right">{{ item.customerName }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('currencyType') + ':'" :rules="rules.coinType" prop="coinType"> <!-- 币别码 -->
            <el-select v-model="formData.coinType" name="formData_coinType" @change="cleanProduct">
              <el-option v-for="item in coinTypeListTemp" :key="item.targetCurrencyCode" :label="item.targetCurrencyNameLabel" :value="item.targetCurrencyCode" >
                {{ item.targetCurrencyName }}<span class="error"> {{ item.targetSymbol }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_store') + ':'" :rules="rules.storeId" prop="storeId"> <!-- 销售店铺 -->
            <el-select v-model="formData.storeId" name="formData_storeId" @change="modifyStore">
              <el-option v-for="item in merchantStoreList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
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
    }
  },
  data() {
    return {
      showModal: false,
      customerList: [],
      merchantStoreList: [],
      coinTypeListTemp: [],
      operatorId: null,
      merchantIdList: [],
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderSysSource: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        customerId: [
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
    async initCustomerList() {
      this.loadCustomerList()
    },
    _initMerchants() { // 初始化商家
      const vue = this
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchantIdList = data.data.listObj || []
        if (vue.merchantIdList.length === 1) {
          vue.formData.merchantId = vue.merchantIdList[0].merchantId

          vue.changeMerchant()
          vue.cleanProduct()
          vue.setMerchantName()

          vue.loadMerchantStoreList()
          vue.loadCustomerList()
        }
      })
    },
    async loadCustomerList() {
      this.customer = {}
      const params = {
        currentPage: 1,
        itemsPerPage: 1000,
        customerTypeList: ['4', '5', '6'] // 经销商，分销商，加盟商
      }
      if (this.formData.merchantId) {
        params.merchants = [{ merchantId: this.formData.merchantId }]
      } else {
        params.merchants = this.merchantIdList.reduce((r, i) => r.push({ merchantId: i.merchantId, merchantCode: i.merchantCode }), [])
      }
      const result = await this.$oms.$api.common.queryCustomerList(params)
      if (result.code === '0' && result.data && result.data.listObj) {
        this.customerList = result.data.listObj
      }
      this.changeCustomer()
    },
    changeCustomer() {
      this.customer = {}
      for (let i = 0; i < this.customerList.length; i++) {
        if (this.customerList[i].customerId === this.formData.customerId) {
          this.customer = this.customerList[i]
          break
        }
      }
      this.formData.customerName = this.customer.customerName
      this.formData.customerCode = this.customer.customerCode
      this.formData.customerType = this.customer.customerType
      // this.loadMerchantStoreList()
      this.$emit('changeUser', this.customer)
    },
    loadMerchantStoreList() { // 加载店铺列表
      this.cleanProduct()
      this.loadCustomerList()
      this.changeMerchant()
      this.setMerchantName()

      this.merchantStoreList = []
      const vue = this
      const queryParam = {
        merchantId: vue.formData.merchantId,
        currentPage: 1,
        itemsPerPage: 500,
        channelCode: '110004'
      }
      this.$oms.$api.common.merchantStoreList(queryParam).then((data) => {
        if (data.code === '0') {
          vue.merchantStoreList = data.data.listObj

          if (vue.merchantStoreList.length === 1) {
            vue.formData.storeId = vue.merchantStoreList[0].storeId
          }
          vue.modifyStore()
        }
      })
    },
    setMerchantName() {
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
    modifyStore() { // 切换店铺
      this.formData.storeName = null
      this.formData.storeCode = null
      let changeChannel = true
      if (this.formData.storeId) {
        this.merchantStoreList.forEach(element => {
          if (element.storeId === this.formData.storeId) {
            this.formData.storeName = element.storeName
            this.formData.storeCode = element.storeCode
            if (this.formData.orderSysSource === element.channelCode) {
              changeChannel = false
            }
            this.formData.orderSysSource = element.channelCode
            return
          }
        })
      } else {
        this.formData.orderSysSource = null
      }
      this.cleanProduct()

      if (changeChannel) {
        this.changeChannel()
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
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    changeChannel() {
      this.$emit('changeChannel')
    },
    changeMerchant() {
      this.$emit('changeMerchant')
    },
    init() {
      this._initCoinTypeList()
      this._initMerchants()
      this.initCustomerList()
    }
  }
}

</script>

<style lang="scss" scoped>
</style>
