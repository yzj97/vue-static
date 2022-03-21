<template>
  <el-select
    v-model="value"
    v-bind="$attrs"
    :clearable="clearable"
    :filterable="filterable"
    :popper-append-to-body="false"
    class="cp-select2"
    v-on="$listeners"
    @change="handleChange">
    <template>
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      >
        <slot :item="item" />
      </el-option>
    </template>
  </el-select>
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
    clearable: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
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
    this.ready(options => {
      this.setOptions(options)
      this.$emit('update:selected', this.options.find(x => x.value === this.value))
    })
  },
  methods: {
    setOptions(options) {
      this.options = this.getOptions(options)
    },
    getOptions(options) {
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

      this.callback = callback

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
/deep/ .el-select-dropdown {
  max-height: 300px !important;
  // height: 300px !important;
  position: absolute !important;
  left: 0px !important;
  right: 0px !important;
  z-index: 999999999 !important;
}
/deep/ .el-scrollbar__view{
  max-height: 300px !important;
}
</style>
