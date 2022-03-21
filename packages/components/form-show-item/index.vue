<template>
  <div class="cp-form-show-item">
    <label class="label">
      {{ label }}
    </label>
    <div class="content">
      <span v-if="content">
        {{ content }}
      </span>
      <template v-else>
        <slot />
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.cp-form-show-item {
  margin-bottom: 10px;
  overflow: hidden;
  &::after {
    content: '';
    display: table;
  }
  .label {
    float: left;
    width: 80px;
    text-align: left;
    height:16px;
    font-size:13px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(153,171,180,1);
    line-height:16px;
  }
  .content {
    margin-left: 90px;
    font-size:13px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(69,90,100,1);
    line-height:16px;
  }
}
</style>
