<template>
  <section class="pg-basic-summary-list">
    <el-row>
      <el-col :span="8">
        <el-form-item :label="$t('商家')" :rules="rules.merchantId" prop="merchantId">
          <el-select v-model="formData.merchantId" name="formData_merchantId">
            <el-option v-for="item in merchantIdList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('供应商')" :rules="rules.supplierId" prop="supplierId">
          <ody-supplier-choose v-model="formData.supplierId" :disabled="showSupplierModal" :merchant-id="formData.merchantId" :selected.sync="collect.selected" value-key="orgId" placeholder="请选择" @ok="setCoinType" @clear="clearSupplier" />
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item :label="$t('结算币种')" :rules="rules.coinType" prop="coinType"> <!-- 币别码 -->
          <el-select v-model="formData.coinType" :disabled="enableCoinType" name="formData_coinType" @change="cleanProduct">
            <el-option v-for="item in coinTypeListTemp" :key="item.targetCurrencyCode" :label="item.targetCurrencyNameLabel" :value="item.targetCurrencyCode" >
              {{ item.targetCurrencyName }}<span class="error"> {{ item.targetSymbol }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item :label="$t('任务类型')" :rules="rules.receiveType" prop="receiveType">
          <el-select v-model="formData.receiveType" :placeholder="$t('全部')" name="search_importType">
            <el-option
              v-for="(value, key) in receiveTypeMap"
              :key="key"
              :label="value"
              :value="key"
            />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item v-if="formData.receiveType === '0'" :label="$t('采购单号')" :space="1">
          <el-input v-model="formData.purchaseOrderCode" :placeholder="$t('请输入') + $t('采购单号')" name="searchForm_filters_purchaseOrderCode" />
        </el-form-item>
      </el-col>
    </el-row>
  </section>
</template>
<script>
export default {
  components: {
  },
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
      enableCoinType: false,
      showSupplierModal: true,
      receiveTypeMap: {},
      merchantIdList: [],
      supplierIdList: [],
      showModal: false,
      coinTypeListTemp: [],
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        supplierId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        coinType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        receiveType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'formData.merchantId': function(val, oldVal) {
      if (val) {
        this.loadSupplierList()
      }
    },
    deep: true
  },
  async mounted() {
    try {
      this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async initCodes() {
      const vue = this
      const { data } = await this.$pms.$api.receiveTask.listMultiCode({
        categories: ['RECEIVE_TASK_TYPE']
      })
      vue.receiveTypeMap = data.RECEIVE_TASK_TYPE.reduce((m, i) => { m[i.code] = i.name; return m }, {})
    },
    _initMerchants() { // 初始化商家
      const vue = this
      this.$pms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchantIdList = data.data.listObj
        if (vue.merchantIdList.length === 1) {
          vue.formData.merchantId = vue.merchantIdList[0].merchantId
          vue.changeMerchant()
          vue.setMerchantName()
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
    loadSupplierList() {
      this.$emit('initWarehouse')
      const vue = this
      vue.showSupplierModal = false
      vue.setMerchantName()
      if (!vue.formData.merchantId) {
        vue.showSupplierModal = true
        return
      }
    },
    setCoinType() {
      if (this.collect.selected) {
        this.formData.coinType = this.collect.selected.currencyCode
        this.enableCoinType = true
      }
    },
    clearSupplier() {
      this.enableCoinType = false
    },
    async _initCoinTypeList() { // 初始化币种信息
      const result = await this.$pms.$api.common.getCurrencies({})
      if (result.code === '0') {
        this.coinTypeList = result.data
        this.modifyCoinTypeList()
        this.coinTypeListTemp = this.coinTypeList.map((item, index) => {
          item.targetCurrencyNameLabel = item.targetCurrencyName + ' ' + item.targetSymbol
          return item
        })
        // 只有一个时默认选中
        if (this.coinTypeListTemp.length === 1) {
          this.formData.coinType = this.coinTypeListTemp[0].targetCurrencyCode
        }
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
    changeMerchant() {
      this.$emit('changeMerchant')
    },
    init() {
      this._initMerchants()
      this._initCoinTypeList()
      this.initCodes()
    }
  }
}

</script>
