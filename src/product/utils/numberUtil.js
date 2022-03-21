/**
 * common工具类
 */
export default {
  validateNumber: (num) => {
    return isNaN(num)
  },
  isNumberEmpty: (number, significand) => {
    if (number === undefined) {
      return true
    }
    if (number === null) {
      return true
    }
    if (number === '') {
      return true
    }
    // 数字的点只有一个
    const oStr = number + ''
    if (oStr.indexOf('.') !== oStr.lastIndexOf('.')) {
      return true
    }
    const lastPoint = oStr.lastIndexOf('.')
    let lastPointStr = ''
    if (lastPoint !== -1) {
      lastPointStr = oStr.substr(lastPoint + 1)
    }
    // 整数
    if (significand === 0) {
      if (lastPointStr && (lastPointStr > 0 || lastPointStr.length > 0)) {
        return true
      }
      if (lastPoint !== -1 && lastPointStr.length === 0) {
        return true
      }
    } else {
    // 默认两位有效数字
      if (lastPointStr && lastPointStr.length > 2) {
        return true
      }
    }
    return isNaN(number)
  }
}
