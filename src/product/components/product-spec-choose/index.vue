<template>
  <div class="choose-spec">
    <el-form ref="dynamicValidateForm" :model="dynamicValidateForm" :disabled="isView">
      <div class="spec">
        <div v-for="(item, index) in dynamicValidateForm.specList" :key="index" class="spec-item">
          <!-- <el-form-item v-if="item.inputType === 1" :label="item.attName" :prop=" item.required ? 'specList.'+ index + '.groupType' : ''" :rules="item.required ? { required: true, message: '必选不能为空', trigger: 'change'} : {}" label-width="80px"> -->
          <!-- 外层显示星星 必填 -->
          <el-form-item
            v-if="item.inputType === 1"
            :label="item.attName"
            :rules="item.required ? { required: true, message: $t('必选不能为空'), trigger: 'change'} : {}"
            label-width="80px"
          >
            <div class="spec-checkbox">
              <div
                v-if="!item.attId"
                name="removeSpecItem"
                class="del-item"
                @click="removeSpecItem(index)"
              >
                <i class="el-icon-close" />
              </div>
              <el-row :gutter="20">
                <!-- 内层显示提示 必填  为了不让el-input框看着红-->
                <el-form-item
                  :prop=" item.required ? 'specList.'+ index + '.groupType' : ''"
                  :rules="item.required ? { required: true, message: $t('必选不能为空'), trigger: 'change'} : {}"
                >
                  <el-checkbox-group
                    v-model="item.groupType"
                    name="item_groupType"
                    @change="changeCheckbox(item, item.groupType)"
                  >
                    <el-col
                      v-for="(itemSpec, indexSpec) in item.items"
                      :span="itemSpec.isAdded === 1 ? 6 : 4"
                      :key="indexSpec"
                    >
                      <el-checkbox
                        :label="itemSpec.code"
                        :disabled="itemSpec.readonly"
                        :title="itemSpec.value"
                        class="ellipsis"
                      >{{ itemSpec.value }}</el-checkbox>
                      <el-popover
                        placement="bottom"
                        trigger="click"
                        width="240"
                        @hide="changeValue=''"
                      >
                        <el-row :gutter="10">
                          <el-col :span="14">
                            <el-input v-model="changeValue" name="changeValue" maxlength="20" />
                          </el-col>
                          <el-col :span="2">
                            <el-button
                              name="confimChangeValue"
                              type="primary"
                              size="small"
                              @click="confimChangeValue(item, itemSpec)"
                            >{{ $t('确定') }}</el-button>
                          </el-col>
                        </el-row>
                        <i
                          v-show="(itemSpec.isAdded === 1 && !mpId) || itemSpec.readonly === undefined"
                          slot="reference"
                          class="el-icon-edit el-icon"
                        />
                      </el-popover>

                      <i
                        v-show="(itemSpec.isAdded === 1 && !mpId) || itemSpec.readonly === undefined"
                        name="delCustomValue"
                        class="el-icon-delete el-icon"
                        @click="delCustomValue(item.items, indexSpec)"
                      />
                    </el-col>
                  </el-checkbox-group>
                </el-form-item>
              </el-row>
              <div v-if="item.enableAdd === 1" class="add-attr">
                <div class="add-attr-input">
                  <el-input
                    v-model="item.customValue"
                    :validate-event="false"
                    :placeholder="$t('请输入') + item.attName"
                    name="item_customValue"
                    maxlength="20"
                  />
                </div>
                <el-button
                  name="addCustomAttValue"
                  size="small"
                  @click="addCustomAttValue(item)"
                >+{{ $t('添加') }}</el-button>
              </div>
            </div>
          </el-form-item>
          <el-form-item
            v-if="item.inputType === 2"
            :prop="'selectValue.' + item.attName"
            :label="item.attName"
            :rules="item.required ? { required: true, message: $t('必选不能为空'), trigger: 'change'} : {}"
            label-width="80px"
          >
            <div class="spec-checkbox">
              <div
                v-if="!item.attId"
                name="removeSpecItem5"
                class="del-item"
                @click="removeSpecItem(index)"
              >
                <i class="el-icon-close" />
              </div>
              <el-select
                :disabled="!!dynamicValidateForm.selectValue[item.attName] && !!mpId"
                v-model="dynamicValidateForm.selectValue[item.attName]"
                :placeholder="$t('请选择')"
                name="dynamicValidateForm_selectValue[item_attName]"
                @change="changeSelect2(index)"
              >
                <el-option
                  v-for="key in item.items"
                  :key="key.code"
                  :label="key.value"
                  :value="key.code"
                />
              </el-select>
            </div>
          </el-form-item>
        </div>
      </div>
      <div v-if="!isView" class="btn-custom">
        <span
          v-if="!mpId && mp.enableAddAtt === 1"
          name="openAttributeModal"
          class="add-custom-btn"
          @click="openAttributeModal"
        >+{{ $t('添加自定义属性') }}</span>
        <selfDefineAttributeComponent
          v-if="modalVisible"
          :visible.sync="modalVisible"
          @ok="closeAttributeModal"
        />
      </div>
      <div class="table">
        <el-row>
          <el-col v-show="type==1" :span="8" class="tax-rate">
            <el-form-item

              :label="$t('销项税码') + ':'"
              label-width="120px"

            >
              <el-select
                v-model="dynamicValidateForm.taxRate"
                :placeholder="$t('请选择')"
                name="dynamicValidateForm_taxRate"
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
            <el-form-item :label="$t('商品税务编码') + ':'" label-width="120px" prop="taxCode">
              <el-input
                v-model="dynamicValidateForm.taxCode"
                name="dynamicValidateForm_taxCode"
                maxlength="50"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <div class="btn">
              <el-button
                name="batchFilling"
                class="btn-left"
                type="primary"
                size="small"
                @click="batchFilling"
              >{{ $t('批量填充') }}</el-button>
            </div>
          </el-col>
        </el-row>
        <el-table
          :data="dynamicValidateForm.tableList"
          :key="tabelKey"
          :span-method="objectSpanMethod"
          name="dynamicValidateForm_tableList999"
          border
        >
          <el-table-column
            v-for="(item, index) in checkedSpecFatherNameAarry"
            :key="index"
            min-width="180"
            align="center"
          >
            <template slot="header" slot-scope="{}">
              <el-autocomplete
                v-model="autoState[item]"
                :fetch-suggestions="querySearch"
                :placeholder="item"
                name="autoState[item]"
                class="inline-input"
                @click.native="curChooseName(item)"
                @select="handleSelect"
              />
            </template>
            <template slot-scope="scope">
              <div>{{ scope.row[item] }}</div>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="180">
            <template slot="header" slot-scope="{}">
              <el-input
                :disabled="mpId!=''"
                v-model="itemInfo.skuCode"
                :placeholder="$t('sku编码')"
                name="itemInfo_skuCode"
                maxlength="20"
              />
            </template>
            <template slot-scope="scope">
              <el-input
                :disabled="mpId!=''"
                v-model="scope.row['skuCode']"
                name="scope_row['skuCode']"
                maxlength="20"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="210">
            <template slot="header" slot-scope="{}">
              <product-spec-barcodes :item="itemInfo" :is-view="isView" :show-placeholder="true" />
            </template>
            <template slot-scope="scope">
              <product-spec-barcodes :item="scope.row" :is-view="isView" />
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="160">
            <template slot="header" slot-scope="{}">
              <div class="sale-price">
                <ody-input-number
                  v-model="itemInfo.salePrice"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  :placeholder="$t('零售价')"
                  name="itemInfo_salePrice"
                  class="require"
                />
              </div>
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.salePrice'"
                :rules="{ required: true, message: $t('零售价格必填'), trigger: 'blur'}"
              >
                <el-popover trigger="click" placement="top" width="160">
                  <p>{{ $t('友情提示') }}</p>
                  <div style="text-align: left; margin: 0">
                    该类目的价格范围在
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
                  name="scope_row['salePrice']1"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="150">
            <template slot="header" slot-scope="{}">
              <ody-input-number
                v-model="itemInfo.marketPrice"
                :decimal="2"
                :max="9999999"
                :empty-tip="false"
                :placeholder="$t('划线价')"
                name="itemInfo_marketPrice"
                class="require"
              />
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'tableList.' + scope.$index + '.marketPrice'"
                :rules="{ required: true, message: $t('划线价格必填'), trigger: 'blur'}"
              >
                <ody-input-number
                  v-model="scope.row['marketPrice']"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  name="scope_row['marketPrice']1"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="150">
            <template slot="header" slot-scope="{}">
              <ody-input-number
                v-model="itemInfo.purchasePrice"
                :decimal="2"
                :max="9999999"
                :empty-tip="false"
                :placeholder="$t('采购价')"
                name="itemInfo_purchasePrice"
              />
            </template>
            <template slot-scope="scope">
              <ody-input-number
                v-model="scope.row['purchasePrice']"
                :decimal="2"
                :max="9999999"
                :empty-tip="false"
                name="scope_row['purchasePrice']"
              />
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="200">
            <template slot="header" slot-scope="{}">
              <el-popover placement="bottom" trigger="hover">
                <div class="weight-flex">
                  <ody-input-number
                    v-model="itemInfo.weightFloor"
                    :decimal="1"
                    :max="99999999"
                    :empty-tip="false"
                    name="itemInfo_weightFloor"
                  />
                  <span class="weight-link">-</span>
                  <ody-input-number
                    v-model="itemInfo.weightCeiling"
                    :decimal="1"
                    :max="99999999"
                    :empty-tip="false"
                    name="itemInfo_weightCeiling"
                  />
                </div>
                <el-input slot="reference" :disabled="true" :placeholder="$t('净重') + '（g）'" />
              </el-popover>
            </template>
            <template slot-scope="scope">
              <div class="weight-flex">
                <ody-input-number
                  v-model="scope.row['weightFloor']"
                  :decimal="1"
                  :max="99999999"
                  :empty-tip="false"
                  name="scope_row['weightFloor']"
                />
                <span class="weight-link">-</span>
                <ody-input-number
                  v-model="scope.row['weightCeiling']"
                  :decimal="1"
                  :max="99999999"
                  :empty-tip="false"
                  name="scope_row['weightCeiling']"
                />
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="130">
            <template slot="header" slot-scope="{}">
              <el-select
                v-model="itemInfo.saleCalcUnitId"
                :placeholder="$t('请选择')"
                :remote-method="loadUnit"
                disabled="true"
                name="itemInfo_saleCalcUnitId"
                filterable
                remote
                @change="changeUnit(scope.row)"
              >
                <el-option
                  v-for="item in mainUnitNameList"
                  :key="item.id"
                  :label="item.calculationUnitName"
                  :value="item.id"
                />
              </el-select>
            </template>
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.saleCalcUnitId"
                :placeholder="$t('请选择')"
                :disabled="mpId!=''"
                name="scope_row['saleCalcUnitId']"
                @change="changeUnit(scope.row)"
              >
                <el-option
                  v-for="item in mainUnitNameList"
                  :key="item.id"
                  :label="item.calculationUnitName"
                  :value="item.id"
                />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="130">
            <template slot="header" slot-scope="{}">
              <el-popover placement="bottom" trigger="hover">
                <ody-upload-image
                  v-model="itemInfo.pictureUrl"
                  :pic-type="['png','jpg', 'jpeg']"
                  :pic-size="4096"
                  :show-tip="false"
                  name="itemInfo_pictureUrl"
                />
                <el-input slot="reference" :disabled="true" :placeholder="$t('sku主图')" />
              </el-popover>
            </template>
            <template slot-scope="scope">
              <ody-upload-image
                v-model="scope.row['pictureUrl']"
                :pic-type="['png','jpg', 'jpeg']"
                :pic-size="4096"
                :show-tip="false"
                name="scope_row['pictureUrl']"
              />
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" min-width="140">
            <template slot="header" slot-scope="{}">
              <el-popover placement="bottom" trigger="hover">
                <el-radio
                  v-model="itemInfo.canSale"
                  :label="1"
                  name="itemInfo_canSale"
                >{{ $t('是') }}</el-radio>
                <el-radio
                  v-model="itemInfo.canSale"
                  :label="0"
                  name="itemInfo_canSale9"
                >{{ $t('否') }}</el-radio>
                <el-input slot="reference" :disabled="true" :placeholder="$t('允许销售')" />
              </el-popover>
            </template>
            <template slot-scope="scope">
              <el-radio
                v-model="scope.row.canSale"
                :label="1"
                name="scope_row_canSale"
              >{{ $t('是') }}</el-radio>
              <el-radio
                v-model="scope.row.canSale"
                :label="0"
                name="scope_row_canSale9"
              >{{ $t('否') }}</el-radio>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
  </div>
