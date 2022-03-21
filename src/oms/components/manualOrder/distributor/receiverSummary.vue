<template>
  <section class="pg-basicSummary-list">
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>{{ $t('customer_order_receiver_info') }}</span>
      </div>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_receiver_name')" :rules="rules.consigneeName" prop="consigneeName"> <!-- 收货人姓名 -->
            <el-input v-model="formData.consigneeName" name="formData_consigneeName" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('do_good_receiver_mobile')" :rules="rules.consigneePhone" prop="consigneePhone"> <!-- 收货人手机 -->
            <el-input v-model="formData.consigneePhone" name="formData_consigneePhone" maxlength="20" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="16">
          <el-form-item :label="$t('order_ports_deliveryAddress')" required> <!-- 收货地址 -->
            <el-col :span="8">
              <el-form-item :rules="rules.goodReceiverProvinceCode" prop="goodReceiverProvinceCode">
                <el-select id="s_province" v-model="formData.goodReceiverProvinceCode" name="s_province" @change="loadCityList" >
                  <el-option :label="$t('choose_the_province')" />
                  <el-option v-for="item in province_list" :label="item.name" :key="item.code" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :rules="rules.goodReceiverCityCode" prop="goodReceiverCityCode">
                <el-select id="s_city" v-model="formData.goodReceiverCityCode" :disabled="!formData.goodReceiverProvinceCode" name="s_city" @change="loadRegionList" >
                  <el-option :label="$t('choose_the_city')" />
                  <el-option v-for="item in city_list" :label="item.name" :key="item.code" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item :rules="rules.goodReceiverAreaCode" prop="goodReceiverAreaCode">
                <el-select id="s_area" v-model="formData.goodReceiverAreaCode" :disabled="!formData.goodReceiverCityCode" name="s_area" @change="changeArea" >
                  <el-option :label="$t('choose_the_region')" />
                  <el-option v-for="item in area_list" :label="item.name" :key="item.code" :value="item.code" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('manual_order_ports_deliveryAddress')" :rules="rules.receiveDetailAddress" prop="receiveDetailAddress"> <!-- 详细地址 -->
            <el-input v-model="formData.receiveDetailAddress" name="formData_receiveDetailAddress" maxlength="300" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row >
        <el-col :span="8">
          <el-form-item :label="$t('common_zipcode')"> <!-- 邮编 -->
            <el-input v-model="formData.goodReceiverPostcode" name="formData_goodReceiverPostcode" maxlength="10" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="$t('order_ports_operation_remarks')" > <!-- 备注 -->
            <el-input v-model="formData.customerRemark" name="formData_customerRemark" type="textarea" maxlength="150"/>
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
      province_list: [],
      city_list: [],
      area_list: [],
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
    validatePhone(rule, value, callback) {
      var pattern = /^1[345789]\d{9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('mobilePhoneIncorrect')))
    },
    getProvinceList() {
      this.formData.goodReceiverCityCode = null
      this.formData.goodReceiverAreaCode = null
      this.province_list = []
      this.loadAreaList(100000, 1)
    },
    loadCityList() {
      this.formData.goodReceiverCityCode = null
      this.formData.goodReceiverAreaCode = null
      this.city_list = []
      this.area_list = []
      this.loadAreaList(this.formData.goodReceiverProvinceCode, 2)

      const name = getNameFromArea(this.formData.goodReceiverProvinceCode, this.province_list)
      if (name) {
        this.formData.goodReceiverProvince = name
      }
    },
    loadRegionList() {
      this.formData.goodReceiverAreaCode = null
      this.area_list = []
      this.loadAreaList(this.formData.goodReceiverCityCode, 3)

      const name = getNameFromArea(this.formData.goodReceiverCityCode, this.city_list)
      if (name) {
        this.formData.goodReceiverCity = name
      }
    },
    changeArea() {
      const name = getNameFromArea(this.formData.goodReceiverAreaCode, this.area_list)
      if (name) {
        this.formData.goodReceiverArea = name
      }
      this.cleanProduct()
    },
    async loadAreaList(parentCode, level) {
      if (parentCode) {
        const res = await this.$oms.$api.common.getAreaListByKey({ parentCode: parentCode })
        if (res.code === '0') {
          if (level === 1) {
            this.province_list = res.data
          } else if (level === 2) {
            this.city_list = res.data
          } else {
            this.area_list = res.data
          }
          this.cleanProduct()
        }
      }
    },
    cleanProduct() {
      this.$emit('cleanProduct')
    },
    init() {
      this.getProvinceList()
    }
  }
}
function getNameFromArea(code, list) {
  if (!code || !list || list.length === 0) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].code === code) {
      return list[i].name
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
