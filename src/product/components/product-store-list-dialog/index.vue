<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="$t('批量设置运费模板')"
      class="product-list-dialog"
      width="600px"
      @open="init"
    >
      <section>
        <el-form ref="templateForm" :model="templateForm" :rules="rules" label-width="120px">
          <div class="content-title">
            <el-form-item
              :label="$t('freight_formwork')"
              :rules="{required: true, message: $t('please_choose_the_shipping_template'), trigger: 'change'} "
              prop="freightTemplateId"
            >
              <el-select v-model="templateForm.freightTemplateId" :placeholder="$t('please_choose')" name="templateForm_freightTemplateId">
                <el-option
                  v-for="item in templateList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="StoreProductListBatchTemplate_submitForm" size="small" type="primary" code="StoreProductListBatchTemplate" @click="submitForm('templateForm')">{{ $t('确认') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    merchantId: {
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
      templateList: [],
      templateForm: {
        mpIdList: [],
        freightTemplateId: null
      }
    }
  },
  methods: {
    init() {
      this.templateForm.mpIdList = this.ids
      if (this.merchantId) {
        const params = {}
        params.merchantId = this.merchantId
        this.$product.$api.mpApi
          .queryFreightTemplateListByMerchantId(params)
          .then(result => {
            if (result && result.code === '0') {
              this.templateList = result.data
            }
          })
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    submitForm(templateForm) {
      this.$refs['templateForm'].validate(valid => {
        if (valid) {
          this.$product.$api.mpApi.updateStoreMpFreightTemplate(this.templateForm)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['templateForm'].resetFields()
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
    line-height: 36px;
  }
}
</style>
