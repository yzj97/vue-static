<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('edit')"
      :close-on-click-modal="false"
      width="900px"
      @open="init" > <!-- 修改地址 -->
      <section class="pg-editRemark">
        <el-form ref="form" :rules="rules" :model="formData" label-width="180px" class="form">
          <el-form-item :label="$t('manual_order_receiver_name')" :rules="rules.consigneeName" prop="consigneeName"> <!-- 收货人姓名 -->
            <el-input v-model="formData.consigneeName" name="formData_consigneeName" maxlength="10" />
          </el-form-item>
          <el-form-item :label="$t('do_good_receiver_mobile')" :rules="rules.consigneePhone" prop="consigneePhone"> <!-- 收货人手机 -->
            <el-input v-model="formData.consigneePhone" name="formData_consigneePhone" maxlength="20" />
          </el-form-item>
          <el-row>
            <el-form-item :label="$t('do_good_receiver_address')" required> <!-- 收货人地址 -->
              <el-col :span="7">
                <el-form-item :rules="rules.provinceCode" prop="provinceCode">
                  <el-select
                    id="s_province"
                    :popper-append-to-body="false"
                    v-model="formData.provinceCode"
                    name="s_province"
                    @change="loadCityList" >
                    <el-option :label="$t('choose_the_province')" />
                    <el-option v-for="item in province_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="7" offset="1">
                <el-form-item :rules="rules.cityCode" prop="cityCode">
                  <el-select id="s_city" :popper-append-to-body="false" v-model="formData.cityCode" :disabled="!formData.provinceCode" name="s_city" @change="loadRegionList" >
                    <el-option :label="$t('choose_the_city')" />
                    <el-option v-for="item in city_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8" offset="1">
                <el-form-item :rules="rules.regionCode" prop="regionCode">
                  <el-select id="s_area" :popper-append-to-body="false" v-model="formData.regionCode" :disabled="!formData.cityCode" name="s_area" @change="changeArea" >
                    <el-option :label="$t('choose_the_region')" />
                    <el-option v-for="item in area_list" :label="item.name" :key="item.code" :value="item.code" />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-row>
          <el-form-item :label="$t('manual_order_ports_deliveryAddress')" :rules="rules.detailAddress" prop="detailAddress"> <!-- 详细地址 -->
            <el-input v-model="formData.detailAddress" name="formData_detailAddress" maxlength="100" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button name="handleOk" size="small" type="primary" @click="handleOk('form')">{{ $t('ok') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    address: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      province_list: [],
      city_list: [],
      area_list: [],
      formData: {
        consigneeName: null,
        consigneePhone: null,
        provinceCode: null,
        provinceName: null,
        cityCode: null,
        cityName: null,
        regionCode: null,
        regionName: null,
        detailAddress: null
      },
      rules: {
        consigneeName: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        consigneePhone: [
          { required: true, message: this.$t('required'), trigger: 'change' },
          { validator: this.validatePhone, trigger: 'change' }
        ],
        provinceCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        cityCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        regionCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        detailAddress: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    async init() {
      this.formData = Object.assign(this.formData, this.address)
      await this.getProvinceList()
      if (this.formData.provinceCode) {
        this.formData.provinceCode = this.formData.provinceCode + ''
        this.formData.provinceName = getNameFromArea(this.formData.provinceCode, this.province_list)
        await this.loadAreaList(this.formData.provinceCode, 2)
      }
      if (this.formData.cityCode) {
        this.formData.cityCode = this.formData.cityCode + ''
        this.formData.cityName = getNameFromArea(this.formData.cityCode, this.city_list)
        await this.loadAreaList(this.formData.cityCode, 3)
      }
      if (this.formData.regionCode) {
        this.formData.regionCode = this.formData.regionCode + ''
        this.formData.regionName = getNameFromArea(this.formData.regionCode, this.area_list)
        this.changeArea()
      }
    },
    validatePhone(rule, value, callback) {
      var pattern = /^1[345789]\d{9}$/
      if (pattern.test(value)) {
        return callback()
      }
      return callback(new Error(this.$t('mobilePhoneIncorrect')))
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async getProvinceList() {
      this.province_list = []
      await this.loadAreaList(100000, 1)
    },
    async loadCityList() {
      this.formData.cityCode = null
      this.formData.regionCode = null
      this.city_list = []
      this.area_list = []
      await this.loadAreaList(this.formData.provinceCode, 2)

      const name = getNameFromArea(this.formData.provinceCode, this.province_list)
      if (name) {
        this.formData.provinceName = name
      }
    },
    async loadRegionList() {
      this.formData.regionCode = null
      this.area_list = []
      await this.loadAreaList(this.formData.cityCode, 3)

      const name = getNameFromArea(this.formData.cityCode, this.city_list)
      if (name) {
        this.formData.cityName = name
      }
    },
    changeArea() {
      const name = getNameFromArea(this.formData.regionCode, this.area_list)
      if (name) {
        this.formData.regionName = name
      }
    },
    async loadAreaList(parentCode, level) {
      if (parentCode) {
        const res = await this.$oms.$api.common.getAreaListByKey({ parentCode: parentCode })
        if (res.code === '0') {
          res.data.forEach(element => {
            element.code = element.code + ''
          })
          if (level === 1) {
            this.province_list = res.data
          } else if (level === 2) {
            this.city_list = res.data
          } else {
            this.area_list = res.data
          }
        }
      }
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.$emit('update:visible', !this.visible)
          vue.$emit('ok', vue.formData)
        }
      })
    }
  }
}
function getNameFromArea(code, list) {
  if (!code || !list || list.length === 0) {
    return
  }
  for (let i = 0; i < list.length; i++) {
    if (list[i].code + '' === code + '') {
      return list[i].name
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/ .el-select-dropdown {
  max-height: 100px !important;
  // height: 300px !important;
  position: absolute !important;
  left: 0px !important;
  right: 0px !important;
  z-index: 999999999 !important;
}
/deep/ .el-scrollbar__view{
  max-height: 100px !important;
}
/deep/ .el-dialog__body{
  overflow: unset !important;
}
/deep/ .el-dialog {
  overflow: unset !important;
}
</style>
