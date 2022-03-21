<template>
  <div class="province-city-region">
    <el-row>
      <el-col :span="span">
        <el-select
          :disabled="!isEdit"
          v-model="codeObj.provinceCode"
          :placeholder="$t('请选择')"
          name="codeObj_provinceCode"
          @change="codeChange(codeObj.provinceCode, 2)">
          <el-option
            v-for="one in provinceCodeList"
            :key="one.code"
            :label="one.name"
            :value="one.code"
          />
        </el-select>
      </el-col>
      <el-col :span="span" :offset="offset">
        <el-select
          :disabled="!isEdit"
          v-model="codeObj.cityCode"
          :placeholder="$t('请选择')"
          name="codeObj_cityCode"
          popper-class="city-code"
          @change="codeChange(codeObj.cityCode, 3)">
          <el-option
            v-for="one in cityCodeList"
            :key="one.code"
            :label="one.name"
            :value="one.code"
          />
        </el-select>
      </el-col>
      <el-col :span="span" :offset="offset">
        <el-select
          :disabled="!isEdit"
          v-model="codeObj.regionCode"
          :placeholder="$t('请选择')"
          name="codeObj_regionCode"
          @change="codeChange()">
          <el-option
            v-for="one in regionCodeList"
            :key="one.code"
            :label="one.name"
            :value="one.code"
          />
        </el-select>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    span: { type: Number, default: 7 },
    offset: { type: Number, default: 1 },
    isEdit: {
      type: Boolean,
      default: true
    },
    data: {
      type: Object,
      default: () => {
        return {}
      }
    },
    provinceKey: {
      type: String,
      default: 'provinceCode'
    },
    cityKey: {
      type: String,
      default: 'cityCode'
    },
    regionKey: {
      type: String,
      default: 'regionCode'
    }

  },
  data() {
    return {
      codeObj: {
        provinceCode: '', // 省编码
        cityCode: '', // 市编码
        regionCode: '' // 区编码
      },
      provinceCodeList: [], // 省编码列表
      cityCodeList: [], // 市编码列表
      regionCodeList: [] // 区编码列表

    }
  },
  watch: {
    // 监控属性data的变化
    data: {
      handler: function(val) {
        this.initAreaList(val)
      },
      deep: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
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
    async init() {
      try {
        await this.getAreaList('100000', 1)

        if (this.data[this.provinceKey]) {
          this.initAreaList(this.data)
        }
      } catch (e) {
        console.log(e)
      }
    },
    initAreaList(val) {
      if (val[this.provinceKey]) {
        this.codeObj.provinceCode = val[this.provinceKey]
      }

      if (val[this.cityKey]) {
        this.codeObj.cityCode = val[this.cityKey]
      }

      if (val[this.regionKey]) {
        this.codeObj.regionCode = val[this.regionKey]
      }

      if (this.codeObj && this.codeObj.provinceCode) {
        this.getAreaList(this.codeObj.provinceCode, 2)
      }
      if (this.codeObj && this.codeObj.cityCode) {
        this.getAreaList(this.codeObj.cityCode, 3)
      }
    },
    getAreaList(parentCode, type) { // type: 1 获得省列表；type: 2 获得市列表；type: 3 获得区列表
      this.$portal.get('/area/queryArea.do?parentCode=' + parentCode).then(res => {
        if (type === 1) {
          this.provinceCodeList = res.data
        } else if (type === 2) {
          this.cityCodeList = res.data
        } else if (type === 3) {
          this.regionCodeList = res.data
        }
      })
    },
    codeChange(parentCode, type) { // type: 1 获得省列表；type: 2 获得市列表；type: 3 获得区列表
      this.$emit('change', this.codeObj)
      this.dispatch('ElFormItem', 'el.form.change', this.codeObj)

      if (!parentCode) {
        return
      }

      this.$portal.get('/area/queryArea.do?parentCode=' + parentCode).then(res => {
        if (type === 1) {
          this.provinceCodeList = res.data
        } else if (type === 2) {
          this.cityCodeList = res.data
          this.regionCodeList = []
          this.codeObj.cityCode = ''
          this.codeObj.regionCode = ''
        } else if (type === 3) {
          this.regionCodeList = res.data
          this.codeObj.regionCode = ''
        }
      })
    }
  }
}
</script>

<style lang="less">
  .province-city-region{
    .el-select{
      width: 100% !important;
    }
  }
  .city-code{
    .el-scrollbar__wrap{
      overflow-x: scroll !important;
    }
  }
</style>
