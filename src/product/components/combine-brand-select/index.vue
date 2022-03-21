<template>
  <div class="choose-store">
    <el-form ref="form" label-width="100px" class="form">
      <ody-search-item :label="$t('商品品牌')" :placeholder="$t('请选择')" prop="label">
        <el-input
          :v-label="$t('商家')"
          v-model="label"
          v-bind="$attrs"
          :clearable="true"
          :placeholder="$t('请选择商家')"
          name="label"
          class="is-readonly"
          @focus="handleOpen"
          @clear="handleClear"
        />
      </ody-search-item>
    </el-form>
    <ody-choose
      v-if="choose.visible"
      :visible="choose.visible"
      :search-config="choose.searchConfig"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :highlight-current-row="true"
      :title="$t('商品品牌')"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
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
    valueKey: {
      type: String,
      default: 'name'
    },
    labelKey: {
      type: String,
      default: 'name'
    },
    searchField: {
      type: Array,
      default: () => ['name'],
      validator: function(val) {
        const allFieldList = ['name']
        return val.every(x => allFieldList.indexOf(x) >= 0)
      }
    },
    resultField: {
      type: Array,
      default: () => ['name'],
      validator: function(val) {
        const allFieldList = ['name']
        return val.every(x => allFieldList.indexOf(x) >= 0)
      }
    }
  },
  data() {
    return {
      label: '',
      choose: {
        visible: false,
        searchConfig: [
          {
            label: this.$t('品牌名称'),
            prop: 'name',
            type: 'input'
          }
        ],
        searchValue: {
          brandName: '',
          storeName: '',
          storeCode: ''
        },
        requestUrl: 'back-product-web2/extra/brand/listBrandByPage.do',
        columns: [
          {
            label: this.$t('品牌名称'),
            prop: 'name',
            show: true
          },
          {
            label: this.$t('品牌名称(第二语言)'),
            prop: 'nameLan2',
            show: true
          },
          {
            label: this.$t('品牌LOGO'),
            prop: 'logUrl',
            align: 'center',
            show: true,
            formatter: param => {
              return param.logUrl ? `<img width="50" src="${param.logUrl}">` : ''
            }
          }
        ]
      }
    }
  },
  computed: {
    // getSearchConfig() {
    //   const { choose: { searchConfig }, searchField } = this

    //   return searchField.map(field => searchConfig.find(x => (x.prop === field || x.slot === field)))
    // },
    // getColumns() {
    //   const { choose: { columns }, resultField } = this

    //   return resultField.map(field => columns.find(x => (x.prop === field || x.slot === field)))
    // }
  },
  watch: {
    selected(newVal) {
      this.label = newVal[this.labelKey] || ''
    },
    value(newVal) {
      if (newVal === undefined || newVal === '' || newVal === null) {
        this.label = ''
      }
    }
  },
  mounted() {
    if (this.selected) {
      this.label = this.selected[this.labelKey] || ''
    }
  },
  methods: {

    handleClear() {
      this.$emit('input', '')
      this.$emit('update:selected', {})
      this.$emit('clear')
    },
    handleOpen() {
      if (this.$attrs.disabled) {
        return false
      }

      this.choose.visible = true
      this.$emit('open')
    },
    handleClose() {
      this.choose.visible = false
      this.$emit('cancel')
    },
    handleSubmit([selected = {}]) {
      this.choose.visible = false
      this.label = selected[this.labelKey]
      this.$emit('input', selected[this.valueKey])
      this.$emit('update:selected', selected)
      this.$emit('ok', selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.choose-store {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
}
</style>
