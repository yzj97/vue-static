<template>
  <div class="cp-brand-choose">
    <template v-if="multiple">
      <div class="my-button" @click="handleChooseOpen" >
        <slot>
          <ody-button v-bind="$attrs" code="ui" type="default" size="small" > + 选择品牌</ody-button>
        </slot>
      </div>
      <template v-if="view">
        已选 <span class="selected"> {{ value.length }} </span> 个
        <ody-button
          :disabled="value.length === 0"
          code="ui"
          size="small"
          type="text"
          class="width-auto"
          @click="handleViewOpen"
        >
          查看
        </ody-button>
      </template>
    </template>
    <template v-else>
      <el-input
        v-model="label"
        v-bind="$attrs"
        :clearable="true"
        class="is-readonly"
        @focus="handleChooseOpen"
        @clear="handleClear"
      />
    </template>

    <ody-choose
      v-if="status === 'choose'"
      :visible="status === 'choose'"
      :search-config="choose.searchConfig"
      :search-value="choose.searchValue"
      :search-format="searchFormat"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :checked="innerChecked"
      :choose-key="valueKey"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('品牌选择')"
      @close="handleChooseClose"
      @submit="handleChooseSubmit"
    >
      <template slot="merchantId" slot-scope="scope">
        <ody-merchant-choose
          :selected.sync="merchantSelected"
          v-model="scope.row.merchantId"
          value-key="merchantId"
          placeholder="请选择"
        />
      </template>
      <template slot="channelCode" slot-scope="scope">
        <ody-channel-select ref="channel" v-model="scope.row.channelCode" :placeholder="$t('全部')" />
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="品牌查看"
      width="960px"
      @close="handleViewClose"
    >
      <ody-button
        :disabled="innerViewChecked.length === 0"
        code="ui"
        type="primary"
        size="small"
        style="margin-bottom: 10px;"
        @click="handleViewBatchDelete"
      >
        批量删除
      </ody-button>
      <ody-table
        :data="innerChecked"
        :columns="choose.columns"
        :checked.sync="innerViewChecked"
        :can-filter="false"
        :multiple="true"
        :operates="viewOperates"
      />
      <span slot="footer">
        <ody-button code="ui" size="small" type="primary" @click="handleViewClose">知道了</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    searchFormat: {
      type: Function,
      default: (params) => { return { ...params } }
    },
    reUrl: {
      type: String,
      default: ''
    },
    limit: {
      type: Number,
      default: Infinity
    },
    view: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Array],
    selected: {
      type: Object,
      default: () => {}
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'name'
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
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      merchantSelected: [],
      choose: {
        searchConfig: [
          {
            label: this.$t('品牌名称'),
            prop: 'name',
            type: 'input'
          }
        ],
        searchValue: {
          name: null,
          ...this.params
        },
        requestUrl: this.reUrl ? this.reUrl : '/back-product-web/back/mp/brand/listBrand.do',
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
          }
        ]
      },
      viewOperates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: this.$t('删除'),
            method: async(index, row) => {
              await this.handleViewDelete(index, row)
            },
            code: 'ui'
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
    searchInnerFormat(params) {
      return this.searchFormat(params)
    },
    async handleViewBatchDelete() {
      const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!res) {
        return
      }

      const checkMap = this.innerViewChecked
        .map(x => x[this.valueKey])
        .reduce((rtv, item) => {
          rtv[item] = true
          return rtv
        }, {})

      this.innerChecked = this.innerChecked.filter((item, index) => !checkMap[item[this.valueKey]])
      this.innerViewChecked = []

      this.$emit('input', this.innerChecked.map(x => x[this.valueKey]))
    },
    async handleViewDelete(index, row) {
      const res = await this.$confirm('确定删除吗?', this.$t('提示'), {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!res) {
        return
      }

      this.innerChecked.splice(index, 1)
      this.$emit('input', this.innerChecked.map(x => x[this.valueKey]))
    },
    handleViewClose() {
      this.status = ''
    },
    handleViewOpen() {
      this.status = 'view'
    },
    handleClear() {
      this.$emit('input', '')
      this.$emit('update:selected', {})
      this.$emit('clear')
    },
    handleChooseOpen() {
      if (this.$attrs.disabled) {
        return false
      }

      this.status = 'choose'
      this.$emit('open')
    },
    handleChooseClose() {
      this.status = ''
      this.$emit('cancel')
    },
    handleChooseSubmit(val) {
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

      this.status = ''
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
.cp-brand-choose {
  // display: inline-block;
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #fff;
      }
    }
  }
}
</style>
