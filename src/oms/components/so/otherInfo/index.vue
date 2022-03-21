<template>
  <div style="height: 260px;">
    <el-row>
      <slot>
        <el-col :span="24">
          <span class="title">{{ $t('其他信息') }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 15px">
          <span class="detail">{{ $t('创建人') }}：</span><span class="f14">{{ soDetail.createUsername }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 5px">
          <span class="detail">{{ $t('销售员') }}：</span><span class="f14">{{ soDetail.salesmanName }}</span>
        </el-col>
      </slot>
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
    return {}
  }
}
</script>

<style lang="less" scoped>
  /deep/ .el-textarea__inner{
    border:none;
    resize: none;
  }
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
