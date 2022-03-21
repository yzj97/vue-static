<template>
  <div class="">
    <merchant-title>{{ $t('客服设置') }}</merchant-title>
    <el-form :disabled="isView || !loaded">
      <el-form-item :label="$t('客服技能组ID')" prop="csTekGroupId">
        <el-input v-model="csTekGroupId" name="csSetting_csTekGroupId" maxlength="40" show-word-limit/>
      </el-form-item>
      <div style="margin: 15px 30px">
        <ody-button id="merchantStoreListCsSetting" name="MerchantStoreListCsSetting_handleSubmit" code="MerchantStoreListCsSetting" type="primary" @click="handleSubmit">{{ $t('保存') }}</ody-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'

export default {
  components: {
    MerchantTitle
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
      csTekGroupId: '',
      checked: true,
      value: '',
      loaded: false
    }
  },
  async mounted() {
    this.csTekGroupId = await this.getStoreCsSetting()
    this.loaded = true
  },
  methods: {
    async handleSubmit() {
      const { orgId } = this.$route.params

      var params = {}
      params.storeId = orgId
      params.csTekGroupId = this.csTekGroupId

      await this.$merchant.$api.storeService.updateStoreCsSetting(params)

      this.$message({
        type: 'success',
        message: this.$t('保存成功')
      })
    },
    async getStoreCsSetting() {
      const { orgId } = this.$route.params

      const { data } = await this.$merchant.$api.storeService.queryStoreCsSetting({
        storeId: orgId
      })

      if (data) {
        return data.csTekGroupId
      }

      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
