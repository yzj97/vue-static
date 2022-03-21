<template>
  <div class="product-spec-list">
    <el-checkbox
      v-if="type ==='1' || type ==='50' || type ==='32'"
      v-model="inputTypeOfProduct"
      :true-label="3"
      :false-label="0"
      :disabled="!!mpId"
      name="inputTypeOfProduct"
      class="is-more-check"
      @change="testChange"
    >{{ $t('启用多规格') }}</el-checkbox>
    <div v-show="inputTypeOfProduct === 0">
      <el-form ref="ruleForm" :model="ruleForm" :disabled="isView">
        <div>
          <el-row>
            <el-col v-show="type==1" :span="12" class="tax-rate">
              <el-form-item
                :label="$t('销项税码') + ':'"

                label-width="120px"

              >
                <el-select
                  v-model="ruleForm.taxRate"
                  :placeholder="$t('请选择')"
                  name="ruleForm_taxRate"
                >
                  <el-option
                    v-for="tax in taxList"
                    :key="tax.saleTaxRateId"
                    :value="tax.saleTaxRateId"
                    :label="tax.saleTaxRate"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" class="tax-rate">
              <el-form-item
                v-if="type ==='1' || type ==='50' || type ==='31' || type ==='32'"
                :label="$t('商品税务编码') + ':'"
                label-width="120px"
                prop="taxCode"
                name="taxCode"
              >
                <el-input
                  v-model="ruleForm.taxCode"
                  name="ruleForm_taxCode"
                  maxlength="50"
                  clearable
                />
              </el-form-item>
            </el-col>
          </el-row>
          <ody-table
            :data="ruleForm.tableList"
            :columns="columns"
            :can-filter="false"
            name="ruleForm_tableList137"
            border
          >
            <template slot="salePriceLabel" slot-scope="scope">
              <ody-tip-star :content="$t('零售价')" />
            </template>
            <template slot="marketPriceLabel" slot-scope="scope">
              <ody-tip-star :content="$t('划线价')" />
            </template>
            <!-- <template slot="skuCode" slot-scope="scope">
            <el-input v-model="scope.row['skuCode']" name="scope_row['skuCode']" maxlength="20"/>
            </template>-->
            <template slot="barcodes" slot-scope="scope">
              <el-form-item :prop="'tableList.' + scope.$index + '.skuBarCode'" :name="'tableList.' + scope.$index + '.skuBarCode'">
                <product-spec-barcodes :item="scope.row" :is-view="isView" />
              </el-form-item>
            </template>
            <template slot="salePrice" slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.salePrice'"
                :name="'tableList.' + scope.$index + '.salePrice'"
                :rules="{ required: true, message: $t('零售价格必填'), trigger: 'blur'}"
              >
                <el-popover trigger="click" placement="top" width="160">
                  <p>{{ $t('友情提示') }}</p>
                  <div style="text-align: left; margin: 0">
                    {{ $t('该类目的价格范围在') }}
                    <br >
                    {{ mp.lowPrice }}-{{ mp.highPrice }}
                  </div>
                  <ody-input-number
                    v-show="mp.lowPrice >= 0 && mp.lowPrice !== null"
                    slot="reference"
                    v-model="scope.row.salePrice"
                    :min="0.01"
                    :decimal="2"
                    :max="9999999"
                    :empty-tip="false"
                    name="scope_row_salePrice"
                  />
                </el-popover>
                <ody-input-number
                  v-show="mp.lowPrice == null"
                  v-model="scope.row.salePrice"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  name="scope_row_salePrice6"
                />
              </el-form-item>
            </template>
            <template slot="faceValues" slot-scope="scope">
              <ody-tip-star :content="$t('面值')" />
            </template>
            <template slot="faceValue" slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.faceValue'"
                :name="'tableList.' + scope.$index + '.faceValue'"
                :rules="{ required: true, message: $t('面值必填'), trigger: 'change'}"
              >
                <ody-input-number
                  v-model="scope.row.faceValue"
                  :disabled="mpId!=''"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  name="scope_row_faceValue"
                />
              </el-form-item>
              <span
                v-show=" parseInt(scope.row.salePrice) > parseInt(scope.row.faceValue)"
              >{{ $t('注意，零售价大于面值') }}</span>
            </template>
            <template slot="marketPrice" slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.marketPrice'"
                :name="'tableList.' + scope.$index + '.marketPrice'"
                :rules="{ required: true, message: $t('划线价格必填'), trigger: 'blur'}"
              >
                <ody-input-number
                  v-model="scope.row.marketPrice"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  name="scope_row_marketPrice"
                />
              </el-form-item>
            </template>
            <template slot="purchasePrice" slot-scope="scope">
              <el-form-item :prop="'tableList.' + scope.$index + '.purchasePrice'" :name="'tableList.' + scope.$index + '.purchasePrice'">
                <ody-input-number
                  v-model="scope.row.purchasePrice"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  name="scope_row_purchasePrice"
                />
              </el-form-item>
            </template>
            <template slot="weight" slot-scope="scope">
              <div class="weight-flex">
                <el-form-item
                  :prop="'tableList.' + scope.$index + '.weight'"
                  :name="'tableList.' + scope.$index + '.weight'"
                  :rules="[{validator: weightPass, trigger: 'blur'}]"
                >
                  <ody-number-range
                    v-model="scope.row.weight"
                    :decimal="1"
                    name="scope_row_weight"
                    range="[0, 99999999.9]"
                    link-string="-"
                  />
                </el-form-item>
              </div>
            </template>
            <template slot="bindProducLabel" slot-scope="scope">
              <ody-tip-star :content="$t('绑定兑换商品')" />
            </template>
            <template slot="bindProduct" slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.bindProductId'"
                :name="'tableList.' + scope.$index + '.bindProductId'"
                :rules="{ required: true, message: $t('请选择绑定商品'), trigger: 'change'}"
              >
                <el-input
                  v-show="false"
                  v-model="scope.row.bindProductId"
                  name="scope_row_bindProductId"
                />
                <el-button
                  v-if="mpId==''"
                  name="bindProductInfo"
                  type="text"
                  @click="bindProductInfo()"
                >{{ $t('绑定兑换商品') }}</el-button>
                <el-button v-if="mpId!=''" type="text">{{ $t('绑定兑换商品') }}</el-button>
              </el-form-item>
            </template>
            <template slot="bindProductCode" slot-scope="scope">
              <div>
                <span>{{ scope.row.bindProductCode }}</span>
              </div>
            </template>
            <template slot="bindProductName" slot-scope="scope">
              <div>
                <span>{{ scope.row.bindProductName }}</span>
              </div>
            </template>
          </ody-table>
        </div>
      </el-form>
    </div>
    <product-spec-choose
      v-show="inputTypeOfProduct === 3"
      ref="specChoose"
      :sale-attribute-edit-vos="saleAttributeEditVos"
      :barcode-price-vos="barcodePriceVos"
      :mp-id="mpId"
      :type-of-product="typeOfProduct"
      :tax-list="taxList"
      :mp="mp"
      :is-view.sync="isView"
    />
    <bind-product-modal
      :visible.sync="bindProductVisible"
      :merchant-id="merchantId"
      :data-type="dataType"
      @ok="closeBindProductModal"
    />
  </div>
