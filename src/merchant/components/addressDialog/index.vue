<template>
  <div>
    <ody-dialog
      v-if="visible"
      :visible.sync="visible"
      :before-close="hideDialog1"
      :title="$t('新增地址信息')"
      width="60%">
      <el-row slot="content">
        <el-col :span="22">
          <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="200px">
            <el-form-item :label="$t('联系人')" prop="contactName" required>
              <el-input
                v-model="addressForm.contactName"
                :placeholder="$t('请输入联系人')"
                name="addressForm_contactName"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('联系手机')" prop="contactPhone" required>
              <el-input
                v-model="addressForm.contactPhone"
                :placeholder="$t('请输入联系手机')"
                name="addressForm_contactPhone"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('详细地址')" prop="addressRegionCode" required>
              <province-city-region :span="7" :data="adressData" :province-key="'province'" :city-key="'city'" :region-key="'region'" name="adressData736" @change="addressRegionCodeChange"/>
            </el-form-item>
            <el-form-item prop="addressOne" required>
              <el-input
                v-model="addressForm.addressOne"
                :placeholder="$t('请输入详细地址')"
                name="addressForm_addressOne"
                type="text"
                show-word-limit
                maxlength="100"/>
            </el-form-item>
            <el-form-item :label="$t('详细地址（第二语言）')" prop="addressTwo">
              <el-input
                v-model="addressForm.addressTwo"
                :placeholder="$t('请输入详细地址（第二语言）')"
                name="addressForm_addressTwo"
                type="text"
                show-word-limit
                maxlength="300"/>
            </el-form-item>
            <el-form-item :label="$t('邮政编码')" prop="postalCode">
              <el-input
                v-model="addressForm.postalCode"
                :placeholder="$t('请输入邮政编码')"
                name="addressForm_postalCode"
                type="text"
                show-word-limit
                maxlength="10"/>
            </el-form-item>
            <el-form-item :label="$t('备注')" prop="remark">
              <el-input
                v-model="addressForm.remark"
                :placeholder="$t('请输入备注')"
                name="addressForm_remark"
                type="textarea"
                show-word-limit
                maxlength="100"/>
            </el-form-item>

          </el-form>
        </el-col>
      </el-row>
      <span slot="footer" class="dialog-footer">
        <div class="line-top"/>
        <el-button name="hideDialog1" size="mini" @click="hideDialog1">{{ $t('取消') }}</el-button>
        <el-button name="confirmDialog1" size="mini" type="primary" @click="confirmDialog1">{{ $t('确定') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import ProvinceCityRegion from '@/components/provinceCityRegion'
export default {
  components: {
    ProvinceCityRegion
  },
  props: {
    visible: { type: Boolean, default: false },
    orgId: { type: Number, default: 0 },
    addressObj: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      adressData: {
        province: '', // 省编码
        city: '', // 市编码
        region: '' // 区编码
      },
      addressForm: {
        contactName: '',
        contactPhone: '',
        addressProvinceCode: '',
        addressCityCode: '',
        addressRegionCode: '',
        addressOne: '',
        addressTwo: '',
        postalCode: '',
        remark: ''
      },
      addressFormRules: {
        contactName: [
          { required: true, message: '请输入联系人', trigger: 'blur' },
          { required: true, message: '请输入联系人', trigger: 'change' }
        ],
        contactPhone: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { pattern: /^((13[0-9])|(14[5|7])|(15([0-3]|[5-9]))|(1[6|7|8][0-9]))\d{8}$/, message: '请输入正确的手机号', trigger: 'change' }
        ],
        addressRegionCode: [
          { required: true, message: '请输入详细地址', trigger: 'change' },
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ],
        addressOne: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { required: true, message: '请输入详细地址', trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.setAddress()
    },
    hideDialog1() {
      this.$emit('hide-dialog')
    },
    confirmDialog1() {
      const distributorService = this.$merchant.$api.distributorService
      this.$refs['addressFormRef'].validate((valid) => {
        if (valid) {
          var addressParam = {}
          addressParam.addressType = 0
          addressParam.cityCode = this.addressForm.addressCityCode
          addressParam.contactPerson = this.addressForm.contactName
          addressParam.contactTelephone = this.addressForm.contactPhone
          addressParam.detailAddress = this.addressForm.addressOne
          addressParam.detailAddressLan2 = this.addressForm.addressTwo
          addressParam.isDefault = 0
          addressParam.orgId = this.orgId
          addressParam.postCode = this.addressForm.postalCode
          addressParam.provinceCode = this.addressForm.addressProvinceCode
          addressParam.regionCode = this.addressForm.addressRegionCode
          addressParam.remark = this.addressForm.remark
          if (this.addressObj && this.addressObj.id) {
            addressParam.id = this.addressObj.id
            distributorService.updateMerchantOrgAddressById(addressParam).then(res => {
              this.$emit('confirm-dialog')
            })
          } else {
            distributorService.addMerchantOrgAddress(addressParam).then(res => {
              this.$emit('confirm-dialog')
            })
          }
        } else {
          this.$message({
            type: 'error',
            message: '请输入必填项！'
          })
        }
      })
    },
    addressRegionCodeChange(val) {
      this.addressForm.addressProvinceCode = val.provinceCode
      this.addressForm.addressCityCode = val.cityCode
      this.addressForm.addressRegionCode = val.regionCode
    },
    setAddress() {
      if (this.addressObj) {
        this.addressForm.addressCityCode = this.addressObj.cityCode
        this.addressForm.contactName = this.addressObj.contactPerson
        this.addressForm.contactPhone = this.addressObj.contactTelephone
        this.addressForm.addressOne = this.addressObj.detailAddress
        this.addressForm.addressTwo = this.addressObj.detailAddressLan2
        this.addressForm.postalCode = this.addressObj.postCode
        this.addressForm.addressProvinceCode = this.addressObj.provinceCode
        this.addressForm.addressRegionCode = this.addressObj.regionCode
        this.addressForm.remark = this.addressObj.remark

        this.adressData = {
          province: this.addressObj.provinceCode, // 省编码
          city: this.addressObj.cityCode, // 市编码
          region: this.addressObj.regionCode // 区编码
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
