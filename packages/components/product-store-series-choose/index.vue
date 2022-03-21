<template>
  <div class="cp-store-product-choose">
    <template v-if="multiple">
      <div class="my-button" @click="handleChooseOpen">
        <slot>
          <ody-button v-bind="$attrs" code="ui" type="default" size="small">+ 选择店铺商品</ody-button>
        </slot>
      </div>
      <template v-if="view">
        已选
        <span class="selected">{{ value.length }}</span> 个
        <ody-button
          :disabled="value.length === 0"
          code="ui"
          size="small"
          type="text"
          class="width-auto"
          @click="handleViewOpen"
        >查看</ody-button>
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
      :response="handleResponse"
      :columns="choose.columns"
      :checked="innerChecked"
      :choose-key="valueKey"
      :default-expand-all="true"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('店铺商品选择')"
      :is-tree="true"
      :disabled-id-list="getDisabledIdList"
      row-key="id"
      @open="handleOpen"
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
      <template slot="category" slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="categoryStatus">
              <el-select
                v-model="scope.row.categoryStatus"
                :clearable="false"
                placeholder="请选择"
                class="choose-contain"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="categoryIds">
              <ody-category-tree-select v-model="scope.row.categoryIds" class="choose-tree" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template slot="brand" slot-scope="scope">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="brandStatus">
              <el-select
                v-model="scope.row.brandStatus"
                :clearable="false"
                placeholder="请选择"
                class="choose-contain"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="brandId">
              <ody-brand-choose v-model="scope.row.brandId" placeholder="请选择" />
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </ody-choose>
    <ody-dialog
      v-else-if="status === 'view'"
      :visible="status === 'view'"
      :append-to-body="true"
      title="店铺商品查看"
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
      >批量删除</ody-button>
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
    limit: {
      type: Number,
      default: Infinity
    },
    disabledIdList: {
      type: Array,
      default: () => []
    },
    view: {
      type: Boolean,
      default: false
    },
    // eslint-disable-next-line vue/require-default-prop
    value: [String, Array],
    selected: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    labelKey: {
      type: String,
      default: 'mpChineseName'
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
      innerDisabledIdList: [],
      tableMaxHeight: 0,
      categoryTreeData: [],
      label: '',
      status: '',
      innerChecked: [],
      innerViewChecked: [],
      merchantSelected: [],
      options: [
        {
          value: 1,
          label: '包含'
        },
        {
          value: 0,
          label: '不包含'
        }
      ],
      choose: {
        searchConfig: [
          {
            label: '商家名称:',
            slot: 'merchantId'
          },
          {
            label: '商品名称:',
            prop: 'chineseName',
            type: 'input'
          },
          {
            label: '商品编码:',
            prop: 'code',
            type: 'input'
          },
          {
            label: '商品类目:',
            slot: 'category'
          },
          {
            label: '商品品牌:',
            slot: 'brand'
          }
        ],
        searchValue: {
          typeOfProducts: [0, 3, 4],
          merchantId: null,
          chineseName: null,
          code: null,
          categoryIds: [],
          categoryStatus: 1, // 1 包含 0 包含
          brandId: null,
          brandStatus: 1, // 1 包含 0 不包含
          ...this.params
        },
        requestUrl:
          '/back-product-web/back/mp/merchantProduct/queryMerchantProductChannelByPage.do',
        columns: [
          {
            label: '商品名称',
            prop: 'mpChineseName',
            show: true,
            minWidth: 180
          },
          {
            label: '商品编码',
            prop: 'mpCode',
            show: true,
            minWidth: 180
          },
          {
            label: '店铺编码',
            prop: 'storeId',
            show: true,
            minWidth: 180
          },
          {
            label: '计量单位',
            prop: 'mpChannelMeasurementUnit',
            show: true,
            minWidth: 100
          },
          {
            label: '商品品牌',
            prop: 'mpBrandName',
            show: true,
            minWidth: 180
          },
          {
            label: '规格属性',
            prop: 'saleAttribute',
            show: true,
            minWidth: 180
          },
          {
            label: '商品类目',
            prop: 'mpCategoryFullNamePath',
            show: true,
            minWidth: 300
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
    getDisabledIdList() {
      const allIds = [...this.disabledIdList, ...this.innerDisabledIdList]
      return [...new Set(allIds)]
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
          const hasValue = this.value && this.value.length
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
        maxHeight - dialogHeight - dialogPaddingTop - dialogPaddingBottom - 100

      this.tableMaxHeight = tableMaxHeight
    },
    searchFormat(params) {
      const {
        categoryStatus,
        categoryIds,
        brandStatus,
        brandId,
        ...otherParams
      } = params

      if (categoryIds && categoryIds.length) {
        otherParams[
          categoryStatus ? 'categoryIds' : 'notCategoryIds'
        ] = categoryIds
      }

      if (brandId) {
        otherParams[brandStatus ? 'brandId' : 'notBrandId'] = brandId
      }

      return otherParams
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    async handleResponse(res) {
      const {
        data: { listObj: mpList }
      } = res

      const mpIdList = (mpList || [])
        .filter(x => x.mpTypeOfProduct === 3)
        .map(x => x[this.valueKey])

      if (mpIdList && mpIdList.length) {
        const {
          data: { listObj: listStoreSeriesMp }
        } = await this.$api.merchantProduct.listStoreSeriesMp({
          currentPage: 1,
          itemsPerPage: 100,
          parentIds: mpIdList
        })

        // console.log(listStoreSeriesMp)
        res.data.listObj.forEach(mpItem => {
          if (mpItem.mpTypeOfProduct === 3) {
            const children = listStoreSeriesMp.filter(
              mpSeriesItem => mpSeriesItem.parentId === mpItem.parentId
            )

            if (children && children.length) {
              mpItem.children = children
            } else {
              this.innerDisabledIdList.push(mpItem[this.valueKey])
            }
          }
        })
      }

      return res
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

      this.innerChecked = this.innerChecked.filter(
        (item, index) => !checkMap[item[this.valueKey]]
      )
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

      const deleteId = row[this.valueKey]
      const ids = this.innerChecked.map(x => x[this.valueKey])
      const deleteIndex = ids.findIndex(x => x === deleteId)

      ids.splice(deleteIndex, 1)
      this.innerChecked.splice(deleteIndex, 1)

      this.$emit('input', ids)
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
        const ids = this.innerChecked.map(x => x[this.valueKey])
        ids &&
          ids.length &&
          (await this.$refs.tableView.getList({
            currentPage: 1,
            itemsPerPage: 100,
            typeOfProducts: [0, 2, 4],
            ids
          }))
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
.choose-contain {
  /deep/ {
    .el-input {
      width: 100px !important;
    }
  }
}
.choose-tree {
  width: 180px;
  margin-right: 20px;
}
.cp-store-product-choose {
  .selected {
    color: red;
  }

  .my-button {
    display: inline-block;
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
