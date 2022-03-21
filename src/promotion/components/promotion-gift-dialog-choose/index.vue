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
    width="960px"
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
    <template slot="giftNum" slot-scope="scope">
      <ody-input-number
        :empty-tip="false"
        :min="1"
        :max="999999"
        v-model="scope.row.giftNum"
        name="scope_row_giftNum" />
    </template>
    <template slot="channelIndividualLimit" slot-scope="scope">
      <ody-input-number
        :empty-tip="false"
        :min="1"
        :max="1000000000"
        v-model="scope.row.channelIndividualLimit"
        name="scope_row_channelIndividualLimit" />
    </template>
    <template slot="channelStoreLimit" slot-scope="scope">
      <ody-input-number
        :empty-tip="false"
        :min="1"
        :max="1000000000"
        v-model="scope.row.channelStoreLimit"
        name="scope_row_channelStoreLimit" />
    </template>
    <template slot="channelMerchantLimit" slot-scope="scope">
      <ody-input-number
        :empty-tip="false"
        :min="1"
        :max="1000000000"
        v-model="scope.row.channelMerchantLimit"
        name="scope_row_channelMerchantLimit" />
    </template>
    <template slot="giftNumLabel" slot-scope="scope">
      <ody-tip-star :content="$t('单次赠送数量')" />
    </template>
    <template slot="channelIndividualLimitLabel" slot-scope="scope">
      <ody-tip-star :content="$t('个人单渠道限购')" />
    </template>
    <template slot="channelStoreLimitLabel" slot-scope="scope">
      <ody-tip-star :content="$t('店铺单渠道限购')" />
    </template>
    <template slot="channelMerchantLimitLabel" slot-scope="scope">
      <ody-tip-star :content="$t('商家单渠道限购')" />
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
          mpName: '',
          mpCode: '',
          barcode: '',
          categoryIds: [],
          categoryType: '1',
          brandIds: [],
          brandType: '1',
          merchantIds: [],
          ...this.params
        },
        requestUrl: '/back-promotion-web/promotionChannelRead/queryOmnichannelProductList.do',
        columns: [
          {
            label: this.$t('商品名称'),
            prop: 'mpName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('商品编码'),
            prop: 'mpCode',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('商品条码'),
            prop: 'barcode',
            show: true,
            minWidth: 100
          },
          {
            label: this.$t('计量单位'),
            prop: 'measurementUnit',
            show: true,
            minWidth: 80
          },
          {
            label: this.$t('所属商家名称'),
            prop: 'merchantName',
            show: true,
            minWidth: 180
          },
          {
            label: this.$t('原价（元）'),
            prop: 'price',
            show: true,
            minWidth: 120
          },
          {
            labelSlot: 'giftNumLabel',
            // label: this.$t('单次赠送数量'),
            slot: 'giftNum',
            show: true,
            minWidth: 180
          },
          {
            labelSlot: 'channelIndividualLimitLabel',
            // label: this.$t('个人单渠道限购'),
            slot: 'channelIndividualLimit',
            show: true,
            minWidth: 180
          },
          {
            labelSlot: 'channelStoreLimitLabel',
            // label: this.$t('店铺单渠道限购'),
            slot: 'channelStoreLimit',
            show: true,
            minWidth: 180
          },
          {
            labelSlot: 'channelMerchantLimitLabel',
            // label: this.$t('商家单渠道限购'),
            slot: 'channelMerchantLimit',
            show: true,
            minWidth: 180
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
    checkData(batch) {
      const checkResult = {
        flg: true,
        errMsg: ''
      }

      if (!batch.giftNum || !batch.giftNum) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('单次赠送数量不应该为空，请重新填写')
      } else if (batch.channelIndividualLimit === undefined || !batch.channelIndividualLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数不应该为空，请重新填写')
      } else if (batch.channelStoreLimit === undefined || !batch.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('店铺单渠道限购数不应该为空，请重新填写')
      } else if (batch.channelMerchantLimit === undefined || !batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('商家单渠道限购数不应该为空，请重新填写')
      } else if (+batch.channelStoreLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('店铺单渠道限购数应小于商家单渠道限购数，请重新填写')
      } else if (+batch.channelIndividualLimit > +batch.channelMerchantLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数应小于商家单渠道限购数，请重新填写')
      } else if (+batch.channelIndividualLimit > +batch.channelStoreLimit) {
        checkResult.flg = false
        checkResult.errMsg = this.$t('个人单渠道限购数应小于店铺单渠道限购数，请重新填写')
      }

      if (!checkResult.flg) {
        this.$message({
          type: 'error',
          message: checkResult.errMsg
        })
      }

      return checkResult.flg
    },
    handleSubmit(val) {
      if (val.length === 0) {
        this.$message({
          type: 'error',
          message: this.$t('请选择赠品')
        })
        return
      }

      for (let index = 0; index < val.length; index++) {
        const flag = this.checkData(val[index])
        if (!flag) {
          return
        }
      }

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
