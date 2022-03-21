<template>
  <el-col :offset="3">
    <el-form
      ref="form"
      :disabled="disabled"
      :model="paramJson"
      :rules="detailRule"
      label-width="300px"
      class="form"
      label-position="right">
      <el-form-item prop="registerValue">
        <el-checkbox v-model="paramJson.registerOn" name="paramJson_registerOn"/>
        <span>{{ $t('邀请新人注册') + '，' + $t('送') + ':' }}</span>
        <el-input v-model="paramJson.registerValue" name="paramJson_registerValue" style="width: 120px" maxlength="10"/>
        <span style="margin-left: 10px">{{ $t('积分') }}</span>
      </el-form-item>
      <el-form-item prop="orderValue">
        <el-checkbox v-model="paramJson.orderOn" name="paramJson_orderOn"/>
        <span>{{ $t('被邀请人完成首次下单后') + '，' + $t('送订单金额对应积分值的') + ':' }}</span>
        <el-input v-model="paramJson.orderValue" name="paramJson_orderValue" style="width: 120px" maxlength="10"/>
        <span style="margin-left: 10px">{{ $t('倍积分') }}</span>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      default: function() {
        return null
      }
    },
    disabled: {
      type: Object,
      default: function() {
        return true
      }
    }
  },
  data() {
    return {
      paramJson: {
        registerOn: false,
        registerValue: false,
        orderOn: null,
        orderValue: null
      },
      detailRule: {
        orderValue: [
          { validator: this.checkOrderValue, trigger: 'change' }
        ],
        registerValue: [
          { validator: this.checkRegisterValue, trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    if (this.param) {
      this.paramJson = this.$portal.deepClone(this.param)
    }
  },
  methods: {
    validateData() {
      if (this.paramJson.registerOn !== true && this.paramJson.orderOn !== true) {
        this.$message({
          type: 'warn',
          message: this.$t('请至少勾选一种规则')
        })
        return false
      }
      return true
    },
    getParamJson() {
      if (!this.paramJson.registerOn) {
        this.paramJson.registerOn = false
      }
      if (!this.paramJson.orderOn) {
        this.paramJson.orderOn = false
      }
      return this.paramJson
    },
    checkRegisterValue(rule, value, callback) {
      if (this.paramJson.registerOn === true) {
        if (!/^[1-9][0-9]{0,9}$/.test(this.paramJson.registerValue)) {
          return callback(new Error(this.$t('最大10位正整数')))
        }
      }
      return callback()
    },
    checkOrderValue(rule, value, callback) {
      if (this.paramJson.orderOn === true) {
        if (!/^[1-9][0-9]{0,9}$/.test(this.paramJson.orderValue)) {
          return callback(new Error(this.$t('最大10位正整数')))
        }
      }
      return callback()
    }
  }
}
</script>

<style scoped>

</style>
