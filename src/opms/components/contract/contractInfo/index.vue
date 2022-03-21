<template>
  <section>
    <el-row>
      <el-col :span="24">
        <el-form ref="baseInfo" :model="contractInfo" label-width="240px">
          <el-card shadow="never">
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('contract_contractCode')">
                  <span>{{ contractInfo.contractCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_supplier_code')">
                  <span>{{ contractInfo.supplierCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_supplier_name')">
                  <span>{{ contractInfo.supplierName }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('contract_contractType')">
                  <span>{{ contractInfo.contractTypeText }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_currency')">
                  <span>{{ contractInfo.currencyCode }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_contractStatus')">
                  <span>{{ contractInfo.contractStatusText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item :label="$t('common_createTime')">
                  <span>{{ contractInfo.createTimeStr }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('common_merchant_name')">
                  <span>{{ contractInfo.merchantName }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item :label="$t('contract_version')">
                  <span>{{ contractInfo.versionNo }}</span>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row v-if="platformId === 1">
              <el-col :span="8">
                <el-form-item :label="$t('purchaseReturnOrder_product_contractProperty')" :rules="contractInfo.contractPropertyText ? null : rules.contractProperty" prop="contractProperty">
                  <el-select v-show="!contractInfo.contractPropertyText" v-model="contractInfo.contractProperty" name="contractInfo_contractProperty">
                    <el-option value="">{{ $t('common_choose_please') }}</el-option>
                    <el-option v-for="(v, k) in contractPropertyMap" :key="k" :label="v" :value="k" />
                  </el-select>
                  <span v-if="contractInfo.contractPropertyText">{{ contractInfo.contractPropertyText }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-card>
        </el-form>
      </el-col>
    </el-row>
  </section>
</template>

<script>
export default {
  props: {
    contractInfo: {
      type: Object,
      default: null
    },
    platformId: {
      type: Number,
      default: null
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    contractPropertyMap: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      rules: {
        contractProperty: [
          { required: true, message: this.$t('please_choose'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    validateForm() {
      const vue = this
      let result = false
      vue.$refs['baseInfo'].validate(valid => {
        if (valid) {
          result = true
        } else {
          return false
        }
      })
      return result
    }
  }
}
</script>

<style scoped>

</style>
