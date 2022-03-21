<template>
  <div v-if="showEle" name="goLink" class="cp-cms-count-down" @click="goLink(model.link)">
    <img :src="model.backgroundImg" class="count-down-background-image">
    <div class="countdown-wrapper">
      <span :style="descStyle" class="desc-wrapper">{{ model.desc }}</span>
      <div :style="barStyle" class="content-wrapper">
        <span :style="tipColor">{{ $t('剩') }}</span>
        <div :style="styleColor" class="down-wrapper">{{ time.days }}</div><span :style="tipColor">{{ $t('天') }}</span>
        <div :style="styleColor" class="down-wrapper">{{ time.hours }}</div>:
        <div :style="styleColor" class="down-wrapper">{{ time.minutes }}</div>:
        <div :style="styleColor" class="down-wrapper">{{ time.seconds }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      time: { days: '00', hours: '00', minutes: '00', seconds: '00' },
      showEle: true
    }
  },
  computed: {
    barStyle() {
      return {
        textAlign: this.model.style === 2 ? 'right' : 'left',
        color: this.model.symboColor
      }
    },
    descStyle() {
      return {
        color: this.model.descColor
      }
    },
    tipColor() {
      return {
        color: this.model.tipColor
      }
    },
    styleColor() {
      return {
        color: this.model.styleColor,
        background: this.model.stylebgColor
      }
    }
  },
  watch: {
    'model.countDownUse': {
      handler(val) {
        this.countDown()
      }
    }
  },
  mounted() {
    this.countDown()
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    timeFormat(param) {
      return param < 10 ? '0' + param : param
    },
    countDown(it) {
      var interval = setInterval(() => {
        if (!this.model.countDownUse) { // 清空时间之后恢复默认
          obj = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
          this.time = obj
          clearInterval(interval)
          return
        }
        const newTime = new Date().getTime() // 开始时间
        const endTime = this.model.countDownUse[1] // 结束时间
        let obj = null
        if (endTime - newTime > 0) {
          const time = (endTime - newTime) / 1000
          const day = parseInt(time / (60 * 60 * 24))
          const hou = parseInt(time % (60 * 60 * 24) / 3600)
          const min = parseInt(time % (60 * 60 * 24) % 3600 / 60)
          const sec = parseInt(time % (60 * 60 * 24) % 3600 % 60)
          obj = {
            days: this.timeFormat(day),
            hours: this.timeFormat(hou),
            minutes: this.timeFormat(min),
            seconds: this.timeFormat(sec)
          }
        } else { // 活动已结束，全部设置为'00'
          obj = {
            days: '00',
            hours: '00',
            minutes: '00',
            seconds: '00'
          }
          if (!this.baseConfig.isEdit) {
            this.showEle = false
          }
          clearInterval(interval)
        }
        this.time = obj
      }, 1000)
    },
    goLink(linkObj) {
      if (linkObj && !this.baseConfig.isEdit && this.operation.goLink) {
        this.operation.goLink(linkObj)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-count-down {
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.count-down-background-image{
  position: absolute;
  width: 100%;
  min-height: 100%;
}
.countdown-wrapper{
  position: relative;
  padding: 0 0.13rem;
  min-height: 0.4rem;
  line-height: 0.4rem;
  display: flex;
}
.desc-wrapper{
  font-weight: 600;
  font-size: 0.2rem;
  padding-right: 0.08rem;
}
.content-wrapper{
  font-size: 0.14rem;
  flex: 1;
}
.down-wrapper{
  width: 0.202rem;
  min-height: 0.22rem;
  text-align: center;
  line-height: 0.22rem;
  border-radius: 0.02rem;
  margin-right: 0.03rem;
  display: inline-block;
}

</style>

