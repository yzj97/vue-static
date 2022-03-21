<template>
  <ody-choose
    v-if="visible"
    :visible="visible"
    :search-config="choose.searchConfig"
    :search-value="choose.searchValue"
    :request-url="choose.requestUrl"
    :columns="choose.columns"
    :checked="selected"
    :choose-key="chooseKey"
    :multiple="multiple"
    :highlight-current-row="!multiple"
    :title="$t('选择商品')"
    :search-format="searchFormat"
    @close="handleClose"
    @submit="handleSubmit"
  >
    <template slot="categoryType" slot-scope="scope">
      <el-select v-model="scope.row.categoryType" :clearable="false" :placeholder="$t('请选择')" name="scope_row_categoryType">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <ody-tree-select :z-index="10000" :multiple="true" :options="options" @input="changeInput"/>
    </template>
    <template slot="brandType" slot-scope="scope">
      <el-select v-model="scope.row.brandType" :clearable="false" :placeholder="$t('请选择')" name="scope_row_brandType">
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-select v-model="scope.row.brandIds" :placeholder="$t('请选择')" name="scope_row_brandIds" filterable multiple>
        <el-option
          v-for="item in brandIdsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </template>
    <template slot="merchantIds" slot-scope="scope">
      <el-select v-model="scope.row.merchantIds" :placeholder="$t('请选择')" name="scope_row_merchantIds" filterable multiple>
        <el-option
          v-for="item in merchantIdsOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </template>

  </ody-choose>
</template>

<script>
export default {
  props: {
    multiple: {
      type: Boolean,
      default: false
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: () => []
    },
    chooseKey: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      options: [],
      brandIdsOptions: [],
      merchantIdsOptions: [],
      categoryOptions: [
        {
          value: '1',
          label: this.$t('包含')
        },
        {
          value: '0',
          label: this.$t('不包含')
        }
      ],
      merchantSelected: [],
      choose: {
        searchConfig: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            type: 'input'
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            type: 'input'
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            type: 'input'
          },
          {
            label: this.$t('类目选择'),
            slot: 'categoryType'
          },
          {
            label: this.$t('商品品牌'),
            slot: 'brandType'
          },
          {
            label: this.$t('商家名称'),
            slot: 'merchantIds'
          }
        ],
        searchValue: {
          currentPage: 1,
          itemsPerPage: 10,
          ...this.params
        },
        requestUrl: '/back-promotion-web/promotionChannelRead/queryOmnichannelProductList.do',
        columns: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 120
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            show: true,
            minWidth: 120
          }
        ]
      }
    }
  },
  mounted() {
    this.constructBackTree()
    this.queryBrandList()
    this.queryPlatformAuthMerchantPage()
  },
  methods: {
    queryBrandList() {
      this.$portal.post('/back-promotion-web/merchantProductRead/queryBrandList.do', { obj: {}}).then(res => {
        var arr = []
        res.data.listObj && res.data.listObj.map(item => {
          arr.push({ value: item.id, label: item.name })
        })
        this.brandIdsOptions = arr
      })
    },
    constructBackTree() {
      this.$portal.post('/back-promotion-web/categoryRead/constructBackTree.action', {}).then(res => {
        var myFun = (item) => {
          var arr = []
          item && item.map(item => {
            var obj = {
              id: item.id,
              label: item.name
            }
            if (item.children && item.children.length > 0) {
              obj.children = myFun(item.children)
            }
            arr.push(obj)
          })
          return arr
        }

        if (res.data) {
          this.options = myFun([res.data])
        }
      })
    },
    queryPlatformAuthMerchantPage() {
      this.$portal.post('/ouser-web/api/merchant/queryPlatformAuthMerchantPage.do', { currentPage: 1, itemsPerPage: 1000 }).then(res => {
        var arr = []
        res.data.listObj.map(item => {
          arr.push({ value: item.merchantId, label: item.merchantName })
        })
        this.merchantIdsOptions = arr
      })
    },
    searchFormat(params) {
      return {
        obj: params
      }
    },
    handleClose() {
      this.$emit('cancel')
    },
    handleSubmit(val) {
      this.$emit('ok', val)
      this.$emit('update:selected', val)
    },
    changeInput(node) {
      this.choose.searchValue.categoryIds = node
    }
  }
}
</script>
<style lang="less" scoped>
 .box{
    max-height: none !important;
  }
  .cp-tree-select {
    width: 200px;
    display: inline-block;
  }
  .el-select {
    display: inline-block !important;
    vertical-align: inherit !important;
  }
</style>
