<template>
  <div ref="sticky" :style="getStyle" class="cp-sticky">
    <div :class="{'sticky--fixed': fixed}" :style="getInnerStyle">
      <slot/>
    </div>
  </div>
</template>

<script>
import $ from 'jquery'

export default {
  props: {
    zIndex: {
      type: [Number, String],
      default: null
    },
    // eslint-disable-next-line vue/require-default-prop
    container: null,
    offsetTop: {
      type: [Number, String],
      default: 0
    }
  },
  data() {
    return {
      fixed: false,
      height: 0,
      transform: 0,
      scroller: null,
      offset: {},
      left: 0,
      width: 0
    }
  },
  computed: {
    getStyle() {
      return {
        height: this.fixed ? `${this.height}px` : null
      }
    },
    getInnerStyle() {
      if (!this.fixed) {
        return
      }

      const style = {}

      if (this.zIndex !== null && this.zIndex !== undefined) {
        style.zIndex = this.zIndex
      }

      if (this.innerOffsetTop) {
        style.top = `${this.innerOffsetTop}px`
      }

      if (this.transform) {
        style.transform = `translate3d(0, ${this.transform}px, 0)`
      }

      style.left = this.left + 'px'
      style.width = this.width + 'px'

      return style
    }
  },
  watch: {
    offsetTop: {
      handler(newVal) {
        if (!this.scroller) {
          return
        }
        this.setInnerOffsetTop(newVal)
        // console.log('innerOffsetTop', this.innerOffsetTop)
      },
      immediate: true
    }
  },
  mounted() {
    const el = this.$refs.sticky

    if (!this.scroller) {
      this.scroller = this.getScroller(el)
    }

    const $scrollContainer = $(this.scroller)

    $scrollContainer.on('scroll.sticky', this.handleScroll)

    this.initData()
    this.handleScroll()
  },
  beforeDestroy() {
    const $scrollContainer = $(this.scroller)

    $scrollContainer.off('scroll.sticky', this.handleScroll)
  },
  methods: {
    setInnerOffsetTop(newVal) {
      let top
      if (this.scroller === window) {
        top = 0
      } else {
        const $scrollContainer = $(this.scroller)
        top = $scrollContainer.offset().top
      }

      this.innerOffsetTop = newVal + top
    },
    isHidden(el) {
      const style = window.getComputedStyle(el)
      const hidden = style.display === 'none'

      // offsetParent returns null in the following situations:
      // 1. The element or its parent element has the display property set to none.
      // 2. The element has the position property set to fixed
      const parentHidden = el.offsetParent === null && style.position !== 'fixed'

      return hidden || parentHidden
    },
    getScrollTop(el) {
      return 'scrollTop' in el ? el.scrollTop : el.pageYOffset
    },
    getRootScrollTop() {
      return (
        window.pageYOffset ||
        document.documentElement.scrollTop ||
        document.body.scrollTop ||
        0
      )
    },
    getElementTop(el, scroller) {
      if (el === window) {
        return 0
      }

      const scrollTop = scroller ? this.getScrollTop(scroller) : this.getRootScrollTop()
      return el.getBoundingClientRect().top + scrollTop
    },
    getScroller(el, root = window) {
      let node = el
      const overflowScrollReg = /scroll|auto/i

      while (
        node &&
        node.tagName !== 'HTML' &&
        node.nodeType === 1 &&
        node !== root
      ) {
        // console.log('node-tagName', node.tagName)
        const { overflowY } = window.getComputedStyle(node)

        if (overflowScrollReg.test(overflowY)) {
          if (node.tagName !== 'BODY') {
            return node
          }

          // see: https://github.com/youzan/vant/issues/3823
          const { overflowY: htmlOverflowY } = window.getComputedStyle(node.parentNode)

          if (overflowScrollReg.test(htmlOverflowY)) {
            return node
          }
        }
        node = node.parentNode
      }

      return root
    },
    emitScrollEvent(scrollTop) {
      this.$emit('scroll', {
        scrollTop,
        isFixed: this.fixed
      })
    },
    scrollContainer(scrollTop, bottomToPageTop, innerOffsetTop) {
      const distanceToBottom = this.height + scrollTop - bottomToPageTop
      // distanceToBottom < this.height

      // console.log('innerOffsetTop', innerOffsetTop, 'this.height', this.height, 'bottomToPageTop', bottomToPageTop)

      if (innerOffsetTop < bottomToPageTop) {
        this.fixed = true
        this.transform = -(distanceToBottom + innerOffsetTop)
      } else {
        this.fixed = false
      }

      // console.log('this.fixed', this.fixed)
      // console.log('emitScrollEvent2')
      this.emitScrollEvent(scrollTop)
    },
    initData() {
      const $el = $(this.$refs.sticky)
      const { left } = $el.offset()

      // 原始的高度
      this.height = this.$el.offsetHeight
      this.left = left

      // console.log('$el.width()', $el.width())
      this.setInnerOffsetTop(this.offsetTop)
      this.width = $el.width()
    },
    // eslint-disable-next-line max-statements
    handleScroll() {
      if (this.isHidden(this.$el)) {
        return
      }
      // 原始的高度
      this.height = this.$el.offsetHeight

      const { container } = this
      const innerOffsetTop = +this.innerOffsetTop
      const scrollTop = this.getScrollTop(window)
      const topToPageTop = this.getElementTop(this.$el)

      // The sticky component should be kept inside the container element
      if (container) {
        const bottomToPageTop = topToPageTop + container.offsetHeight

        // console.log('scrollTop', scrollTop, '--innerOffsetTop', innerOffsetTop, '--this.height', this.height, '--bottomToPageTop', bottomToPageTop)

        if (scrollTop + innerOffsetTop + this.height > bottomToPageTop) {
          this.scrollContainer(scrollTop, bottomToPageTop, innerOffsetTop)
          return
        }
      }

      // debugger

      if (scrollTop + innerOffsetTop > topToPageTop) {
        this.fixed = true
        this.transform = 0
      } else {
        this.fixed = false
      }

      // console.log('emitScrollEvent1')
      this.emitScrollEvent(scrollTop)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-sticky {
  .sticky--fixed {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 99;
  }
}
</style>
