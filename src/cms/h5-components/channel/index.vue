<template>
  <div class="cp-cms-channel">
    <!-- {{ model }} -->
    <img :src="model.backgroundImg" class="channel-background-image">
    <div v-if="model.selected === 1 || model.selected === 2" class="content-wrapper" width="100%">
      <div v-if="model.selectedStyle === 1" class="content">
        <div v-for="(item,index) in model.navigation" :key="index" name="goLink" class="template1-wrapper" @click="goLink(item.link)">
          <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
          <span class="channel-text">{{ item.text }}</span>
        </div>
      </div>
      <div v-if="model.selectedStyle === 2">
        <div class="content">
          <div v-for="(item,index) in fristNavigation" :key="index" name="goLink9" class="template1-wrapper" @click="goLink(item.link)">
            <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
            <span class="channel-text">{{ item.text }}</span>
          </div>
        </div>
        <div class="content">
          <div v-for="(item,index) in secendNavigation" :key="index" name="goLink7" class="template1-wrapper" @click="goLink(item.link)">
            <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
            <span class="channel-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div v-if="model.selected === 3" ref="wrapper" class="content-wrapper">
      <div v-if="model.selectedStyle === 1" ref="cont" class="content">
        <div v-for="(item,index) in model.navigation" :key="index" name="goLink5" class="template1-wrapper" @click="goLink(item.link)">
          <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
          <span class="channel-text">{{ item.text }}</span>
        </div>
      </div>
      <div v-if="model.selectedStyle === 2" ref="cont" >
        <div class="content">
          <div v-for="(item,index) in fristNavigation" :key="index" name="goLink0" class="template1-wrapper" @click="goLink(item.link)">
            <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
            <span class="channel-text">{{ item.text }}</span>
          </div>
        </div>
        <div class="content">
          <div v-for="(item,index) in secendNavigation" :key="index" name="goLink92" class="template1-wrapper" @click="goLink(item.link)">
            <div class="item-image-wrapper"><img :src="item.src" alt="" width="100%"></div>
            <span class="channel-text">{{ item.text }}</span>
          </div>
        </div>
      </div>
      <div class="scrolly-wrapper"><div :style="barStyle" class="show-scrolly"/></div>
      <div/>
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
    baseConfig: { // 传入对于商品 优惠券 组件的基础config
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
      fristNavigation: [],
      secendNavigation: [],
      scrollX: 0,
      scrollWidth: 0,
      windowWidth: 375
    }
  },
  computed: {
    barStyle() {
      if (this.scrollX < 0) {
        const offsetX = Math.abs(this.scrollX) > (this.scrollWidth - this.windowWidth) ? (this.scrollWidth - this.windowWidth) : Math.abs(this.scrollX)
        return {
          marginLeft: (offsetX / (this.scrollWidth - this.windowWidth) / 2 * 100) + '%'
        }
      }
    }
  },
  watch: {
    'model.navigation': {
      handler(val) {
        if (this.model.selectedStyle === 2) {
          this.fristNavigation = this.group(this.model.navigation, (this.model.navigation.length / 2))[0] || []
          this.secendNavigation = this.group(this.model.navigation, (this.model.navigation.length / 2))[1] || []
        }
        if (this.model.selected === 3) {
          this.verScroll()
        }
      }
    }
  },
  mounted() {
    if (!this.baseConfig.isEdit) {
      this.windowWidth = window.innerWidth
    }
    this.$nextTick(() => {
      if (this.model.selectedStyle === 2) {
        this.fristNavigation = this.group(this.model.navigation, this.model.navigation.length / 2)[0] || []
        this.secendNavigation = this.group(this.model.navigation, this.model.navigation.length / 2)[1] || []
      }
      const timer = setTimeout(() => {
        if (timer) {
          clearTimeout(timer)
          if (this.model.selected === 3) {
            this.verScroll()
          }
        }
      }, 0)
    })
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    verScroll() {
      this.$nextTick(() => {
        var length = this.model.selectedStyle === 2 ? this.fristNavigation.length > this.secendNavigation.length ? this.fristNavigation.length : this.secendNavigation.length : this.model.navigation.length
        const width = length * 75
        this.$refs.cont.style.width = width / 100 + 'rem'
        this.scrollWidth = width
        if (!this.scroll) {
          this.scroll = new window.BScroll(this.$refs.wrapper, {
            startX: 0,
            scrollX: true,
            scrollY: false,
            probeType: 3,
            click: true
          })
          this.scroll.on('scroll', (pos) => {
            this.scrollX = Math.round(pos.x)
          })
        } else {
          this.scroll.refresh()
        }
      })
    },
    group(array, subGroupLength) {
      let index = 0
      const newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, index += subGroupLength))
      }
      return newArray
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
.cp-cms-channel {
  position: relative;
  z-index: 1;
  overflow: hidden;
}
.content-wrapper{
  position: relative;
}
.channel-background-image{
  position: absolute;
  width: 100%;
  min-height: 100%;
}
.content{
  display: flex;
}
.template1-wrapper{
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 0.75rem;
  padding: 0.05rem 0 0.15rem 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item-image-wrapper{
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  overflow: hidden;
  background-color: #E7F3FF;
}
.channel-text{
  padding-top: 0.03rem;
  font-size: 0.12rem;
  color: #333;
}
.template-style-wrapper{
display: block;
}
.scrolly-wrapper{
  position: absolute;
  bottom: 0.05rem;
  left: 50%;
  transform:translateX(-50%) ;
  width: 0.43rem;
  height: 0.03rem;
  background-color: #D4D7DE;
  border-radius:0.04rem ;
}
.show-scrolly{
  width: 0.21rem;
  height: 0.03rem;
  background-color: #FE6D2A;
  border-radius:0.04rem ;
}
</style>
