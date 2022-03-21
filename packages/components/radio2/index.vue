<template>
  <el-radio-group
    v-model="value"
    v-bind="$attrs"
    class="cp-radio2"
    v-on="$listeners"
    @change="handleChange">
    <el-radio
      v-for="item in options"
      :label="item.value"
      :key="item.value"
      :disabled="item.disabled"
    >
      {{ $t(item.label) }}
      <slot :name="item.value" />
    </el-radio>
  </el-radio-group>
</template>

<script>
import constant from 'packages/utils/constant'

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    listKey: {
      type: String,
      default: ''
    },
    valueKey: {
      type: String,
      default: 'value'
    },
    labelKey: {
      type: String,
      default: 'label'
    },
    remote: {
      type: Function,
      default: async() => []
    },
    itemDisabled: {
      type: Function,
      default: (x, index) => {
        return false
      }
    },
    itemFilter: {
      type: Function,
      default: (x, index) => {
        return true
      }
    },
    cacheKey: {
      type: String,
      default: ''
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: []
    }
  },
  watch: {
    list: {
      handler(newVal) {
        this.$nextTick(function() {
          if (this.callback) {
            this.callback(newVal)
          }
        })
      },
      deep: true
    }
  },
  async mounted() {
    this.reload()
  },
  methods: {
    reload() {
      this.options = []
      this.ready(options => {
        this.options = this.setOptions(options)
        this.$emit('update:selected', this.options.find(x => x.value === this.value))
      })
    },
    setOptions(options) {
      return options.map((x, index) => {
        const value = x[this.valueKey]
        const label = x[this.labelKey]
        const disabled = this.itemDisabled(x, index)
        const isItem = this.itemFilter(x, index)

        return isItem ? Object.assign({
          value,
          label,
          disabled,
          ...x
        }) : null
      }).filter(x => x)
    },
    cache(callback) {
      const { cacheKey } = this

      if (!constant.$cache) {
        constant.$cache = {}
      }
      if (!constant.$cache[cacheKey]) {
        constant.$cache[cacheKey] = {
          fns: [],
          status: 0,
          options: []
        }
      }

      const cacheObj = constant.$cache[cacheKey]

      if (cacheObj.status === 0) {
        cacheObj.status = 1
        cacheObj.fns.push(callback)

        this.remote().then(options => {
          cacheObj.options = options
          cacheObj.status = 2
          cacheObj.fns.forEach(fn => fn(cacheObj.options))
          cacheObj.fns = null
        })
      } else if (cacheObj.status === 1) {
        cacheObj.fns.push(callback)
      } else if (cacheObj.status === 2) {
        callback(cacheObj.options)
      }
    },
    type(obj) {
      return Object.prototype.toString.call(obj).slice(8, -1)
    },
    ready(callback) {
      const { cacheKey } = this

      if (this.listKey) {
        const list = constant[this.listKey]
        const listType = this.type(list)

        if (listType === 'Array') {
          callback(list)
        } else if (listType === 'Object') {
          const convertList = Object.keys(list).reduce((rtv, item) => {
            rtv.push({
              [this.labelKey]: list[item] + '',
              [this.valueKey]: item + ''
            })
            return rtv
          }, [])

          callback(convertList)
        }
      } else if (this.list && this.list.length > 0) {
        callback(this.list)
      } else if (cacheKey) {
        this.cache(callback)
      } else {
        this.remote().then(callback)
      }
    },
    handleChange(val) {
      this.$emit('update:selected', this.options.find(x => x[this.valueKey] === val))
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