</template>

<script>
import { isEqual } from 'lodash'
import selfDefineAttributeComponent from '../selfDefineAttribute'
import productSpecBarcodes from '../product-spec-barcodes'
export default {
  components: {
    selfDefineAttributeComponent,
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
    return {
      changeValue: '', // 修改要改变的自定义的value
      choseName: '',
      autoState: {}, // 绑定动态生成的表头的数据
      itemInfo: this.defaultItemInfo(), // 表头的可以填入的数据
      tabelKey: 1,
      type: this.mp.productInfoVO.type,
      checkedSpecList: [],
      mainUnitNameList: [],
      checkedSpecFatherNameAarry: [],
      spuList: [], // 处理spu的格式
      // tableList: [], // 处理成表格的绑定数据
      dynamicValidateForm: {
        tableList: [],
        taxRate: '',
        taxCode: '',
        selectValue: {},
        specList: []
      },
      modalVisible: false
    }
  },
  watch: {
    typeOfProduct(newValue) {
      this.init()
    },
    'dynamicValidateForm.specList': {
      handler(val) {
        // 处理单选的值
        this.dealInputType(val)
        // 拿到选中的列表
        this.checkedSpecList = this.getCheckedSpecList(val)
        this.checkedSpecFatherNameAarry = this.getAttNameArray(
          this.checkedSpecList
        )
        // 生成选中的array [[], [], []]
        const checkedSpecArray = this.getSpecArray(this.checkedSpecList)
        // console.log(checkedSpecArray, 222)
        // 生成表格单个的数据 spu
        this.spuList = this.getSpuList(checkedSpecArray)
        // console.log(this.spuList, 3333)
        // 生成el-table能用的数据
        this.dynamicValidateForm.tableList = this.getTableList()
        this.tabelKey += 1
      },
      deep: true,
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.loadUnit()
      if (this.typeOfProduct === 3) {
        const specList = this.$portal.deepClone(this.saleAttributeEditVos)
        // 为specList 绑定上groupType属性
        this.bindGroupType(specList)
        var tableList = this.$portal.deepClone(this.barcodePriceVos)
        if (tableList == null) {
          tableList = []
        }
        // 生成tableList 回显 只关心categoryList
        tableList.map(row => {
          console.log(row)
          row.categoryList = []
          if (row.saleAttrs == null) {
            row.saleAttrs = []
          }
          row.saleAttrs.map(item => {
            const index = specList.findIndex(key => {
              return key.attName === item.attrName
            })
            if (index > -1) {
              const itemsIndex = specList[index].items.findIndex(key => {
                return key.value === item.itemValue
              })
              row.categoryList.push(specList[index].items[itemsIndex])
            }
          })
        })
        this.dynamicValidateForm.tableList = tableList
        // 对规格数据赋值
        this.dynamicValidateForm.specList = specList
        this.initTax()
      } else if (this.typeOfProduct === 0) {
        const specList = this.$portal.deepClone(this.saleAttributeEditVos)
        // 为specList 绑定上groupType属性
        this.bindGroupType(specList)
        this.dynamicValidateForm.specList = specList
      }
    },
    initTax() {
      if (
        this.mp.taxRateVO.saleTaxRateId === 0 ||
        this.mp.taxRateVO.saleTaxRateId
      ) {
        this.dynamicValidateForm.taxRate = this.mp.taxRateVO.saleTaxRateId + ''
      }
      if (this.mp.productInfoVO.taxCode) {
        this.dynamicValidateForm.taxCode = this.mp.productInfoVO.taxCode
      }
    },
    bindGroupType(list) {
      list.map(item => {
        if (item.inputType === 1) {
          this.$set(
            item,
            'groupType',
            item.items.filter(x => x.checked).map(x => x.code)
          )
        }
      })
    },
    changeUnit(item) {
      if (item.saleCalcUnitId) {
        for (var i = 0; i < this.mainUnitNameList.length; i++) {
          const one = this.mainUnitNameList[i]
          if (one.id === item.saleCalcUnitId) {
            item.saleCalcUnitCode = one.calculationUnitCode
            return
          }
        }
      }
      item.saleCalcUnitCode = null
    },
    async loadUnit(name) {
      const param = {
        currentPage: 1,
        itemsPerPage: 100,
        calculationUnitName: name
      }
      const promise = this.$product.$api.mpApi.queryCalculationUnitByPage
      const { data } = await promise(param)
      this.mainUnitNameList = data.listObj || []
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (row.columns.length > 0) {
        const item = row.columns[columnIndex] || 1
        if (item !== 1) {
          if (rowIndex % item === 0) {
            return { rowspan: item, colspan: 1 }
          } else {
            return { rowspan: 0, colspan: 0 }
          }
        }
      }
    },
    dealInputType(val) {
      val.map(item => {
        if (item.inputType === 2) {
          const index = item.items.findIndex(key => {
            return key.checked === true
          })
          if (index > -1) {
            this.$set(
              this.dynamicValidateForm.selectValue,
              item.attName,
              item.items[index].code
            )
          }
        }
      })
    },
    changeSelect2(index) {
      const item = this.dynamicValidateForm.specList[index]
      item.items.map(key => {
        if (key.code === this.dynamicValidateForm.selectValue[item.attName]) {
          key.checked = true
        } else {
          if (key.checked) {
            key.checked = false
          }
        }
      })
    },
    getCheckedSpecList(val) {
      var newList = []
      val.map(item => {
        var copyItem = this.$portal.deepClone(item)
        switch (item.inputType) {
          case 1:
          case 2:
            for (let i = 0; i < copyItem.items.length; i++) {
              if (copyItem.items[i].checked === false) {
                copyItem.items.splice(i, 1)
                i--
              }
            }
            if (copyItem.items.length > 0) {
              newList.push(copyItem)
            }
            break
          default:
            break
        }
      })
      return newList
    },
    getAttNameArray(val) {
      var newArray = []
      val.map(item => {
        newArray.push(item.attName)
        // 已name命名的data 以便自动筛选
        this.$set(this.autoState, item.attName, '')
      })
      return newArray
    },
    getSpecArray(val) {
      var newArray = []
      val.map(item => {
        newArray.push(item.items)
      })
      return newArray
    },
    getSpuList(val) {
      var list = val.reduce((rtv, arr) => {
        if (rtv.length === 0) {
          return arr.map(x => {
            return {
              categoryList: [x],
              columns: []
            }
          })
        }
        const newRtv = []
        rtv.forEach(item1 => {
          const columns = item1.columns.map(x => x * arr.length)
          arr.forEach(item2 => {
            newRtv.push({
              categoryList: [...item1.categoryList, item2],
              columns: [...columns, arr.length]
            })
          })
        })

        return newRtv
      }, [])
      return list
    },
    getTableList() {
      const list = this.$portal.deepClone(this.spuList)
      list.map(item => {
        item.categoryList.map((key, keyIndex) => {
          item[this.checkedSpecFatherNameAarry[keyIndex]] = key.value
          this.itemInfo = this.defaultItemInfo()
          for (const k in this.itemInfo) {
            item[k] = this.itemInfo[k]
          }
        })
      })
      // 回显一模一样的数据
      this.dealWritedData(list)
      return list
    },
    dealWritedData(list) {
      const oldTableList = this.$portal.deepClone(
        this.dynamicValidateForm.tableList
      )
      list.map(item => {
        oldTableList.map(key => {
          if (isEqual(item.categoryList, key.categoryList)) {
            for (const k in this.itemInfo) {
              item[k] = key[k]
            }
            if (!item.barcodes) {
              item.barcodes = []
            }
            if (!item.barcodesPhoto) {
              item.barcodesPhoto = []
            }
            if (!item.canSale) {
              item.canSale = this.itemInfo.canSale
            }
          }
        })
      })
    },
    curChooseName(item) {
      this.choseName = item
    },
    querySearch(queryString, cb) {
      var restaurants = []
      // 动态生成要选择的数据
      this.checkedSpecList.map(item => {
        if (item.attName === this.choseName) {
          item.items.map(key => {
            restaurants.push({ ...key, ...{ value: key.value }})
          })
        }
      })
      var results = queryString
        ? restaurants.filter(this.createFilter(queryString))
        : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter(queryString) {
      return restaurant => {
        return (
          restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) ===
          0
        )
      }
    },
    changeCheckbox(item, val) {
      item.items.forEach(x => {
        x.checked = val.includes(x.code)
      })
      console.log(this.dynamicValidateForm.specList)
    },
    batchFilling() {
      console.log(this.autoState)
      // console.log(this.itemInfo)
      // 取出this.autoState选中的值
      const choseAutoSateList = this.getTableHeaderList()
      // console.log(choseAutoSateList)

      // 比较选中的数据 包含在tableList中的数据进行赋值操作
      if (choseAutoSateList.length > 0) {
        this.dynamicValidateForm.tableList.map(item => {
          let j = 0
          choseAutoSateList.map(key => {
            for (let i = 0; i < item.categoryList.length; i++) {
              if (isEqual(key, item.categoryList[i])) {
                ++j
                break
              }
            }
          })
          if (j === choseAutoSateList.length) {
            for (const k in this.itemInfo) {
              if (this.itemInfo[k] && typeof this.itemInfo[k] === 'string') {
                item[k] = this.itemInfo[k]
              }
              if (k === 'canSale') {
                item[k] = this.itemInfo[k]
              }
              if (k === 'barcodes' && this.itemInfo[k].length > 0) {
                item[k] = this.itemInfo[k]
              }
            }
          }
        })
      } else {
        this.dynamicValidateForm.tableList.map(item => {
          for (const k in this.itemInfo) {
            if (this.itemInfo[k] && typeof this.itemInfo[k] === 'string') {
              item[k] = this.itemInfo[k]
            }
            if (k === 'canSale') {
              item[k] = this.itemInfo[k]
            }
            console.log(k, this.itemInfo[k])
            if (k === 'barcodes' && this.itemInfo[k].length > 0) {
              item[k] = this.$portal.deepClone(this.itemInfo[k])
            }
          }
        })
      }

      // 清空
      for (const i in this.autoState) {
        this.autoState[i] = ''
      }
      this.itemInfo = this.defaultItemInfo()
      this.$forceUpdate()
    },
    defaultItemInfo() {
      return {
        skuCode: '',
        barcodes: [],
        barcodesPhoto: [],
        skuBarCode: '',
        salePrice: '',
        marketPrice: '', // 市场价格
        purchasePrice: '', // 采购价格
        saleCalcUnitId: this.mp.productInfoVO.mainUnitId,
        saleCalcUnitCode: '',
        pictureUrl: '', // 主图
        weightFloor: '', // 净重最小值
        weightCeiling: '', // 净重最大值
        canSale: 0 // 是否允许销售
      }
    },
    getTableHeaderList() {
      const list = []
      this.checkedSpecFatherNameAarry.map((item, index) => {
        if (this.autoState[item]) {
          this.checkedSpecList[index].items.map(key => {
            if (key.value === this.autoState[item]) {
              list.push(key)
            }
          })
        }
      })
      return list
    },
    // 添加自定义规格名称
    addCustomAttValue(item) {
      // console.log(item)
      if (!item.customValue) {
        return this.$message(`请输入${item.attName}`)
      }
      var flag = false
      item.items.map(key => {
        if (key.value === item.customValue) {
          flag = true
        }
      })
      if (flag) {
        return this.$message(`${item.attName}下已经存在${item.customValue}`)
      }
      item.items.push({
        code: 'C' + this.$portal.getUuid(),
        value: item.customValue,
        isAdded: 1,
        checked: true
      })
      item.customValue = ''
      this.bindGroupType(this.dynamicValidateForm.specList)
    },
    delCustomValue(item, index) {
      item.splice(index, 1)
    },
    confimChangeValue(pro, item) {
      if (this.changeValue === '') {
        return false
      }
      var flag = false
      pro.items.map(item => {
        if (item.value === this.changeValue) {
          flag = true
        }
      })
      if (flag) {
        return this.$message(`${pro.attName}下已经存在${this.changeValue}`)
      }
      item.value = this.changeValue
      document.body.click()
    },
    openAttributeModal() {
      this.modalVisible = !this.modalVisible
    },
    // 关闭自定义属性模态框
    closeAttributeModal(newAtt) {
      if (newAtt) {
        // console.log(newAtt)
        var obj = {
          inputType: 1,
          attName: newAtt.attName,
          enableAdd: 1,
          attType: 2,
          items: [],
          removed: 0
        }
        if (newAtt.attValueList.length > 0) {
          newAtt.attValueList.map(item => {
            obj.items.push({
              checked: false,
              isAdded: 1,
              value: item,
              code: 'C' + this.$portal.getUuid()
            })
          })
        } else {
          obj.items.push({
            checked: false,
            isAdded: 1,
            value: newAtt.attValue,
            code: 'C' + this.$portal.getUuid()
          })
        }
        this.dynamicValidateForm.specList.push(obj)
        this.bindGroupType(this.dynamicValidateForm.specList)
      }
    },
    removeSpecItem(index) {
      this.dynamicValidateForm.specList.splice(index, 1)
    },
    toParentTax() {
      const taxRateVO = {}
      this.taxList.map(item => {
        if (item.saleTaxRateId === this.dynamicValidateForm.taxRate) {
          taxRateVO.saleTaxRateId = item.saleTaxRateId
          taxRateVO.saleTaxRate = item.saleTaxRate
        }
      })
      return taxRateVO
    },
    toParentTaxCode() {
      let taxCode = null
      if (this.dynamicValidateForm.taxCode) {
        taxCode = this.dynamicValidateForm.taxCode
      }
      return taxCode
    },
    toParentSpecList() {
      const specList = this.$portal.deepClone(this.dynamicValidateForm.specList)
      specList.map(item => {
        if (item.inputType === 1) {
          delete item['groupType']
        }
      })
      return specList
    },
    toParentTableList() {
      const tableList = this.$portal.deepClone(
        this.dynamicValidateForm.tableList
      )
      // 删除掉后台不用的数据 并组装成后台想要的数据
      tableList.map(row => {
        row.saleAttrs = []
        row.categoryList.map((item, index) => {
          const keyIndex = this.dynamicValidateForm.specList.findIndex(key => {
            return key.attName === this.checkedSpecFatherNameAarry[index]
          })
          row.saleAttrs.push({
            attrName: this.dynamicValidateForm.specList[keyIndex].attName,
            attrId: this.dynamicValidateForm.specList[keyIndex].attId,
            itemCode: item.code,
            itemValue: item.value
          })
          delete row[this.checkedSpecFatherNameAarry[index]]
        })
        delete row['categoryList']
        delete row['skuBarCode']
        delete row['barcodesPhoto']
        delete row['columns']
      })
      console.log(tableList, 'tableList')
      return tableList
    }
  }
}
</script>

