<template>
  <div class="cp-promotion-coupon-choose">
    <template v-if="multiple">
      <ody-button
        v-bind="$attrs"
        :disabled="disabled"
        code="ui"
        type="default"
        size="small"
        @click="handleChooseOpen"
      >
        + 选择优惠券
      </ody-button>
      <template v-if="view">
        已选
        <span class="selected"> {{ value.length }} </span>
        个
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
    <!-- {{ innerChecked }} -->
    <ody-choose
      v-if="status === 'choose'"
      :visible="status === 'choose'"
      :search-config="getSearchConfig"
      :search-format="searchFormat"
      :search-value="choose.searchValue"
      :checked="innerChecked"
      :choose-key="valueKey"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('优惠券选择')"
      @close="handleChooseClose"
      @submit="handleChooseSubmit"
    >
      <template slot="receiveChannelCode" slot-scope="scope">
        <ody-channel-select
          ref="channel"
          v-model="scope.row.receiveChannelCode"
          :placeholder="$t('全部')"
        />
      </template>
      <template slot="merchantId" slot-scope="scope">
        <ody-merchant-select
          v-model="scope.row.merchantId"
          :placeholder="$t('全部')"
          value-key="merchantId"
        />
      </template>
      <template slot="storeId" slot-scope="scope">
        <ody-store-select
          v-model="scope.row.storeId"
          :placeholder="$t('全部')"
          value-key="storeId" />
      </template>
      <template slot="dataStartTime" slot-scope="scope">
        {{ scope.row.startTime | parseTime }}
        ~
        {{ scope.row.endTime | parseTime }}
      </template>
      <template slot="dataUseLimit" slot-scope="scope">
        {{ $t('满') }} {{ scope.row.useLimit }} {{ $t('元可用') }}
      </template>
      <template slot="dataDrawedCoupons" slot-scope="scope">
        {{ scope.row.drawedCoupons }}
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="优惠券查看"
      width="960px"
      @close="handleViewClose"
    >
      <ody-button
        :disabled="innerViewChecked.length === 0 || disabled"
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
      >
        <template slot="dataStartTime" slot-scope="scope">
          {{ scope.row.startTime | parseTime }}
          ~
          {{ scope.row.endTime | parseTime }}
        </template>
        <template slot="dataUseLimit" slot-scope="scope">
          {{ $t('满') }} {{ scope.row.useLimit }} {{ $t('元可用') }}
        </template>
        <template slot="dataDrawedCoupons" slot-scope="scope">
          {{ scope.row.drawedCoupons }}
        </template>
      </ody-table>
      <span slot="footer">
        <ody-button
          code="ui"
          size="small"
          type="primary"
          @click="handleViewClose"
        >
          知道了
        </ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
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
      default: 'themeTitle'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    couponGiveRule: {
      type: Number,
      default: 17
    },
    disabled: {
      type: Boolean,
      default: false
    },
    searchField: {
      type: Array,
      default: () => {
        return [
          'themeTitle',
          'receiveChannelCode',
          'merchantId',
          'storeId'
        ]
      }
    }
  },
  data() {
    return {
      label: '',
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      choose: {
        searchConfig: [
          {
            label: '优惠券名称:',
            prop: 'themeTitle',
            type: 'input'
          },
          {
            label: '使用渠道:',
            slot: 'receiveChannelCode'
          },
          {
            label: '所属商家:',
            slot: 'merchantId'
          },
          {
            label: '所属门店:',
            slot: 'storeId'
          }
        ],
        searchValue: {
          themeTitle: null,
          receiveChannelCode: null,
          merchantId: null,
          storeId: null
        },
        requestUrl: '/back-promotion-web/couponActivityRead/queryCouponActivityPG.do',
        columns: [
          {
            label: '优惠券名称',
            prop: 'themeTitle',
            show: true,
            minWidth: 180
          },
          {
            label: '面值',
            prop: 'couponAmount',
            show: true,
            minWidth: 120
          },
          {
            label: '券活动日期',
            slot: 'dataStartTime',
            show: true,
            minWidth: 300
          },
          {
            label: '使用条件',
            slot: 'dataUseLimit',
            show: true,
            minWidth: 100
          },
          {
            label: '已发行量',
            slot: 'dataDrawedCoupons',
            show: true,
            minWidth: 100
          }
        ]
      },
      channelMap: {},
      viewOperates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: '删除',
            disabled: (index, row) => {
              return this.disabled
            },
            method: async(index, row) => {
              await this.handleViewDelete(index, row)
            },
            code: 'ui'
          }
        ]
      }
    }
  },
  computed: {
    getSearchConfig() {
      // return this.choose.searchConfig
      const {
        choose: { searchConfig },
        searchField
      } = this

      return searchField.map(field =>
        searchConfig.find(x => x.prop === field || x.slot === field)
      )
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
  async mounted() {
    await this.getChannelMap()
  },
  methods: {
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
    async getChannelMap() {
      const { data } = await this.$api.channel.queryChannelMap({})

      this.channelMap = data
    },
    handleViewOpen() {
      this.status = 'view'
    },
    handleViewClose() {
      this.status = ''
    },
    searchFormat({ couponAmount, ...params }) {
      return {
        obj: this.formHasValue({
          status: 4,
          couponGiveRule: this.couponGiveRule,
          ...params
        })
      }
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
.cp-promotion-coupon-choose {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
}
</style>
