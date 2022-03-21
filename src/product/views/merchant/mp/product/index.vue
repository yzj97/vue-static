<template>
  <section>
    <el-form
      ref="form"
      :model="mp"
      :rules="rules"
      :disabled="isView"
      class="form"
      label-width="140px"
    >
      <ody-nav-title v-if="mp.productVO && mp.productInfoVO && loaded" :list="menuList">
        <div v-if="mp.productInfoVO.type">
          <product-header :mp.sync="mp" />
        </div>

        <!-- 基本属性 -->
        <div v-if="mp.productInfoVO.type" id="productBaseInfo">
          <product-base-info
            ref="productBaseInfo"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>
        <!-- 商品配置 -->
        <div
          v-if="mp.productVO.typeOfProduct !== 4 ||(mp.productVO.typeOfProduct===4 && isEdit &&
          mp.dataType === 3&& mp.productInfoVO.type === '32')"
          id="productOther"
        >
          <product-other ref="productOther" :is-edit.sync="isEdit" :is-view.sync="isView" :mp.sync="mp" />
        </div>
        <!-- 商品属性 -->
        <div v-if="mp.productVO.typeOfProduct !== 4" id="productAttribute">
          <product-attribute
            ref="productAttribute"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>

        <!-- 销售属性 -->
        <div v-if="mp.productVO.typeOfProduct !== 4" id="productSaleAttribute">
          <product-sale-attribute
            ref="productSaleAttribute"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>

        <!-- 商品备注 -->
        <div
          v-if="mp.productVO.typeOfProduct !== 4 && mp.productInfoVO.type === '32'"
          id="productRemark"
        >
          <product-remark
            ref="productRemark"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>

        <!-- 组合明细 -->
        <div v-if="mp.productVO.typeOfProduct === 4" id="productCombineGroup">
          <product-combine-group
            ref="productCombineGroup"
            :is-edit.sync="isEdit"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>

        <!-- 图文 -->
        <div id="productMediaDescription">
          <product-media-description
            ref="productMediaDescription"
            :is-view.sync="isView"
            :mp.sync="mp"
          />
        </div>

        <!-- 商品保障 -->
        <div
          v-if="mp.productInfoVO.type !== '31' && mp.productInfoVO.type !== '32'"
          id="productProtected"
        >
          <product-protected ref="productProtected" :mp.sync="mp" />
        </div>
        <!-- 售后服务 -->
        <div
          v-if="mp.productInfoVO.type !== '31' && mp.productInfoVO.type !== '32'"
          id="productAftersale"
        >
          <product-aftersale ref="productAftersale" :mp.sync="mp" />
        </div>
      </ody-nav-title>
    </el-form>
    <ody-fixed>
      <el-button name="cancel" @click="cancel">{{ $t('go_back') }}</el-button>
      <ody-button
        v-if="!isView"
        :disabled="submiting"
        name="ProductCreateSave_btn_submitForm"
        code="ProductCreateSave_btn"
        type="primary"
        @click="submitForm"
      >{{ $t('common_save') }}</ody-button>
    </ody-fixed>
  </section>
</template>

