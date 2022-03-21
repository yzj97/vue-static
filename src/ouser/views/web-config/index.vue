<template>
  <div>
    <el-tabs v-model="activeTab" name="activeTab">
      <el-tab-pane :label="$t('PC基础设置')" name="pc"><pc-config/></el-tab-pane>
      <el-tab-pane :label="$t('后台基础设置')" name="back"><admin-config/></el-tab-pane>
      <el-tab-pane :label="$t('H5基础设置')" name="h5"><h5-config/></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import PcConfig from '@/components/pc-config'
import AdminConfig from '@/components/admin-config'
import H5Config from '@/components/h5-config'

export default {
  name: 'OuserWebConfig',
  components: {
    PcConfig,
    AdminConfig,
    H5Config
  },
  data() {
    return {
      activeTab: 'pc'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {

    }
  }
}
</script>

<style scoped>

</style>
