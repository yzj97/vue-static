<template>
  <section class="pg-receiver-summary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('customer_order_receiver_info') }}</span>
        <!-- 收货信息 -->
      </div>
      <el-row>
        <el-col :span="12" class="receiver-address">
          <el-row>
            <el-col :span="2">&nbsp;</el-col>
            <el-col :span="20">
              <el-card shadow="never">
                <el-col :span="20">
                  <el-form-item :rules="rules.goodReceiverAreaCode" label-width="10px">
                    <div>{{ $t('manual_order_receiver_name') + '：' }} {{ formData.consigneeName }}</div>
                    <!-- 收货人姓名 -->
                    <div>{{ $t('do_good_receiver_address') + '：' }} {{ formData.goodReceiverProvince }}{{ formData.goodReceiverCity }}{{ formData.goodReceiverArea }}{{ formData.receiveDetailAddress }}</div>
                    <!-- 收货人地址 -->
                    <div>{{ $t('do_good_receiver_mobile') + '：' }} {{ formData.consigneePhone }}</div>
                    <!-- 收货人手机 -->
                    <el-link
                      name="showMoreAddress"
                      type="primary"
                      @click="showMoreAddress"
                    >{{ $t('manual_order_more_address') }}</el-link>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-link
                    name="showEditAddress"
                    type="primary"
                    @click="showEditAddress"
                  >{{ $t('manual_order_edit_address') }}</el-link>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="remark">
            <el-col :span="16">
              <el-form-item :label="$t('manual_order_customer_remark')">
                <!-- 客户备注 -->
                <el-input v-model="formData.customerRemark" name="formData_customerRemark" type="textarea" maxlength="150" />
              </el-form-item>
              <el-form-item :label="$t('manual_order_merchant_remark')">
                <!-- 商家备注 -->
                <el-input v-model="formData.merchantRemark" name="formData_merchantRemark" type="textarea" maxlength="150" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item
              :label="$t('manual_order_payment_type')"
              :rules="rules.orderPaymentType"
              prop="orderPaymentType"
            >
              <!-- 付款方式 -->
              <el-select v-model="formData.orderPaymentType" :popper-append-to-body="false" name="formData_orderPaymentType">
                <el-option
                  v-for="item in orderPaymentTypeList"
                  :label="item.value"
                  :key="item.key"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :label="$t('do_delivery_method')"
              :rules="rules.orderDeliveryId"
              prop="orderDeliveryId">
              <!-- 配送方式 -->
              <el-select v-model="formData.orderDeliveryId" :popper-append-to-body="false" name="formData_orderDeliveryId">
                <el-option
                  v-for="item in orderDeliveryList"
                  :label="item.value"
                  :key="item.key"
                  :value="item.key"
                />
              </el-select>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item
              :label="$t('do_logistics_time')"
              :rules="rules.deliveryDate"
              prop="deliveryDate">
              <!-- 预计发货日期 -->
              <el-date-picker
                v-model="formData.deliveryDate"
                :placeholder="$t('please_choose')"
                :picker-options="pickerOptions"
                name="formData_deliveryDate"
                size="small"
                type="date"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item :label="$t('manual_order_attachment')">
              <!-- 附件 -->
              <el-upload
                :limit="limit"
                :file-list.sync="fileList"
                :on-remove="handleRemove"
                :on-preview="handlePictureCardPreview"
                :before-upload="beforeUpload"
                :on-success="handleSuccess"
                :action="orderUploadUrl"
                :on-error="handleError"
                :on-change="handleChange"
                :on-exceed="handleExceed"
                multiple="false"
                accept="image/jpeg, image/png, image/jpg, image/gif"
                class="upload-attachment"
              >
                <!-- <i slot="default" class="el-icon-plus"/> -->
                <el-button
                  v-if="formData.manualOrderAttachmentVOList.length < 3"
                  size="small"
                  type="primary"
                >{{ $t('manual_order_add_attachment') }}</el-button>
                <div slot="tip" class="el-upload__tip">{{ $t("uploadPictureTip") }}</div>
              </el-upload>
            </el-form-item>
          </el-row>
        </el-col>
      </el-row>
    </el-card>
    <!-- 地址列表模态框 -->
    <div v-if="formData.userId">
      <Address
        :visible.sync="showModalAddress"
        :user-id.sync="formData.userId"
        :address-id.sync="addressId"
        :channel-code.sync="formData.orderSysSource"
        @ok="selectAddress"
      />
    </div>
    <div v-if="formData.customerId">
      <CustomerAddress
        :visible.sync="showModalAddress"
        :customer-id.sync="formData.customerId"
        :address-id.sync="addressId"
        :channel-code.sync="formData.orderSysSource"
        @ok="selectAddress"
      />
    </div>
    <!-- 修改地址模态框 -->
    <EditAddress
      :visible.sync="showModalEditAddress"
      :address.sync="editedAddress"
      @ok="modifiedAddress"
    />

    <ody-dialog :visible.sync="fileDialogVisible">
      <img :src="dialogImageUrl" width="100%" alt >
    </ody-dialog>
  </section>
