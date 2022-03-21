<template>
  <div slot="tabs">
    <el-card>
      <el-tabs v-model="activeState" name="activeState">
        <!--积分基础设置-->
        <el-tab-pane :label="$t('point_basic_config')">
          <point />
        </el-tab-pane>
        <!--等级基础设置-->
        <el-tab-pane :label="$t('level_basic_config')">
          <growth />
        </el-tab-pane>
        <!--操作日志-->
        <el-tab-pane :label="$t('operation_log')">
          <log />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import Log from '@/components/basicConfig/log'
import Point from '@/components/basicConfig/point'
import Growth from '@/components/basicConfig/growth'

export default {
  name: 'OuserCenterRuleConfig',
  components: {
    Log,
    Point,
    Growth
  },
  data() {
    return {
      activeState: '0'
    }
  }
}
</script>

<style lang="scss" scoped>
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
