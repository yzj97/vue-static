<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('添加定价对象')"
      width="960px"
      @open="init">
      <el-form ref="productForm" :model="params" :rules="rules" label-position="right" label-width="150px">
        <el-form-item :label="$t('定价对象')" prop="refId">
          <el-select v-model="params.refId" name="params_refId">
            <el-option
              v-for="item in objectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('对象编码')" prop="refCode">
          <el-input v-model="params.refCode" name="params_refCode" @change="handleRefCodeEnter"/>
        </el-form-item>
        <el-form-item :label="$t('对象名称')" prop="refName">
          <el-input v-model="params.refName" :disabled="true" name="params_refName"/>
        </el-form-item>
        <el-form-item :label="$t('定价单位')" prop="objectUnit">
          <el-select v-model="params.objectUnit" name="params_objectUnit" @change="handleObjectUnitChange">
            <el-option
              v-for="item in objectUnitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('定价方式')" prop="calcType">
          <el-select v-model="params.calcType" name="params_calcType">
            <el-option
              v-for="item in calcTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item v-if="params.calcType !== '2'" :label="$t('定价值')" :rules="{ required: true, message: this.$t('required'), trigger: 'blur' }" prop="price">
          <ody-input-number v-if="params.calcType === '1' || params.calcType === ''" :empty-tip="false" v-model="params.price" :decimal="4" :min="0" :max="999999999" name="params_price" />
          <ody-input-number v-if="params.calcType === '3'" v-model="params.price" :empty-tip="false" :decimal="4" :min="0" :max="999999999" name="params_price7">
            <template slot="append">%</template>
          </ody-input-number>
        </el-form-item>
      </el-form>
      <div v-if="params.calcType === '2'" class="el-form-item is-required">
        <label class="el-form-item__label" style="width: 150px">{{ $t('定价值') }}</label>
        <div class="el-form-item__content" style="margin-left: 150px;">
          <el-form ref="ladderPriceForm" :model="ladderPriceForm" :rules="ladderPriceRule">
            <ody-button code="ui" name="handleAddLine" size="mini" type="primary" @click="handleAddLine">{{ $t('添加行') }}</ody-button>
            <el-table :data="ladderPriceForm.ladderPriceData" name="ladderPriceForm_ladderPriceData946">
              <el-table-column
                :label="$t('订购数量（起）')"
                align="center"
                min-width="120"
                prop="numberStartRange">
                <template slot-scope="scope">
                  <el-form-item :prop="'ladderPriceData.' + scope.$index + '.numberStartRange'" :rules="ladderPriceRule.numberStartRange">
                    <ody-input-number v-model="scope.row.numberStartRange" :min="0" :max="999999999" name="scope_row_numberStartRange" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                label="-"
                align="center"
                min-width="20">
                <template slot-scope="scope">
                  <span>{{ $t('至') }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('订购数量（止）')"
                align="center"
                min-width="120"
                prop="numberEndRange">
                <template slot-scope="scope">
                  <el-form-item :prop="'ladderPriceData.' + scope.$index + '.numberEndRange'" :rules="ladderPriceRule.numberEndRange">
                    <ody-input-number v-model="scope.row.numberEndRange" :min="0" :max="999999999" name="scope_row_numberEndRange" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('价格（元）')"
                align="center"
                min-width="120"
                prop="price">
                <template slot-scope="scope">
                  <el-form-item :prop="'ladderPriceData.' + scope.$index + '.price'" :rules="ladderPriceRule.price">
                    <ody-input-number v-model="scope.row.price" :decimal="4" :min="0" :max="999999999" name="scope_row_price" />
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('操作')"
                align="center"
                min-width="120">
                <template slot-scope="scope">
                  <div><el-button name="removeContent" size="small" type="primary" @click="removeContent(scope.row)" >{{ $t('删除') }}</el-button></div>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <ody-button code="ui" name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</ody-button>
        <ody-button code="ui" name="handleOk" size="small" type="primary" @click="handleOk">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    merchantId: {
      type: Number,
      default: null
    },
    product: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      objectList: [
        { value: '1', label: this.$t('商品') }
      ],
      objectUnitList: [],
      calcTypeList: [
        { value: '1', label: this.$t('固定价') },
        { value: '2', label: this.$t('阶梯价') },
        { value: '3', label: this.$t('百分比') }
      ],
      params: {
        refId: '1',
        refCode: '',
        refName: '',
        objectUnit: '',
        calcType: '',
        price: '',
        isEdit: false
      },
      rules: {
        refId: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        refCode: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        refName: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        calcType: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      },
      ladderPriceForm: {
        ladderPriceData: [{
          numberStartRange: '',
          numberEndRange: '',
          price: ''
        }]
      },
      ladderPriceRule: {
        numberStartRange: [
          { required: true, message: '请输入', trigger: 'blur' }
        ],
        numberEndRange: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ],
        price: [
          { required: true, message: this.$t('required'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    async init() {
      if (this.product && this.product.refCode) {
        this.params = Object.assign({}, this.product)
        this.params.isEdit = true
        if (this.params.calcType === '2') {
          this.ladderPriceForm.ladderPriceData = this.params.ladderPriceArr
        }
        this.queryProductAssistUnit(this.params.mpId)
      }
    },
    handleClose() {
      this.$refs['productForm'].resetFields()
      this.ladderPriceForm = {
        ladderPriceData: [{
          numberStartRange: '',
          numberEndRange: '',
          price: ''
        }]
      }
      this.objectUnitList = []
      this.$emit('update:product', {})
      this.$emit('update:visible', !this.visible)
    },
    handleOk() {
      const vue = this
      vue.$refs['productForm'].validate((valid) => {
        if (valid) {
          const selected = Object.assign({}, vue.params)
          if (selected.calcType === '2') {
            vue.$refs['ladderPriceForm'].validate((ladderPriceValid) => {
              if (ladderPriceValid) {
                if (vue.ladderPriceForm.ladderPriceData && vue.ladderPriceForm.ladderPriceData.length > 0) {
                  selected.ladderPriceArr = vue.ladderPriceForm.ladderPriceData
                  vue.$emit('ok', selected)
                  vue.handleClose()
                } else {
                  vue.$message.error(vue.$t('请输入阶梯定价'))
                }
              } else {
                return false
              }
            })
          } else {
            selected.ladderPriceArr = []
            vue.$emit('ok', selected)
            vue.handleClose()
          }
        } else {
          return false
        }
      })
    },
    handleRefCodeEnter(refCode) {
      if (refCode) {
        this.$product.$api.mpApi.queryMerchantProductByCode({ merchantId: this.merchantId, code: refCode }).then(res => {
          if (res && res.code === '0') {
            if (res.data) {
              if (res.data.typeOfProduct === 3 || res.data.typeOfProduct === 4) {
                this.params.refName = ''
                this.params.mainUnitName = ''
                this.params.objectUnit = ''
                this.$message.info(this.$t('亲，只能添加常规品和系列子品哦'))
              } else {
                this.params.refName = res.data.chineseName
                this.params.mainUnitName = res.data.mainUnitName
                this.params.objectUnit = ''
                this.queryProductAssistUnit(res.data.id)
              }
            } else {
              this.params.refName = ''
              this.params.mainUnitName = ''
              this.params.objectUnit = ''
              this.$message.info(this.$t('此对象编码没有对象名称'))
            }
          }
        })
      }
    },
    handleObjectUnitChange(value) {
      if (value) {
        this.objectUnitList.map(item => {
          if (item.value === value) {
            this.params.assistUnitName = item.label
          }
        })
      } else {
        this.params.assistUnitName = ''
      }
    },
    queryProductAssistUnit(mpId) {
      this.objectUnitList = []
      this.$product.$api.mpApi.queryMeasurementUnitByMerchantId(mpId).then(res => {
        if (res && res.code === '0') {
          if (this.params.mpId === null || this.params.mpId === undefined) {
            this.params.mpId = mpId
          }
          if (res.data && res.data.length > 0) {
            res.data.map(item => {
              this.objectUnitList.push({ value: item.unitCode, label: item.measurementUnit })
            })
          }
        }
      })
    },
    handleAddLine() {
      this.ladderPriceForm.ladderPriceData.push({})
    },
    removeContent(row) {
      const index = this.ladderPriceForm.ladderPriceData.indexOf(row)
      this.ladderPriceForm.ladderPriceData.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
