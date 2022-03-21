<template>
  <div class="cp-store-choose">
    <template v-if="multiple">
      <div @click="handleChooseOpen">
        <div v-if="type === 'button'" class="my-button">
          <slot>
            <ody-button v-bind="$attrs" code="ui" type="default" size="small" > + 选择店铺</ody-button>
          </slot>
        </div>
        <div v-else-if="type === 'select'">
          <div ref="selectWrap" :class="[collapseTags ? 'select-wrap-line' : '']" class="select-wrap clearfix">
            <template v-if="selected && selected.length">
              <el-tag
                v-for="tag in getSelectedLeft"
                :key="tag"
                :disable-transitions="false"
                type="info"
                size="mini"
                color="#f4f4f5"
                closable
                style="margin-right: 5px;"
                @close="handleTagClose(tag)"
              >
                {{ tag[labelKey] }}
              </el-tag>
              <el-tag
                v-if="getSelectedRight.length"
                type="info"
                size="mini"
                color="#f4f4f5">
                + {{ getSelectedRight.length }}
              </el-tag>
            </template>
            <template v-else>
              <span class="placeholder">
                {{ $attrs.placeholder }}
              </span>
            </template>
          </div>
        </div>
      </div>
      <template v-if="view">
        已选 <span class="selected"> {{ value.length }} </span> 个
        <!-- {{ innerChecked }} -->
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
      :search-config="getSearchConfig"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :columns="getColumns"
      :checked="innerChecked"
      :choose-key="valueKey"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('店铺选择')"
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
      <template slot="storeOnlineType" slot-scope="scope">
        <el-select v-model="scope.row.storeOnlineType" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </template>
      <template slot="channelCodes" slot-scope="scope">
        {{ getChannel(scope.row.channelCodes) }}
      </template>
      <template slot="storeOnlineTypeName" slot-scope="scope">
        {{ scope.row.storeOnlineType | keyVal(getStoreOnlineTypeMap) }}
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="店铺查看"
      width="960px"
      @close="handleViewClose"
      @change-max-height="handleMaxHeight"
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
        v-if="innerChecked.length === 0"
        key="view-null"
        :max-height="tableMaxHeight"
        :columns="choose.columns"
        :checked.sync="innerViewChecked"
        :can-filter="false"
        :multiple="true"
        :show-pagination="false"
        :operates="viewOperates"
      />
      <ody-table
        v-else
        key="view-has"
        ref="tableView"
        :max-height="tableMaxHeight"
        :request-url="choose.requestUrl"
        :columns="choose.columns"
        :checked.sync="innerViewChecked"
        :can-filter="false"
        :multiple="true"
        :show-pagination="false"
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
    collapseTags: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'button'
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
      default: 'storeCode'
    },
    labelKey: {
      type: String,
      default: 'storeName'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    searchField: {
      type: Array,
      default: () => ['storeCode', 'storeName', 'merchantId'],
      validator: function(val) {
        const allFieldList = [
          'storeCode',
          'storeName',
          'merchantId',
          'channelCode',
          'storeOnlineType'
        ]
        return val.every(x => allFieldList.indexOf(x) >= 0)
      }
    },
    resultField: {
      type: Array,
      default: () => ['storeCode', 'storeName', 'merchantName'],
      validator: function(val) {
        const allFieldList = [
          'storeCode',
          'storeName',
          'merchantName',
          'mobile',
          'contactName'
        ]
        return val.every(x => allFieldList.indexOf(x) >= 0)
      }
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [{
        value: '0',
        label: '线上店铺'
      }, {
        value: '1',
        label: '线下店铺'
      }],
      tableMaxHeight: 0,
      label: '',
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      merchantSelected: [],
      choose: {
        searchConfig: [
          {
            label: '店铺编码',
            prop: 'storeCode',
            type: 'input'
          },
          {
            label: '店铺名称',
            prop: 'storeName',
            type: 'input'
          },
          {
            label: '所属商家',
            slot: 'merchantId'
          },
          {
            label: '所属渠道',
            slot: 'channelCode'
          },
          {
            label: '店铺类型',
            slot: 'storeOnlineType'
          }
        ],
        searchValue: {
          merchantId: '',
          storeCode: '',
          storeName: '',
          ...this.params,
          merchantName: ''
        },
        requestUrl: this.reUrl ? this.reUrl : '/ouser-web/api/store/queryPlatformAuthStorePage.do',
        requestMethod: 'post',
        columns: [
          {
            label: '店铺编码',
            prop: 'storeCode',
            show: true
          },
          {
            label: '店铺名称',
            prop: 'storeName',
            show: true
          },
          {
            label: '所属商家',
            prop: 'merchantName',
            show: true
          },
          {
            label: '联系人手机号',
            prop: 'mobile',
            show: true
          },
          {
            label: '店铺联系人',
            prop: 'contactName',
            show: true
          },
          {
            label: '渠道',
            slot: 'channelCodes',
            show: true
          },
          {
            label: '店铺类型',
            slot: 'storeOnlineTypeName',
            show: true
          }
        ]
      },
      viewOperates: {
        width: 80,
        fixed: 'right',
        list: [
          {
            label: '删除',
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
    getStoreOnlineTypeMap() {
      return this.options.reduce((prev, item) => {
        prev[item.value] = item.label
        return prev
      }, {})
    },
    getChannelCodeMap() {
      return this.$refs.channel.$refs.select2.options.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getSelectedLeft() {
      if (this.collapseTags) {
        const index = this.calcMaxIndex()
        return this.selected.slice(0, index + 1)
      }

      return this.selected
    },
    getSelectedRight() {
      if (this.collapseTags) {
        const index = this.calcMaxIndex()
        return this.selected.slice(index + 1)
      }
      return []
    },
    getSearchConfig() {
      const {
        choose: { searchConfig },
        searchField
      } = this

      return searchField.map(field =>
        searchConfig.find(x => x.prop === field || x.slot === field)
      )
    },
    getColumns() {
      const {
        choose: { columns },
        resultField
      } = this

      return resultField.map(field =>
        columns.find(x => x.prop === field || x.slot === field)
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
      async handler(newVal) {
        // debugger
        if (this.multiple) {
          const hasValue = this.value && this.value.length
          const hasSelected = this.selected && this.selected.length
          if (hasValue) {
            if (!hasSelected) {
              if (this.valueKey === 'storeId') {
                const { data: { listObj: selected }} = await this.requestOne({
                  currentPage: 1,
                  itemsPerPage: newVal.length,
                  storeIds: newVal
                })
                this.selected = selected || []
                this.innerChecked = this.$portal.deepClone(this.selected)
              } else {
                const createSelected = newVal.map(x => ({ [this.valueKey]: x }))

                this.selected = createSelected
                this.innerChecked = []
              }
            }
          } else {
            this.innerChecked = []
          }
        } else {
          const hasValue = this.value != null && this.value !== ''
          const hasSelected = this.selected && Object.keys(this.selected).length

          if (hasValue) {
            if (!hasSelected) {
              if (this.valueKey === 'storeId') {
                const { data: { listObj: [selected] }} = await this.requestOne({
                  currentPage: 1,
                  itemsPerPage: 1,
                  storeIds: [this.value]
                })
                this.selected = selected || {}
                this.innerChecked = this.$portal.deepClone([this.selected])
              } else {
                this.selected = {}
              }
            }
            this.label = this.selected[this.labelKey] || ''
          } else {
            this.label = ''
          }
        }
        this.dispatch('ElFormItem', 'el.form.change', newVal)
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    getChannel(list) {
      return list.map(x => this.getChannelCodeMap[x]).join('、')
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
    async requestOne(params) {
      const requestParams = {
        url: this.choose.requestUrl,
        method: this.choose.requestMethod,
        headers: {
          'Content-Type': 'application/json;charset=UTF-8'
        }
      }
      requestParams[
        this.choose.requestMethod === 'post' ? 'data' : 'params'
      ] = params
      // this.$emit('update:loading', true)
      return await this.$portal.ajax(requestParams)
    },
    calcMaxIndex() {
      if (!this.$refs.selectWrap) return 1
      const allLength = this.$refs.selectWrap.clientWidth
      let myLenth = 0
      let maxIndex = 0

      // this.selected
      this.selected.every((item, index) => {
        const word = item[this.labelKey]
        const wordLength = word.replace(/[^\x00-\xff]/g, '01').length

        myLenth += (wordLength * 12 + 25)

        if (myLenth < allLength) {
          maxIndex = index
          return true
        }
        return false
      })

      return maxIndex
    },
    handleTagClose(tag) {
      const { valueKey } = this
      const selected = this.selected.filter(x => x[valueKey] !== tag[valueKey])
      this.selected = selected

      const value = selected.map(x => x[this.valueKey])

      // console.log('selected', selected)
      this.$emit('input', value)
      this.$emit('update:selected', selected)
      this.dispatch('ElFormItem', 'el.form.change', value)
    },
    handleMaxHeight(maxHeight) {
      this.dialogMaxHeight = maxHeight

      if (maxHeight === 0) {
        this.tableMaxHeight = 1000
        return false
      }

      const dialogHeight = 48
      const dialogPaddingTop = 24
      const dialogPaddingBottom = 12
      const tableMaxHeight =
        maxHeight -
        dialogHeight -
        dialogPaddingTop -
        dialogPaddingBottom -
        100

      this.tableMaxHeight = tableMaxHeight
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
      this.$emit('delete')
      this.initView()
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
      this.$emit('delete')
      this.initView()
    },
    handleViewClose() {
      this.status = ''
    },
    handleViewOpen() {
      this.status = 'view'
      this.initView()
    },
    initView() {
      this.$nextTick(async() => {
        const storeIds = this.innerChecked.map(x => x[this.valueKey])

        storeIds && storeIds.length && await this.$refs.tableView.getList({
          currentPage: 1,
          itemsPerPage: 100,
          storeIds
        })
      })
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
.cp-store-choose {
  .selected {
    color: red;
  }
  .is-readonly {
    /deep/ {
      .el-input__inner {
        /*background: #eef5f9;*/
      }
    }
  }
  .select-wrap {
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    line-height: 28px;
    height: 32px;
    padding: 0 8px;
    &-line {
      overflow: hidden;
    }
    .placeholder {
      color: #c0c4cc;
      line-height: 32px;
    }
  }
}
</style>
