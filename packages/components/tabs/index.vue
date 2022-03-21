<template>
  <div class="cp-tabs">
    <div
      v-for="(item, index) in list"
      :key="index"
      :class="[{active: value === index}]"
      :style="{width: getWidth }"
      class="item"
      @click="handleClick(index)"
    >
      {{ item }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    list: {
      type: Array,
      default: () => {}
    }
  },
  data() {
    return {}
  },
  computed: {
    getWidth() {
      if (this.list.length) {
        return (100 / this.list.length) + '%'
      }
      return '100%'
    }
  },
  methods: {
    handleClick(index) {
      this.$emit('input', index)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-tabs {
  height: 40px;
  .item {
    text-align: center;
    height: 40px;
    line-height: 40px;
    background:rgba(248,248,248,1);
    float: left;
    cursor: pointer;
    &.active {
      background-color: #fff;
    }
  }
}
</style>
