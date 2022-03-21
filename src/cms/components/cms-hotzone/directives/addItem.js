import _ from './util'

export default {
  bind: function(el, binding, vnode) {
    const MIN_LIMIT = _.MIN_LIMIT

    el.addEventListener('mousedown', handleMouseDown)

    function handleMouseDown(e) {
      e && e.preventDefault()

      let itemInfo = {
        top: _.getDistanceY(e, el),
        left: _.getDistanceX(e, el),
        width: 0,
        height: 0,
        link: {}
      }
      const container = _.getOffset(el)

      // Only used once at the beginning of init
      const setting = {
        top: _.decimalPoint(itemInfo.top / container.height),
        left: _.decimalPoint(itemInfo.left / container.width),
        width: 0,
        height: 0,
        link: {}
      }
      let preX = _.getPageX(e)
      let preY = _.getPageY(e)

      vnode.context.addItem(setting)

      window.addEventListener('mousemove', handleChange)
      window.addEventListener('mouseup', handleMouseUp)

      function handleChange(e) {
        e && e.preventDefault()

        const moveX = _.getPageX(e) - preX
        const moveY = _.getPageY(e) - preY
        preX = _.getPageX(e)
        preY = _.getPageY(e)

        // Not consider the direction of movement first, consider only the lower right drag point
        const minLimit = 0
        const styleInfo = _.dealBR(itemInfo, moveX, moveY, minLimit)

        // Boundary value processing
        itemInfo = _.dealEdgeValue(itemInfo, styleInfo, container)

        Object.assign(el.lastElementChild.style, {
          top: `${itemInfo.top}px`,
          left: `${itemInfo.left}px`,
          width: `${itemInfo.width}px`,
          height: `${itemInfo.height}px`,
          link: `${itemInfo.link}`
        })
      }

      function handleMouseUp() {
        const perInfo = {
          top: _.decimalPoint(itemInfo.top / container.height),
          left: _.decimalPoint(itemInfo.left / container.width),
          width: _.decimalPoint(itemInfo.width / container.width),
          height: _.decimalPoint(itemInfo.height / container.height),
          link: {}
        }

        if (vnode.context.isOverRange()) {
          vnode.context.overRange()
        } else if (container.height < MIN_LIMIT && itemInfo.width > MIN_LIMIT) {
          vnode.context.changeItem(Object.assign(perInfo, {
            top: 0,
            height: 1
          }))
        } else if (container.width < MIN_LIMIT && itemInfo.height > MIN_LIMIT) {
          vnode.context.changeItem(Object.assign(perInfo, {
            left: 0,
            width: 1
          }))
        } else if (itemInfo.width > MIN_LIMIT && itemInfo.height > MIN_LIMIT) {
          vnode.context.changeItem(perInfo)
        } else {
          vnode.context.eraseItem()
        }

        window.removeEventListener('mousemove', handleChange)
        window.removeEventListener('mouseup', handleMouseUp)
      }
    }

    el.$destroy = () => el.removeEventListener('mousedown', handleMouseDown)
  },
  unbind: function(el) {
    el.$destroy()
  }
}
