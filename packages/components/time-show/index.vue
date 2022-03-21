<template>
  <div class="cp-time-show">
    <div v-for="(item, index) in activeList" :key="index" class="time-item">
      <div
        :style="{width: getWidth(item), left: getLeft(item)}"
        :class="{
          'has-value': getHasValue(item)
        }"
        class="line"/>
      <div :style="{left: getLeft(item)}" class="text">
        {{ showText(item) }}
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
    },
    start: {
      type: Number,
      default: null
    },
    end: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      list: [
      ]
    }
  },
  computed: {
  },
  methods: {
    getHasValue(item) {
      const { startTime, endTime } = item

      return startTime !== null || endTime !== null
    },
    showText(item) {
      const { startTime, endTime } = item

      if (this.getHasValue) {
        return startTime + ' ~ ' + endTime
      }

      return ''
    },
    getWidth(item) {
      const { startTime, endTime } = item
      const [startHour, startMin] = startTime.split(':')
      const [endHour, endMin] = endTime.split(':')
      const iStart = +startHour + (startMin / 60)
      const iEnd = +endHour + (endMin / 60)

      return ((iEnd - iStart) * 100 / 24) + '%'
    },
    getLeft(item) {
      const { startTime, endTime } = item
      const [startHour, startMin] = startTime.split(':')
      const [endHour, endMin] = endTime.split(':')
      const iStart = +startHour + (startMin / 60)
      const iEnd = +endHour + (endMin / 60)

      return ((iStart + (iEnd - iStart) / 2) * 100 / 24) + '%'
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-time-show {
  position: relative;
  height: 44px;
  border-bottom: 3px solid #eff2f7;
  .line {
    position: absolute;
    bottom: -6px;
    background:#ef5351;
    box-shadow:0px 0px 6px 0px rgba(154,170,180,0.2);
    border-radius:4px;
    height: 10px;
    transform: translateX(-50%);
    &.has-value {
      min-width: 10px;
    }
  }
  .text {
    position: absolute;
    white-space: nowrap;
    bottom: 20px;
    font-size:16px;
    font-family:PingFangSC-Regular,PingFang SC;
    font-weight:400;
    color:rgba(69,90,100,1);
    line-height:16px;
    transform: translateX(-50%);
  }
}
</style>
