<template>
  <div class="center-box">
    <div class="center-box__inner">
      <div class="center-box__inner__title">
        <slot name="title" />
      </div>
      <div class="center-box__inner__text">
        <slot name="text" />
      </div>
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.center-box {
  position: relative;
  &__inner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    line-height: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    &__text {
      font-size: 12px;
      color: #999;
      text-align: center;
      margin-bottom: 10px;
    }
  }
}
</style>
