<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('查看分销商品信息')"
      width="800px"
      @open="init"
    >
      <el-form ref="dpsForm" :model="dpsForm" label-position="right" label-width="80px">
        <el-form-item :label="$t('product_code')" prop="mpCode">
          <span>{{ dpsForm.mpCode }}</span>
        </el-form-item>
        <el-form-item :label="$t('product_name')" prop="mpName">
          <span>{{ dpsForm.mpName }}</span>
        </el-form-item>
        <el-form-item :label="$t('merchant_name')" prop="merchantName">
          <span>{{ dpsForm.merchantName }}</span>
        </el-form-item>
        <el-form-item :label="$t('store_name')" prop="storeName">
          <span>{{ dpsForm.storeName }}</span>
        </el-form-item>
        <el-form-item :label="$t('expiry_date')" prop="expiryDateType">
          <el-radio-group v-model="dpsForm.expiryDateType" name="dpsForm_expiryDateType" disabled="true">
            <el-radio :label="1">{{ $t('permanent_validity') }}</el-radio>
            <el-radio :label="2">
              {{ $t('messageEdit.appointTime') }}
              <el-date-picker
                v-model="dpsForm.expiryStartTimeStr"
                name="dpsForm_expiryStartTimeStr"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                disabled="true"
              />
              <span>-</span>
              <el-date-picker
                v-model="dpsForm.expiryEndTimeStr"
                name="dpsForm_expiryEndTimeStr"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                disabled="true"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('commission_set')" prop="commissionRateType" disabled="true">
          <el-radio-group v-model="dpsForm.commissionRateType" name="dpsForm_commissionRateType" disabled="true">
            <el-radio :label="1">{{ $t('common_default') }}</el-radio>
            <el-radio :label="2">{{ $t('custom') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="dpsForm.commissionRateType==2">
          <el-table v-loading="loading" :data="dpsForm.list" name="dpsForm_list509" width="100%">
            <el-table-column :label="$t('rank_name')" prop="levelName" align="center" width="200" />
            <el-table-column :label="$t('一级销售佣金')" prop="primarySaleCom" align="center" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.primarySaleCom }} {{ dpsForm.comCalcType === 1 ? $t('元') : '%' }}</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('二级销售佣金')"
              prop="secondarySaleCom"
              align="center"
              width="200"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.secondarySaleCom }} {{ dpsForm.comCalcType === 1 ? $t('元') : '%' }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-form-item :label="$t('priority')" prop="priority">
          <ody-input-number v-model="dpsForm.priority" :min="0" :max="999999" name="dpsForm_priority" disabled="true" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
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
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dpsForm: {
        id: null,
        mpId: null,
        mpCode: null,
        mpName: null,
        merchantName: null,
        storeName: null,
        expiryDateType: null,
        expiryStartTimeStr: null,
        expiryEndTimeStr: null,
        commissionRateType: null,
        priority: null,
        list: [],
        comCalcType: 0
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async init() {
      try {
        if (this.id) {
          const params = {}
          params.id = this.id
          this.$agent.$api.distributionProduct
            .getDistributionProductInfo(params)
            .then(result => {
              if (result && result.code === '0') {
                this.dpsForm = result.data
              }
            })
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style scoped>
</style>
