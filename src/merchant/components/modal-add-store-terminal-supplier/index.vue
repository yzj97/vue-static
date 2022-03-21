<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleStoreTerminalSupplierCancel"
      :title="getAddOrEdit + $t('供应商')"
      width="600px"
    >
      <el-form
        ref="storeTerminalSupplier"
        :model="storeTerminalSupplier"
        :rules="rules"
        label-position="right"
        label-width="140px"
      >
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('供应商')" prop="terminalSupplierCode">
              <ody-select2
                id="terminalSupplierCode"
                :disabled="isEdit"
                v-model="storeTerminalSupplier.terminalSupplierCode"
                :placeholder="$t('请选择')"
                name="storeTerminalSupplier_terminalSupplierCode"
                list-key="terminalSupplierList"
              />
            </el-form-item>
            <el-form-item :label="$t('对应供应商店铺ID')" prop="outerStoreCode">
              <el-input
                id="outerStoreCode"
                v-model="storeTerminalSupplier.outerStoreCode"
                name="storeTerminalSupplier_outerStoreCode"
                type="text"
                maxlength="18"
                show-word-limit
              />
            </el-form-item>
            <el-form-item :label="$t('备注')" prop="remarks">
              <el-input
                v-model="storeTerminalSupplier.remarks"
                name="storeTerminalSupplier_remarks"
                type="textarea"
                maxlength="32"
                show-word-limit
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleStoreTerminalSupplierCancel" size="mini" @click="handleStoreTerminalSupplierCancel">{{ $t('取消') }}</el-button>
        <ody-button
          id="merchantStoreListTerminalSupplier"
          name="MerchantStoreListTerminalSupplier_handleStoreTerminalSupplierSubmit"
          size="mini"
          type="primary"
          code="MerchantStoreListTerminalSupplier"
          @click="handleStoreTerminalSupplierSubmit"
        >{{ $t('确定') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import constants from '@/utils/constants'

export default {
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    storeId: {
      type: String,
      default: ''
    },
    supplierId: {
      type: Number,
      default: 0
    },
    terminalSupplierCode: {
      type: String,
      default: ''
    },
    outerStoreCode: {
      type: String,
      default: ''
    },
    remarks: {
      type: String,
      default: ''
    },
    isAvailable: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isEdit: this.supplierId !== 0,
      storeTerminalSupplier: {
        terminalSupplierCode: '',
        outerStoreCode: '',
        remarks: ''
      },
      rules: {
        terminalSupplierCode: [
          {
            required: true,
            message: this.$t('请选择供应商'),
            trigger: 'change'
          }
        ],
        outerStoreCode: [
          {
            required: true,
            message: this.$t('请输入对应供应商店铺ID'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  computed: {
    getAddOrEdit() {
      return this.isEdit ? this.$t('编辑') : this.$t('新增')
    },
    getTerminalSupplierSelectMap() {
      return constants.terminalSupplierList.reduce((rtv, item) => {
        rtv[item.value] = item.label
        return rtv
      }, {})
    }
  },
  mounted() {
    if (this.isEdit) {
      this.storeTerminalSupplier.id = this.supplierId
      this.storeTerminalSupplier.terminalSupplierCode = this.terminalSupplierCode
      this.storeTerminalSupplier.outerStoreCode = this.outerStoreCode
      this.storeTerminalSupplier.remarks = this.remarks
      this.storeTerminalSupplier.isAvailable = this.isAvailable
    }
  },
  methods: {
    handleStoreTerminalSupplierCancel() {
      this.$emit('update:visible', false)
    },
    async handleStoreTerminalSupplierSubmit() {
      const [err] = await this.formValidate('storeTerminalSupplier')
      const { ...params } = this.storeTerminalSupplier

      if (err) {
        return
      }

      params.storeId = this.storeId + ''
      params.terminalSupplierName = this.getTerminalSupplierSelectMap[
        params.terminalSupplierCode
      ]

      if (this.isEdit) {
        await this.$merchant.$api.storeService.updateStoreTerminalSupplier(
          params
        )
      } else {
        params.isAvailable = 1
        await this.$merchant.$api.storeService.addStoreTerminalSupplier(params)
      }

      this.$message({
        message: this.getAddOrEdit + this.$t('供应商') + this.$t('成功'),
        type: 'success'
      })
      this.$emit('ok')
    }
  }
}
</script>

<style scoped>
</style>
