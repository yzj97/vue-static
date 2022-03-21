<template>
  <div class="cp-choose-merchant">
    <div v-if="!showEdit">
      <el-button
        v-if="!isView"
        v-model="label"
        v-bind="$attrs"
        :clearable="true"
        name="label"
        type="text"
        icon="el-icon-plus"
        class="is-readonly"
        @click="handleOpen"
        @clear="handleClear"
      >{{ $t('添加关联原料') }}</el-button>
    </div>
    <div v-if="showEdit">
      <div class="show-edit-el-icon">
        <div class="show-edit-label">{{ value.chineseName }}{{ value }}</div>
        <i v-if="!isView" name="handleOpen" class="el-icon-edit opra-color" @click="handleOpen" />
        <i v-if="!isView" name="berRemove" class="el-icon-close opra-color" @click="berRemove" />
      </div>
    </div>
    <ody-choose
      v-if="choose.visible"
      :visible="choose.visible"
      :checked="innerChecked"
      :search-config="choose.searchConfig"
      :search-value="choose.searchValue"
      :request-url="choose.requestUrl"
      :request-page-type="choose.pageType"
      :columns="choose.columns"
      :choose-key="valueKey"
      :highlight-current-row="true"
      :search-format="searchFormat"
      :title="$t('商品列表')"
      @close="handleClose"
      @submit="handleSubmit"
    >
      <template slot="brandId" slot-scope="scope">
        <ody-brand-select v-model="scope.row.brandId" name="scope_row_brandId" />
      </template>
      <template slot="BarCodes" slot-scope="scope">
        <span v-for="(item,index) in scope.row.merchantProductBarCodes" :key="index">
          {{ item.barCode }}
          <span v-if="index<scope.row.merchantProductBarCodes.length-1">,</span>
        </span>
      </template>
    </ody-choose>
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
      default: 'merchantCode'
    },
    labelKey: {
      type: String,
      default: 'merchantName'
    },
    id: {
      type: String,
      default: ''
    },
    parindex: {
      type: String,
      default: ''
    },
    index: {
      type: String,
      default: ''
    },
    selectedBeverageid: {
      type: Array,
      default: () => []
    },
    merchantId: {
      type: Number,
      default: null
    },
    merchantProductId: {
      type: Number,
      default: null
    },
    dataType: {
      type: Number,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    },
    warehouseType: {
      type: Number,
      default: null
    }
  },
  data() {
    const vue = this
    return {
      innerChecked: [],
      label: '',
      choose: {
        pageType: 'page',
        visible: false,
        searchConfig: [
          {
            label: '商品名称',
            prop: 'chineseName',
            placeholder: '请输入商品名称',
            type: 'input'
          },
          {
            label: '商品编码',
            prop: 'code',
            placeholder: '请输入商品编码',
            type: 'input'
          },
          {
            label: '商品条码',
            prop: 'barCode',
            placeholder: '请输入商品条码',
            type: 'input'
          },
          {
            label: '商品品牌',
            slot: 'brandId'
          }
        ],
        searchValue: {
          artNo: null,
          barCode: null,
          bomItemIds: [],
          brandId: null,
          categoryId: null,
          categoryIds: null,
          chineseName: null,
          code: null,
          dataType: vue.dataType,
          merchantId: this.merchantId,
          mpIds: this.selectedBeverageid || [],
          status: [2],
          type: [1, 32],
          typeOfProducts: [0, 2, 4],
          useType: 1,
          warehouseType: this.warehouseType,
          ...this.params
        },
        requestUrl:
          '/back-product-web/back/mp/mpBom/listBomItemProductForPage.do',
        columns: [
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
            label: '商品条码',
            slot: 'BarCodes',
            show: true
          },
          {
            label: '商品品牌',
            prop: 'brandName',
            show: true
          }
        ],
        checked: []
      },
      showEdit: false
    }
  },
  watch: {
    selected: {
      handler(newVal) {
        this.label = newVal[this.labelKey] || ''
      },
      deep: true // 可以深度检测到 person 对象的属性值的变化
    },
    value: {
      handler(newVal) {
        if (newVal === undefined || newVal === '' || newVal === null) {
          this.label = ''
        }
        if (newVal && newVal.length > 0) {
          this.innerChecked = [{ [this.valueKey]: newVal[0][this.valueKey] }]
        }
      },
      immediate: true,
      deep: true
    },
    selectedBeverageid: {
      handler(val) {
        this.choose.searchValue.mpIds = this.selectedBeverageid || []
      },
      deep: true
    }
  },
  mounted() {
    if (this.value) {
      this.showEdit = true
    }
  },
  methods: {
    searchFormat(params) {
      return {
        filters: params
      }
    },
    handleClear() {
      this.$emit('input', '')
      this.$emit('clear')
    },
    handleOpen() {
      if (this.$attrs.disabled) {
        return false
      }

      this.choose.visible = true
      this.$emit('open')
    },
    berRemove() {
      this.selectedBeverageid.splice(
        this.selectedBeverageid.findIndex(
          item => item === this.merchantProductId
        ),
        1
      )
      this.value = null
      this.$emit('clearMun', this.parindex, this.index)
      this.$emit('input', this.value)
      this.showEdit = false
    },
    handleClose() {
      this.choose.visible = false
      this.$emit('cancel')
    },
    handleSubmit(value) {
      this.choose.visible = false
      this.id = value[0]
      this.$emit('input', value[0].chineseName)
      this.$emit('getrelatedUnit', value[0], this.parindex, this.index)
      this.showEdit = true
    }
  }
}
</script>

<style lang="scss" scoped>
.opra-color {
  font-size: 18px;
  font-weight: 600;
  color: #ced4da;
  padding-left: 10px;
}
.show-edit-label {
  max-width: 130px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.show-edit-el-icon {
  display: flex;
  align-items: center;
}
.cp-choose-merchant {
  .is-readonly {
    /deep/ {
      .el-input__inner {
        background: #eef5f9;
      }
    }
  }
  .el-button--text {
    color: rgba(24, 144, 255, 1) !important;
    min-width: 50px !important;
  }
}
</style>
