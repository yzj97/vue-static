<template>
  <section>
    <el-form ref="form" :disabled="isView" :model="mp" :rules="rules" class="form" label-width="140px" >
      <ody-nav-title v-if="mp.productVO && mp.productInfoVO && loaded" :list="menuList" >
        <div v-if="mp.productInfoVO.type">
          <product-header
            :mp.sync="mp" />
        </div>

        <!-- 基本属性 -->
        <div id="productBaseInfo">
          <product-base-info
            ref="productBaseInfo"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp" />
        </div>
        <!-- 价格设置 -->
        <div id="productMaterialPrice">
          <product-material-price
            ref="productMaterialPrice"
            :is-edit.sync="isEdit"
            :mp.sync="mp"
            :is-view.sync="isView"

          />
        </div>
        <!-- 图文 -->
        <div id="productMediaDescription">
          <product-media-description
            ref="productMediaDescription"
            :mp.sync="mp" />
        </div>
        <!-- 其他 -->
        <div id="productOther">
          <product-other
            ref="productOther"
            :mp.sync="mp" />
        </div>
      </ody-nav-title>
    </el-form>
    <ody-fixed>
      <el-button name="cancel" @click="cancel">{{ $t('go_back') }}</el-button>
      <ody-button v-if="!isView" :disabled="submiting" name="ProductCreateSave_btn_submitForm" code="ProductCreateSave_btn" type="primary" @click="submitForm">{{ $t('common_save') }}</ody-button>
    </ody-fixed>
  </section>

</template>

