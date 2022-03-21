<template>
  <div class="cp-cms-slider">
    <!-- {{ model }} -->
    <div v-if="model.manner === 1" :style="getBgStyle" class="bg"/>
    <div ref="mySwiper" :options="swiperOptions" :style="swiperStyle" class="swiper-container">
      <div class="swiper-wrapper">
        <div v-for="(item,index) in model.pictureList" :key="index" class="swiper-slide">
          <img :src="item.src || require('@/img/goods-default.png')" :style="imgStyle" name="goLink" class="swiper-img" @click="goLink(item.link)" >
        </div>
      </div>
      <div :style="styleStyle" class="swiper-pagination"/>
    </div>
  </div>
</template>

<script>
import eventBus from '@/utils/eventBus'
export default {
  props: {
    model: {
      type: Object,
      default: () => {}
    },
    itemData: { // 只有排在第二位的时候才发
      type: Object,
      default: () => {}
    },
    operation: {
      type: Object,
      default: () => {}
    },
    baseConfig: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    const self = this
    return {
      headerHeight: 90,
      realIndex: 0,
      currentItem: { colorStyle: 1, color: '#1890FF', src: '', height: 290, link: {}, endcolor: '' },
      swiperOptions: {
        observer: true,
        autoHeight: true,
        loop: true,
        autoplay: {
          disableOnInteraction: false
        },
        pagination: {
          el: '.swiper-pagination',
          type: 'custom',
          autoplayDisableOnInteraction: false,
          renderCustom: function(swiper, current, total) {
            var paginationHtml = ' '
            if (self.model.style === 1) { // 样式1
              for (var i = 0; i < total; i++) {
                if (i === (current - 1)) {
                  paginationHtml += '<span class="swiper-pagination-customs swiper-pagination-customs-active"></span>'
                } else {
                  paginationHtml += '<span class="swiper-pagination-customs"></span>'
                }
              }
            } else { // 样式二
              paginationHtml = '<span class="swiper-pagination-customs-manner">' + current + '/' + total + '</span>'
            }

            return paginationHtml
          }
        },
        on: {
          slideChange() {
            self.realIndex = this.realIndex
            // console.log(self.realIndex)
            self.currentItem = self.model.pictureList[self.realIndex]
            self.currentItem.height = self.model.pictureList[self.realIndex].height
            if (self.itemData.sortValue === 1 && self.model.manner === 1) {
              const background = self.currentItem.colorStyle === 1
                ? self.currentItem.color
                : 'linear-gradient(' + self.currentItem.color + ',' + self.currentItem.endcolor + ')'
              const height = self.currentItem.height / 2 - 30
              console.log(background, height, 1111)
              eventBus.$emit('CmsChangeBgColor', { background, height })
            } else {
              eventBus.$emit('CmsChangeBgColor', { background: 'transparent', height: self.currentItem.height / 2 - 30 })
            }
          }
        }
      }
    }
  },
  computed: {
    getBgStyle() {
      return {
        height: (this.currentItem.height / 2 + this.headerHeight - 30) / 100 + 'rem',
        marginTop: -(this.headerHeight / 100) + 'rem',
        background: this.currentItem.colorStyle === 1 ? this.currentItem.color : 'linear-gradient(' + this.currentItem.color + ',' + this.currentItem.endcolor + ')'
      }
    },
    swiperStyle() {
      return {
        height: (this.currentItem.height / 2) / 100 + 'rem'
      }
    },
    imgStyle() {
      return {
        width: this.model.manner === 1 ? 3.55 + 'rem' : 100 + '%',
        marginLeft: this.model.manner === 1 ? 0.1 + 'rem' : 0,
        marginRight: this.model.manner === 1 ? 0.1 + 'rem' : 0,
        height: (this.currentItem.height / 2) / 100 + 'rem',
        borderRadius: this.model.manner === 1 ? 0 + 'rem' : 0
      }
    },
    styleStyle() {
      return {
        justifyContent: this.model.style === 1 ? 'center' : 'flex-end'
      }
    },
    swiper() {
      return this.$refs.mySwiper.$swiper
    }
  },
  watch: {
    'model.pictureList': {
      handler(val) {
        if (this.model.pictureList.length > 0) {
          this.currentItem = this.model.pictureList[0]
          this.model.height = this.model.pictureList[0].height
        }
        this.$nextTick(() => {
          if (this.$refs.mySwiper.$swiper) {
            this.$refs.mySwiper.$swiper.destroy()
          }
          this.$refs.mySwiper.$swiper = new window.Swiper(this.$refs.mySwiper, this.swiperOptions)
        })
      },
      deep: true,
      immediate: true
    }
  },
  created() {
    // 接受来自头部的通信 知道有多高
    eventBus.$on('CmsHeaderHeight', this.setHeaderHeight)
  },
  beforeDestroy() {
    eventBus.$off('CmsHeaderHeight', this.setHeaderHeight)
    window.removeEventListener('scroll', this.handler, true)
  },
  mounted() {
    if (this.model.pictureList.length > 0) {
      this.currentItem = this.model.pictureList[0]
      this.model.height = this.model.pictureList[0].height
    }
    window.addEventListener('scroll', this.handler, true)

    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    setHeaderHeight(res) {
      this.headerHeight = res
    },
    handler() {
      const boundRectObj = this.$el.getBoundingClientRect()
      if (boundRectObj.top < 0 && this.swiper && this.swiper.autoplay && this.swiper.autoplay.running) {
        this.swiper.autoplay.stop()
      } else if (boundRectObj.top > 0 && this.swiper && this.swiper.autoplay && !this.swiper.autoplay.running) {
        this.swiper.autoplay.start()
      }
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

/deep/.swiper-pagination-custom{
  height: 0.25rem;
  display: flex;
  align-items: center;
  bottom:0;
  padding: 0 0.06rem;
  box-sizing: border-box;
  .swiper-pagination-customs{
    width: 0.04rem;
    height: 0.04rem;
    border-radius: 50%;
    background:rgba($color: #fff, $alpha: 0.7);
    margin-right: 0.12rem;
  }
  .swiper-pagination-customs-active{
    width: 0.16rem;
    height: 0.04rem;
    border-radius: 0.05rem;
    background: #fff;
    margin-right: 0.12rem;
  }
  .swiper-pagination-customs-manner{
    background: rgba($color: #666, $alpha: 0.7);
    color: #fff;
    font-size: 0.12rem;
    padding: 0 0.1rem;
    border-radius: 0.4rem;
    box-sizing: border-box;
  }

}
.cp-cms-slider {
  .bg {
    width:100%;
    // height:2.00rem;
    border-radius:0rem 0rem 0.15rem 0.15rem;
    position: absolute;
    // margin-top: -1.05rem;
    z-index: 0;
    transition: background 0.3s ease-in-out;
  }
  .swiper-container {
    position: relative;
    // padding: 0 0.2rem;
    z-index: 1;
    .swiper-slide{
      width: 100% !important;
    }
  }
}
</style>
