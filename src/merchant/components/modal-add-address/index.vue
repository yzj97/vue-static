<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleAddAddressCancel"
      :title="getAddOrEdit + $t('地址')"
      width="960px">
      <el-form
        ref="addressForm"
        :model="addressForm"
        :rules="rules"
        label-position="right"
        label-width="140px">
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('联系人')" prop="contactPerson">
              <el-input
                id="contactPerson"
                v-model="addressForm.contactPerson"
                :placeholder="$t('请输入联系人')"
                name="addressForm_contactPerson"
                type="text"
                show-word-limit
                maxlength="20"/>
            </el-form-item>
            <el-form-item :label="$t('联系手机')" prop="contactTelephone">
              <el-input
                id="contactTelephone"
                v-model="addressForm.contactTelephone"
                :placeholder="$t('请输入联系手机')"
                name="addressForm_contactTelephone"
                type="text"
                show-word-limit
                maxlength="11"/>
            </el-form-item>
            <el-form-item :label="$t('详细地址')" prop="area">
              <ody-province-city-region-select
                v-model="addressForm.area"
                name="addressForm_area"
              />
            </el-form-item>
            <el-form-item prop="detailAddress">
              <el-input
                id="detailAddress"
                v-model="addressForm.detailAddress"
                :placeholder="$t('请输入详细地址')"
                name="addressForm_detailAddress"
                type="text"
                show-word-limit
                maxlength="100"/>
            </el-form-item>
            <el-form-item :label="$t('详细地址（第二语言）')" prop="detailAddressLan2">
              <el-input
                v-model="addressForm.detailAddressLan2"
                :placeholder="$t('请输入详细地址（第二语言）')"
                name="addressForm_detailAddressLan2"
                type="text"
                show-word-limit
                maxlength="300"/>
            </el-form-item>
            <el-form-item :label="$t('地址类型')" prop="addressType">
              <ody-select2
                v-model="addressForm.addressType"
                :clearable="false"
                name="addressForm_addressType"
                list-key="addressType"
              />
            </el-form-item>
            <el-form-item :label="$t('默认地址')">
              <el-checkbox
                v-model="addressForm.isDefault"
                :true-label="1"
                :false-label="0"
                name="addressForm_isDefault"
              />
            </el-form-item>
            <el-form-item :label="$t('邮政编码')" prop="postCode">
              <el-input
                v-model="addressForm.postCode"
                :placeholder="$t('请输入邮政编码')"
                name="addressForm_postCode"
                type="text"
                show-word-limit
                maxlength="6"
                @input="handleInput()"/>
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
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer">
        <el-button name="handleAddAddressCancel" size="mini" @click="handleAddAddressCancel">{{ $t('取消') }}</el-button>
        <ody-button id="merchantStoreListAddressSave" name="MerchantStoreListAddressSave_handleAddAddressSubmit" code="MerchantStoreListAddressSave" size="mini" type="primary" @click="handleAddAddressSubmit">{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>

export default {
  components: {
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    orgId: {
      type: String,
      default: ''
    },
    addressId: {
      type: Number,
      default: 0
    },
    contactPerson: {
      type: String,
      default: ''
    },
    contactTelephone: {
      type: String,
      default: ''
    },
    provinceCode: {
      type: String,
      default: ''
    },
    cityCode: {
      type: String,
      default: ''
    },
    regionCode: {
      type: String,
      default: ''
    },
    detailAddress: {
      type: String,
      default: ''
    },
    detailAddressLan2: {
      type: String,
      default: ''
    },
    addressType: {
      type: String,
      default: ''
    },
    isDefault: {
      type: String,
      default: ''
    },
    postCode: {
      type: String,
      default: ''
    },
    remark: {
      type: String,
      default: ''
    }
  },
  data() {
    const validateArea = (rule = {}, value = [], callback) => {
      const len = value.filter(x => x).length
      if (len < 3) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    }

    return {
      isEdit: this.addressId !== 0,
      addressForm: {
        contactPerson: '',
        contactTelephone: '',
        area: [],
        detailAddress: '',
        detailAddressLan2: '',
        addressType: '0',
        isDefault: '0',
        postCode: '',
        remark: ''
      },
      rules: {
        contactPerson: [
          { required: true, message: this.$t('请输入联系人'), trigger: 'change' }
        ],
        contactTelephone: [
          { required: true, pattern: /^1\d{10}$/, message: this.$t('请输入正确的手机号'), trigger: 'change' }
        ],
        area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: true,
            message: this.$t('请完整地选择省市区')
          }
        ],
        detailAddress: [
          { required: true, message: this.$t('请输入详细地址'), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    getAddOrEdit() {
      return this.isEdit ? this.$t('编辑') : this.$t('新增')
    }
  },
  mounted() {
    if (this.isEdit) {
      this.addressForm.id = this.addressId
      this.addressForm.contactPerson = this.contactPerson
      this.addressForm.contactTelephone = this.contactTelephone
      this.addressForm.area = [this.provinceCode, this.cityCode, this.regionCode]
      this.addressForm.detailAddress = this.detailAddress
      this.addressForm.detailAddressLan2 = this.detailAddressLan2
      this.addressForm.addressType = this.addressType + ''
      this.addressForm.isDefault = this.isDefault
      this.addressForm.postCode = this.postCode
      this.addressForm.remark = this.remark
    }
  },
  methods: {
    handleInput() {
      this.addressForm.postCode = this.addressForm.postCode.replace(/[^\d]/g, '')
    },
    handleAddAddressCancel() {
      this.$emit('update:visible', false)
    },
    async handleAddAddressSubmit() {
      const [err] = await this.formValidate('addressForm')
      if (err) {
        return
      }

      const { area: [provinceCode, cityCode, regionCode], ...params } = this.addressForm

      params.orgId = this.orgId + ''
      params.provinceCode = provinceCode
      params.cityCode = cityCode
      params.regionCode = regionCode

      if (this.isEdit) {
        await this.$merchant.$api.distributorService.updateMerchantOrgAddressById(params)
      } else {
        await this.$merchant.$api.distributorService.addMerchantOrgAddress(params)
      }

      this.$message({
        message: this.getAddOrEdit + this.$t('地址') + this.$t('成功'),
        type: 'success'
      })
      this.$emit('ok')
    }
  }
}
</script>

<style scoped>

</style>
