<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :title="$t('批量设置餐饮作业区域')"
      class="product-list-dialog"
      width="600px"
      @open="init"
    >
      <section>
        <el-form ref="zoneForm" :model="zoneForm" :rules="rules" label-width="120px">
          <el-form-item
            :label="$t('餐饮作业区域')"
            :rules=" {required: true, message: $t('请选择餐饮区域'), trigger: 'change'}"
            prop="operationAreaCode"
          >
            <el-select v-model="zoneForm.operationAreaCode" :placeholder="$t('please_choose')" name="zoneForm_operationAreaCode">
              <el-option
                v-for="item in locationCodeList"
                :key="item.code"
                :label="item.locationName"
                :value="item.code"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <el-button name="StoreProductListBatchZone_submitForm" size="small" type="primary" code="StoreProductListBatchZone" @click="submitForm('zoneForm')">{{ $t('确认') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>
<script>
export default {
  props: {
    ids: {
      type: Array,
      default: null
    },
    storeId: {
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
      locationCodeList: [],
      zoneForm: {
        mpIdList: [],
        operationAreaCode: null
      }
    }
  },
  methods: {
    init() {
      this.zoneForm.mpIdList = this.ids
      if (this.storeId) {
        const params = {}
        params.storeId = this.storeId
        this.$product.$api.common.queryStoreLocation(params).then(result => {
          if (result && result.code === '0') {
            this.locationCodeList = result.data
          }
        })
      }
    },
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    submitForm(zoneForm) {
      this.$refs['zoneForm'].validate(valid => {
        if (valid) {
          this.$product.$api.mpApi.updateStoreMpOperateZone(this.zoneForm)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['zoneForm'].resetFields()
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
