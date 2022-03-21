import _ from './util.js'

export default {
  bind: function(el, binding, vnode) {
    el.addEventListener('mousedown', handleMouseDown)

    function handleMouseDown(e) {
      e && e.stopPropagation()

      const container = _.getOffset(el.parentNode)
      const preX = _.getPageX(e)
      const preY = _.getPageY(e)
      let top
      let left
      let flag

      window.addEventListener('mousemove', handleChange)
      window.addEventListener('mouseup', handleMouseUp)

      function handleChange(e) {
        e && e.preventDefault()
        flag = true

        // Hide the info displayed by hover
        vnode.context.handleHideZone(true)

        const setting = vnode.context.setting
        let moveX = _.getPageX(e) - preX
        let moveY = _.getPageY(e) - preY

        setting.top = setting.top || 0
        setting.left = setting.left || 0
        top = _.decimalPoint(moveY / container.height + setting.top)
        left = _.decimalPoint(moveX / container.width + setting.left)

        // Hotzone moving boundary processing
        if (top < 0) {
          top = 0
          moveY = -container.height * setting.top
        }

        if (left < 0) {
          left = 0
          moveX = -container.width * setting.left
        }

        if (top + setting.height > 1) {
          top = 1 - setting.height
          moveY = container.height * (top - setting.top)
        }

        if (left + setting.width > 1) {
          left = 1 - setting.width
          moveX = container.width * (left - setting.left)
        }

        el.style.transform = `translate(${moveX}px, ${moveY}px)`
      }

      function handleMouseUp() {
        if (flag) {
          flag = false
          el.style.transform = 'translate(0, 0)'
          vnode.context.changeInfo({
            top,
            left
          })
        }

        // Show the info
        vnode.context.handleHideZone(false)

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
