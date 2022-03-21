<template>
  <div class="cp-province-city-region-cascader">
    <el-cascader
      ref="cascader"
      v-model="value"
      :props="props"
      v-bind="{...$attrs, ...getDefaultSetting}"
      :clearable="clearable"
      :filterable="filterable"
      v-on="$listeners"
      @change="handleChange"
    >
      <!-- <template slot-scope="{ node, data }">
        <span>{{ data.label }}</span>
        <span v-if="!node.isLeaf"> ({{ data.children.length }}) </span>
      </template> -->
    </el-cascader>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'code'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    selected: {
      type: Array,
      default: () => [{}, {}, {}]
    },
    filterable: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    checkStrictly: {
      type: Boolean,
      default: false
    },
    level: {
      type: Number,
      default: 3 // 代表省市区
    }
  },
  data() {
    const { checkStrictly, multiple } = this
    return {
      defaultSetting: {
        multiple: {
          'show-all-levels': false,
          'collapse-tags': true,
          filterable: false
        }
      },
      provinceList: [],
      cityList: [],
      regionList: [],
      props: {
        multiple,
        checkStrictly, // 取消级联，可以只选中省，省市，省市区
        lazy: true,
        lazyLoad: async(node, resolve) => {
          const { level } = node
          const { labelKey, valueKey } = this
          let parentCode = 100000

          if (level === 1 && level <= this.getMaxLevel) {
            const province = this.provinceList.find(x => x.value === node.data.value)
            parentCode = province.code
          } else if (level === 2 && level <= this.getMaxLevel) {
            const city = this.cityList.find(x => x.value === node.data.value)
            parentCode = city.code
          }
          // const

          const { data } = await this.$api.area.queryArea({
            parentCode
          })

          const nodes = data.map(item => ({
            value: item[valueKey],
            label: item[labelKey],
            leaf: level >= this.getMaxLevel,
            ...item
          }))

          if (level === 0) {
            this.provinceList = this.arrObjectUniq([...this.provinceList, ...nodes])
          } else if (level === 1 && level <= this.getMaxLevel) {
            this.cityList = this.arrObjectUniq([...this.cityList, ...nodes])
          } else if (level === 2 && level <= this.getMaxLevel) {
            this.regionList = this.arrObjectUniq([...this.regionList, ...nodes])
          }

          resolve(nodes)
        }
      }
    }
  },
  computed: {
    getMaxLevel() {
      return this.level - 1
    },
    getDefaultSetting() {
      if (this.multiple) {
        return this.defaultSetting.multiple
      }

      return {}
    }
  },
  watch: {
  },
  methods: {
    arrObjectUniq(arr = []) {
      const { valueKey } = this
      return arr.reduce((prev, item) => {
        if (!prev.find(x => x[valueKey] === item[valueKey])) {
          prev.push(item)
        }
        return prev
      }, [])
    },
    handleChange() {
      const { valueKey } = this
      // const selected = this.$refs.cascader.getCheckedNodes(true)
      // console.log('selected', selected)
      // this.$emit('input', this.value)
      const selected = this.value.map((value, level) => {
        if (level === 0) {
          return this.provinceList.find(x => x[valueKey] === value)
        }
        if (level === 1) {
          // console.log('this.cityList', this.cityList)
          return this.cityList.find(x => x[valueKey] === value)
        }
        if (level === 2) {
          return this.regionList.find(x => x[valueKey] === value)
        }
      })
      this.$emit('update:selected', selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-select-province-city-region {
  // margin-right: -20px;
  // .select {
  //   margin-right: 20px;
  //   width: calc(33% - 20px);
  //   float: left;
  // }
  // .cascader {
  //   &.disabled {
  //     .el-input__inner {
  //       background-color: #f5f7fa;
  //       border-color: #d9d9d9;
  //       color: #ccc;
  //       cursor: not-allowed;
  //     }
  //   }
  // }
}
</style>
