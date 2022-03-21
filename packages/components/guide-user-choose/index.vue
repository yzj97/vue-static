<template>
  <div class="cp-guide-user-choose">
    <template v-if="multiple">
      <ody-button v-bind="$attrs" code="ui" type="default" size="small" @click="handleChooseOpen"> + 选择导购员</ody-button>
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
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :checked="innerChecked"
      :choose-key="valueKey"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('导购员选择')"
      @close="handleChooseClose"
      @submit="handleChooseSubmit"
    >
      <template slot="channelCode" slot-scope="scope">
        <ody-channel-select ref="channel" v-model="scope.row.channelCode" :placeholder="$t('全部')" />
      </template>
      <template slot="departmentId" slot-scope="scope">
        <ody-organization-select v-model="scope.row.departmentId" value-key="code" style="width: 180px;"/>
      </template>
      <template slot="isAvailable" slot-scope="scope">
        {{ scope.row.isAvailable | keyVal(getAvailableMap) }}
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="导购员查看"
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
      >
        <template slot="isAvailable" slot-scope="scope">
          {{ scope.row.isAvailable | keyVal(getAvailableMap) }}
        </template>
      </ody-table>
      <span slot="footer">
        <ody-button code="ui" size="small" type="primary" @click="handleViewClose">知道了</ody-button>
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
      default: 'userId'
    },
    labelKey: {
      type: String,
      default: 'username'
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      tableMaxHeight: 0,
      label: '',
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      merchantSelected: [],
      getAvailableMap: {
        1: '启用',
        0: '停用'
      },
      choose: {
        searchConfig: [
          // {
          //   label: '所属渠道',
          //   slot: 'channelCode'
          // },
          {
            label: '所属组织',
            slot: 'departmentId'
          },
          {
            label: '工号',
            prop: 'employeNum',
            type: 'input'
          },
          {
            label: '用户账号',
            prop: 'username',
            type: 'input'
          },
          {
            label: '姓名',
            prop: 'identityCardName',
            type: 'input'
          },
          {
            label: '手机号',
            prop: 'mobile',
            type: 'input'
          }
        ],
        searchValue: {
          departmentId: null,
          employeNum: null,
          username: null,
          mobile: null,
          ...this.params
        },
        requestUrl: '/ouser-web/employee/queryGuideUserPage.do',
        columns: [
          {
            label: '用户账号',
            prop: 'username',
            show: true
          },
          {
            label: '姓名',
            prop: 'identityCardName',
            show: true
          },
          {
            label: '手机号',
            prop: 'mobile',
            show: true
          },
          {
            label: '工号',
            prop: 'employeNum',
            show: true
          },
          {
            label: '状态',
            slot: 'isAvailable',
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
        const userIds = this.innerChecked.map(x => x[this.valueKey])
        userIds && userIds.length && await this.$refs.tableView.getList({
          currentPage: 1,
          itemsPerPage: 100,
          userIds
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
.cp-guide-user-choose {
  .selected {
    color: red;
  }
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
}
</style>