</template>
<script>
import Address from './address'
import EditAddress from './address/editAddress.vue'

import CustomerAddress from './customerAddress'

export default {
  components: {
    Address,
    EditAddress,
    CustomerAddress
  },
  props: {
    collect: {
      type: Object,
      default: () => {
        return {}
      }
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    forCustomer: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(v) {
          return v.getTime() < new Date().getTime() - 86400000
        }
      },
      limit: 3,
      showModalAddress: false,
      showModalEditAddress: false,
      fileDialogVisible: false,
      dialogImageUrl: null,
      addressId: null,
      orderPaymentTypeList: [],
      selectedAddress: {},
      editedAddress: {},
      orderDeliveryList: [],
      fileList: [],
      orderUploadUrl: '/api/oms-web/public/upload/uploadFile',
      rules: {
        consigneeName: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        consigneePhone: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validatePhone, trigger: 'blur' }
        ],
        goodReceiverProvinceCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        goodReceiverCityCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        goodReceiverAreaCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        receiveDetailAddress: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        deliveryDate: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderDeliveryId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderPaymentType: [
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
    beforeUpload(file) {
      // 文件上传前检测文件大小
      if (!file || file.size > 2 * 1024 * 1024) {
        this.$message({
          type: 'info',
          message: this.$t('fileToMax')
        })
        return false
      }
      const isPNG = file.type === 'image/png'
      const isJPG = file.type === 'image/jpg'
      const isJPEG = file.type === 'image/jpeg'
      const isGif = file.type === 'image/gif'

      if (isPNG || isJPG || isJPEG || isGif) {
        return true
      } else {
        this.$message({
          type: 'info',
          message: this.$t('onlyPictureFile')
        })
        return false
      }
    },
    handleSuccess(response, file, fileList) {
      // 文件上传成功回调
      if (response.code === '0') {
        if (Array.isArray(response.data) && response.data.length > 0) {
          var data = response.data[0]
          file.url = data.url
        }
      } else {
        this.$message({
          type: 'warn',
          message: this.$t('common_upload_fail')
        })
        this.handleError(null, file, fileList)
      }
    },
    handleError(e, file, fileList) {
      const index = fileList.indexOf(file)
      if (index >= 0) {
        fileList.splice(index, 1)
      }
    },
    handleChange(file, fileList) {
      this.formData.manualOrderAttachmentVOList = []
      if (fileList) {
        fileList.forEach(item => {
          if (
            item.status === 'success' &&
            item.response &&
            item.response.code === '0'
          ) {
            item.path = item.url
            this.formData.manualOrderAttachmentVOList.push(item)
          }
        })
      }
    },
    handleExceed(file, fileList) {
      this.$message({
        type: 'warn',
        message: this.$t('uploadFileLimit', { limit: this.limit })
      })
    },
    handleRemove(file, fileList) {
      // 删除文件
      const index = this.formData.manualOrderAttachmentVOList.indexOf(file)
      if (index >= 0) {
        this.formData.manualOrderAttachmentVOList.splice(index, 1)
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.fileDialogVisible = true
    },
    validatePhone(rule, value, callback) {
      var pattern = /^1[345789]\d{9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('mobilePhoneIncorrect')))
    },
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    async _initOrderPaymentType() {
      // 初始化支付方式
      const queryParam = {
        categorys: ['PAY_METHOD', 'SELF_PICKED_UP_TYPE']
      }
      const result = await this.$oms.$api.common.listByCategorysForOrder(
        queryParam
      )
      if (result.code === '0') {
        result.data['PAY_METHOD'].forEach(item => {
          if ((this.forCustomer && item['code'] === '2') || !this.forCustomer) {
            this.orderPaymentTypeList.push({
              key: item['code'],
              value: item['name']
            })
          }
        })
      }
    },
    async _initOrderDeliveryList() {
      // 初始化配送方式
      const queryParam = {
        filters: {
          isAvailable: 1
        }
      }
      const res = await this.$oms.$api.distributionModeItem.distributionModeItemList(
        queryParam
      )
      if (res.code === '0') {
        res.data.forEach(item => {
          this.orderDeliveryList.push({
            key: item['shippingCode'],
            value: item['distributionMode']
          })
        })
      }
    },
    async changeUser() {
      // 修改用户，加载地址信息
      this.loadDefaulAddress()
    },
    async loadDefaulAddress() {
      if (
        (!this.formData.userId && !this.formData.customerId) ||
        !this.formData.orderSysSource
      ) {
        this.selectAddress({})
        return
      }
      // 如果是客户下单，调用获取客户地址列表接口
      let address = {}
      if (this.formData.customerId) {
        // 获取客户地址
        const res = await this.$oms.$api.common.queryMerchantOrgAddressByOrgId(
          JSON.stringify(this.formData.customerId)
        )
        if (res.code === '0' && res.data && res.data.listObj) {
          res.data.listObj.forEach(element => {
            if (element.isDefault === 1) {
              address = element
              return
            }
          })
        }
      } else {
        const params = {
          userId: this.formData.userId,
          channelCode: this.formData.orderSysSource
        }
        const res = await this.$oms.$api.thirdData.queryDefaultAddress(params)
        if (res.code === '0') {
          address = res.data
        }
      }
      this.selectAddress(address)
    },
    showMoreAddress() {
      let message
      if (!this.formData.userId && !this.formData.customerId) {
        message = 'pleaseSelectTheAccountInformation'
      } else if (!this.formData.storeId) {
        message = 'please_choose_store'
      }
      if (message) {
        this.$message({
          type: 'warn',
          message: this.$t(message)
        })
        return
      }
      if (this.selectedAddress) {
        this.addressId = this.selectedAddress.id
      } else {
        this.addressId = null
      }
      this.showModalAddress = true
    },
    showEditAddress() {
      this.editedAddress = {
        consigneeName: this.formData.consigneeName,
        consigneePhone: this.formData.consigneePhone,
        provinceCode: this.formData.goodReceiverProvinceCode,
        provinceName: this.formData.goodReceiverProvince,
        cityCode: this.formData.goodReceiverCityCode,
        cityName: this.formData.goodReceiverCity,
        regionCode: this.formData.goodReceiverAreaCode,
        regionName: this.formData.goodReceiverArea,
        detailAddress: this.formData.receiveDetailAddress
      }
      this.showModalEditAddress = true
    },
    selectAddress(address) {
      if (!address) {
        address = {}
      }
      if (!this.formData.customerId) {
        this.formData.consigneeName = address.userName
        this.formData.consigneePhone = address.mobile
      } else {
        this.formData.consigneeName = address.contactPerson
        this.formData.consigneePhone = address.contactTelephone
      }
      this.setAddressInfo(address)
    },
    modifiedAddress(address) {
      this.formData.consigneeName = address.consigneeName
      this.formData.consigneePhone = address.consigneePhone
      this.setAddressInfo(address)
    },
    setAddressInfo(address) {
      this.selectedAddress = Object.assign({}, address)
      if (this.formData.goodReceiverAreaCode !== address.regionCode) {
        this.cleanProduct()
      }
      this.formData.goodReceiverProvinceCode = address.provinceCode
      this.formData.goodReceiverProvince = address.provinceName
      this.formData.goodReceiverCityCode = address.cityCode
      this.formData.goodReceiverCity = address.cityName
      this.formData.goodReceiverAreaCode = address.regionCode
      this.formData.goodReceiverArea = address.regionName
      this.formData.receiveDetailAddress = address.detailAddress
    },
    changeChannel() {
      // 修改渠道，重新获取用户收货信息
      this.loadDefaulAddress()
    },
    async init() {
      this._initOrderDeliveryList()
      await this._initOrderPaymentType()
      if (this.forCustomer) {
        // 客户下单只有线下支付
        this.formData.orderPaymentType = '2'
      }
    }
  }
}
</script>

<style lang="less" scoped>
.pg-receiver-summary-list {
  margin-bottom: 15px;

  .receiver-address {
    border-right: 2px #eef5f9 solid;
  }

  .remark {
    margin-top: 20px;
  }
}
</style>
