<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t(''+ modalType)"
      width="500px"
      @open="init">
      <section class="pg-timelineSet-list">
        <el-form ref="timeSetForm" :model="formData" :rules="rules" label-width="140px">
          <el-form-item :label="$t('order_source')" prop="orderSource">
            <el-select v-model="formData.orderSource" name="formData_orderSource">
              <el-option key="-1" :label="$t('please_choose')"/>
              <el-option
                v-for="item in orderSourceList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('paymentType')" prop="paymentType">
            <el-select v-model="formData.paymentType" name="formData_paymentType">
              <el-option key="-1" :label="$t('please_choose')"/>
              <el-option
                v-for="item in payMethodList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item v-if="type != 0" :label="$t('OrderTriggeringState')" prop="orderTriggerStatus">
            <el-select v-model="formData.orderTriggerStatus" name="formData_orderTriggerStatus">
              <el-option
                v-for="item in orderTriggerStatusList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('system_auto') + typeName + $t('time')" prop="triggerAfterMinutes">
            <ody-input-number v-model="formData.triggerAfterMinutes" :min="0" :max="999999" name="formData_triggerAfterMinutes" placeholder=""/>
            <span>{{ $t('minute') }}</span>
          </el-form-item>
          <el-form-item :label="$t('so_return_channel_code')" prop="appChannels">
            <el-select v-model="formData.appChannels" name="formData_appChannels" multiple="true" placeholder="">
              <el-option
                v-for="(value, key) in appChannelMap"
                :key="key"
                :label="value"
                :value="key"/>
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button :disabled="submiting" name="OmsSoAutoConfig_Save_handleOk" code="OmsSoAutoConfig_Save" type="primary" @click="handleOk('timeSetForm')">{{ $t('ok') }}</ody-button>
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
    selectedItem: {
      type: Object,
      default: null
    },
    type: {
      type: Number,
      default: null
    },
    typeName: {
      type: String,
      default: ''
    },
    modalType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      appChannelMap: {},
      orderSourceList: [],
      payMethodList: [],
      orderStatusList: [],
      formData: {},
      loading: false,
      submiting: false,
      rules: {
        orderSource: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        paymentType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        orderTriggerStatus: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        triggerAfterMinutes: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        appChannels: [
          { type: 'array', required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  async mounted() {
    try {
      await this.init()
    } catch (ex) {
      console.log(ex)
    }
  },
  methods: {
    async init() {
      this.formData = Object.assign({
        triggerAfterMinutes: null,
        orderTriggerStatus: null,
        appChannels: [],
        type: this.type
      }, this.selectedItem)
      if (typeof this.formData.orderSource !== 'undefined') {
        this.formData.orderSource = this.formData.orderSource + ''
      }
      this._initAllChannels()
      this._initCategoryForOrder()
      if (this.$refs['timeSetForm']) {
        this.$refs['timeSetForm'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.submiting = true
          let promise = vue.$oms.$api.soAutoConfig.soAutoConfigUpdate
          if (vue.modalType === 'add') {
            promise = vue.$oms.$api.soAutoConfig.soAutoConfigAdd
          }
          const form = Object.assign({}, vue.formData)
          form.appChannels = form.appChannels.join(',')
          promise(form).then((res) => {
            vue.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            vue.$emit('update:visible', !this.visible)
            vue.$emit('ok')
          }).finally(() => {
            vue.submiting = false
          })
        }
      })
    },
    async _initAllChannels() {
      const res = await this.$oms.$api.common.listAllChannels({})
      if (res && res.data) {
        const map = res.data
        for (var p in map) {
          var o = map[p]
          this.appChannelMap[o.channelCode] = o.channelName
        }
      }
    },
    _initCategoryForOrder() {
      const vue = this
      const baseUrl = '/oms-web/public/order/code/listByCategory'
      this.$portal.get(baseUrl + '/ORDER_SOURCE', {}).then(res => {
        vue.orderSourceList = res.data
      })
      const paymentType = this.type === 0 ? '/AUTO_CANCEL_PAY_METHOD' : '/SIGN_PAYMENT_TYPE'
      this.$portal.get(baseUrl + paymentType, {}).then(res => {
        vue.payMethodList = res.data
      })
      this.$portal.get(baseUrl + '/ORDER_STATUS', {}).then(res => {
        vue.orderStatusList = res.data
        vue._chooseOrderTriggerStatus()
      })
    },
    _chooseOrderTriggerStatus: function() {
      this.orderTriggerStatusList = []
      const vue = this
      this.orderStatusList.forEach(item => {
        item.code = Number(item.code)
        if ((vue.type === 1 && item.code === 1060) || (vue.type === 2 && item.code === 1070)) {
          vue.orderTriggerStatusList.push(item)
          vue.formData.orderTriggerStatus = item.code
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
