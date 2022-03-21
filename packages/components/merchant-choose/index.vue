<template>
  <div class="cp-merchant-choose">
    <template v-if="multiple || type === 'button'">
      <div class="my-button" @click="visible = true">
        <slot>
          <ody-button v-bind="$attrs" code="ui" type="default" size="small" > + {{ $t("选择商家") }}</ody-button>
        </slot>
      </div>
    </template>
    <template v-else>
      <el-input
        v-if="multiple===false"
        v-model="label"
        v-bind="$attrs"
        :clearable="true"
        class="is-readonly"
        @focus="handleOpen"
        @clear="handleClear"
      />
    </template>
    <ody-choose
      v-if="visible"
      :visible="visible"
      :search-config="choose.searchConfig"
      :checked="innerChecked"
      :choose-key="valueKey"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('商家选择')"
      @close="handleClose"
      @submit="handleSubmit"
    />
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'input'
    },
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
      default: 'merchantCode'
    },
    labelKey: {
      type: String,
      default: 'merchantName'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      label: '',
      innerChecked: [],
      visible: false,
      choose: {
        searchConfig: [
          {
            label: this.$t('商家编码'),
            prop: 'merchantCode',
            type: 'input'
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            type: 'input'
          }
        ],
        searchValue: {
          merchantCode: '',
          merchantName: '',
          ...this.params
        },
        requestUrl: '/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do',
        columns: [
          {
            label: this.$t('商家编码'),
            prop: 'merchantCode',
            show: true
          },
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true
          },
          {
            label: this.$t('商家类型'),
            prop: 'merchantTypeName',
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
            this.innerChecked = this.$portal.deepClone(this.selected)
          } else {
            this.label = ''
            this.innerChecked = []
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
  mounted() {
    // console.log(this.params, 1111)
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
      this.visible = true
      this.$emit('open')
    },
    handleClose() {
      this.visible = false
      this.$emit('cancel')
    },
    handleSubmit(val) {
      let selected
      let value

      if (this.multiple) {
        selected = val
        value = selected.map(x => x[this.valueKey])
      } else {
        [selected = {}] = val
        this.label = selected[this.labelKey]
        value = selected[this.valueKey]
      }

      this.visible = false
      this.innerChecked = val
      this.value = value
      this.selected = selected
      this.$emit('input', value)
      this.$emit('update:selected', selected)
      this.$emit('ok', selected)
    }
  }
}
</script>

<style lang="scss" scoped>
.my-button {
  display: inline-block;
}
.cp-merchant-choose {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #fff;
      }
    }
  }
}
</style>
