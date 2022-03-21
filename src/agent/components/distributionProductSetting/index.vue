<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleClose"
      :title="$t('设置商品信息')"
      width="900px"
      @open="init"
    >
      <el-form ref="dpsForm" :model="dpsForm" label-position="right" label-width="80px">
        <el-form-item :label="$t('product_code')" prop="mpCode">
          <span>{{ dpsForm.mpCode }}</span>
        </el-form-item>
        <el-form-item :label="$t('product_name')" prop="mpName">
          <span>{{ dpsForm.mpName }}</span>
        </el-form-item>
        <el-form-item :label="$t('merchant_name')" prop="merchantName">
          <span>{{ dpsForm.merchantName }}</span>
        </el-form-item>
        <el-form-item :label="$t('store_name')" prop="storeName">
          <span>{{ dpsForm.storeName }}</span>
        </el-form-item>
        <el-form-item
          :label="$t('expiry_date')"
          :rules="{
            required: true,
            message: this.$t('请选择有效期类型'),
            trigger: 'change'
          }"
          prop="expiryDateType"
        >
          <el-radio-group v-model="dpsForm.expiryDateType" name="dpsForm_expiryDateType">
            <el-radio :label="1">{{ $t('permanent_validity') }}</el-radio>
            <el-radio :label="2">
              {{ $t('messageEdit.appointTime') }}
              <el-date-picker
                :disabled="dpsForm.expiryDateType===1"
                :placeholder="$t('common_choose_date')"
                v-model="dpsForm.expiryStartTimeStr"
                name="dpsForm_expiryStartTimeStr"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
              />
              <span>-</span>
              <el-date-picker
                :disabled="dpsForm.expiryDateType===1"
                :placeholder="$t('common_choose_date')"
                v-model="dpsForm.expiryEndTimeStr"
                name="dpsForm_expiryEndTimeStr"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
              />
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          :label="$t('commission_set')"
          :rules="{
            required: true,
            message: this.$t('请选择分佣设置'),
            trigger: 'change'
          }"
          prop="commissionRateType"
        >
          <el-radio-group
            v-model="dpsForm.commissionRateType"
            name="dpsForm_commissionRateType"
            @change="changeRateType(dpsForm.commissionRateType)"
          >
            <el-radio :label="1">{{ $t('common_default') }}</el-radio>
            <el-radio :label="2">{{ $t('custom') }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <div v-if="dpsForm.commissionRateType==2">
          <el-table v-loading="loading" :data="dpsForm.list" name="dpsForm_list835" width="100%">
            <el-table-column :label="$t('等级名称')" prop="levelName" align="center" width="200" />
            <el-table-column :label="$t('一级销售佣金')" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.' + scope.$index + '.primarySaleCom'"
                  :rules="[
                    {required: true, message: placeholder, trigger: 'change'},
                    { validator: validatePass, message: placeholder, trigger: 'change' }
                  ]"
                  label-width="0px"
                >
                  <ody-input-number
                    v-model="scope.row.primarySaleCom"
                    :decimal="rateDecimal"
                    :min="0"
                    :max="rateMax"
                    :controls="false"
                    :placeholder="placeholder"
                    name="scope_row_primarySaleCom"
                  />
                  &nbsp;{{ dpsForm.comCalcType === 0 ? '%' : $t('元') }}
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('二级销售佣金')" align="center">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'list.' + scope.$index + '.secondarySaleCom'"
                  :rules="[
                    {required: true, message: placeholder, trigger: 'change'},
                    { validator: validatePass, message: placeholder, trigger: 'change' }
                  ]"
                  label-width="0px"
                >
                  <ody-input-number
                    v-model="scope.row.secondarySaleCom"
                    :decimal="rateDecimal"
                    :min="0"
                    :max="rateMax"
                    :controls="false"
                    :placeholder="placeholder"
                    name="scope_row_secondarySaleCom"
                  />
                  &nbsp;{{ dpsForm.comCalcType === 0 ? '%' : $t('元') }}
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <el-form-item
          :rules="{
            required: true,
            message: this.$t('请输入优先级'),
            trigger: 'blur'
          }"
          prop="priority"
        >
          <template slot="label">
            <el-tooltip
              :content="$t('前端排序优先级，支持输入大于等于0的整数，数字越大优先级越高，排序值相同按添加商品顺序')"
              class="item"
              effect="dark"
              placement="bottom-start"
            >
              <i class="el-icon-question" />
            </el-tooltip>
            <span>{{ $t('priority') }}</span>
          </template>
          <ody-input-number
            v-model="dpsForm.priority"
            :min="0"
            :max="999999"
            name="dpsForm_priority"
          />
        </el-form-item>
        <!-- <el-form-item>
          <span style="color:red">* {{ $t('前端排序优先级，支持输入大于等于0的整数，数字越大优先级越高，排序值相同按添加商品顺序') }}</span>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" @click="handleClose">{{ $t('common_cancel') }}</el-button>
        <ody-button
          name="DistributionProductSet_handleSave"
          type="primary"
          code="DistributionProductSet"
          @click="handleSave('dpsForm')"
        >{{ $t('commission_save') }}</ody-button>
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
    id: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      dpsForm: {
        id: null,
        mpId: null,
        mpCode: null,
        mpName: null,
        merchantName: null,
        storeName: null,
        expiryDateType: null,
        expiryStartTimeStr: null,
        expiryEndTimeStr: null,
        commissionRateType: null,
        priority: null,
        list: [],
        comCalcType: 0
      }
    }
  },
  computed: {
    rateMax() {
      return this.dpsForm.comCalcType === 0 ? '50.0' : '1000.00'
    },
    rateMax1() {
      return this.dpsForm.comCalcType === 0 ? 50.0 : 1000
    },
    rateDecimal() {
      return this.dpsForm.comCalcType === 0 ? 1 : 2
    },
    placeholder() {
      return this.dpsForm.comCalcType === 0
        ? this.$t('应输入0.0至50.0的数字，小数点最多保留1位')
        : this.$t('应输入0.00至1000.00的数字，小数点最多保留2位')
    }
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入一级销售佣金'))
      } else {
        if (+value > this.rateMax1 || +value < 0) {
          callback(new Error(this.placeholder))
        } else {
          callback()
        }
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    async handleSave(dpsForm) {
      const vue = this
      this.$refs[dpsForm].validate(valid => {
        // console.log(valid)
        if (valid) {
          if (vue.dpsForm.expiryDateType === 2) {
            if (!vue.dpsForm.expiryStartTimeStr) {
              vue.$message({
                type: 'error',
                message: vue.$t('请选择指定时间开始时间')
              })
              return
            }

            if (!vue.dpsForm.expiryEndTimeStr) {
              vue.$message({
                type: 'error',
                message: vue.$t('请选择指定时间结束时间')
              })
              return
            }
            var dateNow = vue.$portal.parseTime(
              new Date(),
              '{y}-{m}-{d} {h}:{i}'
            )
            var shelfTime = vue.$portal.parseTime(
              vue.dpsForm.expiryEndTimeStr,
              '{y}-{m}-{d} {h}:{i}'
            )
            if (shelfTime < dateNow) {
              vue.$message({
                type: 'error',
                message: vue.$t('指定时间结束时间不能小于当前时间')
              })
              return
            }
            if (vue.dpsForm.expiryStartTimeStr > vue.dpsForm.expiryEndTimeStr) {
              vue.$message({
                type: 'error',
                message: vue.$t('指定时间开始时间不能大于指定时间结束时间')
              })
              return
            }
            if (
              vue.dpsForm.expiryStartTimeStr === vue.dpsForm.expiryEndTimeStr
            ) {
              vue.$message({
                type: 'error',
                message: vue.$t('指定时间开始时间不能等于指定时间结束时间')
              })
              return
            }
          }
          const dpsRequest = vue.$agent.$api.distributionProduct
          dpsRequest.update(vue.dpsForm).then(result => {
            if (result && result.code === '0') {
              vue.$emit('update:visible', !vue.visible)
              vue.$emit('ok', [])
              vue.$message({
                type: 'success',
                message: vue.$t('common_operate_success')
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    changeRateType(commissionRateType) {
      if (commissionRateType === 2) {
        if (this.dpsForm.mpId) {
          const params = {}
          params.mpId = this.dpsForm.mpId
          this.$agent.$api.distributionProduct
            .getDistributionProductDefinitionRate(params)
            .then(result => {
              if (result && result.code === '0') {
                this.dpsForm.list = result.data.list
              }
            })
        }
      }
    },

    async init() {
      try {
        if (this.id) {
          const params = {}
          params.id = this.id
          this.$agent.$api.distributionProduct
            .getDistributionProductInfo(params)
            .then(result => {
              if (result && result.code === '0') {
                this.dpsForm = result.data
              }
            })
        }
      } catch (ex) {
        console.log(ex)
      }
    }
  }
}
</script>

<style scoped>
</style>
