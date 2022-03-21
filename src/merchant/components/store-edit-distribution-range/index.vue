<template>
  <div class>
    <merchant-title>{{ $t('配送范围') }}</merchant-title>
    <merchant-a-map-range
      v-if="loaded"
      v-model="mapRange"
      :map-center="mapCenter"
      :disabled="isView"
      name="mapRange"
      class="mapbox"
      @clearAll="clear"
    />
    <div style="margin: 15px 0">
      <ody-button
        :disabled="isView"
        name="MerchantStoreListDistributionRange_handleSubmit"
        type="primary"
        code="MerchantStoreListDistributionRange"
        @click="handleSubmit"
      >{{ $t('保存') }}</ody-button>
    </div>
  </div>
</template>

<script>
import MerchantTitle from '@/components/title'
import MerchantAMapRange from '@/components/a-map-range'

export default {
  components: {
    MerchantTitle,
    MerchantAMapRange
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
      isView,
      isEdit,
      mapRange: [],
      loaded: false,
      clearAll: false,
      mapCenter: []
    }
  },
  // watch: {
  //   'mapRange': {
  //     handler(value, oldValue) {
  //       console.log('mapRange改变')
  //     },
  //     deep: true
  //   }
  // },
  async mounted() {
    await this.init()
  },
  methods: {
    async init() {
      this.loaded = false
      this.mapRange = await this.getPois()
      this.storeInfo = await this.getStoreInfo()
      if (this.storeInfo.longitude && this.storeInfo.latitude) {
        this.mapCenter = [this.storeInfo.longitude, this.storeInfo.latitude]
      }
      this.loaded = true
    },
    async getPois() {
      this.clearAll = false
      const { orgId: id } = this.$route.params
      const {
        data: { pois = [] } = {}
      } = await this.$merchant.$api.storeService.queryStoreCoverageMap({
        id
      })
      return pois
    },
    clear() {
      this.clearAll = true
    },
    async handleSubmit() {
      const { orgId } = this.$route.params

      const params = {
        orgId
      }

      // 没数据代表清空
      if (this.mapRange && this.mapRange.length) {
        params.coverageMapVO = {
          id: null,
          orgId,
          pois: this.mapRange
        }
      }
      params.clearAll = this.clearAll
      await this.$merchant.$api.storeService.updateStoreCoverageInfo(params)
      this.clearAll = false
      this.$message({
        message: this.$t('保存成功'),
        type: 'success'
      })
      // 重新加载数据
      // await this.init()
    },
    async getStoreInfo() {
      const { orgId, entityType, showTab, channelMode } = this.$route.params
      const { data } = await this.$merchant.$api.storeService.queryStoreInfo({
        orgId,
        entityType,
        showTab,
        channelMode
      })

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
