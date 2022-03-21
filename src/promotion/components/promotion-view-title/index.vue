<template>
  <div class="bottom">
    <el-row>
      <el-col :span="2">促销活动ID:</el-col>
      <el-col :span="4">{{ detail.activityId }}</el-col>
      <el-col :span="2">活动名称:</el-col>
      <el-col :span="4">{{ detail.title }}</el-col>
      <el-col :span="2">开始时间:</el-col>
      <el-col v-if="detail.startTime" :span="4">{{ detail.startTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-col>
      <el-col :span="2">结束时间:</el-col>
      <el-col v-if="detail.endTime" :span="4">{{ detail.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</el-col>
    </el-row>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  }
}
</script>
<style lang="less" scoped>
  .bottom {
    padding-bottom: 30px;
    border-bottom: 1px solid #f1f1f1;
  }
</style>
