<template>
  <div>
    <!-- 多规格商品 -->
    <ody-dialog :title="$t('店铺库存设置')" :visible.sync="visible" :before-close="handleClose" width="72%" @open="init">
      <section>
        <el-form
          ref="multiplyStockForm"
          :model="multiplyStockForm"
          label-width="120px"
        >
          <el-table :data="multiplyStockForm.stockInfoList" name="multiplyStockForm_stockInfoList163">
            <el-table-column :label="$t('SKU编码')" prop="code" label-width="100px" min-width="80px"/>
            <el-table-column :label="$t('规格属性')" prop="saleAttribute" min-width="100px"/>
            <el-table-column :label="$t('当前库存')" min-width="140px">
              <template slot-scope="scope">
                <el-form-item
                  slot="virtualStockNum"
                  :prop="'stockInfoList.' + scope.$index + '.virtualStockNum'"
                  :rules="{ required: true, message: $t('请输入库存数量'),trigger: 'change'}"
                >
                  <ody-input-number
                    v-model="scope.row.virtualStockNum"
                    :min="0"
                    :max="999999"
                    :placeholder="$t('请输入大于等于0的正整数')"
                    name="scope_row_virtualStockNum"
                  >
                    <template slot="append" >
                      <div class="flex-append">
                        <div class="flex-append_left">{{ $t('已锁定') }} {{ scope.row.lockingStockNum }} {{ $t('件') }}</div>
                        <div>{{ $t('已冻结') }} {{ scope.row.freezeStockNum }} {{ $t('件') }}</div>
                      </div>
                    </template>
                  </ody-input-number>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleClose" size="small" @click="handleClose">{{ $t('取消') }}</el-button>
        <ody-button
          :disabled="submitFlag"
          name="StoreProductListUpdateStock_submitForm"
          size="small"
          type="primary"
          code="StoreProductListUpdateStock"
          @click="submitForm('multiplyStockForm')"
        >{{ $t('确认') }}</ody-button>
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
      multiplyStockForm: {
        stockInfoList: []
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
            message: this.$t('请输入自动更新的库存数量'),
            trigger: 'change'
          }
        ],
        autoUpdateValidityTimeStart: [
          {
            required: true,
            message: this.$t('请输入有效期的开始时间'),
            trigger: 'change'
          }
        ],
        autoUpdateValidityTimeEnd: [
          {
            required: true,
            message: this.$t('请输入有效期的结束时间'),
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
      this.$refs['multiplyStockForm'].resetFields()
    },
    init() {
      this.submitFlag = false
      this.multiplyStockForm.stockInfoList = []
      if (this.storeMpId) {
        const params = {}
        params.id = this.storeMpId
        this.$product.$api.mpApi
          .listStoreProductStockByIdNew(params)
          .then(result => {
            if (result && result.code === '0') {
              this.multiplyStockForm.stockInfoList = result.data
            }
          })
      }
    },
    submitForm(multiplyStockForm) {
      this.$refs['multiplyStockForm'].validate(valid => {
        if (valid) {
          for (var i = 0; i < this.multiplyStockForm.stockInfoList.length; i++) {
            const item = this.multiplyStockForm.stockInfoList[i]
            if (item.autoUpdateStatus === '0') {
              if (item.autoUpdateValidityTimeStart > item.autoUpdateValidityTimeEnd) {
                const t = i + 1
                this.$message(
                  '第' + t + '行有效期的开始时间不能大于有效期的结束时间'
                )
                return
              }
            }
          }
          this.submitFlag = true
          this.$product.$api.mpApi
            .updateStoreMpStockNew(this.multiplyStockForm.stockInfoList)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                /* this.$refs['multiplyStockForm'].resetFields()*/
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
.warehousingSku-switch {
  padding-left: 10px;
}
/deep/.el-form-item__content {
  margin-left: 0px !important;
}
/deep/.warehousingSku-el-input {
  display: flex;
  .el-input__inner {
    width: 100px !important;
  }
}
.botton-form {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}
  .flex-append{
    height: 32px;
    display: flex;
    align-items: center;
  }
.flex-append_left{
  margin-right: 10px;
  padding-right: 10px;
  border-right: 1px solid #D9D9D9;
}

</style>