<script>
import productHeader from '@/components/product-header' // 类型，类目
import productBaseInfo from '@/components/product-base-info' // 基本属性
import productAttribute from '@/components/product-attribute' // 商品属性
import productSaleAttribute from '@/components/product-sale-attribute' // 销售属性
import productRemark from '@/components/product-remark' // 商品备注
import productCombineGroup from '@/components/product-combine-group' // 组合明细
import productMediaDescription from '@/components/product-media-description' // 图文
import productProtected from '@/components/product-protected' // 保障
import productOther from '@/components/product-other' // 商品配置
import productAftersale from '@/components/product-aftersale' // 售后
export default {
  name: 'ProductDetail',
  components: {
    productHeader,
    productBaseInfo,
    productAttribute,
    productSaleAttribute,
    productRemark,
    productCombineGroup,
    productMediaDescription,
    productProtected,
    productOther,
    productAftersale
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
    if (query) {
      // 通过跳转进入
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
      if (this.mp.productVO.typeOfProduct !== 4) {
        this.menuList.push({
          href: '#productOther',
          text: this.$t('商品配置')
        })
      } else if (
        this.mp.productVO.typeOfProduct === 4 &&
        this.isEdit &&
        this.mp.dataType === 3
      ) {
        this.menuList.push({
          href: '#productOther',
          text: this.$t('商品配置')
        })
      }
      if (this.mp.productVO.typeOfProduct !== 4) {
        this.menuList.push({
          href: '#productAttribute',
          text: this.$t('商品属性')
        })
        this.menuList.push({
          href: '#productSaleAttribute',
          text: this.$t('销售属性')
        })
        if (this.mp.productInfoVO.type === '32') {
          this.menuList.push({
            href: '#productRemark',
            text: this.$t('商品备注')
          })
        }
      }
      if (this.mp.productVO.typeOfProduct === 4) {
        this.menuList.push({
          href: '#productCombineGroup',
          text: this.$t('组合明细')
        })
      }
      this.menuList.push({
        href: '#productMediaDescription',
        text: this.$t('图文信息')
      })
      if (
        this.mp.productInfoVO.type === '1' ||
        this.mp.productInfoVO.type === '50' ||
        this.mp.productInfoVO.type === '33' ||
        this.mp.productInfoVO.type === '34' ||
        this.mp.productInfoVO.type === '35' ||
        this.mp.productInfoVO.type === '36'
      ) {
        this.menuList.push({
          href: '#productProtected',
          text: this.$t('商品保障')
        })
      }
      if (
        this.mp.productInfoVO.type === '1' ||
        this.mp.productInfoVO.type === '50' ||
        this.mp.productInfoVO.type === '33' ||
        this.mp.productInfoVO.type === '34' ||
        this.mp.productInfoVO.type === '35' ||
        this.mp.productInfoVO.type === '36'
      ) {
        this.menuList.push({
          href: '#productAftersale',
          text: this.$t('售后服务')
        })
      }
    },
    async loadMp() {
      if (this.mp.productVO.id) {
        // 获取商品信息
        const { data } = await this.$product.$api.mpApi.getProductDetail(
          JSON.stringify(this.mp.productVO.id)
        )
        data.dataType = data.productVO.dataType
        if (data.productInfoVO.expiryDateUnit) {
          data.productInfoVO.expiryDateUnit =
            data.productInfoVO.expiryDateUnit + ''
        }
        if (data.productInfoVO.type) {
          data.productInfoVO.type = data.productInfoVO.type + ''
        }
        this.initNullValue(data)
        if (data.productVO.id !== data.productVO.refId) {
          this.isView = true
        }
        this.mp = data
        if (this.mp.combineGroupVOS) {
          if (this.mp.productInfoVO.supplierId) {
            this.mp.combineGroupVOS.forEach(element => {
              if (element.products) {
                element.products.forEach(i => {
                  i.supplierId = this.mp.productInfoVO.supplierId
                  i.supplierCode = this.mp.productInfoVO.supplierCode
                  i.supplierName = this.mp.productInfoVO.supplierName
                  i.isInnerSupplier = this.mp.productInfoVO.isInnerSupplier
                })
              }
            })
          }
        }
      } else {
        // 通过创建进入
        const defaultFrom = getDefaultFrom()
        defaultFrom.productVO = Object.assign(
          defaultFrom.productVO,
          this.createMp.productVO
        )
        defaultFrom.productInfoVO = Object.assign(
          defaultFrom.productInfoVO,
          this.createMp.productInfoVO
        )
        if (
          defaultFrom.barcodePriceVOS ||
          defaultFrom.barcodePriceVOS.length === 0
        ) {
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

      let type = null
      if (this.mp.combineGroupVOS) {
        for (let i = 0; i < this.mp.combineGroupVOS.length; i++) {
          const group = this.mp.combineGroupVOS[i]
          if (group.products) {
            for (let j = 0; j < group.products.length; j++) {
              const product = group.products[j]
              if (type == null) {
                type = product.warehouseType
              } else if (type !== product.warehouseType) {
                this.$message({
                  type: 'error',
                  message: this.$t('组合品必须全部有仓或者全部无仓')
                })
                this.submiting = false
                return
              }
            }
          }
        }
      }

      if (this.mp.chargingGroupVOS) {
        var len = this.mp.chargingGroupVOS.length
        for (var k = 0; k < len; k++) {
          var group = this.mp.chargingGroupVOS[k]
          if ((!group.saveMpChargingList || group.saveMpChargingList.length === 0) && (!group.updateMpchargingList || group.updateMpchargingList.length === 0) && (!group.mpChargings || group.mpChargings.length === 0)) {
            this.$message({
              type: 'error',
              message: this.$t('加料组内加料商品必填')
            })
            this.submiting = false
            return
          }
          if (group.saveMpChargingList) {
            for (let j = 0; j < group.saveMpChargingList.length; j++) {
              const charging = group.saveMpChargingList[j]
              if (!charging.merchantProductId || charging.merchantProductId === '') {
                this.$message({
                  type: 'error',
                  message: this.$t('关联原料必填')
                })
                this.submiting = false
                return
              }
            }
          }
          if (group.mpChargings) {
            for (var j = 0; j < group.mpChargings.length; j++) {
              var charging = group.mpChargings[j]
              if (!charging.merchantProductId || charging.merchantProductId === '') {
                this.$message({
                  type: 'error',
                  message: this.$t('关联原料必填')
                })
                this.submiting = false
                return
              }
            }
          }
        }
      }

      // 提交表单
      try {
        this.$refs['form'].validate(async(valid, object) => {
          var refPreValidateFlag = true
          if (valid) {
            // 调用组件的validate方法
            // debugger
            for (const index in refs) {
              if (index !== 'form' && refs[index] && refs[index].validate) {
                const preValidate = refs[index].validate()
                if (!preValidate) {
                  refPreValidateFlag = preValidate
                }
              }
            }
          } else {
            console.log(object)
            this.scrollToView(this, object)
          }
          this.mp.mediaList = this.mp.mediaList.map((x, index) => {
            x.fileName = '图文详情' + index
            return x
          })
          if (valid && refPreValidateFlag) {
            this.$product.$api.mpApi
              .newSaveOrUpdateProductInfo(this.mp)
              .then(data => {
                this.$message({
                  type: 'success',
                  message: data.message
                    ? data.message
                    : this.$t('商品保存成功')
                })
                this.$emit('ok')
                if (this.mp.dataType === 1) {
                  this.$router.push({ path: '/back-product-static/platfrom/mp/PlatformMerchantProduct/list' })
                } else if (this.mp.dataType === 2) {
                  this.$router.push({ path: '/back-product-static/merchant/mp/MerchantProductManage/list' })
                }
                // this.$portal.delActiveView()
              })
              .finally(res => {
                this.submiting = false
              })
          } else {
            this.submiting = false
          }
        })
      } catch (ex) {
        console.log(ex)
      }
    },
    cancel() {
      if (this.isEdit || this.clone || this.isView) {
        this.$portal.delActiveView()
      } else {
        this.$emit('back')
      }
    },
    clearCloneDataInfo() {
      // 清理复制商品的信息
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
          element.canSale = null
          element.barcodes = []
        })
      }
      if (this.mp.attributeEditVOS) {
        this.mp.attributeEditVOS.forEach(element => {
          element.id = null
          if (element.level === 1) {
            element.attId = null
          }
        })
      }
      if (this.mp.saleAttributeEditVOS) {
        this.mp.saleAttributeEditVOS.forEach(element => {
          element.id = null
          if (element.level === 1) {
            element.attId = null
          }
        })
      }
      if (this.mp.afterSalePO) {
        this.mp.afterSalePO.id = null
      }
      if (this.mp.relationPOS) {
        this.mp.relationPOS.forEach(element => {
          element.id = null
        })
      }
      if (this.mp.mediaList) {
        this.mp.mediaList.forEach(element => {
          element.id = null
        })
      }
      if (this.mp.describePOS) {
        this.mp.describePOS.forEach(element => {
          element.id = null
        })
      }
      if (this.mp.combineGroupVOS) {
        this.mp.combineGroupVOS.forEach(element => {
          element.id = null
          if (element.products) {
            element.products.forEach(i => {
              i.id = null
            })
          }
        })
      }
      if (this.mp.chargingGroupVOS) {
        this.mp.chargingGroupVOS.forEach(element => {
          element.id = null
          if (element.mpChargings) {
            element.mpChargings.forEach(i => {
              i.id = null
            })
          }
        })
      }
      if (this.mp.taxRateVO) {
        this.mp.taxRateVO.id = null
      }
      if (this.mp.controlPO) {
        this.mp.controlPO.id = null
      }
    },
    initNullValue(data) {
      if (!data.taxRateVO) {
        data.taxRateVO = getDefaultTaxRateVO()
      }
      if (!data.controlPO) {
        data.controlPO = getControlPO()
      }
      if (!data.afterSalePO) {
        data.afterSalePO = getAfterSalePO()
      }
      if (data.productVO.typeOfProduct !== 4 && data.attributeEditVOS) {
        data.attributeEditVOS.map(item => {
          if (item.inputType === 2) {
            const selectItem = item.items.find(x => x.checked)
            this.$set(item, 'select', selectItem && selectItem.code)
          } else if (item.inputType === 1) {
            this.$set(
              item,
              'checkbox',
              item.items.filter(x => x.checked).map(x => x.code)
            )
          }
        })
        return data.attributeEditVOS
      }
    }
  }
}
function getDefaultFrom() {
  return Object.assign(
    {},
    {
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
        canTrace: 0, // 默认无追溯码
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
        conversionRate: null,
        mainUnitId: null,
        mainUnitCode: null,
        mainUnitName: null,
        isInvoice: 0, // 是否支持发票:1-支持;0-不支持;
        isForceInvoice: 0, // 是否强制开发票:1-支持;0-不支持
        isVatInvoice: 0, // 是否可开增值税发票:1-支持;0-不支持
        batchStrategyId: null,
        outboundStrategy: null,
        isSupportedBatchStrategy: 0
      },
      attributeEditVOS: [],
      afterSalePO: getAfterSalePO(),
      relationPOS: [], // 商品保障信息
      mediaList: [], // 商品图文信息
      describePOS: [], // 商品文描信息
      combineGroupVOS: [], // 组合商品信息
      chargingGroupVOS: [], // 餐饮商品备注信息
      taxRateVO: getDefaultTaxRateVO(),
      barcodePriceVOS: [], // 商品条码和价格信息
      controlPO: getControlPO(),
      enableAddAtt: null
    }
  )
}
function getDefaultBarcodePrice() {
  return Object.assign(
    {},
    {
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
      pictureUrl: '',
      canSale: null,
      priceEditable: 1 // 价格是否可编辑： 0不行 1可以
    }
  )
}
function getDefaultTaxRateVO() {
  return Object.assign(
    {},
    {
      saleTaxRateId: null,
      saleTaxRate: null
    }
  )
}
function getControlPO() {
  return Object.assign(
    {},
    {
      // 商品管控信息
      isInvoice: 0, // 是否支持发票:1-支持;0-不支持;
      isForceInvoice: 0, // 是否强制开发票:1-支持;0-不支持
      isVatInvoice: 0 // 是否可开增值税发票:1-支持;0-不支持
    }
  )
}
function getAfterSalePO() {
  return Object.assign(
    {},
    {
      id: null,
      merchantProductId: null,
      content: null,
      refId: null,
      contentLan2: null
    }
  )
}
</script>
<style lang="less" scoped>
.form .section {
  margin: 20px 0px;
}
/* 导航被覆盖，设置z-index */
/deep/ .cp-nav-title .tabs {
  z-index: 1000;
}
</style>