<script>
import productHeader from '@/components/product-header' // 类型，类目
import productBaseInfo from '@/components/product-base-info/material' // 基本属性
import productMaterialPrice from '@/components/product-material-price' // 销售属性
import productMediaDescription from '@/components/product-media-description/material' // 图文
import productOther from '@/components/product-other/material' // 其他
export default {
  name: 'ProductDetailMaterial',
  components: {
    productHeader,
    productBaseInfo,
    productMaterialPrice,
    productMediaDescription,
    productOther
  },
  props: {
    createMp: {
      type: Object,
      required: true,
      default: null
    }
  },
  data() {
    return {
      submiting: false,
      activeIndex: 'productBaseInfo',
      mp: getDefaultFrom(),
      rules: {},
      menuList: [],
      loaded: false,
      isView: false,
      clone: false
    }
  },
  async mounted(d) {
    const query = this.$route.query
    if (query) { // 通过跳转进入
      if (query.id) {
        this.mp.productVO.id = query.id
      }
      if (query.isView) {
        this.isView = query.isView
      }
      if (query.clone) {
        this.clone = query.clone
      }
    }
    await this.loadMp()
    this.loadMenu()

    if (this.clone) {
      this.isEdit = false
      this.isView = false
      this.clearCloneDataInfo()
    } else {
      this.isEdit = !!this.mp.productVO.id
    }
    this.loaded = true
  },
  methods: {
    loadMenu() {
      this.menuList = []
      this.menuList.push({
        href: '#productBaseInfo',
        text: this.$t('基本属性')
      })
      if (!this.mp.productInfoVO.type) {
        return
      }
      this.menuList.push({
        href: '#productMaterialPrice',
        text: this.$t('价格设置')
      })
      this.menuList.push({
        href: '#productMediaDescription',
        text: this.$t('原料图片')
      })
      this.menuList.push({
        href: '#productOther',
        text: this.$t('其他')
      })
    },
    async loadMp() {
      if (this.mp.productVO.id) {
        // 获取商品信息
        const { data } = await this.$product.$api.mpApi.getProductDetail(JSON.stringify(this.mp.productVO.id))
        data.dataType = data.productVO.dataType
        if (data.productVO.id !== data.productVO.refId) {
          this.isView = true
        }
        this.mp = data
        this.mp.barcodePriceVOS.forEach(item => {
          this.$set(item, 'weight', [this.mp.weightFloor, this.mp.weightCeiling])
        })
      } else { // 通过创建进入
        const defaultFrom = getDefaultFrom()
        defaultFrom.productVO = Object.assign(defaultFrom.productVO, this.createMp.productVO)
        defaultFrom.productInfoVO = Object.assign(defaultFrom.productInfoVO, this.createMp.productInfoVO)
        if (defaultFrom.barcodePriceVOS || defaultFrom.barcodePriceVOS.length === 0) {
          defaultFrom.barcodePriceVOS = [getDefaultBarcodePrice()]
        }
        defaultFrom.dataType = this.createMp.dataType
        this.mp = defaultFrom
      }
    },
    submitForm() {
      // 调用每个组件的预提交方法
      this.submiting = true
      const refs = this.$refs
      for (const i in refs) {
        if (refs[i] && refs[i].preSubmit) {
          refs[i].preSubmit()
        }
      }
      this.mp.isAdd = !this.isEdit
      this.mp.productVO.dataType = this.mp.dataType
      this.mp.productInfoVO.code = this.mp.productVO.code

      // 提交表单
      this.$refs['form'].validate((valid) => {
        let refPreValidateFlag = true
        if (valid) {
          // 调用组件的validate方法
          for (const index in refs) {
            if (index !== 'form' && refs[index] && refs[index].validate) {
              const preValidate = refs[index].validate()
              if (!preValidate) {
                refPreValidateFlag = false
              }
            }
          }
        }
        if (valid && refPreValidateFlag) {
          this.$product.$api.mpApi.saveOrUpdateProductInfo(this.mp).then((data) => {
            this.$message({
              type: 'success',
              message: data.message ? data.message : this.$t('common_save_success')
            })
            this.$portal.delActiveView()
          }).finally(res => {
            this.submiting = false
          })
        } else {
          this.submiting = false
        }
      })
    },
    cancel() {
      if (this.isEdit || this.clone || this.isView) {
        this.$portal.delActiveView()
      } else {
        this.$emit('back')
      }
    },
    clearCloneDataInfo() { // 清理复制商品的信息
      this.mp.productVO.id = null
      this.mp.productVO.code = null
      this.mp.productVO.status = null
      this.mp.productVO.canSale = null
      this.mp.productInfoVO.id = null
      this.mp.productInfoVO.artNo = null
      if (this.mp.barcodePriceVOS) {
        this.mp.barcodePriceVOS.forEach(element => {
          element.id = null
          element.priceId = null
          element.mpId = null
          element.skuCode = null
          element.priceId = null
          element.canSale = null
          element.barcodes = []
        })
      }
      if (this.mp.mediaList) {
        this.mp.mediaList.forEach(element => {
          element.id = null
        })
      }
      if (this.mp.taxRateVO) {
        this.mp.taxRateVO.id = null
      }
    }
  }
}
function getDefaultFrom() {
  return Object.assign({}, {
    id: null,
    dataType: 1, // 平台商品
    productVO: {
      merchantId: null,
      merchantProductId: null,
      code: null,
      parentId: null,
      sourceType: null,
      status: null,
      channelCode: null,
      dataType: null,
      priceLevel: null,
      subTypeOfProduct: null,
      typeOfProduct: null, // 普通品
      refId: null,
      productVOList: []
    },
    productInfoVO: {
      id: null,
      merchantProdVolume: null,
      shelflifeDays: null,
      returnDays: null,
      chineseName: null,
      englishName: null,
      code: null,
      artNo: null,
      subtitle: null,
      subtitleLan2: null,
      type: null,
      saleCalcUnitId: null, // 主计量单位id
      categoryId: null,
      brandId: null,
      warehouseType: 1, // 默认无仓
      useType: null,
      machiningType: 0, // 无需加工，2: 后加工
      combineType: null, // 组合商品类型:0-固定组合;1-可选组合
      placeOriginName: null,
      fastCode: null,
      mpModel: null,
      categoryFullIdPath: null,
      mainUnitId: null,
      mainUnitCode: null,
      mainUnitName: null
    },
    mediaList: [], // 商品图文信息
    taxRateVO: {
      saleTaxRateId: null,
      saleTaxRate: null
    },
    barcodePriceVOS: [] // 商品条码和价格信息
  })
}

function getDefaultBarcodePrice() {
  return Object.assign({}, {
    mpId: null,
    skuCode: null,
    saleAttrs: [],
    barcodes: [],
    priceId: null,
    salePrice: null, // 零售价
    salePriceUnitType: null, // 零售价单位类型（仅称重商品）
    marketPrice: 0, // 市场价, 默认0
    purchasePrice: 0, // 采购价, 默认0
    weightFloor: null,
    weightCeiling: null,
    weight: [],
    pictureUrl: null,
    canSale: null,
    priceEditable: 1 // 价格是否可编辑： 0不行 1可以
  })
}
</script>
<style lang="less" scoped>
  .form .section{
    margin:20px 0px;
  }
  /* 导航被覆盖，设置z-index */
  /deep/
  .cp-nav-title .tabs {
    z-index: 1000;
  }
</style>
