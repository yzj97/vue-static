<template>
  <div>
    <ody-list-search-area>
      <div slot="content">
        <el-form ref="form" :model="form" :rules="rules" label-width="140px">
          <el-row>
            <el-col :span="6">
              <el-form-item :label="$t('价目表编码')" prop="priceSheetCode">
                <el-input v-model="form.priceSheetCode" :disabled="true" name="form_priceSheetCode" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('价目表名称')" prop="priceSheetName">
                <el-input v-model="form.priceSheetName" name="form_priceSheetName" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('优先级')" prop="sort">
                <el-input v-model="form.sort" :disabled="true" name="form_sort" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('状态')" prop="status">
                <ody-radio2 v-model="form.status" name="form_status" list-key="advancePriceStatusList" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item :label="$t('有效期')" prop="validDate">
                <el-date-picker
                  v-model="form.validDate"
                  name="form_validDate"
                  value-format="yyyy-MM-dd"
                  type="daterange"
                  range-separator="-"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('备注')" prop="sort">
                <el-input v-model="form.remarks" name="form_remarks" />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item :label="$t('商家')" prop="merchantId">
                <ody-merchant-select
                  v-model="form.merchantId"
                  :disabled="form.id"
                  name="form_merchantId"
                  value-key="merchantId"
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </ody-list-search-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="MerchantAdvancedPricingAddContion_handleAddRule"
          size="mini"
          type="primary"
          code="MerchantAdvancedPricingAddContion"
          @click="handleAddRule"
        >{{ $t('添加条件') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="ruleTable.data"
          :columns="ruleTable.columns"
          :operates="ruleTable.operates"
          :can-filter="false"
          name="ruleTable_data249"
        >
          <template
            slot="optionId"
            slot-scope="scope"
          >{{ scope.row.optionId | keyVal(getOptionMap) }}</template>
        </ody-table>
      </div>
    </ody-list-table-area>
    <ody-list-table-area>
      <div slot="btn">
        <ody-button
          name="MerchantAdvancedDeleteObject_handleDeleteProduct"
          size="mini"
          type="primary"
          code="MerchantAdvancedDeleteObject"
          @click="handleDeleteProduct"
        >{{ $t('批量删除') }}</ody-button>
        <ody-button
          name="MerchantAdvancedPricingAddObject_handleAddProduct"
          size="mini"
          type="primary"
          code="MerchantAdvancedPricingAddObject"
          @click="handleAddProduct"
        >{{ $t('添加对象') }}</ody-button>
      </div>
      <div slot="table">
        <ody-table
          :data="productTable.data.filter(data => data.toDeleted !== 1)"
          :columns="productTable.columns"
          :operates="productTable.operates"
          :multiple="true"
          :checked.sync="productTable.checked"
          :can-filter="false"
          name="productTable_data_filter(data => data_toDeleted !== 1)498"
        >
          <template slot="refId" slot-scope="scope">{{ scope.row.refId | keyVal(getRefIdMap) }}</template>
          <template
            slot="calcType"
            slot-scope="scope"
          >{{ scope.row.calcType | keyVal(getCalcTypeMap) }}</template>
          <template slot="price" slot-scope="scope">
            <div v-if="scope.row.calcType === '2'">
              <div>{{ scope.row.priceRange }}</div>
              <div>
                <el-popover placement="top" width="500" trigger="hover">
                  <el-table :data="scope.row.ladderPriceArr" name="scope_row_ladderPriceArr735">
                    <el-table-column
                      :label="$t('订购数量（起）')"
                      align="center"
                      min-width="120"
                      prop="numberStartRange"
                    />
                    <el-table-column label="-" align="center" min-width="30">
                      <template slot-scope="scope">
                        <span>{{ $t('至') }}</span>
                      </template>
                    </el-table-column>
                    <el-table-column
                      :label="$t('订购数量（止）')"
                      align="center"
                      min-width="120"
                      prop="numberEndRange"
                    />
                    <el-table-column
                      :label="$t('价格（元）')"
                      align="center"
                      min-width="120"
                      prop="price"
                    />
                  </el-table>
                  <el-button slot="reference" size="mini" icon="el-icon-info" circle />
                </el-popover>
              </div>
            </div>
            <div v-if="scope.row.calcType !== '2'">{{ scope.row.price }}</div>
          </template>
        </ody-table>
        <div slot="page">
          <div class="block">
            <ody-pagination
              :current-page.sync="page.current"
              :page-sizes="[10, 20, 30, 50]"
              :page-size.sync="page.size"
              :total.sync="page.total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handlePageSizeChange"
              @current-change="handlePageCurrentChange"
            />
          </div>
        </div>
      </div>
    </ody-list-table-area>
    <ody-fixed>
      <ody-button code="ui" name="handleReturn" @click="handleReturn">{{ $t('返回') }}</ody-button>
      <ody-button
        name="MerchantAdvancedSaveOrUpdate_handleSave"
        type="primary"
        code="MerchantAdvancedSaveOrUpdate"
        @click="handleSave"
      >{{ $t('保存') }}</ody-button>
    </ody-fixed>
    <rule-dialog-edit
      :visible.sync="ruleDialogEditVisible"
      :merchant-id.sync="form.merchantId"
      :rule.sync="editRule"
      @ok="handleRuleDialogOk"
    />
    <product-dialog-edit
      :visible.sync="productDialogEditVisible"
      :merchant-id.sync="form.merchantId"
      :product.sync="editProduct"
      @ok="handleProductDialogOk"
    />
  </div>
</template>

<script>
import ruleDialogEdit from '@/components/advanced-pricing/rule-dialog-edit'
import productDialogEdit from '@/components/advanced-pricing/product-dialog-edit'
export default {
  name: 'MerchantAdvancedPricingEdit',
  components: {
    ruleDialogEdit,
    productDialogEdit
  },
  data() {
    return {
      optionList: [
        { value: 1, label: this.$t('渠道') },
        { value: 2, label: this.$t('店铺') },
        { value: 3, label: this.$t('客户编码') },
        { value: 4, label: this.$t('销售区域') },
        { value: 5, label: this.$t('订单类型') }
      ],
      calcTypeList: [
        { value: '1', label: this.$t('固定价') },
        { value: '2', label: this.$t('阶梯价') },
        { value: '3', label: this.$t('百分比') }
      ],
      objectList: [{ value: '1', label: this.$t('商品') }],
      ruleDialogEditVisible: false,
      productDialogEditVisible: false,
      form: {
        priceSheetCode: '',
        priceSheetName: '',
        sort: '',
        merchantId: '',
        validDate: [],
        status: '1',
        remarks: '',
        channelCodes: '',
        storeCodes: '',
        customerCodes: '',
        areaCodes: '',
        orderTypes: ''
      },
      rules: {
        merchantId: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        priceSheetCode: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        priceSheetName: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        status: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        validDate: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      },
      editRule: {},
      ruleTable: {
        data: [],
        columns: [
          {
            label: this.$t('条件名称'),
            align: 'center',
            slot: 'optionId',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('条件值'),
            align: 'center',
            prop: 'valueStr',
            minWidth: 120,
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.editRule = row
                this.ruleDialogEditVisible = true
              },
              code: 'MerchantAdvancedPricingEditContion'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                this.ruleTable.data.splice(index, 1)
              },
              code: 'MerchantAdvancedPricingDeleteContion'
            }
          ]
        }
      },
      editProduct: {},
      page: {
        size: 10,
        current: 1,
        total: 0
      },
      productTable: {
        data: [],
        checked: [],
        columns: [
          {
            label: this.$t('定价对象'),
            align: 'center',
            slot: 'refId',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('对象编码'),
            align: 'center',
            prop: 'refCode',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('对象名称'),
            align: 'center',
            prop: 'refName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('主计量单位'),
            align: 'center',
            prop: 'mainUnitName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('定价单位'),
            align: 'center',
            prop: 'assistUnitName',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('定价方式'),
            align: 'center',
            slot: 'calcType',
            minWidth: 120,
            show: true
          },
          {
            label: this.$t('定价值'),
            align: 'center',
            slot: 'price',
            minWidth: 120,
            show: true
          }
        ],
        operates: {
          width: 150,
          fixed: 'right',
          list: [
            {
              label: this.$t('编辑'),
              method: (index, row) => {
                this.editProduct = row
                this.editProduct.originalRefCode = this.editProduct.refCode
                this.productDialogEditVisible = true
              },
              code: 'MerchantAdvancedEditObject'
            },
            {
              label: this.$t('删除'),
              method: (index, row) => {
                if (row.id) {
                  row.toDeleted = 1
                } else {
                  this.productTable.data.splice(index, 1)
                }
              },
              code: 'MerchantAdvancedDeleteObject'
            }
          ]
        }
      }
    }
  },
  computed: {
    getOptionMap() {
      return this.optionList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getCalcTypeMap() {
      return this.calcTypeList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    },
    getRefIdMap() {
      return this.objectList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const vue = this
      const id = vue.$route.params.id
      if (id) {
        vue.$product.$api.priceApi
          .queryPriceSheetForEdit({ id: id })
          .then(res => {
            vue.form = res.data
            vue.form.status = vue.form.status + ''
            vue.form.validDate = [
              vue.$portal.parseTime(vue.form.startDate, '{y}-{m}-{d}'),
              vue.$portal.parseTime(vue.form.endDate, '{y}-{m}-{d}')
            ]
            vue.setOptions()
            vue.updateProductList()
          })
      } else {
        vue.$product.$api.priceApi.generatingAlgorithmWhenAdd({}).then(res => {
          vue.form.priceSheetCode = res.data.maxPriceCodeName
          vue.form.sort = res.data.maxSort
        })
      }
    },
    setOptions() {
      const vue = this
      for (const code in vue.form) {
        const value = vue.form[code]
        if (value) {
          const result = {
            contentTables: [],
            valueStr: '',
            optionId: '',
            optionName: '',
            operationCode: '='
          }

          if (code === 'channelCodes') {
            result.optionId = 1
            vue.loadChannelList(result, value)
          } else if (code === 'storeCodes') {
            result.optionId = 2
            vue.loadStoreList(result, value)
          } else if (code === 'customerCodes') {
            result.optionId = 3
            vue.loadCustomerCodes(result, value)
          } else if (code === 'areaCodes') {
            result.optionId = 4
            vue.loadSaleAreaList(result, value)
          } else if (code === 'orderTypes') {
            result.optionId = 5
            vue.loadSoTypeList(result, value)
          }

          if (result.optionId) {
            vue.ruleTable.data.push(result)
          }
        }
      }
    },
    async loadChannelList(data, value) {
      const channel = await this.$product.$api.userApi.queryChannelMap({})
      if (channel && channel.data) {
        for (const c in channel.data) {
          if (value.indexOf(channel.data[c].channelCode) !== -1) {
            data.contentTables.push({
              value: channel.data[c].channelCode,
              name: channel.data[c].channelName
            })
            data.valueStr += channel.data[c].channelName + '\n'
          }
        }
      }
    },
    async loadStoreList(data, value) {
      const store = await this.$product.$api.merchantApi.queryPlatformAuthStorePage(
        { currentPage: 1, itemsPerPage: 500, merchantId: this.form.merchantId }
      )
      if (
        store &&
        store.data &&
        store.data.listObj &&
        store.data.listObj.length > 0
      ) {
        store.data.listObj.map(item => {
          if (value.indexOf(item.storeId) !== -1) {
            data.contentTables.push({
              value: item.storeId,
              name: item.storeName
            })
            data.valueStr += item.storeName + '\n'
          }
        })
      }
    },
    async loadCustomerCodes(data, value) {
      const customerCodes = value.split(',')
      customerCodes.map(item => {
        const customerCode = item.replace('_', '')
        data.contentTables.push({ value: customerCode, name: customerCode })
        data.valueStr += customerCode + '\n'
      })
    },
    async loadSaleAreaList(data, value) {
      const saleArea = await this.$product.$api.userApi.querySalesAreaByMerchantId(
        { merchantId: this.form.merchantId }
      )
      if (saleArea && saleArea.data && saleArea.data.length > 0) {
        saleArea.data.map(item => {
          if (value.indexOf(item.areaCode) !== -1) {
            data.contentTables.push({
              value: item.areaCode,
              name: item.areaName
            })
            data.valueStr += item.areaName + '\n'
          }
        })
      }
    },
    async loadSoTypeList(data, value) {
      const soType = await this.$product.$api.common.querySoTypeList({})
      if (soType && soType.data && soType.data.length > 0) {
        this.soTypeList = []
        soType.data.map(item => {
          if (value.indexOf(item.code) !== -1) {
            data.contentTables.push({ value: item.code, name: item.name })
            data.valueStr += item.name + '\n'
          }
        })
      }
    },
    async handlePageSizeChange() {
      try {
        await this.updateProductList()
      } catch (ex) {
        console.log(ex)
      }
    },
    async updateProductList() {
      try {
        this.loading = true
        if (this.form.id) {
          const param = {
            priceSheetId: this.form.id,
            currentPage: this.page.current,
            itemsPerPage: this.page.size
          }
          this.$product.$api.priceApi
            .queryPriceSheetStrategyForEdit(param)
            .then(res => {
              if (res && res.code === '0') {
                if (res.data.listObj && res.data.listObj.length > 0) {
                  res.data.listObj.map(item => {
                    item.refId = '1'
                    item.calcType = item.calcType + ''
                    setPriceRange(item)
                  })
                }
                this.productTable.data = res.data.listObj
                this.page.total = res.data.total
              }
            })
          this.productTable.checked = []
        }
      } catch (ex) {
        console.log(ex)
      } finally {
        this.loading = false
      }
    },
    async handlePageCurrentChange() {
      try {
        await this.updateProductList()
      } catch (ex) {
        console.log(ex)
      }
    },
    handleReturn() {
      this.$portal.delActiveView()
      setTimeout(() => {
        this.$router.push({ name: 'MerchantAdvancedPricing' })
      }, 0)
    },
    handleReturnAndRefresh() {
      this.$portal.delActiveViewAndRefresh()
      setTimeout(() => {
        this.$router.push({ name: 'MerchantAdvancedPricing' })
      }, 0)
    },
    handleAddRule() {
      if (this.form.merchantId) {
        this.ruleDialogEditVisible = true
      } else {
        this.$message.info(this.$t('请选择商家'))
      }
    },
    handleAddProduct() {
      if (this.form.merchantId) {
        this.productDialogEditVisible = true
      } else {
        this.$message.info(this.$t('请选择商家'))
      }
    },
    handleDeleteProduct() {
      if (this.productTable.checked && this.productTable.checked.length > 0) {
        this.$confirm(this.$t('delete_confirm'), this.$t('prompt'), {
          confirmButtonText: this.$t('ok'),
          cancelButtonText: this.$t('cancel'),
          type: 'warning'
        }).then(() => {
          for (let i = 0; i < this.productTable.checked.length; i++) {
            const item = this.productTable.checked[i]
            if (item.id) {
              item.toDeleted = 1
            } else {
              const index = this.productTable.data.indexOf(item)
              this.productTable.data.splice(index, 1)
            }
          }
          this.productTable.checked = []
        })
      } else {
        this.$message.info(this.$t('请选择'))
      }
    },
    handleSave() {
      const vue = this
      vue.$refs['form'].validate(valid => {
        if (valid) {
          const params = Object.assign({}, vue.form)
          params.startDate = params.validDate[0]
          params.endDate = params.validDate[1]
          this.optionList.map(item => {
            const codeName = getCodeName(item.value)
            let codeValue = ''
            for (const ruleItem of this.ruleTable.data) {
              if (item.value === ruleItem.optionId) {
                ruleItem.contentTables.map(content => {
                  codeValue += '_' + content.value + ','
                })
                break
              }
            }
            params[codeName] = codeValue
          })
          params.strategyVOList = this.productTable.data
          if (vue.form.id) {
            vue.$product.$api.priceApi.updatePriceSheet(params).then(res => {
              if (res && res.code === '0') {
                vue.$message.success(vue.$t('保存成功'))
                vue.handleReturnAndRefresh()
              }
            })
          } else {
            vue.$product.$api.priceApi.savePriceSheet(params).then(res => {
              if (res && res.code === '0') {
                vue.$message.success(vue.$t('保存成功'))
                vue.handleReturnAndRefresh()
              }
            })
          }
        }
      })
    },
    handleRuleDialogOk(selected) {
      if (selected.contentTables && selected.contentTables.length > 0) {
        selected.valueStr = ''
        selected.contentTables.map(item => {
          selected.valueStr += item.name + '\n'
        })
      }
      let exist = false
      this.ruleTable.data.map(item => {
        if (item.optionId === selected.optionId) {
          if (selected.isEdit) {
            item.operationCode = selected.operationCode
            item.contentTables = selected.contentTables
            item.valueStr = selected.valueStr
          }
          exist = true
        }
      })
      if (exist) {
        if (!selected.isEdit) {
          this.$message.info(this.$t('此条件已存在，请不要重复添加'))
        }
      } else {
        this.ruleTable.data.push(selected)
      }
    },
    handleProductDialogOk(selected) {
      setPriceRange(selected)
      let exist = false
      this.productTable.data.map(item => {
        if (
          item.refCode === selected.refCode ||
          item.refCode === selected.originalRefCode
        ) {
          if (selected.isEdit || item.toDeleted === 1) {
            selected.isEdit = true
            resetProduct(item, selected)
          }
          exist = true
        }
      })
      if (exist) {
        if (!selected.isEdit) {
          this.$message.info(this.$t('此对象编码已存在，请不要重复添加'))
        }
      } else {
        this.productTable.data.push(selected)
      }
    }
  }
}

