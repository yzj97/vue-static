<template>
  <div>
    <!-- 多规格商品 -->
    <ody-dialog :visible.sync="visible" :before-close="handleClose" width="72%" @open="init">
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
                    <template slot="append">{{ $t('已冻结') }} {{ scope.row.freezeStockNum }} {{ $t('件') }}</template>
                  </ody-input-number>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('自动更新库存')" min-width="60px">
              <template slot-scope="scope">
                <el-form-item
                  slot="autoUpdateStatus"
                  :prop="'stockInfoList.' + scope.$index + '.autoUpdateStatus'"
                >
                  <el-switch
                    :active-value="'0'"
                    :inactive-value="'1'"
                    v-model="scope.row.autoUpdateStatus"
                    :active-text="scope.row.autoUpdateStatus === '1' ? $t('停用') : $t('启用')"
                    name="scope_row_autoUpdateStatus"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('每日自动更新到（件）')" min-width="85px">
              <template slot-scope="scope">
                <el-form-item
                  v-if="scope.row.autoUpdateStatus === '0'"
                  slot="autoUpdateStockNum"
                  :prop="'stockInfoList.' + scope.$index + '.autoUpdateStockNum'"
                  :rules="{ required: true, message: $t('请输入自动更新库存数量'),trigger: 'change'}"
                >
                  <ody-input-number
                    v-model="scope.row.autoUpdateStockNum"
                    :decimal="2"
                    :min="0.01"
                    :max="999999"
                    :placeholder="$t('大于0,保留两位小数')"
                    name="scope_row_autoUpdateStockNum"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('有效期开始日期')" min-width="125px">
              <template slot-scope="scope">
                <el-form-item
                  v-if="scope.row.autoUpdateStatus === '0'"
                  slot="autoUpdateValidityTimeStart"
                  :prop="'stockInfoList.' + scope.$index + '.autoUpdateValidityTimeStart'"
                  :rules="{ required: true, message: $t('选择库存有效期开始日期'),trigger: 'change'}"
                >
                  <el-date-picker
                    v-model="scope.row.autoUpdateValidityTimeStart"
                    :placeholder="$t('选择日期')"
                    name="scope_row_autoUpdateValidityTimeStart"
                    type="date"
                  />
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column :label="$t('有效期结束日期')" min-width="125px">
              <template slot-scope="scope">
                <el-form-item
                  v-if="scope.row.autoUpdateStatus === '0'"
                  slot="autoUpdateValidityTimeEnd"
                  :prop="'stockInfoList.' + scope.$index + '.autoUpdateValidityTimeEnd'"
                  :rules="{ required: true, message: $t('选择库存有效期结束日期'),trigger: 'change'}"
                >
                  <el-date-picker
                    v-model="scope.row.autoUpdateValidityTimeEnd"
                    :placeholder="$t('选择日期')"
                    name="scope_row_autoUpdateValidityTimeEnd"
                    type="date"
                  />
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
      if (this.storeMpId) {
        const params = {}
        params.id = this.storeMpId
        this.$product.$api.mpApi
          .listStoreProductStockById(params)
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
            .updateStoreMpStock(this.multiplyStockForm.stockInfoList)
            .then(result => {
              if (result && result.code === '0') {
                this.$emit('update:visible', !this.visible)
                this.$refs['multiplyStockForm'].resetFields()
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
</style>