<style lang="scss" scoped>
.ellipsis {
  /deep/ .el-checkbox__label {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    max-width: 120px;
    vertical-align: middle;
  }
}
/deep/ .el-checkbox-group {
  font-size: 14px;
}
/deep/ .el-table__header-wrapper {
  .cell {
    height: 38px;
  }
}
.tax-rate {
  width: 260px;
}
.att-name {
  display: inline-block;
  min-width: 70px;
  text-align: right;
}
.choose-spec {
  background: #ffffff;
}
.add-attr {
  display: flex;
  align-items: center;
  margin-top: 20px;
  .add-attr-input {
    margin: 0 10px 0 0;
    width: 200px;
  }
}
.btn-custom {
  margin: 24px 0 0 86px;
  .add-custom-btn {
    display: inline-block;
    width: 130px;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    cursor: pointer;
    color: var(--themeColor90);
    border: 1px dashed var(--themeColor90);
    &:hover {
      color: var(--themeColor);
      border: 1px dashed var(--themeColor);
    }
  }
}
.spec-item {
  display: flex;
  margin: 20px 0 0 0;
  .spec-checkbox {
    position: relative;
    margin: 0 0 0 5px;
    padding: 0 0 0 10px;
    width: 800px;
    min-height: 50px;
    line-height: 50px;
    background: rgba(248, 249, 250, 1);
    border: 1px solid rgba(238, 245, 249, 1);
    .el-select {
      width: 200px;
    }
    .del-item {
      position: absolute;
      z-index: 99;
      top: -6px;
      right: 10px;
      cursor: pointer;
      &:hover {
        color: var(--themeColor);
      }
    }
  }
}

.table {
  margin: 20px;
  position: relative;
  .btn {
    right: 0;
    position: absolute;
  }
  .weight-flex {
    display: flex;
    .weight-link {
      margin: 4px 5px;
    }
  }
}
.el-icon {
  cursor: pointer;
  &:hover {
    color: var(--themeColor);
  }
}
.sale-price {
  display: flex !important;
  .require {
    position: relative;
    &::before {
      position: absolute;
      content: '*';
      color: red;
    }
  }
}
</style>
