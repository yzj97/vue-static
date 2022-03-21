<template>
  <div class="cp-select-province-city-region">
    <el-select
      v-model="value[0]"
      :placeholder="$t('请选择')"
      :disabled="disabled"
      :popper-append-to-body="popperAppendToBody"
      clearable
      class="select"
      @change="handleProvinceChange">
      <el-option
        v-for="item in provinceList"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>

    <el-select
      v-model="value[1]"
      :placeholder="$t('请选择')"
      :disabled="disabled"
      :popper-append-to-body="popperAppendToBody"
      clearable
      class="select"
      @change="handleCityChange">
      <el-option
        v-for="item in cityList"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
    <el-select
      v-model="value[2]"
      :placeholder="$t('请选择')"
      :disabled="disabled"
      :popper-append-to-body="popperAppendToBody"
      clearable
      class="select"
      @change="handleRegionChange">
      <el-option
        v-for="item in regionList"
        :key="item.value"
        :label="item.label"
        :value="item.value"/>
    </el-select>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
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
    popperAppendToBody: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      provinceList: [],
      cityList: [],
      regionList: []
    }
  },
  watch: {
    value: {
      async handler(newVal) {
        await this.init()
      },
      immediate: true
    }
  },
  methods: {
    async init() {
      if (this.provinceList.length === 0) {
        this.provinceList = await this.getProvinceList()
      }

      if (this.cityList.length === 0) {
        this.cityList = await this.getCityList()
      } else if (!this.value[0]) {
        this.cityList = []
      }

      if (this.regionList.length === 0) {
        this.regionList = await this.getRegionList()
      } else if (!this.value[1]) {
        this.regionList = []
      }

      this.handleChange()
    },
    async getProvinceList() {
      const { data } = await this.$api.area.queryArea({
        parentCode: 100000
      })
      const { labelKey, valueKey } = this

      return data.map(x => {
        return {
          label: x[labelKey],
          value: +x[valueKey],
          ...x
        }
      })
    },
    async getCityList() {
      if (!this.value[0]) {
        return []
      }
      const { code: parentCode } = this.provinceList.find(x => x.value === this.value[0])
      const { data } = await this.$api.area.queryArea({
        parentCode
      })
      const { labelKey, valueKey } = this

      return data.map(x => {
        return {
          label: x[labelKey],
          value: +x[valueKey],
          ...x
        }
      })
    },
    async getRegionList() {
      if (!this.value[1]) {
        return []
      }

      const { code: parentCode } = this.cityList.find(x => x.value === this.value[1])
      const { data } = await this.$api.area.queryArea({
        parentCode
      })
      const { labelKey, valueKey } = this

      return data.map(x => {
        return {
          label: x[labelKey],
          value: +x[valueKey],
          ...x
        }
      })
    },
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    handleChange() {
      const [provinceCode, cityCode, regionCode] = this.value
      const { provinceList, cityList, regionList } = this
      const selected = [
        provinceList.find(x => x.value === provinceCode),
        cityList.find(x => x.value === cityCode),
        regionList.find(x => x.value === regionCode)
      ]

      this.$emit('input', this.value)
      this.$emit('update:selected', selected)
      this.dispatch('ElFormItem', 'el.form.change', this.value)
    },
    async handleProvinceChange() {
      this.cityList = []
      this.value[1] = ''
      this.regionList = []
      this.value[2] = ''
      // this.handleChange()
      // this.cityList = await this.getCityList()
      // this.regionList = await this.getRegionList()
    },
    async handleCityChange() {
      this.regionList = []
      this.value[2] = ''
      // this.handleChange()
      // this.regionList = await this.getRegionList()
    },
    async handleRegionChange() {
      this.handleChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-select-province-city-region {
  margin-right: -20px;
  .select {
    margin-right: 20px;
    width: calc(33% - 20px);
    float: left;
  }
}
/deep/ .el-select-dropdown__wrap {
  max-height: 320px;
}
</style>
