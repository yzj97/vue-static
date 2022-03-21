<template>
  <ody-dialog
    :visible="visible"
    :before-close="handleClose"
    :title="$t('积分定价')"
    width="80%"
    @open="init"
  >
    <el-form ref="mpValidateForm" :model="mpValidateForm">
      <el-form-item
        :label="$t('兑换方式')"
        :rules="{
          required: true,
          message: this.$t('请选择兑换方式'),
          trigger: 'change'
        }"
        prop="type"
      >
        <el-radio-group v-model="mpValidateForm.type" name="mpValidateForm_type">
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
        <el-radio-group v-model="mpValidateForm.dateType" name="mpValidateForm_dateType">
          <el-radio :label="1">{{ $t('不限制') }}</el-radio>
          <el-radio :label="2">
            {{ $t('限制时间') }}
            <el-date-picker
              v-if="mpValidateForm.dateType===2"
              :placeholder="$t('common_choose_date')"
              v-model="mpValidateForm.startDate"
              name="mpValidateForm_startDate"
              type="date"
            />
            <span v-if="mpValidateForm.dateType===2">-</span>
            <el-date-picker
              v-if="mpValidateForm.dateType===2"
              :placeholder="$t('common_choose_date')"
              v-model="mpValidateForm.endDate"
              name="mpValidateForm_endDate"
              type="date"
            />
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <div class="table">
        <div class="btn">
          <el-button
            name="batchFilling"
            class="btn-left"
            type="primary"
            size="small"
            @click="batchFilling"
          >{{ $t('批量填充') }}</el-button>
        </div>

        <el-table
          :data="mpValidateForm.productPointVOList"
          name="mpValidateForm_tableList999"
          border
        >
          <el-table-column :label="$t('SKU编码')" prop="code" align="center" width="100" />
          <el-table-column :label="$t('销售属性')" prop="saleAttribute" align="center" width="200" />
          <el-table-column :label="$t('商品零售价')" prop="salePriceWithTax" align="center" width="100" />
          <el-table-column align="center" min-width="400">
            <template slot="header" slot-scope="scope">
              <div class="point">
                <ody-input-number
                  v-model="itemInfo.point"
                  :min="1"
                  :max="9999999999"
                  :empty-tip="false"
                  :placeholder="$t('所需积分')"
                  name="itemInfo_point"
                  class="require"
                  style="width:150px"
                />

                <span v-if="mpValidateForm.type===2">+</span>

                <ody-input-number
                  v-if="mpValidateForm.type===2"
                  v-model="itemInfo.amount"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  :placeholder="$t('金额')"
                  name="itemInfo_amount"
                  style="width:150px"
                />
              </div>
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
                  style="width:180px"
                />
                <span>{{ $t('积分') }}</span>
                <span v-if="mpValidateForm.type===2">+</span>
                <ody-input-number
                  v-if="mpValidateForm.type===2"
                  v-model="scope.row.amount"
                  :min="0.01"
                  :decimal="2"
                  :max="9999999"
                  :empty-tip="false"
                  :placeholder="placeholder1"
                  name="scope_row['amount']"
                  style="width:180px"
                />
                <span v-if="mpValidateForm.type===2">{{ $t('元') }}</span>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100">
            <template slot="header" slot-scope="scope">
              <ody-input-number
                v-model="itemInfo.totalNum"
                :min="1"
                :max="99999999"
                :empty-tip="false"
                :placeholder="$t('总兑换数量限制')"
                name="itemInfo_exchangeTotalQuantity"
              />
            </template>
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
                  name="scope_row['exchangeTotalQuantity']"
                />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column align="center" min-width="100">
            <template slot="header" slot-scope="scope">
              <ody-input-number
                v-model="itemInfo.exchangeNum"
                :min="1"
                :max="99999999"
                :empty-tip="false"
                :placeholder="$t('每人兑换数量限制')"
                name="itemInfo_exchangeNum"
              />
            </template>
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
        name="mpValidateForm_handleSave"
        type="primary"
        @click="handleSave('mpValidateForm')"
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
      itemInfo: {
        point: null,
        amount: null,
        totalNum: null,
        exchangeNum: null
      },
      mpValidateForm: {
        productPointVOList: [],
        type: null,
        dateType: null,
        startDate: null,
        endDate: null
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
    batchFilling() {
      this.mpValidateForm.productPointVOList.map(item => {
        for (const k in this.itemInfo) {
          if (this.itemInfo[k]) {
            item[k] = this.itemInfo[k]
          }
        }
      })
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    defaultItemInfo() {
      return {
        point: null,
        amount: null,
        totalNum: null,
        exchangeNum: null
      }
    },
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
    async handleSave(mpValidateForm) {
      const vue = this
      this.$refs[mpValidateForm].validate(valid => {
        // console.log(valid)
        if (valid) {
          if (vue.mpValidateForm.dateType === 2) {
            if (!vue.mpValidateForm.startDate) {
              vue.$message({
                type: 'error',
                message: vue.$t('请选择限制时间开始时间')
              })
              return
            }

            if (!vue.mpValidateForm.endDate) {
              vue.$message({
                type: 'error',
                message: vue.$t('请选择限制时间结束时间')
              })
              return
            }
            var dateNow = vue.$portal.parseTime(new Date(), '{y}-{m}-{d}')
            var shelfTime = vue.$portal.parseTime(
              vue.mpValidateForm.endDate,
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
              vue.mpValidateForm.startDate,
              '{y}-{m}-{d}'
            )
            var endTime = vue.$portal.parseTime(
              vue.mpValidateForm.endDate,
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

          if (vue.mpValidateForm.dateType === 1) {
            vue.mpValidateForm.startDate = null
            vue.mpValidateForm.endDate = null
          }
          var amountflag = true
          var exchangeNumflag = true
          vue.mpValidateForm.productPointVOList.every(item => {
            if (vue.mpValidateForm.type === 2) {
              if (!item.amount) {
                amountflag = false
              }
            }
            if (vue.mpValidateForm.type === 1) {
              if (item.amount) {
                item.amount = null
              }
            }
            if (vue.mpValidateForm.dateType === 1) {
              if (item.startDate) {
                item.startDate = null
              }
              if (item.endDate) {
                item.endDate = null
              }
            }
            if (vue.mpValidateForm.dateType === 2) {
              item.startDate = vue.mpValidateForm.startDate
              item.endDate = vue.mpValidateForm.endDate
            }
            if (+item.exchangeNum > +item.totalNum) {
              exchangeNumflag = false
            }
            item.type = vue.mpValidateForm.type
            item.dateType = vue.mpValidateForm.dateType
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
            .saveOrUpdateProductPoint(vue.mpValidateForm)
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
          this.mpValidateForm = result.data
        }
        if (!this.mpValidateForm.type) {
          this.mpValidateForm.type = 1
        }
        if (!this.mpValidateForm.dateType) {
          this.mpValidateForm.dateType = 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.point {
  display: flex;
  justify-content: center;
}
.require {
  position: relative;
  &::before {
    position: absolute;
    content: '*';
    color: red;
  }
}
</style>
