<template>
  <div class="cp-batch-icon">
    <div class="cp-batch-icon__bg"/>
    <div class="cp-batch-icon__batch">{{ $t('批') }}</div>
  </div>
</template>
<style lang="scss" scoped>
.cp-batch-icon {
  &__bg {
    position: absolute;
    content: '';
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    border-top: 30px solid red;
    border-right: 30px solid transparent;
  }
  &__batch {
    position: absolute;
    top: 2px;
    left: 2px;
    height: 12px;
    width: 12px;
    line-height: 12px;
    font-size: 12px;
    color: #fff;
  }
}
</style>
