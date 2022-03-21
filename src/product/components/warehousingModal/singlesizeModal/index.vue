<template>
  <div>
    <ody-dialog :visible.sync="visible" :before-close="handleClose" width="800px" @open="init">
      <section>
        <el-form ref="singleStockForm" :model="singleStockForm" :rules="rules" label-width="150px">
          <el-form-item :label="$t('当前库存')" prop="virtualStockNum">
            <ody-input-number
              v-model="singleStockForm.virtualStockNum"
              :min="0"
              :max="999999"
              :placeholder="$t('请输入大于等于0的正整数')"
              name="singleStockForm_virtualStockNum"
            />
            <span>已冻结 {{ singleStockForm.freezeStockNum }} 件</span>
          </el-form-item>
          <el-form-item :label="$t('自动更新库存')">
            <el-switch
              :active-value="'0'"
              :inactive-value="'1'"
              :active-text="singleStockForm.autoUpdateStatus === '1' ? $t('停用') : $t('启用')"
              v-model="singleStockForm.autoUpdateStatus"
              name="singleStockForm_autoUpdateStatus"
            />
          </el-form-item>
          <el-form-item
            v-if="singleStockForm.autoUpdateStatus==='0'"
            :label="$t('每日自动更新到(件)')"
            prop="autoUpdateStockNum"
          >
            <ody-input-number
              v-model="singleStockForm.autoUpdateStockNum"
              :decimal="2"
              :min="0.01"
              :max="999999"
              :placeholder="$t('大于0,保留两位小数')"
              name="singleStockForm_autoUpdateStockNum"
            />
          </el-form-item>
          <el-form-item
            v-if="singleStockForm.autoUpdateStatus==='0'"
            :label="$t('有效期开始日期')"
            prop="autoUpdateValidityTimeStart"
          >
            <el-date-picker
              v-model="singleStockForm.autoUpdateValidityTimeStart"
              :placeholder="$t('选择日期')"
              name="singleStockForm_autoUpdateValidityTimeStart"
              type="date"
            />
          </el-form-item>

          <el-form-item
            v-if="singleStockForm.autoUpdateStatus==='0'"
            :label="$t('有效期结束日期')"
            prop="autoUpdateValidityTimeEnd"
          >
            <el-date-picker
              v-model="singleStockForm.autoUpdateValidityTimeEnd"
              :placeholder="$t('选择日期')"
              name="singleStockForm_autoUpdateValidityTimeEnd"
              type="date"
            />
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button :disabled="submitFlag" name="StoreProductListUpdateStock_submitForm" size="small" type="primary" code="StoreProductListUpdateStock" @click="submitForm('singleStockForm')">{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    storeMpId: {
      type: Number,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      singleStockForm: {
        virtualStockNum: null,
        freezeStockNum: null,
        autoUpdateStockNum: null,
        autoUpdateStatus: null,
        storeMpId: null,
        virtualStockId: null,
        autoUpdateId: null,
        autoUpdateValidityTimeStart: null,
        autoUpdateValidityTimeEnd: null
      },
      submitFlag: false,
      rules: {
        virtualStockNum: [
          {
            required: true,
            message: this.$t('请输入库存数量'),
            trigger: 'change'
          }
        ],
        autoUpdateStockNum: [
          {
            required: true,
            message: this.$t('请输入每天自动更新库存数量'),
            trigger: 'change'
          }
        ],
        autoUpdateValidityTimeStart: [
          {
            required: true,
            message: this.$t('请选择有效期开始日期'),
            trigger: 'change'
          }
        ],
        autoUpdateValidityTimeEnd: [
          {
            required: true,
            message: this.$t('请选择有效期结束日期'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['singleStockForm'].resetFields()
    },
    init() {
      this.submitFlag = false
      if (this.storeMpId) {
        const params = {}
        params.id = this.storeMpId
        this.$product.$api.mpApi
          .listStoreProductStockById(params)
          .then(result => {
            if (result && result.code === '0') {
              this.singleStockForm = result.data[0]
            }
          })
      }
    },
    submitForm(singleStockForm) {
      this.$refs['singleStockForm'].validate(valid => {
        if (valid) {
          if (
            this.singleStockForm.autoUpdateStatus === '0' &&
            this.singleStockForm.autoUpdateValidityTimeStart >
            this.singleStockForm.autoUpdateValidityTimeEnd
          ) {
            this.$message({
              type: 'warning',
              message: this.$t('有效期的开始时间不能大于有效期的结束时间')
            })
            return
          }
          this.submitFlag = true
          const paramsList = []
          paramsList.push(this.singleStockForm)
          this.$product.$api.mpApi
            .updateStoreMpStock(paramsList)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['singleStockForm'].resetFields()
                this.$emit('ok', [])
              }
            }).finally(res => {
              this.submitFlag = false
            })
        } else {
          this.submitFlag = false
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
