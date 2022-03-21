<template>
  <section id="order-delivery-detail">
    <div v-for="(packageData, index) in packageList" :key="index">
      <div style="font-weight: bold; background: #F6F8F8; padding-left: 18px; padding-top: 16px; padding-bottom: 12px; margin-bottom: 16px;">
        {{ $t('package') }}{{ index + 1 }}
      </div>
      <!--包裹信息-->
      <el-card style="padding-left: 117px;">
        <el-form>
          <el-form-item :label="$t('packageCode')+':'">
            <span>{{ packageData.packageCode }}</span>
          </el-form-item>
          <el-form-item :label="$t('do_do_code')+':'">
            <span>{{ packageData.doCode }}</span>
          </el-form-item>
          <!--map开始-->
          <el-form-item :label="$t('deliveryModeManagement')+':'">
            <span>{{ deliveryTypeMap[packageData.orderDeliveryMethodId] }}</span>
          </el-form-item>
          <!-- <el-form-item :label="$t('so_pick_delivery_merchant')+':'">
            <span>{{ deliveryMerchantMap[packageData.deliveryCompanyId] }}</span>
          </el-form-item>-->
          <el-form-item :label="$t('deliveryExpressNo')+':'">
            <span>{{ packageData.deliveryExpressNbr }}</span>
            <i v-if="(packageData.doStatus!=null && packageData.doStatus < 2040) || packageData.packageStatus < 3040" name="updateDeliveryModal" class="el-icon-edit" style="margin-left: 20px;" @click="updateDeliveryModal(packageData, deliveryMerchantList)"/>
          </el-form-item>
          <el-form-item :label="$t('packageStatus')+':'">
            <span>{{ packageStatusMap[packageData.packageStatus] }}</span>
          </el-form-item>
          <!--map结束-->
          <el-form-item :label="$t('do_good_receiver_name')+':'">
            <span>{{ packageData.goodReceiverName }}, {{ packageData.goodReceiverMobile }}</span>
          </el-form-item>
          <el-form-item :label="$t('goodReceiverAddress')+':'">
            <span>{{ packageData.goodReceiverProvince }}-{{ packageData.goodReceiverCity }}-{{ packageData.goodReceiverArea }}-{{ packageData.goodReceiverAddress }}</span>
          </el-form-item>
        </el-form>
      </el-card>
      <!--商品信息-->
      <ody-list-table-area>
        <div slot="table">
          <el-table v-loading="loading" :data="packageData.itemList" name="packageData_itemList386" style="width: 100%">
            <el-table-column :label="$t('manual_order_line_no')" prop="lineNo"/>
            <el-table-column :label="$t('goods_goods_good_name')" prop="productCname"/>
            <el-table-column :label="$t('goods_goods_good_code')" prop="code"/>
            <el-table-column :label="$t('manual_order_product_attr')" prop="extInfoStr"/>
            <el-table-column :label="$t('product_good_serialNumber')" prop="artNo"/>
            <el-table-column :label="$t('so_promotion_unit')" prop="unit"/>
            <el-table-column :label="$t('deliveredNum')" prop="productItemOutNum"/>
            <el-table-column :label="$t('do_warehouse')" prop="warehouseName"/>
          </el-table>
        </div>
      </ody-list-table-area>
      <!--物流信息-->
      <el-card>
        {{ $t('orderInvoiceInfo_logistics_detail')+':' }}<i :class="isShow == false ? 'el-icon-arrow-up' : 'el-icon-arrow-down'" name="isShow" style="margin-left: 26px;" @click="isShow = !isShow"/>
        <ul v-for="(item, idx) in packageData.deliveryInfos" v-show="isShow" :key="idx">
          <li>
            {{ item.createTime }} {{ item.remark }} {{ item.deliveryTypeStr }}
          </li>
        </ul>
      </el-card>
    </div>
    <DeliveryModal :visible.sync="showModal" :package-data.sync="selectedPackageData" :delivery-merchant-list.sync="deliveryMerchantList"/>
  </section>
</template>

<script>
import DeliveryModal from '@/components/deliveryModal'
export default {
  components: {
    DeliveryModal
  },
  props: {
    model: {
      type: String,
      default: null
    },
    orderCode: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      limit: 10,
      page: 1,
      total: 0,
      loading: false,
      packageList: [],
      packageData: {},
      isShow: false,
      deliveryTypeMap: {},
      deliveryMerchantMap: {},
      packageStatusMap: {},
      showModal: false,
      selectedPackageData: {},
      deliveryMerchantList: [],
      listItem: []
    }
  },
  created() {
    this.init()
    this.getParcel()
  },
  methods: {
    handleSearchSubmit() {
      this.getParcel()
    },
    handleSearchReset() {
    },

    handlePageSizeChange(value) {
      this.limit = value
      this.getParcel()
    },
    handlePageCurrentChange(value) {
      this.page = value
      this.getParcel()
    },
    init() {
      const deliveryTypeParams = this.$oms.$api.distributionModeItem.distributionModeItemListForSelect({})
      const deliveryMerchantParams = this.$oms.$api.merchantExpressConfig.merchantExpressConfigListForSelect({ 'filters': { 'isAvailable': 1 }})
      const packageStatusParams = this.$oms.$api.common.listByCategorysForOrder({
        categorys: ['PACKAGE_STATUS']
      })
      Promise.all([deliveryTypeParams, deliveryMerchantParams, packageStatusParams]).then(res => {
        console.log(JSON.stringify(res))
        this.deliveryTypeMap = res[0].data.reduce((m, i) => { m[i['shippingCode']] = i['distributionMode']; return m }, {})
        this.deliveryMerchantMap = res[1].data.reduce((m, i) => { m[i['deliveryCompanyId']] = i['deliveryCompanyName']; return m }, {})
        this.deliveryMerchantList = res[1].data
        this.packageStatusMap = res[2].data.PACKAGE_STATUS.reduce((m, i) => { m[i['code']] = i['name']; return m }, {})
      })
    },
    getParcel() {
      this.loading = true
      const params = {
        page: this.page,
        limit: this.limit,
        filters: {
          orderCode: this.orderCode
        }
      }
      this.$oms.$api.soPackage.parcelListListPageWithItem(params).then(res => {
        console.log('=====' + JSON.stringify(res))
        this.listItem = res.data
        this.listItem.forEach(item => {
          item.extInfoStr = this.getAttributes(item.extInfo)
          item.itemList.forEach(subItem => {
            subItem.extInfoStr = this.getAttributes(subItem.extInfo)
          })
          this.getDeliveryInfo(item)
        })
        this.packageList = this.listItem
      }).finally(() => {
        this.loading = false
      })
    },
    getDeliveryInfo(pkg) {
      const params = {
        packageCode: pkg.packageCode
      }
      this.$oms.$api.soDelivery.soDeliveryGetInfoByPackageCode(params).then(res => {
        pkg.deliveryInfos = res.data
      })
    },
    getAttributes(val) {
      let value = ''
      if (val === null || val === undefined || val === '' || val.length === 0) {
        return '无'
      }
      const json = JSON.parse(val)
      for (let i = 0; i < json.length; i++) {
        value = value + json[i].name + ':' + json[i].value + ';'
      }
      return value
    },
    updateDeliveryModal(packageData, deliveryMerchantList) {
      this.deliveryMerchantList = deliveryMerchantList
      this.selectedPackageData = packageData
      this.showModal = true
    }
  }
}
</script>

<style scoped>

</style>
