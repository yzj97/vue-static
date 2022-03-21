<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('modifyDeliveryDetail')"
      width="25%"
      @open="init" >
      <section class="pg-userModal-list">
        <ody-list-search-area>
          <div slot="content">
            <el-form ref="form" label-width="50px" class="form">
              <ody-search-item :label="$t('so_pick_delivery_merchant')" prop="deliveryCompanyId">
                <el-select v-model="packageData.deliveryCompanyId" :placeholder="$t('请选择')" name="packageData_deliveryCompanyId">
                  <el-option
                    v-for="item in deliveryMerchantList"
                    :key="item.deliveryCompanyId"
                    :label="item.deliveryCompanyName"
                    :value="item.deliveryCompanyId"/>
                </el-select>
              </ody-search-item>
              <ody-search-item :label="$t('deliveryExpressNo')" prop="deliveryExpressNbr">
                <el-input v-model="packageData.deliveryExpressNbr" name="packageData_deliveryExpressNbr"/>
              </ody-search-item>
            </el-form>
          </div>
          <div slot="btn">
            <el-button name="handleClose" size="small" @click="handleClose">{{ $t('cancel') }}</el-button>
            <el-button name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('ok') }}</el-button>
          </div>
        </ody-list-search-area>
      </section>
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
    packageData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    deliveryMerchantList: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  methods: {
    init() {
      console.log('=============' + JSON.stringify(this.packageData))
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const params = {
        id: this.packageData.id,
        deliveryCompanyId: this.packageData.deliveryCompanyId,
        deliveryCompanyName: this.packageData.deliveryCompanyName,
        deliveryExpressNbr: this.packageData.deliveryExpressNbr
      }
      this.$oms.$api.soPackage.parcelListUpdateExpressComAndNbr(params).then(res => {
        console.log(JSON.stringify(res))
        this.handleClose()
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
