export default class dateUtil {
  /**
   * 判断字符串是否为空
   * @param str
   * @returns {boolean}
   */
  static isEmpty(str) {
    return str == null || str.length === 0 || str === ''
  }
  /**
   * 格式化时间
   *
   * @param time 时间戳
   * @param reHHmmss false yyyy-MM-dd, true yyyy-MM-dd HH:mm:ss
   * @return yyyy-MM-dd / yyyy-MM-dd HH:mm:ss
   */
  static dateFormatForTime(time, reHHmmss) {
    if (!time) {
      return ''
    }
    var date = new Date(time)
    var seperator = '-'
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var strDate = date.getDate()
    if (month >= 1 && month <= 9) {
      month = '0' + month
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = '0' + strDate
    }
    var ymd = year + seperator + month + seperator + strDate
    if (reHHmmss) {
      var h = date.getHours()
      var m = date.getMinutes()
      var s = date.getSeconds()
      if (h >= 0 && h <= 9) {
        h = '0' + h
      }
      if (m >= 0 && m <= 9) {
        m = '0' + m
      }
      if (s >= 0 && s <= 9) {
        s = '0' + s
      }
      return ymd + ' ' + h + ':' + m + ':' + s
    } else {
      return ymd
    }
  }
}
