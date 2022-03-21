<template>
  <section class="section">
    <el-card>
      <div slot="header" class="clearfix">
        <strong>{{ $t('价格设置') }}</strong>
      </div>

      <el-form ref="rowForm" :rules="rules" :model="mp" class="form" label-width="0px">
        <ody-table
          ref="table"
          :can-filter="false"
          :data="mp.barcodePriceVOS"
          :columns="columns"
          name="mp_barcodePriceVOS763"
          height="150px"
        >
          <template slot="skuBarcode" slot-scope="scope">
            <el-form-item>
              <div class="skucode-input">
                <el-input v-model="scope.row.barcode" :disabled="true" name="scope_row_barcode" readonly="true" />
                <el-popover
                  ref="popover"
                  v-model="showBarcodeModal"
                  name="showBarcodeModal"
                  placement="bottom"
                  width="250"
                  trigger="click"
                >
                  <div>
                    <div shadow="never" class="skucode-list">
                      <div v-for="(item, index) in barcodeList" :key="index" class="skucode-item">
                        <el-input v-model="item.barcode" name="item_barcode" maxlength="20" />
                        <i
                          v-if="!isView"
                          name="removeBardCode"
                          class="el-icon-delete delete-skucode"
                          @click="removeBardCode(index)"
                        />
                      </div>
                      <div
                        v-if="!isView && barcodeList.length < 10"
                        name="addBardCode"
                        class="add-skucode-btn"
                        @click="addBardCode(scope.row)"
                      >
                        <i class="el-icon-plus" />
                      </div>
                    </div>
                    <div v-if="!isView" class="skucode-bottom-btn">
                      <el-button name="cancel" size="mini" @click="cancel">{{ $t('取消') }}</el-button>
                      <el-button
                        name="saveBarCode"
                        type="primary"
                        size="mini"
                        @click="saveBarCode(scope.row)"
                      >{{ $t('保存') }}</el-button>
                    </div>
                  </div>
                  <span slot="reference" name="handleIconClick" class="skucode-add" @click="handleIconClick(scope.row)">+</span>
                </el-popover>
              </div>
            </el-form-item>
          </template>
          <template slot="price" slot-scope="scope">
            <el-form-item :prop="'barcodePriceVOS.' + scope.$index + '.purchasePrice'">
              <ody-input-number
                v-model="scope.row.purchasePrice"
                :min="0.01"
                :max="9999999"
                :decimal="2"
                :empty-tip="false"
                name="scope_row_purchasePrice"
              />
            </el-form-item>
          </template>
          <template slot="weight" slot-scope="scope">
            <el-form-item
              :prop="'barcodePriceVOS.' + scope.$index + '.weight'"
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
          </template>
        </ody-table>
      </el-form>
    </el-card>
  </section>
</template>

<script>
export default {
  components: {},
  props: {
    mp: {
      type: Object,
      required: true,
      default: null
    },
    isView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      barcodeList: [],
      showBarcodeModal: false,
      columns: [
        {
          show: true,
          label: this.$t('SKU条形码'),
          slot: 'skuBarcode',
          minWidth: 250
        },
        {
          show: true,
          label: this.$t('采购价(￥)'),
          slot: 'price',
          minWidth: 150
        },
        {
          show: true,
          label: this.$t('净重（g）'),
          slot: 'weight',
          minWidth: 300
        }
      ]
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    weightPass(rule, value, callback) {
      if (value[1] && !value[0]) {
        callback(new Error(this.$t('请填写净重区间')))
      } else {
        callback()
      }
    },
    init() {
      if (this.mp && this.mp.barcodePriceVOS) {
        this.mp.barcodePriceVOS.forEach(element => {
          const barcodeList = element.barcodes
          element.weight = [element.weightFloor, element.weightCeiling]
          if (barcodeList && barcodeList.length > 0) {
            let barcode = barcodeList[0].barcode
            const mainCodeList = barcodeList.filter(i => i.type === 0)
            if (mainCodeList.length > 0) {
              barcode = mainCodeList[0].barcode
            }
            this.$set(element, 'barcode', barcode)
          }
        })
      }
    },
    handleIconClick(row) {
      const barcodes = []
      if (row.barcodes && row.barcodes.length > 0) {
        row.barcodes
          .sort((a, b) => a.type - b.type)
          .forEach(element => {
            barcodes.push(Object.assign({}, element))
          })
      }
      this.barcodeList = barcodes
      this.showBarcodeModal = true
    },
    removeBardCode(index) {
      this.barcodeList.splice(index, 1)
    },
    addBardCode() {
      this.barcodeList.push({
        barcode: null,
        type: this.barcodeList.length === 0 ? 0 : 1 // 0： 主条码，1：辅条码
      })
    },
    saveBarCode(row) {
      const codes = []
      row.barcode = null
      if (this.barcodeList && this.barcodeList.length > 0) {
        for (let i = 0; i < this.barcodeList.length; i++) {
          const item = this.barcodeList[i]
          if (!item.barcode) {
            this.$message({
              type: 'warning',
              message: this.$t('条码不能为空')
            })
            return
          }
          if (codes.indexOf(item.barcode) >= 0) {
            this.$message({
              type: 'warning',
              message: this.$t('条码不能重复') + ': ' + item.barcode
            })
            return
          }
          if (i === 0) {
            item.type = 0
            row.barcode = item.barcode
          } else {
            item.type = 1
          }
          codes.push(item.barcode)
        }
      }
      row.barcodes = this.barcodeList
      this.showBarcodeModal = false
    },
    cancel() {
      this.showBarcodeModal = false
    },
    preSubmit() {
      this.mp.barcodePriceVOS.forEach(item => {
        item.weightFloor = item.weight[0]
        item.weightCeiling = item.weight[1]
      })
    },
    validate() {
      const vue = this
      let validated = false
      this.$refs['rowForm'].validate(valid => {
        if (valid) {
          validated = this.mp.barcodePriceVOS.every(item => {
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
    }
  }
}
</script>
<style lang="scss" scoped>
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
}
.skucode-bottom-btn {
  margin-top: 8px;
  text-align: center;
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
</style>