</template>
<script>
import productSpecChoose from '@/components/product-spec-choose'
import bindProductModal from '@/components/bind-product-modal'
import productSpecBarcodes from '../product-spec-barcodes'
import proHeader from '../product-header'
import { isEqual } from 'lodash'
export default {
  components: {
    productSpecChoose,
    productSpecBarcodes,
    bindProductModal,
    proHeader
  },
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    },
    mpId: {
      type: String,
      default: ''
    },
    typeOfProduct: {
      type: Number,
      default: -1
    },
    saleAttributeEditVos: {
      type: Array,
      default: () => []
    },
    barcodePriceVos: {
      type: Array,
      default: () => [{}]
    },
    taxList: {
      type: Array,
      default: () => []
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    const self = this
    return {
      bindProductVisible: false,
      ruleForm: {
        tableList: [this.defaultItemInfo()],
        taxRate: '',
        taxCode: ''
      },
      inputTypeOfProduct: this.typeOfProduct,
      type: self.mp.productInfoVO.type,
      merchantId: self.mp.productVO.merchantId,
      dataType: self.mp.dataType,
      columns: [
        // {
        //   label: 'SKU编码',
        //   slot: 'skuCode',
        //   align: 'center',
        //   show: true,
        //   minWidth: 120
        // },
        {
          label: self.$t('SKU条形码'),
          slot: 'barcodes',
          align: 'center',
          show() {
            return self.type !== '33' && self.type !== '35'
          },
          minWidth: 120
        },
        {
          labelSlot: 'salePriceLabel',
          slot: 'salePrice',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          labelSlot: 'faceValues',
          slot: 'faceValue',
          align: 'center',
          show() {
            return self.type === '33' || self.type === '34'
          },
          minWidth: 120
        },
        {
          labelSlot: 'marketPriceLabel',
          slot: 'marketPrice',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          label: self.$t('采购价'),
          slot: 'purchasePrice',
          align: 'center',
          show: true,
          minWidth: 120
        },
        {
          show() {
            return self.type === '1' || self.type === '50' || self.type === '31' || self.type === '32'
          },
          label: self.$t('净重(g)'),
          slot: 'weight',
          align: 'center',
          minWidth: 120
        },
        {
          show() {
            return self.type === '35' || self.type === '36'
          },
          labelSlot: 'bindProducLabel',
          slot: 'bindProduct',
          align: 'center',
          minWidth: 120
        },
        {
          show() {
            return self.type === '35' || self.type === '36'
          },
          label: self.$t('兑换商品编码'),
          slot: 'bindProductCode',
          align: 'center',
          minWidth: 120
        },
        {
          show() {
            return self.type === '35' || self.type === '36'
          },
          label: self.$t('兑换商品名称'),
          slot: 'bindProductName',
          align: 'center',
          minWidth: 120
        }
      ]
    }
  },
  watch: {
    typeOfProduct: {
      handler(newValue) {
        this.inputTypeOfProduct = newValue
        if (newValue === 0) {
          this.init()
        }
      },
      immediate: true
    }
  },
  methods: {
    weightPass(rule, value, callback) {
      if (value[1] && !value[0]) {
        callback(new Error(this.$t('请填写净重区间')))
      } else {
        callback()
      }
    },
    testChange() {
      if (this.saleAttributeEditVos.length === 0) {
        this.inputTypeOfProduct = 0
        this.$message(this.$t('该类目未维护销售属性，不可创建多规格商品'))
      }
    },
    init() {
      this.initTableList()
      this.initTax()
    },
    initTableList() {
      // this.ruleForm.tableList[0].skuCode = this.barcodePriceVos[0].skuCode
      this.ruleForm.tableList[0].barcodes = this.barcodePriceVos[0].barcodes
      this.ruleForm.tableList[0].salePrice = this.barcodePriceVos[0].salePrice
      this.ruleForm.tableList[0].purchasePrice = this.barcodePriceVos[0].purchasePrice
      this.ruleForm.tableList[0].marketPrice = this.barcodePriceVos[0].marketPrice
      this.ruleForm.tableList[0].weightFloor = this.barcodePriceVos[0].weightFloor
      this.ruleForm.tableList[0].weightCeiling = this.barcodePriceVos[0].weightCeiling
      this.ruleForm.tableList[0].faceValue = this.barcodePriceVos[0].faceValue
      this.ruleForm.tableList[0].bindProductCode = this.barcodePriceVos[0].bindProductCode
      this.ruleForm.tableList[0].bindProductName = this.barcodePriceVos[0].bindProductName
      this.ruleForm.tableList[0].bindProductId = this.barcodePriceVos[0].relationProductId
      this.ruleForm.tableList[0].weight = [
        this.ruleForm.tableList[0].weightFloor,
        this.ruleForm.tableList[0].weightCeiling
      ]
    },
    initTax() {
      if (
        this.mp.taxRateVO.saleTaxRateId === 0 ||
        this.mp.taxRateVO.saleTaxRateId
      ) {
        this.ruleForm.taxRate = this.mp.taxRateVO.saleTaxRateId + ''
      }
      if (this.mp.productInfoVO.taxCode) {
        this.ruleForm.taxCode = this.mp.productInfoVO.taxCode
      }
    },
    defaultItemInfo() {
      return {
        // skuCode: '',
        barcodes: [],
        barcodesPhoto: [],
        skuBarCode: '',
        salePrice: '',
        marketPrice: '', // 市场价格
        purchasePrice: '', // 采购价格
        weightFloor: '', // 净重最小值
        weightCeiling: '', // 净重最大值
        weight: [],
        faceValue: '',
        bindProductId: '',
        bindProductName: '',
        bindProductCode: ''
      }
    },
    dealData() {
      const list = this.$portal.deepClone(this.ruleForm.tableList)
      list.map(item => {
        delete item['barcodesPhoto']
        delete item['skuBarCode']
      })
      return list
    },
    dealTax() {
      const taxRateVO = {}
      this.taxList.map(item => {
        if (item.saleTaxRateId === this.ruleForm.taxRate) {
          taxRateVO.saleTaxRateId = item.saleTaxRateId
          taxRateVO.saleTaxRate = item.saleTaxRate
        }
      })
      return taxRateVO
    },
    dealGiftInfo(barcodePriceVOS) {
      const giftInfo = {}
      barcodePriceVOS.map(item => {
        giftInfo.faceValue = item.faceValue
        giftInfo.relationProductId = item.bindProductId
      })
      return giftInfo
    },
    dealBarcodePriceVOS(barcodePriceVOS) {
      if (this.mpId) {
        this.mp.barcodePriceVOS.map(item => {
          if (item.saleAttrs && item.saleAttrs.length > 0) {
            var saleAttrs = this.$portal.deepClone(item.saleAttrs)
            saleAttrs.map(key => 'mpId' in key && delete key['mpId'])
            const index = barcodePriceVOS.findIndex(key =>
              isEqual(key.saleAttrs, saleAttrs)
            )
            if (index > -1) {
              if (item.priceId) {
                barcodePriceVOS[index].priceId = item.priceId
              }
              if (item.mpId) {
                barcodePriceVOS[index].mpId = item.mpId
              }
              if (item.pictureId) {
                barcodePriceVOS[index].pictureId = item.pictureId
              }
            }
          } else {
            barcodePriceVOS[0].priceId = this.mp.barcodePriceVOS[0].priceId
            barcodePriceVOS[0].mpId = this.mp.barcodePriceVOS[0].mpId
          }
        })
      }
    },
    toParentData() {
      const typeOfProduct = this.inputTypeOfProduct
      if (typeOfProduct === 3) {
        const saleAttributeEditVOS = this.$refs.specChoose.toParentSpecList()
        const barcodePriceVOS = this.$refs.specChoose.toParentTableList()
        const taxRateVO = this.$refs.specChoose.toParentTax()
        const taxCode = this.$refs.specChoose.toParentTaxCode()
        this.dealBarcodePriceVOS(barcodePriceVOS)
        return {
          typeOfProduct,
          saleAttributeEditVOS,
          barcodePriceVOS,
          taxRateVO,
          taxCode
        }
      } else if (typeOfProduct === 0) {
        this.preSubmit()
        const barcodePriceVOS = this.dealData()
        const taxRateVO = this.dealTax()
        const taxCode = this.ruleForm.taxCode
        this.dealBarcodePriceVOS(barcodePriceVOS)
        if (
          this.type === '33' ||
          this.type === '34' ||
          this.type === '35' ||
          this.type === '36'
        ) {
          const giftInfo = this.dealGiftInfo(barcodePriceVOS)
          return {
            typeOfProduct,
            barcodePriceVOS,
            taxRateVO,
            giftInfo,
            taxCode
          }
        } else {
          return { typeOfProduct, barcodePriceVOS, taxRateVO, taxCode }
        }
      }
    },
    preSubmit() {
      this.ruleForm.tableList.forEach(item => {
        if (item.weight[0]) {
          item.weightFloor = item.weight[0]
        }
        if (item.weight[1]) {
          item.weightCeiling = item.weight[1]
        }
      })
    },
    validate() {
      const vue = this
      let validated = false
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          validated = this.ruleForm.tableList.every(item => {
            const weightValid =
              (!item.weightFloor && !item.weightCeiling) ||
              item.weightFloor ||
              (item.weightFloor && item.weightCeiling)
            if (!weightValid) {
              vue.$message.error('请填写净重区间')
            }
            return weightValid
          })
        }
      })
      return validated
    },
    closeBindProductModal(selectVal) {
      // 返回模态框返回的对象
      this.ruleForm.tableList[0].bindProductCode = selectVal.code
      this.ruleForm.tableList[0].bindProductName = selectVal.chineseName
      this.ruleForm.tableList[0].bindProductId = selectVal.refId
    },
    bindProductInfo() {
      this.bindProductVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.tax-rate {
  width: 260px;
}
.product-spec-list {
  background: #ffffff;
  padding: 10px;
  .is-more-check {
    margin-bottom: 12px;
  }
}
.skucode-input {
  display: flex;
  align-items: center;
  .skucode-add {
    margin: 0 0 0 6px;
    font-size: 18px;
    color: var(--themeColor90);
    cursor: pointer;
  }
}
.skucode-list {
  .skucode-item {
    margin-top: 4px;
    display: flex;
    align-items: center;
    .delete-skucode {
      margin-left: 4px;
      cursor: pointer;
    }
  }
  .add-skucode-btn {
    cursor: pointer;
    border: 1px solid rgba(238, 245, 249, 1);
    height: 34px;
    line-height: 34px;
    margin-top: 8px;
    text-align: center;
    font-weight: 700;
    font-size: 18px;
    &:hover {
      border: 1px solid var(--themeColor);
      color: var(--themeColor);
    }
  }
  .skucode-bottom-btn {
    margin-top: 8px;
    text-align: center;
  }
}
.weight-flex {
  display: flex;
  .weight-link {
    margin: 4px 5px;
  }
}
</style>
