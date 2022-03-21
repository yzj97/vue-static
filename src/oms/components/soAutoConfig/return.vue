<template>
  <div>
    <ody-dialog
      :visible="returnVisible"
      :before-close="handleClose"
      :title="$t('' + modalType)"
      width="500px"
      @open="init">
      <section class="pg-timelineReturnSet-list">
        <el-form ref="timeSetForm" :model="formData" :rules="rules" label-width="140px">
          <el-form-item :label="$t('so_return_type')" prop="returnType">
            <el-select v-model="formData.returnType" name="formData_returnType">
              <el-option key="-1" :label="$t('please_choose')"/>
              <el-option
                v-for="item in returnTypeList"
                :key="item.code"
                :label="item.name"
                :value="item.code"/>
            </el-select>
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
          <el-form-item :label="$t('time_limit_audit')" prop="triggerAfterMinutes">
            <ody-input-number v-model="formData.triggerAfterMinutes" :min="0" :max="999999" name="formData_triggerAfterMinutes" placeholder=""/>
            <span>{{ $t('minute') }}</span>
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
    returnVisible: {
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
    modalType: {
      type: String,
      default: 'add'
    }
  },
  data() {
    return {
      appChannelMap: {},
      returnTypeList: [],
      formData: { },
      loading: false,
      submiting: false,
      rules: {
        returnType: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        appChannels: [
          { type: 'array', required: true, message: this.$t('required'), trigger: 'change' }
        ],
        triggerAfterMinutes: [
          { required: false, trigger: 'change' }
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
        appChannels: [],
        type: this.type
      }, this.selectedItem)
      this._initAllChannels()
      this._initCodes()
      if (this.$refs['timeSetForm']) {
        this.$refs['timeSetForm'].resetFields()
      }
    },
    handleClose() {
      this.$emit('update:returnVisible', !this.returnVisible)
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
          if (!form.triggerAfterMinutes) {
            form.triggerAfterMinutes = 0
          }
          form.appChannels = form.appChannels.join(',')
          promise(form).then((res) => {
            vue.$message({
              type: 'success',
              message: this.$t('common_save_success')
            })
            vue.$emit('update:returnVisible', !this.returnVisible)
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
    _initCodes() {
      const vue = this
      this.$oms.$api.common.listByCategorysForOrder({ 'categorys': ['RETURN_TYPE'] }).then((data) => {
        if (data.data.RETURN_TYPE) {
          vue.returnTypeList = data.data.RETURN_TYPE
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
