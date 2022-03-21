<template>
  <div class="cp-page-list">
    <div
      v-for="(page, index) in pageList"
      :key="index"
      :class="{'active': index === innerChooseIndex}"
      name="changePage"
      class="item"
      @click="changePage(index)">
      {{ page.label }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageList: {
      type: Object,
      default: () => {}
    },
    chooseIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      innerChooseIndex: this.chooseIndex
    }
  },
  watch: {
    chooseIndex(val) {
      // console.log(val)
      this.innerChooseIndex = val
    }
  },
  methods: {
    changePage(index) {
      this.$emit('changeChooseIndex', index)
    }
  }
}
</script>

<style lang="scss" scoped>
  .cp-page-list {
    width: 120px;
    padding: 10px;
    height: 900px;
    background-color: #F8F8F8;
    .item {
      width: 100px;
      height: 40px;
      font-size:14px;
      font-family:PingFangSC-Regular,PingFang SC;
      font-weight:400;
      color:rgba(51,51,51,1);
      line-height:40px;
      text-align: center;
      cursor: pointer;
      &.active {
        background:rgba(238,238,238,1);
        border-radius:2px;
      }
    }
  }
</style>
