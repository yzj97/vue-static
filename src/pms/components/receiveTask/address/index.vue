<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('manual_address_list')"
      width="700px"
      @open="init" > <!-- 修改地址 -->
      <section>
        <el-radio-group v-model="addressId" name="addressId">
          <el-row v-for="address in addressList" :key="address.id" >
            <el-radio :label="address.id">
              <el-tooltip v-if="address.userName.length > 5" :content="address.userName" effect="dark" placement="top-start">
                <span>{{ address.userName.substring(0, 5) + '...' }} </span>
              </el-tooltip>
              <span v-if="address.userName.length <= 5" >{{ address.userName }} </span>
              &nbsp;&nbsp;&nbsp;
              {{ address.mobile }}
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
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <el-button :disabled="!addressId" name="selectAddress" size="small" type="primary" @click="selectAddress">{{ $t('ok') }}</el-button>
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
    userId: {
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
      this.loadAddressList()
    },
    async loadAddressList() {
      const params = {
        userId: this.userId,
        channelCode: this.channelCode
      }
      const res = await this.$oms.$api.thirdData.queryAddressList(params)
      if (res.code === '0') {
        this.addressList = res.data
        this.addressList.forEach(element => {
          element.addressInfo = element.provinceName + element.cityName + element.regionName + element.detailAddress
        })
      }
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

<style scoped>

</style>
