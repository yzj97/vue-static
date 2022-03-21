<template>
  <div>
    <el-row>
      <el-steps :active="active" align-center="true" finish-status="success">
        <el-step
          v-for="item in stepInfo"
          :key="item.title"
          :title="item.title"
          :description="item.desc"/>
      </el-steps>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    stepInfo: {
      type: Object,
      default: function() {
        return []
      }
    },
    orderStatus: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      active: 0
    }
  },
  watch: {
    stepInfo: {
      handler(newValue, oldValue) {
        const self = this
        this.stepInfo.forEach((s, index) => {
          if (s.active) {
            self.active = index + 1
          }
        })
      }
    }
  }
}
</script>

<style scoped>
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
</style>
