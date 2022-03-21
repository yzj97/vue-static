<template>
  <div class="cms-slideshow-imgwidth">
    <div class="slideshow-wrapper">
      <ody-input-number v-model="value" :min="min" :max="max" name="value"/>
      <span>%</span>
    </div>
    <span class="slideshow-margin">(宽度比例需介于25至100之间)</span>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 25
    }
  },
  data() {
    return {
      min: 25,
      max: 100
    }
  },
  watch: {
    value: {
      handler(val) {
        this.$emit('input', val)
      },
      deep: true
    }
  },
  methods: {

  }
}
</script>

<style lang="scss" scoped>

.slideshow-wrapper{
  display: flex;
}
.slideshow-margin{
  font-size: 0.12rem;
  color: #333;
}
</style>