function resetProduct(original, current) {
  original.refCode = current.refCode
  original.refName = current.refName
  original.objectUnit = current.objectUnit
  original.assistUnitName = current.assistUnitName
  original.mainUnitName = current.mainUnitName
  original.calcType = current.calcType
  original.price = current.price
  original.priceRange = current.priceRange
  original.ladderPriceArr = current.ladderPriceArr
  original.toDeleted = null
}

function setPriceRange(selected) {
  if (selected.calcType === '2') {
    let minPrice = Number(selected.ladderPriceArr[0].price)
    let maxPrice = Number(selected.ladderPriceArr[0].price)
    selected.ladderPriceArr.map(item => {
      const price = Number(item.price)
      if (price <= minPrice) {
        minPrice = price
      }
      if (price >= maxPrice) {
        maxPrice = price
      }
      selected.priceRange = minPrice + '-' + maxPrice
    })
  }
}

function getCodeName(optionId) {
  let s = ''
  switch (optionId) {
    case 1:
      s = 'channelCodes'
      break
    case 2:
      s = 'storeCodes'
      break
    case 3:
      s = 'customerCodes'
      break
    case 4:
      s = 'areaCodes'
      break
    case 5:
      s = 'orderTypes'
      break
    default:
      break
  }
  return s
}
</script>

<style scoped>
</style>
