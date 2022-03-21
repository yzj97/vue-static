<template>
  <div style="height:260px;">
    <el-row>
      <span class="title"><!--预约信息-->{{ $t('预约信息') }}</span>
    </el-row>
    <el-row style="margin-top: 8px">
      <span class="detail"><!--上门服务时间-->{{ $t('上门服务时间') }}：</span><span class="f14">{{ formatterServiceDateTime() }}</span>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    soDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
    },
    formatterServiceDateTime() {
      if (this.soDetail && this.soDetail.serviceDateTime) {
        const dateTime = JSON.parse(this.soDetail.serviceDateTime)
        if (dateTime && dateTime.serviceDate) {
          return dateTime.serviceDate + ' ' + (dateTime.serviceTimeStart ? dateTime.serviceTimeStart.replace(/(\d+):(\d+):(\d+)/g, '$1:$2') : '')
        }
      }
      return ''
    }
  }
}
</script>

<style scoped>
  .f14{
    font-size: 14px;
  }
  .detail {
    font-size: 14px;
    font-weight:400;
    color:rgba(153,171,180,1);
  }
  .title{
    font-size: 14px;
    font-weight:700;
    color:rgba(69,90,100,1)
  }
</style>
