<template>
  <div class="cp-supplier-choose">
    <el-input
      v-model="label"
      v-bind="$attrs"
      :clearable="true"
      class="is-readonly"
      @focus="handleOpen"
      @clear="handleClear"
    />
    <ody-choose
      v-if="choose.visible"
      :visible="choose.visible"
      :search-config="choose.searchConfig"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :checked="innerChecked"
      :choose-key="valueKey"
      :columns="choose.columns"
      :highlight-current-row="true"
      :limit="limit"
      :title="$t('供应商选择')"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  props: {
    limit: {
      type: Number,
      default: Infinity
    },
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
      default: 'orgCode'
    },
    labelKey: {
      type: String,
      default: 'orgName'
    },
    merchantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      innerChecked: [],
      label: '',
      choose: {
        visible: false,
        searchConfig: [
          {
            label: this.$t('供应商编码'),
            prop: 'orgCode',
            type: 'input'
          },
          {
            label: this.$t('供应商名称'),
            prop: 'orgName',
            type: 'input'
          }
        ],
        searchValue: {
          supplierCode: '',
          supplierName: '',
          status: 1, // 查询启用的供应商
          orgType: 7,
          merchantId: this.merchantId
        },
        requestUrl: '/ouser-web/api/registerMerchant/queryDistributionByPageInfo.do',
        columns: [
          {
            label: this.$t('供应商编码'),
            prop: 'orgCode',
            show: true
          },
          {
            label: this.$t('供应商名称'),
            prop: 'orgName',
            show: true
          }
        ]
      }

    }
  },
  watch: {
    selected: {
      handler(newVal) {
        if (this.multiple) {
          const hasValue = this.value && this.value.length
          const hasSelected = this.selected && this.selected.length

          if (hasSelected) {
            if (!hasValue) {
              this.value = []
            }
            this.innerChecked = this.$portal.deepClone(this.selected)
          } else {
            this.innerChecked = []
          }
        } else {
          const hasValue = this.value != null && this.value !== ''
          const hasSelected = this.selected && Object.keys(this.selected).length

          if (hasSelected) {
            if (!hasValue) {
              this.value = {}
            }
            this.label = this.selected[this.labelKey] || ''
          } else {
            this.label = ''
          }
        }
      },
      immediate: true,
      deep: true // 可以深度检测到 person 对象的属性值的变化
    },
    value: {
      handler(newVal) {
        if (this.multiple) {
          const hasValue = this.value && this.value.length
          const hasSelected = this.selected && this.selected.length

          if (hasValue) {
            if (!hasSelected) {
              const createSelected = newVal.map(x => ({ [this.valueKey]: x }))

              this.selected = createSelected
              this.innerChecked = []
            }
          } else {
            this.innerChecked = []
          }
        } else {
          const hasValue = this.value != null && this.value !== ''
          const hasSelected = this.selected && Object.keys(this.selected).length

          if (hasValue) {
            if (!hasSelected) {
              this.selected = {}
            }
            this.label = this.selected[this.labelKey] || ''
          } else {
            this.label = ''
          }
        }
      },
      immediate: true,
      deep: true
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
.cp-supplier-choose {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
}
</style>
