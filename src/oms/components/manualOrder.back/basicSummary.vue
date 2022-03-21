<template>
  <section class="pg-basicSummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('manual_order_base_info') }}</span> <!-- 基本信息 -->
      </div>
      <el-row v-if="!forCustomer">
        <el-col :span="8">
          <el-form-item :label="$t('order_entry_mode')"> <!-- 录入方式 -->
            <span>{{ $t('artificialOrderManagement') }}</span> <!-- 人工下单 -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('do_merchant_name')" :rules="rules.merchantId" prop="merchantId" > <!-- 销售商家 -->
            <el-select v-model="formData.merchantId" name="formData_merchantId" @change="loadOrderSysSourceList">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in merchantIdList" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_order_syssource')" :rules="rules.orderSysSource" prop="orderSysSource"> <!-- 销售渠道 -->
            <el-select v-model="formData.orderSysSource" name="formData_orderSysSource" @change="loadMerchantStoreList">
              <el-option :label="$t('please_choose')" />
              <el-option v-for="item in orderSysSourceList" :label="item.value" :key="item.key" :value="item.key" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_store')" :rules="rules.storeId" prop="storeId"> <!-- 销售店铺 -->
            <el-select v-model="formData.storeId" name="formData_storeId" @change="modifyStore">
              <el-option :label="$t('please_choose')" />
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
    },
    forCustomer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      merchantIdList: [],
      orderSysSourceList: [],
      merchantStoreList: [],
      customerChannelCode: '110004',
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderSysSource: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
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
    _initMerchants() { // 初始化商家
      const vue = this
      this.$oms.$api.common.merchantList({ 'currentPage': 1, 'itemsPerPage': 1000 }).then((data) => {
        vue.merchantIdList = data.data.listObj
      })
    },
    loadOrderSysSourceList() { // 切换商家，加载销售渠道列表
      this.changeMerchant()
      this.cleanProduct()
      this.setMerchantName()
      const vue = this
      vue.formData.orderSysSource = null
      vue.formData.storeId = null
      vue.orderSysSourceList = []
      vue.merchantStoreList = []
      if (vue.formData.merchantId) {
        this.$oms.$api.common.merchantManageChannel({ 'merchantId': vue.formData.merchantId }).then((data) => {
          if (data.code === '0') {
            data.data.forEach(item => {
              if (vue.forCustomer) {
                if (item.channelCode === vue.customerChannelCode) {
                  vue.formData.orderSysSource = item.channelCode
                  vue.orderSysSourceList.push({
                    key: item.channelCode,
                    value: item.channelName
                  })
                  vue.loadMerchantStoreList()
                }
              } else {
                vue.orderSysSourceList.push({
                  key: item.channelCode,
                  value: item.channelName
                })
              }
            })
          }
        })
      }
    },
    loadMerchantStoreList() { // 切换销售渠道，加载店铺列表
      this.cleanProduct()
      const vue = this
      vue.merchantStoreList = []
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
      this.$oms.$api.common.merchantStoreList(queryParam).then((data) => {
        if (data.code === '0') {
          vue.merchantStoreList = data.data.listObj
        }
      })
    },
    modifyStore() { // 切换店铺
      this.formData.storeName = null
      if (this.formData.storeId) {
        this.merchantStoreList.forEach(element => {
          if (element.storeId === this.formData.storeId) {
            this.formData.storeName = element.storeName
            return
          }
        })
      }
      this.cleanProduct()
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
    changeMerchant() {
      this.$emit('changeMerchant')
    },
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    init() {
      this._initMerchants()
    }
  }
}

</script>

<style lang="scss" scoped>

</style>
