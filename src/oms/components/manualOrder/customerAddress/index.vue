<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('manual_address_list')"
      width="700px"
      @open="init" > <!-- 修改地址 -->
      <section class="pg-addressModal-list" width="100%">
        <el-radio-group v-model="addressId" name="addressId">
          <el-row v-for="address in addressList" :key="address.id">
            <el-radio :label="address.id">
              <el-tooltip v-if="address.contactPerson.length > 5" :content="address.contactPerson" effect="dark" placement="top-start">
                <span>{{ address.contactPerson.substring(0, 5) + '...' }} </span>
              </el-tooltip>
              <span v-if="address.contactPerson.length <= 5" >{{ address.contactPerson }} </span>
              &nbsp;&nbsp;&nbsp;
              {{ address.contactTelephone }}
              &nbsp;&nbsp;&nbsp;
              <el-tooltip v-if="address.addressInfo.length > 20" :content="address.addressInfo" effect="dark" placement="top-start">
                <span>{{ address.addressInfo.length > 20 ? address.addressInfo.substring(0, 20) + '...' : address.addressInfo }} </span>
              </el-tooltip>
              <span v-if="address.addressInfo.length <= 20" >{{ address.addressInfo }} </span>
            </el-radio>
          </el-row>
        </el-radio-group>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="!addressId" name="selectAddress" type="primary" @click="selectAddress">{{ $t('ok') }}</el-button>
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
    customerId: {
      type: Number,
      default: null
    },
    channelCode: {
      type: String,
      default: null
    },
    addressId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      addressList: []
    }
  },
  methods: {
    init() {
      this.addressId = this.addressId
      this.loadAddressList()
    },
    async loadAddressList() {
      const res = await this.$oms.$api.common.queryMerchantOrgAddressByOrgId(JSON.stringify(this.customerId))
      if (res.code === '0' && res.data && res.data.listObj) {
        this.addressList = res.data.listObj
      } else {
        this.addressList = []
      }
      this.addressList.forEach(element => {
        element.addressInfo = element.provinceName + element.cityName + element.regionName + element.detailAddress
      })
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async selectAddress() {
      for (let index = 0; index < this.addressList.length; index++) {
        const element = this.addressList[index]
        if (element.id === this.addressId) {
          this.$emit('ok', element)
          this.handleClose()
          return
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
