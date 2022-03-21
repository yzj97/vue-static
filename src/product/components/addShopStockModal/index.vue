<template>
  <div>
    <ody-dialog
      :visible.sync="stockVisible"
      :title="$t('添加店铺库存')"
      width="600px"
      @close="handleHideDialog"
    >
      <el-form
        slot="content"
        ref="shopForm"
        :model="shopData"
        :rules="shopRules"
        label-width="150px"
      >
        <el-form-item :label="$t('店铺')" prop="storeId">
          <el-select
            v-model="shopData.storeId"
            :placeholder="$t('请选择')"
            name="shopData_storeId"
            style="width:290px"
            @change="handleChangeStore"
          >
            <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('分配模式')" prop="assignType">
          <el-select
            v-model="shopData.assignType"
            :placeholder="$t('请选择')"
            name="shopData_assignType"
            style="width:290px"
            @change="changeAssignType"
          >
            <el-option
              v-for="item in assignTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('分配值')" prop="assignValue">
          <ody-input-number
            v-model="shopData.assignValue"
            :min="1"
            :max="999"
            :empty-tip="false"
            :disabled="shopData.assignType == 3 "
            name="shopData_assignValue"
            style="width:290px"
          >
            <template slot="append">%</template>
          </ody-input-number>
        </el-form-item>
        <el-form-item :label="$t('置零阈值')" prop="alarmValue">
          <ody-input-number
            v-model="shopData.alarmValue"
            :min="1"
            :max="999"
            :empty-tip="false"
            name="shopData_alarmValue"
            style="width:290px"
          />
        </el-form-item>
        <el-form-item :label="$t('独享')" prop="isNeedHold">
          <el-checkbox v-model="shopData.isNeedHold" :true-label="1" :false-label="0" name="shopData_isNeedHold" />
        </el-form-item>
        <el-form-item :label="$t('独享优先级')" prop="holdLevel">
          <ody-input-number
            v-model="shopData.holdLevel"
            :min="1"
            :max="99"
            :empty-tip="false"
            :disabled="!shopData.isNeedHold"
            name="shopData_holdLevel"
            style="width:290px"
          />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleHideDialog" size="small" @click="handleHideDialog">{{ $t('取消') }}</el-button>
        <el-button :loading="confirmLoding" name="handleConfirmDialog" size="small" type="primary" @click="handleConfirmDialog">{{ $t('确定') }}</el-button>
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
    stockVisible: {
      type: Boolean,
      default: false
    },
    isFitting: {
      type: Boolean,
      default: false
    },
    shopIds: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      confirmLoding: false,
      storeList: [],
      shopRules: {
        storeId: [
          { required: true, message: this.$t('请选择店铺'), trigger: 'change' }
        ],
        assignType: [
          {
            required: true,
            message: this.$t('请选择分配模式'),
            trigger: 'change'
          }
        ],
        assignValue: [
          {
            required: true,
            message: this.$t('请输入分配值'),
            trigger: 'change'
          }
        ]
      },
      shopData: {
        storeId: '',
        assignType: '',
        assignValue: '',
        alarmValue: '',
        isNeedHold: 0,
        holdLevel: '',
        isAvailable: 1,
        merchantId: ''
      },
      assignTypeList: [
        { id: 1, name: this.$t('按比例') },
        { id: 3, name: this.$t('共享') }
      ]
    }
  },
  watch: {},
  mounted() {
    this.shopData.merchantId = this.merchantId
    this.loadStoreList()
  },
  methods: {
    handleChangeStore() {
      this.storeList.map(item => {
        if (item.storeId === this.shopData.storeId) {
          this.shopData.storeName = item.storeName
          this.shopData.storeCode = item.storeCode
          this.shopData.channelCode = item.channelCode
        }
      })
    },
    async loadStoreList() {
      const store = await this.$product.$api.merchantApi.queryPlatformAuthStorePage(
        {
          currentPage: 1,
          itemsPerPage: 500,
          merchantId: this.merchantId
        }
      )
      if (store.data.listObj) {
        if (this.isFitting) {
          this.storeList = store.data.listObj
        } else {
          store.data.listObj.forEach(element => {
            if (element.channelCodes[0].indexOf('12000') >= 0 || element.channelCodes[0].indexOf('110003') >= 0) {
              this.storeList.push(element)
            }
          })
        }
      }
    },
    handleHideDialog() {
      this.$emit('update:stockVisible', false)
      this.handleClearData()
    },
    handleClearData() {
      this.shopData = {
        storeId: '',
        assignType: '',
        assignValue: '',
        alarmValue: '',
        isNeedHold: 0,
        holdLevel: '',
        isAvailable: 1,
        merchantId: this.merchantId
      }
    },
    handleConfirmDialog() {
      var vue = this
      vue.confirmLoding = true

      this.$refs.shopForm.validate(valid => {
        if (this.shopIds.includes(this.shopData.storeId)) {
          this.$message({
            type: 'warning',
            message: this.$t('有相同的配置了')
          })
          vue.confirmLoding = false
          return
        }

        if (valid) {
          this.$emit('update:stockVisible', false)
          this.$emit('ok', this.shopData)

          this.handleClearData()
        }
        vue.confirmLoding = false
      })
    },
    changeAssignType() {
      if (this.shopData.assignType === 3) {
        this.shopData.assignValue = 100
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
