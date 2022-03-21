<template>
  <div style="height:260px;">
    <el-row style="margin-top: 8px">
      <span class="detail">{{ $t('预计收货日期') }}：</span><span v-if="receiveDetail.expectReceiveDate" class="f14"> {{ $portal.parseTime(receiveDetail.expectReceiveDate, '{y}-{m}-{d}') }}</span>
    </el-row>
    <el-row>
      <div>
        <span class="title">{{ $t('附件') }}</span>
        <a
          v-for="(p, index) in receiveDetail.receiveAttachmentVOList"
          :key="p.id"
          :href="p.path"
          target="_blank"
          style="margin-right: 10px;color: #1287d6"
        >
          {{ '附件' + (index + 1)
          }}
        </a>
      </div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    receiveDetail: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      expectDeliverDateStr: ''
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
