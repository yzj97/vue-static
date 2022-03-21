<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t('积分定价')"
    width="900px"
    @open="init"
  >
    <el-form ref="integralValidateForm" :model="integralValidateForm">
      <el-form-item
        :label="$t('兑换方式')"
        :rules="{
          required: true,
          message: this.$t('请选择兑换方式'),
          trigger: 'change'
        }"
        prop="type"
      >
        <el-radio-group
          v-model="integralValidateForm.type"
          name="integralValidateForm_exchangeType"
        >
          <el-radio :label="1">{{ $t('纯积分') }}</el-radio>
          <el-radio :label="2">{{ $t('积分+金额') }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="$t('兑换时间')"
        :rules="{
          required: true,
          message: this.$t('请选择兑换时间方式'),
          trigger: 'change'
        }"
        prop="dateType"
      >
        <el-radio-group
          v-model="integralValidateForm.dateType"
          name="integralValidateForm_exchangeDateType"
        >
          <el-radio :label="1">{{ $t('不限制') }}</el-radio>
          <el-radio :label="2">
            {{ $t('限制时间') }}
            <el-date-picker
              v-if="integralValidateForm.dateType===2"
              :placeholder="$t('common_choose_date')"
              v-model="integralValidateForm.startDate"
              name="integralValidateForm_exchangeStartDate"
              type="date"
            />
            <span v-if="integralValidateForm.dateType===2">-</span>
            <el-date-picker
              v-if="integralValidateForm.dateType===2"
              :placeholder="$t('common_choose_date')"
              v-model="integralValidateForm.endDate"
              name="integralValidateForm_exchangeEndDateStr"
              type="date"
            />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="table">
        <el-table
          :data="integralValidateForm.productPointVOList"
          name="integralValidateForm_tableList999"
        >
          <el-table-column
            :label="$t('商品零售价')"
            prop="salePriceWithTax"
            align="center"
            min-width="80"
          />
          <el-table-column align="center" min-width="300">
            <template slot="header" slot-scope="scope" :scope="scope">
              <ody-tip-star :content="$t('兑换价格')" />
            </template>
            <template slot-scope="scope">
              <el-form-item
                :prop="'productPointVOList.' + scope.$index + '.point'"
                :rules="[
                  {required: true, message: placeholder, trigger: 'change'},
                  { validator: validatePass, message: placeholder, trigger: 'change' }
                ]"
                label-width="0px"
              >
                <ody-input-number
                  v-model="scope.row.point"
                  :min="1"
                  :max="9999999999"
                  :empty-tip="false"
                  :placeholder="placeholder"
                  name="scope_row['point']"
                  style="width:100px"
                />
                <span>{{ $t('积分') }}</span>
                <span v-if="integralValidateForm.type===2">+</span>
                <ody-input-number
                  v-if="integralValidateForm.type===2"
                  v-model="scope.row.amount"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  :placeholder="placeholder1"
                  name="scope_row['amount']"
                  style="width:150px"
                />
                <span v-if="integralValidateForm.type===2">{{ $t('元') }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('总兑换数量限制')" align="center" min-width="100">
            <template slot-scope="scope">
              <el-form-item
                :prop="'productPointVOList.' + scope.$index + '.totalNum'"
                label-width="0px"
              >
                <ody-input-number
                  v-model="scope.row.totalNum"
                  :min="1"
                  :max="99999999"
                  :empty-tip="false"
                  :placeholder="placeholder"
                  name="scope_row['totalNum']"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column :label="$t('每人兑换数量限制')" align="center" min-width="100">
            <template slot-scope="scope">
              <el-form-item
                :prop="'productPointVOList.' + scope.$index + '.exchangeNum'"
                label-width="0px"
              >
                <ody-input-number
                  v-model="scope.row.exchangeNum"
                  :min="1"
                  :max="99999999"
                  :empty-tip="false"
                  :placeholder="placeholder"
                  name="scope_row['exchangeNum']"
                />
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
      <el-button
        :loading="saveing"
        name="ExchangeIntegralSetting_handleSave"
        type="primary"
        @click="handleSave('integralValidateForm')"
      >{{ $t('commission_save') }}</el-button>
    </span>
  </ody-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    storeMpId: {
      type: Number,
      default: null
    },
    typeOfProduct: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      saveing: false,
      integralValidateForm: {
        productPointVOList: [],
        type: null,
        dateType: null,
        startDate: null,
        endDate: null,
        startDateStr: null,
        endDateStr: null
      }
    }
  },
  computed: {
    rateMax1() {
      return 9999999999
    },
    placeholder() {
      return this.$t('应输入1至9999999999的整数')
    },
    placeholder1() {
      return this.$t('应输入0至9999999的数字,小数点最多保留2位')
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入兑换价格'))
      } else {
        if (+value > this.rateMax1 || +value <= 0) {
          callback(new Error(this.placeholder))
        } else {
          callback()
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleSave(integralValidateForm) {
      if (this.saveing) {
        return
      }
      this.saveing = true
      try {
        const vue = this
        this.$refs[integralValidateForm].validate(valid => {
          // console.log(valid)
          if (valid) {
            if (vue.integralValidateForm.dateType === 2) {
              if (!vue.integralValidateForm.startDate) {
                vue.$message({
                  type: 'error',
                  message: vue.$t('请选择限制时间开始时间')
                })
                return
              }

              if (!vue.integralValidateForm.endDate) {
                vue.$message({
                  type: 'error',
                  message: vue.$t('请选择限制时间结束时间')
                })
                return
              }
              var dateNow = vue.$portal.parseTime(new Date(), '{y}-{m}-{d}')
              var shelfTime = vue.$portal.parseTime(
                vue.integralValidateForm.endDate,
                '{y}-{m}-{d}'
              )
              if (shelfTime < dateNow) {
                vue.$message({
                  type: 'error',
                  message: vue.$t('限制时间结束时间不能小于当前时间')
                })
                return
              }
              var startTime = vue.$portal.parseTime(
                vue.integralValidateForm.startDate,
                '{y}-{m}-{d}'
              )
              var endTime = vue.$portal.parseTime(
                vue.integralValidateForm.endDate,
                '{y}-{m}-{d}'
              )

              if (startTime > endTime) {
                vue.$message({
                  type: 'error',
                  message: vue.$t('限制时间开始时间不能大于限制时间结束时间')
                })
                return
              }
            }
            if (vue.integralValidateForm.dateType === 1) {
              vue.integralValidateForm.startDate = null
              vue.integralValidateForm.endDate = null
            }
            var amountflag = true
            var exchangeNumflag = true
            vue.integralValidateForm.productPointVOList.every(item => {
              if (vue.integralValidateForm.type === 2) {
                if (!item.amount) {
                  amountflag = false
                }
              }
              if (vue.integralValidateForm.type === 1) {
                if (item.amount) {
                  item.amount = null
                }
              }
              if (vue.integralValidateForm.dateType === 1) {
                if (item.startDate) {
                  item.startDate = null
                }
                if (item.endDate) {
                  item.endDate = null
                }
              }
              if (vue.integralValidateForm.dateType === 2) {
                item.startDate = vue.integralValidateForm.startDate
                item.endDate = vue.integralValidateForm.endDate
              }
              if (+item.exchangeNum > +item.totalNum) {
                exchangeNumflag = false
              }
              item.type = vue.integralValidateForm.type
              item.dateType = vue.integralValidateForm.dateType
            })

            if (!amountflag) {
              vue.$message.error('请输入兑换金额')
              return
            }
            if (!exchangeNumflag) {
              vue.$message.error('每人兑换数量限制不能大于总兑换数量限制')
              return
            }

            const pointRequest = vue.$product.$api.pointApi
            pointRequest
              .saveOrUpdateProductPoint(vue.integralValidateForm)
              .then(result => {
                if (result && result.code === '0') {
                  vue.$emit('update:visible', !vue.visible)
                  vue.$emit('ok', [])
                  vue.$message({
                    type: 'success',
                    message: vue.$t('common_operate_success') + '，' + vue.$t('如果修改了积分或者金额需要审核才能生效')
                  })
                }
              })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      } finally {
        this.saveing = false
      }
    },
    async init() {
      if (this.storeMpId) {
        const queryParams = {}
        queryParams.merchantProductId = this.storeMpId
        queryParams.typeOfProduct = this.typeOfProduct
        const result = await this.$product.$api.pointApi.getProductPointByMpId(
          queryParams
        )
        if (result && result.code === '0') {
          this.integralValidateForm = result.data
          if (!this.integralValidateForm.type) {
            this.integralValidateForm.type = 1
          }
          if (!this.integralValidateForm.dateType) {
            this.integralValidateForm.dateType = 1
          }
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
