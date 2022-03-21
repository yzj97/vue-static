<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="type===1 ? $t('批量上架店铺商品') : $t('批量下架店铺商品')"
      class="product-list-dialog"
      width="600px"
    >
      <section>
        <el-form ref="batchCansaleForm" :model="batchCansaleForm" :rules="rules" class="form">
          <div class="content-up">
            <div v-if="type===1">
              <el-form-item prop="chooseFlag">
                <el-radio-group v-model="batchCansaleForm.chooseFlag" name="batchCansaleForm_chooseFlag" @change="changeFlag">
                  <el-radio :label="2">{{ $t('仅上架选中的商品') }}</el-radio>
                  <el-radio :label="3">{{ $t('自定义需要上架的商品') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div v-if="type===0">
              <el-form-item prop="chooseFlag">
                <el-radio-group v-model="batchCansaleForm.chooseFlag" name="batchCansaleForm_chooseFlag9" @change="changeFlag">
                  <el-radio :label="2">{{ $t('仅下架选中的商品') }}</el-radio>
                  <el-radio :label="3">{{ $t('自定义需要下架的商品') }}</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <el-form-item v-if="batchCansaleForm.chooseFlag==3" prop="codes" class="input-box">
              <div v-if="type===1" >{{ $t('请在下面文本框中输入需要上架的商品，每行一个商品编码（仅允许输入SPU编码），最多1000行。') }}</div>
              <div v-if="type===0" >{{ $t('请在下面文本框中输入需要下架的商品，每行一个商品编码（仅允许输入SPU编码），最多1000行。') }}</div>
              <el-input
                v-model="batchCansaleForm.codes"
                :placeholder="$t('每行输入一个SPU，最多输入1000行')"
                name="batchCansaleForm_codes"
                type="textarea"
              />
            </el-form-item>
          </div>
          <div class="content-title">
            <div v-if="type===1" >{{ $t('说明') }}：1.{{ $t('根据所选商品查询到所有的店铺商品并执行上架操作') }} 2.{{ $t('如果操作的是多规格商品，下面的所有SKU一并改为上架状态') }}</div>
            <div v-if="type===0" >{{ $t('说明') }}：1.{{ $t('根据所选商品查询到所有的店铺商品并执行下架操作') }} 2.{{ $t('如果操作的是多规格商品，下面的所有SKU一并改为下架状态') }}</div>
          </div>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button
          v-if="type===1"
          name="MerchantProductManageCanSale_submitForm"
          size="small"
          type="primary"
          code="MerchantProductManageCanSale"
          @click="submitForm('batchCansaleForm')"
        >{{ $t('确认') }}</ody-button>
        <ody-button
          v-if="type===0"
          name="MerchantProductManageCanNotSale_submitForm"
          size="small"
          type="primary"
          code="MerchantProductManageCanNotSale"
          @click="submitForm('batchCansaleForm')"
        >{{ $t('确认') }}</ody-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: Number,
      default: null
    },
    ids: {
      type: Array,
      default: null
    },
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      batchCansaleForm: {
        chooseFlag: 2,
        codes: ''
      },
      rules: {
        codes: [
          {
            required: true,
            message: this.$t('请输入自定义商品SPU编码'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['batchCansaleForm'].resetFields()
    },
    submitForm(batchCansaleForm) {
      if (this.batchCansaleForm.chooseFlag === 2 && this.ids.length <= 0) {
        this.$message({
          type: 'warning',
          message: this.$t('请选择商品信息')
        })
        return
      }
      this.$refs['batchCansaleForm'].validate(valid => {
        if (valid) {
          let codelList = []
          if (this.batchCansaleForm.chooseFlag === 3) {
            codelList = this.batchCansaleForm.codes
              .trim()
              .split(/\n/)
              .map(x => x.trim())
            console.info(codelList)
            if (codelList.length > 1000) {
              this.$message({
                type: 'warning',
                message: this.$t('SPU编码数量超过1000个')
              })
              return
            }
          }
          const submitParams = {
            mpIdList: [],
            mpCodeList: [],
            canSale: null
          }
          submitParams.canSale = this.type
          if (this.batchCansaleForm.chooseFlag === 2) {
            submitParams.mpIdList = this.ids
          } else {
            submitParams.mpCodeList = codelList
          }
          this.$product.$api.mpApi
            .storeMpCanSaleByMpInfo(submitParams)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['batchCansaleForm'].resetFields()
                this.$emit('ok', [])
              }
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.product-list-dialog {
  .content {
    padding-bottom: 100px;
  }
  .content-title {
    margin-top: 20px;
    line-height: 32px;
    background: #F9F9F9
  }
  .input-box {
    margin-top: 20px;
  }
}
</style>
