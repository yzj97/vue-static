<template>
  <div class="cp-week-show">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="{
        active: activeList.indexOf(item) >= 0
      }"
      class="week-item"
    >
      <div class="line"/>
      <div class="circle"/>
      <div class="item">
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    activeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      list: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-week-show {
  position: relative;
  height: 50px;
  padding-left: 24px;
  margin-right: -24px;
  // padding: 0 -24px 0 24px;
  word-spacing: nowrap;
  .week-item {
    position: relative;
    float: left;
    border-bottom: 1px solid #eff2f7;
    height: 42px;
    // width: 14.28%;
    min-width:46px;
    &:last-child {
      border-bottom: none;
    }
    .item {
      // visibility: hidden;
      margin: 0 5px;
      width:46px;
      text-align: center;
      height:18px;
      line-height: 18px;
      font-size:12px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(255,255,255,1);
      background:#eff2f7;
      border-radius:2px;
      line-height:16px;
      position: relative;
      left: -30px;
    }
    .line {
      // visibility: hidden;
      position: absolute;
      left: -1px;
      width:2px;
      height:15px;
      top: 18px;
      background:#eff2f7;
    }
    .circle {
      // visibility: hidden;
      position: absolute;
      left: -7px;
      width:2px;
      height:15px;
      top: 33px;
      width:15px;
      height:15px;
      background:#eff2f7;
      border-radius: 100%;
    }
    &.active {
      .item {
        // visibility: visible;
        background:rgba(255,177,43,1);
      }
      .line {
        // visibility: visible;
        background:rgba(255,177,43,1);
      }
      .circle {
        // visibility: visible;
        background:rgba(255,177,43,1);
      }
    }
  }
}
</style>
