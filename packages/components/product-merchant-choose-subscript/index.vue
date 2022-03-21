<template>
  <div class="cp-merchant-choose">
    <template v-if="multiple">
      <div class="my-button" @click="visible = true">
        <slot>
          <ody-button v-if="multiple===true" v-bind="$attrs" code="ui" type="primary" size="small" >{{ $t('选择商品') }}</ody-button>
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
      :search-format="searchFormat"
      :checked="innerChecked"
      :choose-key="valueKey"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :columns="choose.columns"
      :multiple="multiple"
      :highlight-current-row="!multiple"
      :limit="limit"
      :title="$t('商家商品选择')"
      :disabled-id-list="disabledIdList"
      class="choose"
      request-page-type="page"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="merchantId" slot-scope="scope">
        <!-- :popper-append-to-body="false" -->
        <el-select
          v-model="scope.row.merchantId"
          :placeholder="$t('请选择')"
          clearable>
          <el-option
            v-for="item in merchantList"
            :key="item.merchantId"
            :label="item.merchantName"
            :value="item.merchantId"/>
        </el-select>
      </template>
      <template slot="categoryIds" slot-scope="scope">
        <el-form-item prop="categoryIds">
          <ody-tree-select :append-to-body="true" :z-index="10000" :normalizer="normalizer" v-model="scope.row.categoryIds" :multiple="true" :options="categoryTreeData" value-consists-of="LEAF_PRIORITY"/>
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
      categoryTreeData: [],
      merchantList: [],
      brandList: [],
      service: this.$api.product,
      label: '',
      innerChecked: [],
      visible: false,
      choose: {
        searchConfig: [
          {
            label: this.$t('商家名称'),
            slot: 'merchantId'
          },
          {
            label: this.$t('商品名称'),
            prop: 'chineseName',
            type: 'input'
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            type: 'input'
          },
          {
            label: this.$t('商品类目'),
            slot: 'categoryIds'
          },
          {
            label: this.$t('商品品牌'),
            slot: 'brandId'
          }
        ],
        searchValue: {
          merchantId: '',
          storeId: '',
          chineseName: null,
          code: null,
          categoryIds: [],
          brandId: null,
          ...this.params
        },
        requestUrl: '/back-product-web/back/mp/product/listMerchantProductInfoByPage.do',
        columns: [
          {
            label: this.$t('商家名称'),
            prop: 'merchantName',
            show: true
          },
          //  {
          //    label: '店铺',
          //    prop: 'storeName',
          //    show: true
          //  },
          {
            label: this.$t('商品名称'),
            prop: 'chineseName',
            show: true
          },
          {
            label: this.$t('商品编码'),
            prop: 'code',
            show: true
          },
          {
            label: this.$t('商品类目'),
            prop: 'categoryName',
            show: true
          },
          {
            label: this.$t('商品品牌'),
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
        this.getMerchantList()
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
        filters: { merchantStatusFlag: 0, ...params }
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
    getMerchantList() {
      this.service.queryPlatformAuthMerchantPage({
        currentPage: 1,
        itemsPerPage: 500
      }).then(res => {
        this.merchantList = res.data.listObj
      })
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
  display: inline-block;
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
// /deep/ .cp-search-item {
//   overflow: unset !important;
// }
// .choose {
//   /deep/ .box {
//     overflow: unset !important;
//   }
// }
// /deep/ .cp-list-search-area .box{
//   overflow: unset !important;
// }
// /deep/ .cp-list-search-area .inner{
//   overflow: unset !important;
// }
/deep/ .el-select-dropdown {
  position: absolute !important;
  left: 0;
  right: 0;
  max-height: 300px;
}
/deep/ .el-scrollbar__view{
  max-height: 300px;
}
</style>
