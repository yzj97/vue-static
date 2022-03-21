<template>
  <div>
    <ody-dialog
      v-if="visible"
      :before-close="hideDialog"
      :visible.sync="visible"
      :title="$t('新增')"
      width="600px"
      @confirm-dialog="confirmDialog">

      <el-form slot="content" ref="ruleForm" :model="oneData" label-width="200px" class="form">
        <el-form-item :rules="[{ required: true, message: $t('店铺必选')}, duplicateValidator]" :label="$t('店铺')" prop="storeId">
          <el-select v-model="oneData.storeId" :placeholder="$t('请选择')" name="oneData_storeId" style="width:200px" clearable>
            <el-option
              v-for="item in storeList"
              :key="item.storeId"
              :label="item.storeName"
              :value="item.storeId"/>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: $t('分配模式必选')}]" :label="$t('分配模式')" prop="assignType">
          <el-select v-model="oneData.assignType" :placeholder="$t('请选择')" name="oneData_assignType" clearable style="width:200px" @change="changeAssignType()">
            <el-option
              v-for="item in assignTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item
          :rules="[{ required: true, message: $t('分配值必选')},
                   { type: 'number', message: $t('分配值必须为数字值')}]"
          :label="$t('分配值')"
          prop="assignValue">
          <el-input-number
            v-model="oneData.assignValue"
            :precision="0"
            :step="1"
            :max="999"
            :min="1"
            :disabled="oneData.assignType === 3"
            :controls="false"
            name="oneData_assignValue"/>%
        </el-form-item>
        <el-form-item
          :rules="[{validator: (rule, value, callback) => {
            if(value){
              if (!(/^([1-9][0-9]*)$/.test(value)) || value.length > 3) {
                return callback(this.$t('置零阈值必须是1-999的正整数'))
              }
            }
            callback()
          }}]"
          :label="$t('置零阈值')"
          prop="alarmValue">
          <el-input v-model="oneData.alarmValue" name="oneData_alarmValue" style="width:200px"/>
        </el-form-item>
        <el-form-item :label="$t('渠道独享')">
          <el-checkbox v-model="oneData.isNeedHold" name="oneData_isNeedHold" @change="changeIsNeedHold()"/>
        </el-form-item>
        <el-form-item
          :rules="[{validator: (rule, value, callback) => {
            if(value){
              if (!(/^([1-9][0-9]*)$/.test(value)) || value.length > 2) {
                return callback(this.$t('独占优先级必须是1-99的正整数'))
              }
            }
            callback()
          }}]"
          :label="$t('独享优先级')"
          prop="holdLevel">
          <el-input v-model="oneData.holdLevel" :disabled="!oneData.isNeedHold" name="oneData_holdLevel" style="width:200px"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div class="line-top"/>
        <el-button name="hideDialog" size="mini" @click="hideDialog">{{ $t('取消') }}</el-button>
        <el-button name="confirmDialog" size="mini" type="primary" @click="confirmDialog">{{ $t('确定') }}</el-button>
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
    storeList: {
      type: Array,
      default: () => []
    },
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    const self = this
    return {
      duplicateValidator: {
        validator: (rule, value, callback) => {
          if (value) {
            for (let i = 0; i < self.selected.length; i++) {
              if (value === self.selected[i].storeId) {
                return callback(this.$t('已存在相同配置'))
              }
            }
          }
          callback()
        }
      },
      oneData: {
        assignValue: null,
        storeId: null,
        alarmValue: null,
        isNeedHold: null,
        holdLevel: null,
        assignType: null
      },
      assignTypeList: [{ id: 1, name: this.$t('按比例') }, { id: 3, name: this.$t('共享') }],
      value: ''
    }
  },
  async mounted() {
    try {
      //      this.getStoreByMerchantId()
    } catch (e) {
      console.log(e)
    }
  },
  methods: {
    getStoreByMerchantId() {
      // 只查询拟合仓的数据
      this.$product.$api.merchantApi.queryPlatformAuthStorePage({ currentPage: 1, itemsPerPage: 500, merchantIds: [this.merchantId] }).then(
        res => {
          this.storeList = res.data.listObj
        }
      )
    },
    hideDialog() {
      this.$emit('update:visible', !this.visible)
    },
    confirmDialog() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('update:visible', !this.visible)
          this.$emit('ok', this.oneData)
        }
      })
    },
    changeAssignType() {
      if (this.oneData.assignType === 3) {
        this.oneData.assignValue = 100
      }
    },
    changeIsNeedHold() {
      if (!this.oneData.isNeedHold) {
        this.oneData.holdLevel = null
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .line-top {
    width: 100%;
    height: 1px;
    background: #eee;
    margin-bottom: 10px;
  }
</style>
