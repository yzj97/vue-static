<template>
  <div class="cp-merchant-choose">
    <template v-if="multiple">
      <div class="my-button" @click="visible = true">
        <slot>
          <ody-button v-if="multiple===true" v-bind="$attrs" code="ui" type="primary" size="small" >选择商品</ody-button>
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
      :title="$t('店铺商品选择')"
      :search-format="searchFormat"
      :disabled-id-list="disabledIdList"
      request-page-type="page"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="storeId" slot-scope="scope">
        <el-select
          v-model="scope.row.storeId"
          :placeholder="$t('common_choose_please')"
          clearable
        >
          <el-option v-for="v in storeList" :label="v.storeName" :key="v.storeId" :value="v.storeId" />
        </el-select>
      </template>
      <template slot="categoryIds" slot-scope="scope">
        <el-form-item prop="categoryIds">
          <ody-tree-select :normalizer="normalizer" :append-to-body="true" :z-index="10000" v-model="scope.row.categoryIds" :multiple="true" :options="categoryTreeData" value-consists-of="LEAF_PRIORITY"/>
        </el-form-item>
      </template>
      <template slot="brandId" slot-scope="scope">
        <el-form-item prop="brandId">
          <ody-brand-choose
            v-model="scope.row.brandId"
            :placeholder="$t('请选择')"
          />
        </el-form-item>
      </template>
    </ody-choose>
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
      default: 'code'
    },
    labelKey: {
      type: String,
      default: 'chineseName'
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
      storeList: [],
      categoryTreeData: [],
      brandList: [],
      service: this.$api.product,
      label: '',
      innerChecked: [],
      visible: false,
      choose: {
        searchConfig: [
          {
            label: '店铺',
            slot: 'storeId'
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
            slot: 'categoryIds'
          },
          {
            label: '商品品牌:',
            slot: 'brandId'
          }
        ],
        searchValue: {
          storeId: '',
          merchantId: null,
          chineseName: null,
          code: null,
          categoryIds: [],
          brandId: null,
          ...this.params
        },
        requestUrl: '/back-product-web/back/mp/product/listStoreProductInfoByPage.do',
        columns: [
          {
            label: '商家名称',
            prop: 'merchantName',
            show: true
          },
          {
            label: '店铺',
            prop: 'storeName',
            show: true
          },
          {
            label: '商品名称',
            prop: 'chineseName',
            show: true
          },
          {
            label: '商品编码',
            prop: 'code',
            show: true
          },
          {
            label: '商品品牌',
            prop: 'brandName',
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
    },
    visible(val) {
      if (val) {
        this.queryPlatformAuthStorePage()
        this.getListBrand()
        this.getListBackCategoryTree()
      }
    }
  },
  mounted() {
    console.log(this.params, 1111)
  },
  methods: {
    searchFormat(params) {
      return {
        filters: params
      }
    },
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
    },
    getListBrand() {
      this.service.listBrand({ currentPage: 1, itemsPerPage: 500 }).then(res => {
        this.brandList = res.data.listObj
      })
    },
    getListBackCategoryTree() {
      this.service.listBackCategoryTree({}).then(res => {
        this.categoryTreeData = [res.data]
      })
    },
    queryPlatformAuthStorePage() {
      this.service.queryPlatformAuthStorePage({
        currentPage: 1,
        itemsPerPage: 1000
      }).then(res => {
        this.storeList = res.data.listObj
      })
    },
    normalizer(node) {
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
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
        background: #eef5f9;
      }
    }
  }
}
.cp-tree-select {
  width: 200px;
  display: inline-block;
}
</style>
