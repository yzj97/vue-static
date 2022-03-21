<template>
  <div class="cp-cms-bulletin">
    <div :style="barStyle" name="goLink" class="notice-bar" @click="goLink">
      <div v-if="model.imgUrl" class="notice-bar__icon">
        <img :src="model.imgUrl" alt="" height="100%">
      </div>
      <div ref="wrap" class="notice-bar__wrapper">
        <div
          ref="content"
          :class="animationClass"
          :style="contentStyle"
          class="notice-bar__content"
          @aniamtionend="onAnimationEnd"
          @webkitAnimationEnd="onAnimationEnd"
          @webkitAnimationIteration="onAnimationIteration"
          @animationiteration="onAnimationIteration">
          <slot>{{ model.content }}</slot>
        </div>
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
      animationClass: '',
      wrapWidth: 0,
      offsetWidth: 0,
      duration: 0,
      first: true,
      speed: 50,
      delay: 1
    }
  },
  computed: {
    barStyle() {
      return {
        color: this.model.fontColor,
        backgroundColor: this.model.bgColor
      }
    },
    contentStyle() {
      return {
        paddingLeft: this.first ? 0 : this.wrapWidth + 'px',
        animationDelay: (this.first ? this.delay : 0) + 's',
        animationDuration: this.duration + 's'
      }
    }
  },
  watch: {
    'model.content': {
      handler(val) {
        this.$nextTick(() => {
          const { wrap, content } = this.$refs
          if (!val) {
            return
          }
          const wrapWidth = wrap.getBoundingClientRect().width
          const offsetWidth = content.getBoundingClientRect().width

          if (!this.wrapWidth) {
            this.wrapWidth = wrapWidth
            this.offsetWidth = offsetWidth
            this.duration = offsetWidth / this.speed
            this.animationClass = 'notice-bar__play'
          }
        })
      },
      immediate: true
    }
  },
  mounted() {
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    onAnimationEnd() {
      this.first = false
      this.$nextTick(_ => {
        this.duration = (this.wrapWidth + this.offsetWidth) / this.speed
        this.animationClass = 'notice-bar__play--infinite'
      })
    },
    onAnimationIteration() {
      // console.log(111)
    },
    goLink() {
      if (!this.baseConfig.isEdit && this.model.link && this.operation.goLink) {
        this.operation.goLink(this.model.link)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-cms-bulletin {
  position: relative;
  z-index: 1;
}
 .notice-bar {
    display: flex;
    position: relative;
    padding: 0.09rem 0.15rem;
    font-size: 0.12rem;
    line-height: 1.5;
    color: #333;
  }

  .notice-bar__icon {
    height: 0.18rem;
    min-width: 0.2rem;
    box-sizing: border-box;
  }
  .notice-bar__wrapper {
    flex: 1;
    margin-left: 0.1rem;
    height: 0.18rem;
    overflow: hidden;
    position: relative;
    box-sizing: border-box;
  }

  .notice-bar__content {
    padding-top: 1px;
    position: absolute;
    white-space: nowrap;
  }

  .notice-bar__play {
    animation: notice-bar-play linear both;
  }

  .notice-bar__play--infinite {
    animation: notice-bar-play-infinite linear infinite both;
  }

  @keyframes notice-bar-play {
    100% {
      transform: translate3d(-100%,0,0)
    }
  }
  @keyframes notice-bar-play-infinite {
    100% {
      transform: translate3d(-100%,0,0)
    }
  }
</style>
