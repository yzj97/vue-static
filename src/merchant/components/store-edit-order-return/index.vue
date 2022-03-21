<template>
  <div class="">
    <merchant-title>{{ $t('订单退货设置') }}</merchant-title>
    <el-form ref="storeOrderSetting" :model="storeOrderSetting" :rules="rules" :disabled="isView || !loaded">
      <el-radio-group v-model="storeOrderSetting.backFlag" name="storeOrderSetting_backFlag">
        <el-radio id="returnLable1" :label="1">{{ $t('按地址退回') }}</el-radio>
        <div style="margin: 15px 0;"/>
        <el-radio id="returnLable2" :label="2">{{ $t('按仓退回') }}</el-radio>
      </el-radio-group>
      <div v-if="storeOrderSetting.backFlag === 2" style="margin:10px 30px;">
        <el-checkbox v-model="checked" name="checked">{{ $t('指定仓库退回') }}</el-checkbox>
        <div style="margin: 10px 25px;">
          <merchant-select-warehouse
            v-model="storeOrderSetting.warehouseCode"
            :disabled="!checked"
            :placeholder="$t('请选择')"
            name="storeOrderSetting_warehouseCode"/>
        </div>
      </div>
      <div style="margin: 15px 30px">
        <ody-button id="merchantStoreListOrderReturn" name="MerchantStoreListOrderReturn_handleSubmit" code="MerchantStoreListOrderReturn" type="primary" @click="handleSubmit">{{ $t('保存') }}</ody-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'
import MerchantSelectWarehouse from '@/components/select-warehouse'

export default {
  components: {
    MerchantTitle,
    MerchantSelectWarehouse
  },
  data() {
    const { status } = this.$route.params
    let isView = +status === 2
    let isEdit = +status === 1

    if (isEdit) {
      if (!this.$portal.hasPermission('MerchantStoreListEdit')) {
        isEdit = false
        isView = true
      }
    }

    return {
      isEdit,
      isView,
      storeOrderSetting: {},
      checked: true,
      value: '',
      merchantId: '',
      loaded: false
    }
  },
  async mounted() {
    this.merchantId = await this.getMerchantId()
    this.storeOrderSetting = await this.getStoreOrderSetting()
    this.loaded = true
  },
  methods: {
    async getMerchantId() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data = {}} = await this.$merchant.$api.storeService.queryStoreInfo({
        orgId,
        entityType,
        showTab,
        channelMode
      })

      return data.merchantId
    },
    async handleSubmit() {
      const { orgId } = this.$route.params
      const { ...params } = this.storeOrderSetting

      params.orgId = orgId
      params.merchantId = this.merchantId

      if (params.backFlag === 2) {
        if (!this.checked) {
          this.$message({
            type: 'error',
            message: this.$t('请勾选指定仓库退回')
          })
          return false
        }

        if (!params.warehouseCode) {
          this.$message({
            type: 'error',
            message: this.$t('请选择指定仓库')
          })
          return false
        }
      }

      params.warehouseId = params.warehouseCode

      await this.$merchant.$api.storeService.addStoreOrderSetting(params)

      this.$message({
        type: 'success',
        message: this.$t('保存成功')
      })
    },
    async getStoreOrderSetting() {
      const { orgId } = this.$route.params

      const { data } = await this.$merchant.$api.storeService.queryStoreOrderSetting({
        orgId
      })

      if (data) {
        if (data.backFlag === 2) {
          return {
            backFlag: 2,
            warehouseCode: data.warehouseId
          }
        }
        return {
          backFlag: 1,
          warehouseCode: ''
        }
      }

      return {
        backFlag: '',
        warehouseCode: ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
