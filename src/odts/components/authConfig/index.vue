<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="add ? $t('新增授权') : $t('修改授权')"
      :close-on-click-modal="true"
      width="500px"
      @open="init" > <!-- 新增授权 -->
      <section class="pg-addAuthConfig">
        <el-form ref="form" :rules="rules" :model="formData" label-width="100px" class="form">
          <el-form-item :label="$t('渠道编码')" prop="channelCode">
            <el-select v-model="formData.channelCode" :disabled="!add" name="formData_channelCode" @change="changeChannelCode">
              <el-option v-for="item in channelList" :label="item.channelName" :key="item.channelCode" :value="item.channelCode" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('应用')" prop="appKey">
            <el-select v-model="applicationId" name="applicationId" @change="changeApplicationItem">
              <el-option v-for="item in applicationList" :label="item.envName" :key="item.id" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('商家')" prop="merchantId">
            <el-select v-model="formData.merchantId" :disabled="!add" name="formData_merchantId" @change="loadStoreByMerchant">
              <el-option v-for="item in merchants" :label="item.merchantName" :key="item.merchantId" :value="item.merchantId" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="displayStore" :label="$t('店铺')" prop="storeId">
            <el-select v-model="formData.storeId" :disabled="!add" name="formData_storeId" >
              <el-option v-for="item in storeList" :label="item.storeName" :key="item.storeId" :value="item.storeId" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('授权编码')" prop="authCode">
            <el-input v-model="formData.authCode" name="formData_authCode" maxlength="50" />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button :disabled="submiting" name="OdtsAuthConfig_Save_handleOk" code="OdtsAuthConfig_Save" size="small" type="primary" @click="handleOk('form')">{{ $t('保存') }}</ody-button>
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
    noStoreChannelCodes: {
      type: Array,
      default: () => {
        return []
      }
    },
    authConfig: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      add: true,
      submiting: false,
      channelList: [],
      applicationList: [],
      applicationMap: {},
      channelMap: {},
      merchants: [],
      merchantMap: {},
      storeList: [],
      storeMap: {},
      displayStore: true,
      applicationId: null,
      formData: getDefaultFormData(),
      rules: {
        channelCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        appKey: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        storeId: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ],
        authCode: [
          { required: true, message: this.$t('required'), trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    _initMerchants() {
      const vue = this
      this.$odts.$api.common.queryPlatformAuthMerchantPage({ currentPage: 1, itemsPerPage: 1000 }).then((data) => {
        if (data.code === '0') {
          vue.merchants = data.data.listObj
          vue.merchantMap = vue.merchants.reduce((r, i) => { r[i['merchantId']] = i; return r }, {})
        }
      })
    },
    loadStoreByMerchant() { // 修改商家
      this.storeList = []
      this.storeMap = {}
      this.formData.storeId = null
      this.formData.storeName = null

      if (!this.formData.merchantId) {
        return
      }
      if (this.displayStore) {
        this.loadStore()
      }
    },
    changeChannelCode() { // 修改渠道，变更是否显示店铺
      if (this.formData && this.formData.channelCode) {
        if (this.noStoreChannelCodes && this.noStoreChannelCodes.indexOf(this.formData.channelCode) !== -1) {
          this.displayStore = false
        } else {
          this.displayStore = true
          this.loadStore()
        }
      }
      this.applicationId = null
      this.changeApplicationItem()
      this.loadApplication()
    },
    loadStore() { // 获取商家下店铺
      const vue = this
      vue.formData.storeId = null
      vue.storeList = []
      if (!vue.formData.merchantId || !vue.formData.channelCode) {
        return
      }
      this.$odts.$api.common.queryStoreOrgPageByAuth({ currentPage: 1, itemsPerPage: 1000, merchantId: vue.formData.merchantId }).then((data) => {
        if (data.code === '0') {
          vue.storeList = (data.data.listObj || []).filter(i => i.channelCodes && i.channelCodes.indexOf(vue.formData.channelCode) >= 0)
          vue.storeMap = vue.storeList.reduce((r, i) => { r[i['storeId']] = i; return r }, {})
        }
      })
    },
    async loadApplication() {
      this.applicationList = []
      const vue = this
      await this.$odts.$api.application.queryApplicationInfoList({ channelCode: this.formData.channelCode }).then((data) => {
        if (data.code === '0') {
          vue.applicationList = data.data.listObj || []
          vue.applicationMap = vue.applicationList.reduce((r, i) => { r[i.id] = i; return r }, {})
        }
      })
    },
    changeApplicationItem() {
      let applicationItem = {}
      if (this.applicationId && this.applicationMap[this.applicationId]) {
        applicationItem = this.applicationMap[this.applicationId]
      }
      this.formData.applicationInfoId = applicationItem.id
      this.formData.appKey = applicationItem.appKey
      this.formData.appSecret = applicationItem.appSecret
      this.formData.appKey = applicationItem.appKey
    },
    _loadSupportChannel() {
      const vue = this
      this.$odts.$api.odtsMp.supportChannel({ }).then((data) => {
        if (data.code === '0') {
          vue.channelList = data.data
          vue.channelMap = vue.channelList.reduce((r, i) => { r[i['channelCode']] = i; return r }, {})
        }
      })
    },
    async init() {
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      this.formData = getDefaultFormData()
      this._loadSupportChannel()
      this._initMerchants()
      this.applicationId = null
      this.add = true
      if (this.authConfig && this.authConfig.id) {
        this.add = false
        this.formData = Object.assign(this.formData, this.authConfig)
        await this.loadStore()
        this.formData.storeId = this.authConfig.storeId
        await this.loadApplication()
        for (let i = 0; i < this.applicationList.length; i++) {
          const item = this.applicationList[i]
          if (item.channelCode === this.formData.channelCode && item.appKey === this.formData.appKey) {
            this.applicationId = item.id
            return
          }
        }
        this.changeApplicationItem()
      } else if (this.authConfig && this.authConfig.channelCode) {
        this.add = true
        this.formData = Object.assign(this.formData, this.authConfig)
        await this.loadApplication()
        for (let i = 0; i < this.applicationList.length; i++) {
          const item = this.applicationList[i]
          if (item.channelCode === this.formData.channelCode && item.appKey === this.formData.appKey) {
            this.applicationId = item.id
            return
          }
        }
        this.changeApplicationItem()
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleOk(formName) {
      const vue = this
      if (this.formData.id) {
        if (this.formData.authCode !== this.authConfig.authCode || this.formData.appKey !== this.authConfig.appKey || this.formData.appSecret !== this.authConfig.appSecret) {
          const confirm = await this.$confirm('修改应用或者授权code需要重新获取访问授权，确认修改？', this.$t('提示'))
          if (!confirm) {
            return
          }
        }
      }

      vue.formData.merchantName = vue.merchantMap[vue.formData.merchantId] ? vue.merchantMap[vue.formData.merchantId].merchantName : ''
      vue.formData.storeName = vue.storeMap[vue.formData.storeId] ? vue.storeMap[vue.formData.storeId].storeName : ''
      this.submiting = true
      this.$refs[formName].validate((valid) => {
        if (valid) {
          vue.$odts.$api.authConfig.saveAuthConfig(vue.formData).then(data => {
            if (data.code === '0') {
              vue.$emit('update:visible', !this.visible)
              vue.$emit('ok')
            }
          }).finally(res => {
            vue.submiting = false
          })
        } else {
          vue.submiting = false
        }
      })
    }
  }
}
function getDefaultFormData() {
  return Object.assign({}, {
    channelCode: null,
    applicationInfoId: null,
    appKey: null,
    appSecret: null,
    merchantId: null,
    merchantName: null,
    storeId: null,
    storeName: null,
    authCode: null
  })
}
</script>

<style lang="scss" scoped>

</style>
