<template>
  <div class="cp-checkbox2">
    <el-checkbox
      v-if="isShowAll"
      v-model="checkAll"
      :indeterminate="isIndeterminate"
      :disabled="disabled"
      class="all-select"
      @change="handleCheckAllChange"
    >全部</el-checkbox>
    <el-checkbox-group
      v-model="value"
      v-bind="$attrs"
      class="select-group"
      v-on="$listeners"
      @change="handleCheckedOneChange"
    >
      <template>
        <el-checkbox
          v-for="item in options"
          :label="item.value"
          :key="item.value"
          :disabled="disabled || item.disabled"
          :checked="item.checked"
        >
          {{ $t(item.label) }}
          <slot :item="item" />
        </el-checkbox>
      </template>
    </el-checkbox-group>
  </div>
</template>

<script>
import constant from 'packages/utils/constant'

export default {
  props: {
    value: {
      type: Array,
      default: () => []
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
    isShowAll: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    checkedAll: {
      type: Boolean,
      default: false
    },
    list: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      options: [],
      checkAll: false,
      isIndeterminate: false,
      callback: null
    }
  },
  watch: {
    'value': {
      handler: function(val) {
        this.$nextTick(function() {
          this.setSelectStatus(val)
        })
      },
      deep: true
    },
    'list': {
      handler: function(val) {
        this.$nextTick(function() {
          if (this.callback) {
            this.callback(val)
          }
        })
      },
      deep: true
    }
  },
  async mounted() {
    this.$nextTick(() => {
      this.ready(options => {
        this.options = this.setOptions(options)
        this.setSelectStatus(this.value)
        if (this.checkedAll) {
          this.checkAll = true
          this.handleCheckAllChange(true)
        } else {
          this.$emit(
            'update:selected',
            this.options.filter(x => this.value.includes(x[this.valueKey]))
          )
        }
      })
    })
  },
  methods: {
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
    setSelectStatus(val) {
      const checkedCount = val.length
      this.checkAll = checkedCount === this.options.length
      this.isIndeterminate =
      checkedCount > 0 && checkedCount < this.options.length
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
      this.callback = callback
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
    handleCheckedOneChange(val) {
      this.setSelectStatus(val)
      this.$emit('input', val)
      this.$emit(
        'update:selected',
        this.options.filter(x => val.includes(x[this.valueKey]))
      )
    },
    handleCheckAllChange(val) {
      this.isIndeterminate = false
      const ids = val
        ? this.options.map(item => {
          return item[this.valueKey]
        })
        : []
      this.value = ids
      this.$emit('input', this.value)
      this.$emit(
        'update:selected',
        this.options.filter(x => this.value.includes(x[this.valueKey]))
      )
    }
  }
}
</script>

<style lang="less" scoped>
  .cp-checkbox2{
    .all-select, .select-group{
      display: inline-block;
    }
  }
</style>
