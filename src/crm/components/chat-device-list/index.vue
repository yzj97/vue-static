<template>
  <div class="chat-device-list">
    <div class="first-item">
      {{ $t('设备列表') }}
      <i name="refresh" class="el-icon-refresh-right refresh" @click="refresh"/>
    </div>
    <el-scrollbar wrap-class="menu1-wrap2" style="height:100%">
      <div
        v-for="(item, index ) in list"
        :key="item"
        :class="{active: index === innerChooseIndex}"
        name="changeDevice"
        class="item item-flex"
        @click="changeDevice(index)">
        <el-image
          :src="item.avatar"
          fit="fill"
          style="width: 32px; height: 32px; border-radius: 2px;"/>
        <span class="alias-name">{{ item.nickname ? item.nickname : item.alias }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
export default {
  props: {
    list: {
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
      this.innerChooseIndex = val
    }
  },
  methods: {
    changeDevice(index) {
      this.$emit('update:chooseIndex', index)
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style lang="less" scoped>
.chat-device-list {
  height: 100%;
  background: #3B3F45;
  position: relative;
  padding-top: 48px;

  .first-item {
    background: #32353A;
    .item;
    position: absolute;
    top:0;
    left: 0;
    right: 0;
    font-size: 14px;
    .refresh {
      font-size: 16px;
      float: right;
      margin: 16px 10px 0 0;
      cursor: pointer;
    }
  }
  .active {
    background: #4F555E;
  }
  .item {
    height: 48px;
    line-height: 48px;
    padding-left: 16px;
    color: #ffffff;
    font-weight: 600;
    font-size: 12px;

  }
  .item-flex {
    cursor: pointer;
    display: flex;
    align-items: center;
    .alias-name {
      flex: 1;
      margin-left: 8px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
