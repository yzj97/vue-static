
/**
 * @description 改变字符串形式，大驼峰和小驼峰形式
 * @param {String} str 字符串
 * @param {String} type 类型--默认值：'camel' 默认小驼峰形式。  可选值： 'pascal'和'camel'   含义说明： 'pascal'：大驼峰形式，  'camel'：小驼峰形式。
 * @returns {String} {String}
 * @example
 * ::: demo
 *
 * ```html
 *  <template>
 *   <div>
 *    <p><b>小驼峰形式：</b>{{ changeCase }}</p>
 *    <p><b>大驼峰形式：</b>{{ changeCase1 }}</p>
 *   </div>
 *  </template>
 *  <script>
 *    export default {
 *      data() {
 *        return {
 *          changeCase: '',
 *          changeCase1: ''
 *        }
 *    },
 *    mounted() {
 *      this.changeCase = this.$portal.changeCase('is-png')
 *      this.changeCase1 = this.$portal.changeCase('is-png', 'pascal')
 *    }
 *  }
 *  </script>
 *
 * ```
 * :::
 *
*/
function changeCase(str, type = 'camel') {
  if (type === 'camel') {
    return str
      .replace(/\-([a-z])/g, ($0, $1) => $1.toUpperCase())
      .replace(/^[A-Z]/, $0 => $0.toLowerCase())
  } else if (type === 'pascal') {
    return str
      .replace(/\-([a-z])/g, ($0, $1) => $1.toUpperCase())
      .replace(/^[a-z]/, $0 => $0.toUpperCase())
  } else if (type === 'kebab') {
    return str
      .replace(/^[A-Z]/, $0 => $0.toLowerCase())
      .replace(/\_([a-z])/g, ($0, $1) => `-${$1}`)
      .replace(/[A-Z]/g, ($0) => `-${$0.toLowerCase()}`)
  }
}

export default changeCase
