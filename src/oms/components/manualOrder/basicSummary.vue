<template>
  <section class="pg-basic-summary-list">
    <el-row>
      <el-col :span="12">
        <el-form-item :label="$t('do_merchant_name')" :rules="rules.merchantId" prop="merchantId"> <!-- 销售商家 -->
          <el-select
            v-model="formData.merchantId"
            :popper-append-to-body="false"
            :placeholder="$t('please_choose')"
            name="formData_merchantId"
            @change="loadMerchantStoreList">
            <el-option v-for="item in merchantIdList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('manual_order_store')" :rules="rules.storeId" prop="storeId"> <!-- 销售店铺 -->
          <el-select
            v-model="formData.storeId"
            :popper-append-to-body="false"
            :placeholder="$t('please_choose')"
            name="formData_storeId"
            @change="modifyStore">
            <el-option v-for="item in merchantStoreList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :key="initKey" :label="$t('member_name')" prop="userId"> <!-- 会员名称 -->
          <ody-member-choose ref="memberChoose" v-model="formData.userId" :params="memberChoose.params" name="formData_userId" @ok="selectUser" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item :label="$t('currencyType')" :rules="rules.coinType" prop="coinType"> <!-- 币别码 -->
          <el-select
            v-model="formData.coinType"
            :popper-append-to-body="false"
            :placeholder="$t('please_choose')"
            name="formData_coinType"
            @change="cleanProduct">
            <el-option v-for="item in coinTypeListTemp" :key="item.targetCurrencyCode" :label="item.targetCurrencyNameLabel" :value="item.targetCurrencyCode" >
              {{ item.targetCurrencyName }}<span class="error"> {{ item.targetSymbol }}</span>
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item :label="$t('销售员')" prop="salesmanId"> <!-- 销售员 -->
          <el-select
            v-model="formData.salesmanId"
            :popper-append-to-body="false"
            name="formData_salesmanId"
            @change="selectSalesman">
            <el-option v-for="item in salesmanList" :key="item.userId" :label="item.userName" :value="item.userId" >
              {{ item.userName }}
            </el-option>
          </el-select>
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
      salesmanList: [],
      userInfo: {},
      memberChoose: {
        params: {
          'isAvailable': 1,
          'userType': 2,
          'ignoreSso': 1,
          'limitCount': 10000
        }
      },
      salesmanChoose: {
        params: {
          'isAvailable': 1,
          'userType': 1,
          'ignoreSso': 1,
          'limitCount': 10000
        }
      },
      initKey: 0, // 复制订单时会调用initSelected(), 第三方订单无会员号，不应必填。 initKey用来解决会员号必填星号刷新问题
      showModal: false,
      merchantIdList: [],
      orderSysSourceList: [],
      merchantStoreList: [],
      coinTypeListTemp: [],
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
        coinType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      loadMerchant: null,
      loadStore: null
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
    async initSelected({ merchantId, storeId }) {
      ++this.initKey // 可以使input刷新，去除必填星号
      this.formData.merchantId = this.formData.merchantId || merchantId
      await this.loadMerchant
      this.loadMerchantStoreList(false)
      await this.loadStore // 解决storeId闪现
      this.formData.storeId = storeId
      this.modifyStore(false)
      this.$refs.memberChoose.initSelected()
    },
    _initMerchants() { // 初始化商家
      const vue = this
      this.loadMerchant = this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchantIdList = data.data.listObj
        if (vue.merchantIdList.length === 1) {
          vue.formData.merchantId = vue.merchantIdList[0].merchantId
          vue.changeMerchant()
          vue.setMerchantName()
          vue.loadMerchantStoreList(false)
        }
      })
    },
    loadMerchantStoreList(cleanProduct = true) { // 切换切换商家，加载店铺列表
      this.setMerchantName()
      const vue = this
      vue.merchantStoreList = []
      vue.formData.storeId = null
      if (!vue.formData.merchantId) {
        vue.modifyStore(cleanProduct)
        return
      }
      const queryParam = {
        merchantId: vue.formData.merchantId,
        currentPage: 1,
        itemsPerPage: 500,
        filterChannelCode: '110004'
      }
      this.loadStore = this.$oms.$api.common.merchantStoreList(queryParam).then((data) => {
        if (data.code === '0') {
          vue.merchantStoreList = data.data.listObj

          if (vue.merchantStoreList.length === 1) {
            vue.formData.storeId = vue.merchantStoreList[0].storeId
          }
          vue.modifyStore(cleanProduct)
        }
      })
    },
    modifyStore(cleanProduct) { // 切换店铺
      this.formData.storeName = null
      this.formData.storeCode = null
      let changeChannel = true
      if (this.formData.storeId) {
        this.merchantStoreList.forEach(element => {
          if (element.storeId === this.formData.storeId) {
            this.formData.storeCode = element.storeCode
            this.formData.storeName = element.storeName
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
      if (cleanProduct) {
        this.cleanProduct()
      }

      if (changeChannel && cleanProduct) {
        this.changeChannel()
      }
      this._initSalesmanList()
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
    selectUser(value) {
      if (value) {
        this.formData.userId = value.id
        this.formData.userName = value.nickname || value.username || value.mobile
        this.formData.email = value.email
        this.formData.mobile = value.mobile
        this.$emit('changeUser', value)
      } else {
        this.formData.userId = null
        this.formData.userName = null
        this.formData.email = null
        this.formData.mobile = null
      }
    },

    selectSalesman(value) {
      this.formData.salesmanName = null
      for (let i = 0; i < this.salesmanList.length; ++i) {
        if (this.salesmanList[i].userId === value) {
          this.formData.salesmanName = this.salesmanList[i].userName || this.salesmanList[i].nickname || this.salesmanList[i].mobile
        }
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
    changeMerchant() {
      this.$emit('changeMerchant')
    },
    changeChannel() {
      this.$emit('changeChannel')
    },
    async _initSalesmanList() {
      this.userInfo = this.$portal.getUser()
      if (this.formData.storeId) {
        const data = await this.$oms.$api.common.queryStoreEmployeeList({
          entityIds: [this.formData.storeId],
          isAvailable: 1,
          currentPage: 1,
          itemsPerPage: 1000000
        })
        this.salesmanList = data.data.listObj
      } else {
        this.formData.salesmanId = null
        this.formData.salesmanName = null
        this.salesmanList = []
      }
      const salesman = {
        userId: this.userInfo.userId,
        userName: this.userInfo.name,
        nickName: this.userInfo.nickName,
        mobile: this.userInfo.mobile
      }
      this.salesmanList.push(salesman)
    },
    init() {
      this._initMerchants()
      this._initCoinTypeList()
      this._initSalesmanList()
    }
  }
}

</script>
<style lang="scss" scoped>
/deep/ .el-select-dropdown {
  max-height: 300px !important;
  // height: 300px !important;
  position: absolute !important;
  left: 0px !important;
  right: 0px !important;
  z-index: 999999999 !important;
}
/deep/ .el-scrollbar__view{
  max-height: 300px !important;
}
</style>
