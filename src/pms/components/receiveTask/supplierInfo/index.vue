<template>
  <div style="height: 260px;">
    <el-row>
      <slot>
        <el-col :span="24">
          <span class="title">{{ $t('供应商信息') }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 15px">
          <span class="detail">{{ $t('供应商编码') }}：</span><span class="f14">{{ receiveDetail.supplierCode }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 5px">
          <span class="detail">{{ $t('供应商') }}：</span><span class="f14">{{ receiveDetail.supplierName }}</span>
        </el-col>
        <el-col :span="24" style="margin-top: 5px">
          <span class="detail">{{ $t('联系电话') }}：</span><span class="f14">{{ receiveDetail.supplierMobile }}</span>
        </el-col>
        <el-col :span="24" class="receive-wrap">
          <span class="detail receive-address">{{ $t('联系地址') }}：</span>
          <span class="f14 word">{{ receiveDetail.supplierAddress }}</span>
        </el-col>
      </slot>
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
    return {}
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
.receive-wrap{
  margin-top: 5px;
  display: flex;

  .receive-address{
    display: inline-block;
    min-width: 70px;
  }
}
  .word{
    word-break:break-all;
    word-wrap:break-word
  }

</style>
