<template>
  <section class="pg-receiver-summary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('任务相关信息') }}</span>
        <!-- 收货信息 -->
      </div>
      <el-row>
        <el-col :span="12" class="receiver-address">
          <el-row :span="12">
            <el-col :span="13">
              <el-form-item :label="$t('收货仓库')" required>
                <el-select v-model="formData.warehouseId" :placeholder="$t('common_all')" name="searchForm_warehouseId" @change="setAddress">
                  <el-option
                    v-for="item in warehouseList"
                    :label="item.warehouseName"
                    :key="item.warehouseId"
                    :value="item.warehouseId"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="4">&nbsp;</el-col>
            <el-col :span="18">
              <el-card shadow="never">
                <el-col :span="18">
                  <el-form-item :rules="rules.goodReceiverAreaCode" label-width="10px">
                    <div>{{ $t('收货人姓名') + '：' }} {{ formData.receiver }}</div>
                    <div>{{ $t('收货人地址') + '：' }} {{ formData.goodReceiverProvince }}{{ formData.goodReceiverCity }}{{ formData.goodReceiverArea }}{{ formData.receiveDetailAddress || '' }}</div>
                    <div>{{ $t('收货人手机') + '：' }} {{ formData.receiverMobile }}</div>
                  </el-form-item>
                </el-col>
                <el-col :span="4">
                  <el-link
                    name="showEditAddress"
                    type="primary"
                    @click="showEditAddress"
                  >{{ $t('修改地址') }}</el-link>
                </el-col>
              </el-card>
            </el-col>
          </el-row>
          <el-row class="remark">
            <el-col :span="20">
              <el-form-item :label="$t('备注')">
                <el-input v-model="formData.remark" :autosize="{minRows: 4, maxRows: 4}" name="formData_remark" type="textarea" maxlength="100" show-word-limit />
              </el-form-item>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-form-item
              :label="$t('预计收货日期')"
              :rules="rules.expectReceiveDate"
              prop="expectReceiveDate"
            >
              <el-date-picker
                v-model="formData.expectReceiveDate"
                :placeholder="$t('please_choose')"
                :picker-options="pickerOptions"
                name="formData_expectReciveDate"
                size="small"
                type="date"
              />
            </el-form-item>
          </el-row>
          <el-row>
            <!-- 附件 -->
            <el-form-item :label="$t('manual_order_attachment')">
              <ody-upload-doc
                v-model="fileList"
                @change="changeFiles"
              >
                <template slot="tip">
                  <span>{{ $t("最多支持上传3个文件") }}</span>
                </template>
              </ody-upload-doc>
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

export default {
  components: {
    Address,
    EditAddress
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
      limit: 3,
      areaList: [],
      warehouseList: [],
      showModalAddress: false,
      showModalEditAddress: false,
      fileDialogVisible: false,
      dialogImageUrl: null,
      addressId: null,
      selectedAddress: {},
      editedAddress: {},
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
        expectReceiveDate: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderDeliveryId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderPaymentType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime() - 86400000
        }
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
    changeFiles() {
      if (this.fileList) {
        this.formData.receiveAttachmentList = []
        this.fileList.forEach(item => {
          const fileItem = {}
          fileItem.refType = 1
          fileItem.name = item.name
          fileItem.path = item.url
          this.formData.receiveAttachmentList.push(fileItem)
        })
      }
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
        receiver: this.formData.receiver,
        receiverMobile: this.formData.receiverMobile,
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
    modifiedAddress(address) {
      this.formData.receiver = address.receiver
      this.formData.receiverMobile = address.receiverMobile
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
    async initWarehouse() {
      const warehouse = await this.$pms.$api.common.queryPlatformAuthWarehousePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.formData.merchantId
        }
      )
      this.warehouseList = warehouse.data.listObj
    },
    async getAreaList() {
      const { data = [] } = await this.$pms.$api.common.areaList({
        parentCode: 100000
      })
      return data
    },
    setAddressName(provinceCode, cityCode, districtCode, address) {
      if (!(provinceCode && cityCode && districtCode)) {
        return ''
      }

      const provinceList = this.areaList
      const rtv = []
      const province = provinceList.find(x => {
        return x.code === provinceCode
      })
      this.formData.goodReceiverProvinceCode = provinceCode
      this.formData.goodReceiverProvince = province.name
      rtv.push(province.name)
      const cityList = province.children
      const city = cityList.find(x => {
        return x.code === cityCode
      })
      this.formData.goodReceiverCityCode = cityCode
      this.formData.goodReceiverCity = city.name
      rtv.push(city.name)

      const districtList = city.children
      const district = districtList.find(x => {
        return x.code === districtCode
      })
      this.formData.goodReceiverAreaCode = districtCode
      this.formData.goodReceiverArea = district.name
      this.formData.receiveDetailAddress = address
      rtv.push(district.name)
      this.formData.receiverAddress = rtv.join('') + address
    },
    setAddress(warehouseId) {
      this.formData.goodReceiverProvinceCode = null
      this.formData.goodReceiverProvince = null
      this.formData.goodReceiverCityCode = null
      this.formData.goodReceiverCity = null
      this.formData.goodReceiverAreaCode = null
      this.formData.goodReceiverArea = null
      this.formData.receiveDetailAddress = null
      const vue = this
      const warehouse = vue.warehouseList.find(x => {
        return x.warehouseId === warehouseId
      })
      vue.formData.warehouseName = warehouse.warehouseName
      if (warehouse.provinceCode) {
        vue.setAddressName(warehouse.provinceCode, warehouse.cityCode, warehouse.districtCode, warehouse.address)
      }
      vue.formData.receiverMobile = warehouse.warehouseContacterMobile
      vue.formData.receiver = warehouse.warehouseContacter
    },
    async init() {
      this.areaList = await this.getAreaList()
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
