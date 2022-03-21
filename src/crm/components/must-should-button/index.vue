<template>
  <div :class="[{'show-back': action === 'should'}]" class="cp-must-should-button">
    <span key="must" class="face">
      {{ $t('且') }}
    </span>
    <span key="should" class="back">
      {{ $t('或') }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    action: {
      type: String,
      default: null
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.cp-must-should-button {
  width: 28px;
  height: 28px;
  position: absolute;
  top: 0;
  left: 0;
  .face, .back {
    position: absolute;
    top: 0;
    left: 0;
    width: 28px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    backface-visibility: hidden;
    transform-style: preserve-3d;
    transition: transform 1s;
  }
  .face {
    transform: rotateY(0deg);
  }
  .back{
    transform: rotateY(-180deg);
  }
  &.show-back .back{transform:rotateY(0deg);}
  &.show-back .face{transform:rotateY(180deg);}
}
</style>
