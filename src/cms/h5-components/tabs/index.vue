<template>
  <div class="cp-cms-tabs">
    <div ref="container" class="container">
      <component
        ref="sticky"
        :is="model.tabMode === 2 && !baseConfig.isEdit ? `ody-sticky`: `div`"
        :offset-top="offsetTop"
        :container="container"
        @scroll="handleScroll">
        <div ref="tabsWrapper" :style="defaultTabsStyle" class="tabs-wrapper" >
          <ul ref="tabsContent" class="tabs-content">
            <li
              v-for="(item,index) in model.tabs"
              :key="index"
              :label="item.title"
              :ref="`tabItem` + index"
              name="index"
              class="tab"
              @click="handleTabsChange(index)"
            >
              <span
                :style="activeTabsStyle(index)"
                :class="{
                  'tabStyle':model.tabStyle==='style2',
                  'style3': model.tabStyle==='style3',
                  'style2':model.tabStyle==='style1'
                }"
              >
                {{ item.title }}
              </span>
            </li>
          </ul>
        </div>
      </component>
      <!-- {{ model.tabs.tabMode }} -->
      <template v-if="!baseConfig.isEdit && model.tabMode && model.tabMode === 2">
        <template v-if="model.tabInteractive === 1">
          <!-- 标签模块 -->
          <div v-for="(itemsTabs, index) in model.tabs[model.currentTab].modules" :key="index" class="contact-tabs">
            <component
              :is="'cms-' + changeCase(itemsTabs.templateCode, 'kebab')"
              :model="itemsTabs.templateVariable"
              :item-data="itemsTabs"
              :operation="operation"
              :base-config="baseConfig"
              :is-last="isLast && model.currentTab === model.tabs.length - 1 && index === model.tabs[model.currentTab].modules.length - 1"
            />
          </div>
        </template>
        <template v-else-if="model.tabInteractive === 2">
          <!-- 锚点定位 -->
          <div v-for="(tabs, tabsIndex) in model.tabs" :id="tabs.id" :key="tabsIndex">
            <div v-for="(itemsTabs, index) in tabs.modules" :key="index" class="contact-tabs">
              <component
                :is="'cms-' + changeCase(itemsTabs.templateCode, 'kebab')"
                :model="itemsTabs.templateVariable"
                :item-data="itemsTabs"
                :operation="operation"
                :base-config="baseConfig"
                :is-last="isLast && tabsIndex === model.tabs.length - 1 && index === model.tabs[model.currentTab].modules.length - 1"
              />
            </div>
          </div>
        </template>
      </template>
    </div>
  </div>
</template>
<script>
import changeCase from 'packages/utils/change-case'
import eventBus from '@/utils/eventBus'
import OdySticky from './sticky'
// import $ from 'jquery'
const moduleComponents = {}
const allVue = require.context('@/h5-components', true, /index\.vue$/)

allVue.keys().map(key => {
  const match = key.match(/([^/]+)\/index.vue$/)
  if (match && match[1]) {
    moduleComponents['Cms' + changeCase(match[1], 'pascal')] = allVue(
      key
    ).default
  }
})

