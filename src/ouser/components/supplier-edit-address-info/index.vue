<template>
  <div class="supplier-edit-address-info">
    <el-form
      ref="supplier"
      :model="deliveryAddressInfo"
      :rules="addressInfoRules"
      :disabled="isView || !loaded"
      label-width="200px"
      style="width: 640px;"
      class="inner-form"
    >
      <el-form-item :label="$t('省市区/县')" prop="area">
        <ody-province-city-region-select
          v-if="loaded"
          v-model="deliveryAddressInfo.area"
          :selected.sync="provinceCityRegion"
          name="deliveryAddressInfo_area"
          value-key="id"
        />
      </el-form-item>
      <el-form-item :label="$t('详细地址')" prop="detailAddress">
        <el-input
          v-model="deliveryAddressInfo.detailAddress"
          name="deliveryAddressInfo_detailAddress"
          maxlength="300"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  props: {
    deliveryAddress: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const { editStatus, supplierId, merchant } = this.$route.params
    const isView = +editStatus === 2
    const isEdit = +editStatus === 1
    const isAdd = +editStatus === 0

    const validateArea = (rule, value = [], callback) => {
      const len = value.filter(x => x).length
      if (len < 3) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    }

    return {
      loaded: false,
      supplierId,
      merchant: merchant ? JSON.parse(merchant) : {},
      isEdit,
      isView,
      isAdd,
      provinceCityRegion: [],
      deliveryAddressInfo: {
        area: [], // 省市区/县
        detailAddress: '' // 详细地址
      },
      addressInfoRules: {
        area: [
          {
            trigger: 'change',
            validator: validateArea,
            required: true,
            message: this.$t('请完整地选择省市区')
          }
        ],
        detailAddress: [
          {
            required: true,
            message: this.$t('请输入详细地址'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  async mounted() {
    if (this.isEdit || this.isView) {
      const {
        data: { listObj: [deliveryAddressInfo] = [] } = {}
      } = await this.$ouser.$api.supplier.queryMerchantOrgAddressByOrgId(
        this.supplierId + ''
      )
      const {
        provinceCode,
        cityCode,
        regionCode,
        ...params
      } = deliveryAddressInfo

      params.area = [provinceCode, cityCode, regionCode]

      this.deliveryAddressInfo = params
    }
    this.loaded = true
  }
}
</script>

<style lang="scss" scoped>
</style>
