export default class numberUtil {
  static sum(arr, index) { // arr数组；index整数，小数的位数
    let result = 0
    let intVal = 0
    let decimal = 0
    let decimalDec = 0
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].indexOf('.') > 0) {
        const tempArr = arr[i].split('.')
        intVal += Number(tempArr[0])
        decimal += Number('0.' + tempArr[1]) * Math.pow(10, index)
      } else {
        intVal += Number(arr[i])
      }
    }
    const tmpDecimal = (decimal / Math.pow(10, index)).toString().split('.')
    const decimalInt = Number(tmpDecimal[0])
    if (tmpDecimal.length === 2) {
      decimalDec = tmpDecimal[1]
      result = (intVal + decimalInt) + '.' + decimalDec
    } else {
      result = intVal + decimalInt
    }
    return Number(result).toFixed(index)
  }
  static sub(arg1, arg2) {
    if (isNaN(arg1)) {
      arg1 = 0
    }
    if (isNaN(arg2)) {
      arg2 = 0
    }
    arg1 = Number(arg1)
    arg2 = Number(arg2)

    var r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    n = (r1 >= r2) ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
  }
}