export default {
  components: {
    ...moduleComponents,
    OdySticky
  },
  props: {
    isLast: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object,
      default: () => {}
    },
    itemData: {
      type: Object,
      default: () => {}
    },
    operation: { // 传入对于商品 优惠券 的基础操作 比如 请求商品 加入购物车 跳转到详情页面
      type: Object,
      default: () => {}
    },
    baseConfig: { // 传入对于商品 优惠券 组件的基础config
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      activeIndex: 0,
      offsetTop: 0,
      container: null,
      lock: false
    }
  },
  computed: {
    defaultTabsStyle() {
      return {
        color: this.model.defaultColor.fontColor,
        background: this.model.defaultColor.bgColor
        // minWidth: (this.model.tabs.length * 94) / 100 + 'rem'
      }
    }
  },
  created() {
    eventBus.$on('CmsHeaderHeight', this.setOffsetTop)
  },
  beforeDestroy() {
    eventBus.$off('CmsHeaderHeight', this.setOffsetTop)
  },
  mounted() {
    this.container = this.$refs.container
    this.$nextTick(() => {
      const timer = setTimeout(() => { // 其实我也不想写这个定时器的，这相当于又嵌套了一层$nextTick，但是不这么写会失败
        if (timer) {
          clearTimeout(timer)
          this.initBScroll()
        }
      }, 0)
    })

    if (this.model && this.model.tabMode === 2) {
      this.model.currentTab = 0
      // this.model.tabs.forEach(tab => {
      //   const $el = document.querySelector(`[id="${tab.id}"]`)
      //   const { y: initOffsetTop } = $el.getBoundingClientRect()

      //   tab.initOffsetTop = initOffsetTop
      // })
    }
    // 大数据热力图埋点
    if (window.heimdallTrackCmsModule) {
      window.heimdallTrackCmsModule(this.$el, this.itemData.id, this.baseConfig.pageId)
    }
  },
  methods: {
    setOffsetTop(offsetTop) {
      this.offsetTop = offsetTop
    },
    handleScroll(e) {
      // console.log('e', e)
      if (!(this.$refs.sticky && this.$refs.sticky.scroller || this.baseConfig.isEdit)) {
        return
      }

      // 分屏 并且 瞄点滚动
      if (!(this.model.tabMode === 2 && this.model.tabInteractive === 2)) {
        return false
      }

      // TODO 调整计算
      const scrollContainerTop = this.$refs.sticky.scroller === window ? 0 : this.$refs.sticky.scroller.offsetTop
      const reverseContentList = [...this.model.tabs].reverse()

      for (let index = 0; index < reverseContentList.length; index++) {
        const tab = reverseContentList[index]
        const $el = document.querySelector(`[id="${tab.id}"]`)
        const { y: elOffsetTop } = $el.getBoundingClientRect()

        if (elOffsetTop <= scrollContainerTop + this.offsetTop + 44) {
          this.model.currentTab = reverseContentList.length - index - 1
          break
        }
      }
    },
    changeCase,
    // 获取横轴宽度
    width() {
      const wrap1 = this.$refs.tabsContent.children
      let sum = 0
      for (var i = 0; i < wrap1.length; i++) {
        sum += wrap1[i].offsetWidth
      }
      return sum + wrap1.length * 16 * 2
    },
    initBScroll() {
      const width = this.model.tabs.length * 0.94
      if (!this.$refs.tabsContent) return
      this.$refs.tabsContent.style.width = width + 'rem'

      this.$nextTick(() => {
        this.scrollmethod = new window.BScroll(this.$refs.tabsWrapper, {
          startX: 0,
          scrollX: true,
          tap: true,
          click: true
          // probeType: 3
        })
      })
    },
    iscrollCenter(index) {
      /* 滑动到指定索引的导航节点，并将其显示在可视区*/
      this.scrollmethod.scrollToElement(this.$refs[`tabItem` + index][0], null, true, true)
      this.scrollmethod.refresh()
    },
    activeTabsStyle(index) {
      const tabStyle = this.model.tabStyle
      const tab = this.model.tabs[index]

      if (!tab) {
        return
      }

      if (index === this.model.currentTab && tabStyle === 'style1') {
        return {
          color: this.model.activeColor.activeFontColor,
          borderBottom: `0.02rem solid ${this.model.activeColor.activeBgColor}`
        }
      }

      if (index === this.model.currentTab && tabStyle === 'style2') {
        return {
          color: this.model.activeColor.activeFontColor,
          background: this.model.activeColor.activeBgColor
        }
      }

      if (index === this.model.currentTab && tabStyle === 'style3') {
        return {
          color: this.model.activeColor.activeFontColor,
          background: this.model.activeColor.activeBgColor
        }
      }
    },
    // 切换页签
    handleTabsChange(index) {
      const tabMode = this.model.tabMode
      const isEdit = this.baseConfig.isEdit
      const tab = this.model.tabs[index]

      if (!tab) {
        return
      }

      if (tabMode === 1) {
        // const url = tab.link && tab.link.data || tab.link.BBC.data
        const url = tab.link

        if (isEdit) {
          return false
        }

        if (url) {
          // location.href = url
          if (this.operation.goLink) {
            this.operation.goLink(url)
          }
        }

        return false
      }

      // tabModel = 2 分屏

      // 编辑状态
      if (isEdit) {
        this.model.currentTab = index

        return
      }

      // 交互方式 - 模板切换
      if (this.model.tabInteractive === 1) {
        this.model.currentTab = index
        return
      }

      // 交互方式 - 锚点
      if (this.model.tabInteractive === 2) {
        this.scrollContainer(this.model.tabs[index], () => {
          this.model.currentTab = index
          this.iscrollCenter(index)
        })

        return
      }
    },
    scrollToY(y, duration = 0, element = document.scrollingElement, callback) {
      // cancel if already on target position
      if (element.scrollTop === y) return

      const cosParameter = (element.scrollTop - y) / 2
      let scrollCount = 0
      let oldTimestamp = null

      function step(newTimestamp) {
        if (oldTimestamp !== null) {
          // if duration is 0 scrollCount will be Infinity
          scrollCount += Math.PI * (newTimestamp - oldTimestamp) / duration
          if (scrollCount >= Math.PI) {
            element.scrollTop = y
            if (callback) {
              callback()
            }
            return false
          }
          element.scrollTop = cosParameter + y + cosParameter * Math.cos(scrollCount)
        }
        oldTimestamp = newTimestamp
        window.requestAnimationFrame(step)
      }
      window.requestAnimationFrame(step)
    },
    scrollToTop(duration = 0) {
      this.scrollToY(0, duration, document.scrollingElement)
    },
    scrollToId(id, duration = 0) {
      const offset = Math.round(document.getElementById(id).getBoundingClientRect().top)

      this.scrollToY(document.scrollingElement.scrollTop + offset, duration)
    },
    scrollToElement(element, duration = 0) {
      const offset = Math.round(element.getBoundingClientRect().top)

      this.scrollToY(document.scrollingElement.scrollTop + offset, duration)
    },
    scrollContainer(tab, callback) {
      if (!(this.$refs.sticky && this.$refs.sticky.scroller)) {
        return
      }

      const offset = Math.round(document.getElementById(tab.id).getBoundingClientRect().top)

      this.scrollToY(document.scrollingElement.scrollTop + offset - this.offsetTop - 44, 0, document.scrollingElement, callback)
    }
  }
}
</script>
<style lang="scss">
html, body { scroll-behavior:smooth; }
</style>

<style lang="scss" scoped>
.cp-cms-tabs {
  position: relative;
  z-index: 1;
  .tabs-wrapper {
    overflow: hidden;
    .tabs-content {
      list-style: none;
      white-space: nowrap;
      margin: 0;
      padding: 0;
      // display: flex;
    }
  }
  .tab {
    display: inline-block;
    .tabStyle {
      color: inherit;
      display: inline-block;
      display: block;
      text-align: center;
      height: 0.44rem;
      padding:0 0.3rem;
      line-height: 0.44rem;
      border-bottom-width: 0.03rem;
      box-sizing: border-box;
    }
    .style2{
      display: inline-block;
      height: 0.44rem;
      padding:0 0.3rem;
      text-align: center;
      line-height: 0.44rem;
    }
    .style3 {
      display: inline-block;
      height: 0.3rem;
      padding:0 0.12rem;;
      border-radius: 0.06rem;
      margin: 0.07rem 0.25rem;
      text-align: center;
      line-height: 0.3rem;
    }
  }
  .tabs-style3 {
    height: 0.44rem;
    line-height: 0.44rem;
    box-sizing: border-box;
  }
}
</style>
