<template>
  <div class>
    <merchant-title>{{ $t('地址标记') }}</merchant-title>
    <merchant-a-map-position v-if="loaded" v-model="mapCenter" :disabled="isView" name="mapCenter" class="mapbox" />
    <div style="margin: 15px 0">
      <ody-button
        :disabled="isView"
        name="MerchantStoreListPositionSave_handleSubmit"
        type="primary"
        code="MerchantStoreListPositionSave"
        @click="handleSubmit"
      >{{ $t('保存') }}</ody-button>
    </div>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'
import MerchantAMapPosition from '@/components/a-map-position'

export default {
  components: {
    MerchantTitle,
    MerchantAMapPosition
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
      storeInfo: {},
      mapCenter: [],
      loaded: false
    }
  },
  async mounted() {
    this.storeInfo = await this.getStoreInfo()
    if (this.storeInfo.longitude && this.storeInfo.latitude) {
      this.mapCenter = [this.storeInfo.longitude, this.storeInfo.latitude]
    }
    this.loaded = true
  },
  methods: {
    async getStoreInfo() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data } = await this.$merchant.$api.storeService.queryStoreInfo({
        orgId,
        entityType,
        showTab,
        channelMode
      })

      return data
    },
    async handleSubmit() {
      const { ...params } = this.storeInfo
      params.longitude = this.mapCenter[0]
      params.latitude = this.mapCenter[1]
      await this.$merchant.$api.storeService.updateStoreInfo({ ...params })

      this.$message({
        message: this.$t('保存成功'),
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
