export default {
  isEmpty(e) {
    if (e !== 0 && !e) {
      return true
    } else if (e.length === 0) {
      return true
    }
    return false
  }
}
