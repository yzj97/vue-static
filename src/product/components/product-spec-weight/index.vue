<template>
  <div class="product-spec-list">
    <div>
      <el-form ref="ruleForm" :model="ruleForm" :disabled="isView">
        <el-row>
          <el-col :span="12" class="tax-rate">
            <el-form-item
              :label="$t('销项税码') + ':'"
              label-width="80px"
              prop="taxRate"
              name="taxRate"
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
            <el-form-item :label="$t('商品税务编码') + ':'" label-width="120px">
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
          name="ruleForm_tableList309"
          border
        >
          <template slot="salePriceLabel" slot-scope="scope">
            <ody-tip-star :content="$t('零售价')" />
          </template>
          <template slot="barcodes" slot-scope="scope">
            <product-spec-barcodes :item="scope.row" />
          </template>
          <template slot="salePrice" slot-scope="scope">
            <div>
              <el-row :gutter="1">
                <el-col :span="12">
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
                        v-model="scope.row['salePrice']"
                        :decimal="2"
                        :max="9999999"
                        :empty-tip="false"
                        name="scope_row['salePrice']"
                      />
                    </el-popover>
                    <ody-input-number
                      v-show="mp.lowPrice == null"
                      v-model="scope.row['salePrice']"
                      :decimal="2"
                      :max="9999999"
                      :empty-tip="false"
                      name="scope_row['salePrice']0"
                    />
                    <!-- <ody-input-number v-model="scope.row['salePrice']" :decimal="2" :max="9999999" :empty-tip="false" name="scope_row['salePrice']7"/> -->
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-select
                    v-model="scope.row['salePriceUnitType']"
                    :clearable="false"
                    :placeholder="$t('请选择')"
                    name="scope_row['salePriceUnitType']"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </div>
          </template>
          <template slot="purchasePrice" slot-scope="scope">
            <div>
              <el-row :gutter="1">
                <el-col :span="12">
                  <ody-input-number
                    v-model="scope.row['purchasePrice']"
                    :decimal="2"
                    :max="9999999"
                    :empty-tip="false"
                    name="scope_row['purchasePrice']"
                  />
                </el-col>
                <el-col :span="6">
                  <el-select
                    v-model="scope.row['purchasePriceUnitType']"
                    :clearable="false"
                    :placeholder="$t('请选择')"
                    name="scope_row['purchasePriceUnitType']"
                  >
                    <el-option
                      v-for="item in options"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    />
                  </el-select>
                </el-col>
              </el-row>
            </div>
          </template>
        </ody-table>
      </el-form>
    </div>
  </div>
</template>
<script>
import productSpecBarcodes from '../product-spec-barcodes'
export default {
  components: {
    productSpecBarcodes
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
    return {
      options: [
        {
          value: 1,
          label: '500g'
        },
        {
          value: 2,
          label: '1000g'
        }
      ],
      ruleForm: {
        tableList: [this.defaultItemInfo()],
        taxRate: '',
        taxCode: ''
      },
      columns: [
        {
          label: this.$t('SKU条形码'),
          slot: 'barcodes',
          align: 'center',
          show: true,
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
          label: this.$t('采购价'),
          slot: 'purchasePrice',
          align: 'center',
          show: true,
          minWidth: 120
        }
      ]
    }
  },
  mounted() {
    this.init()
    // console.log(this.barcodePriceVos, 'spec-weight')
  },
  methods: {
    init() {
      this.initTableList()
      this.initTax()
    },
    initTableList() {
      console.log(this.barcodePriceVos)
      this.ruleForm.tableList[0].barcodes = this.barcodePriceVos[0].barcodes
      this.ruleForm.tableList[0].salePrice = this.barcodePriceVos[0].salePrice
      this.ruleForm.tableList[0].purchasePrice = this.barcodePriceVos[0].purchasePrice
      this.ruleForm.tableList[0].salePriceUnitType =
        this.barcodePriceVos[0].salePriceUnitType || 1
      this.ruleForm.tableList[0].purchasePriceUnitType =
        this.barcodePriceVos[0].purchasePriceUnitType || 1
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
        barcodes: [],
        barcodesPhoto: [],
        skuBarCode: '',
        salePrice: '',
        purchasePrice: '', // 采购价格
        salePriceUnitType: 1, //
        purchasePriceUnitType: 1
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
    dealBarcodePriceVOS(barcodePriceVOS) {
      if (this.mpId) {
        barcodePriceVOS[0].priceId = this.mp.barcodePriceVOS[0].priceId
        barcodePriceVOS[0].mpId = this.mp.barcodePriceVOS[0].mpId
      }
    },
    toParentData() {
      const barcodePriceVOS = this.dealData()
      const taxRateVO = this.dealTax()
      const taxCode = this.ruleForm.taxCode
      this.dealBarcodePriceVOS(barcodePriceVOS)
      console.log(barcodePriceVOS, 'barcodePriceVOS')
      return { barcodePriceVOS, taxRateVO, taxCode }
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
