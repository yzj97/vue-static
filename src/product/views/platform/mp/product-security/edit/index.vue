<template>
  <div>
    <el-form ref="form" :model="form" :rules="rules" label-width="240px">
      <el-form-item v-if="platformId === '2'" :label="$t('商家')" prop="merchantId">
        <ody-merchant-select
          ref="selectMerchant"
          v-model="form.merchantId"
          :disabled="form.id"
          name="form_merchantId"
          value-key="merchantId"
        />
      </el-form-item>
      <el-form-item :label="$t('保障名称')" prop="title">
        <el-input v-model="form.title" :disabled="view" name="form_title" maxlength="20" />
      </el-form-item>
      <el-form-item :label="$t('保障名称（第二语言）')" prop="titleLan2">
        <el-input v-model="form.titleLan2" :disabled="view" name="form_titleLan2" maxlength="40" />
      </el-form-item>
      <el-form-item :label="$t('保障说明')">
        <el-input
          v-model="form.contentPlain"
          :disabled="view"
          :autosize="{ minRows: 4, maxRows: 6}"
          name="form_contentPlain"
          type="textarea"
          maxlength="140"
        />
      </el-form-item>
      <el-form-item :label="$t('保障说明（第二语言）')">
        <el-input
          v-model="form.contentPlainLan2"
          :disabled="view"
          :autosize="{ minRows: 4, maxRows: 6}"
          name="form_contentPlainLan2"
          type="textarea"
          maxlength="140"
        />
      </el-form-item>
    </el-form>
    <ody-fixed>
      <el-button name="handleReturn" @click="handleReturn">{{ $t('返回') }}</el-button>
      <ody-button
        v-if="!view"
        name="ProductProductSecuritySave_handleSave"
        type="primary"
        code="ProductProductSecuritySave"
        @click="handleSave"
      >{{ $t('保存') }}</ody-button>
    </ody-fixed>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  name: 'ProductProductSecurityEdit',
  data() {
    return {
      platformId: '',
      view: false,
      form: {
        merchantId: '',
        title: '',
        titleLan2: '',
        contentPlain: '',
        contentPlainLan2: ''
      },
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        title: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      }
    }
  },
  mounted() {
    this.initPlatformId().then(() => {
      this.init()
    })
  },
  methods: {
    async initPlatformId() {
      this.platformId = Cookies.get('platformId')
      return Promise.resolve()
    },
    init() {
      const vue = this
      const id = vue.$route.params.id
      vue.view = vue.$route.params.view
      if (id) {
        if (vue.platformId === '1') {
          vue.$product.$api.mpApi
            .queryPlatformMpProtectionById({ id: id })
            .then(res => {
              vue.form = res.data
            })
        } else {
          vue.$product.$api.mpApi
            .queryMerchantProdSecurityById({ id: id })
            .then(res => {
              vue.form = res.data
            })
        }
      }
    },
    handleReturn() {
      this.$router.push({ name: 'ProductProductSecurity' })
      this.$portal.delActiveView()
    },
    handleReturnAndRefresh() {
      this.$router.push({ name: 'ProductProductSecurity' })
      this.$portal.delActiveViewAndRefresh()
    },
    handleSave() {
      const vue = this
      vue.$refs['form'].validate(valid => {
        if (valid) {
          if (this.platformId === '1') {
            vue.form.merchantId = -1
            vue.$product.$api.mpApi
              .platformMpProtectionEdit(vue.form)
              .then(res => {
                vue.$message.success(vue.$t('保存成功'))
                vue.handleReturnAndRefresh()
              })
          } else {
            vue.$product.$api.mpApi
              .merchantProdSecurityEdit(vue.form)
              .then(res => {
                vue.$message.success(vue.$t('保存成功'))
                vue.handleReturnAndRefresh()
              })
          }
        }
      })
    }
  }
}
</script>

<style scoped>
</style>
