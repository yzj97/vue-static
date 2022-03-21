<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="$t('指定订单号查询')"
      width="600px"
      @open="init">
      <el-form ref="assignForm" label-width="100px" label-position="top" class="form">
        <el-form-item>
          <el-radio v-model="formData.type" name="formData_type" label="1">{{ $t('中台订单号') }}</el-radio>
          <el-radio v-model="formData.type" name="formData_type2" label="2">{{ $t('外部订单号') }}</el-radio>
        </el-form-item>
        <el-form-item v-if="formData.type === '1'" :label="$t('请在下面文本框中输入订单号,每行一个订单号，最多5000行。')">
          <el-input :autosize="{ minRows: 10, maxRows: 15}" v-model="formData.orderCodes" name="formData_orderCodes" type="textarea" />
        </el-form-item>
        <el-form-item v-if="formData.type === '2'" :label="$t('请在下面文本框中输入外部订单号,每行一个外部订单号，最多5000行。')">
          <el-input :autosize="{ minRows: 10, maxRows: 15}" v-model="formData.outOrderCodes" name="formData_outOrderCodes" type="textarea" />
        </el-form-item>
      </el-form>
      <span slot="footer">
        <ody-button code="ui" name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</ody-button>
        <ody-button code="ui" name="handleQuery" size="small" type="primary" @click="handleQuery">{{ $t('查询') }}</ody-button>
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
    }
  },
  data() {
    return {
      formData: {
        type: '1',
        orderCodes: '',
        outOrderCodes: ''
      }
    }
  },
  mounted() {
  },
  methods: {
    init() {
    },
    handleClear() {
      this.formData.orderCodes = ''
      this.formData.outOrderCodes = ''
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    handleQuery() {
      const params = {}
      params.type = this.formData.type
      if (this.formData.type === '1') {
        if (this.formData.orderCodes) {
          params.orderCodes = this.formData.orderCodes.split(/[(\r\n)\r\n]+/)
        }
      } else {
        if (this.formData.outOrderCodes) {
          params.outOrderCodes = this.formData.outOrderCodes.split(/[(\r\n)\r\n]+/)
        }
      }
      this.$emit('ok', params)
      this.$emit('update:visible', !this.visible)
    }
  }
}
</script>

<style scoped>

</style>
