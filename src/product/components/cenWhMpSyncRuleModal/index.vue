<template>
  <div>
    <ody-dialog
      v-if="visible"
      :before-close="hideDialog"
      :visible.sync="visible"
      :title="$t('新增')"
      width="600px"
      @confirm-dialog="confirmDialog">

      <el-form slot="content" ref="form" :model="oneData" label-width="200px" class="form">
        <el-form-item :rules="[{ required: true, message: '拟合仓必选'}, duplicateValidator]" :label="$t('拟合仓')" prop="virtualWarehouseId">
          <el-select v-model="oneData.virtualWarehouseId" :placeholder="$t('请选择')" name="oneData_virtualWarehouseId" style="width:200px" clearable>
            <el-option
              v-for="item in virWarehouseList"
              :key="item.id"
              :label="item.warehouseName"
              :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '分配模式必选'}]" :label="$t('分配模式')" prop="assignType">
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
    virWarehouseList: {
      type: Array,
      default: null
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
              if (value === self.selected[i].virtualWarehouseId) {
                return callback('已存在相同配置')
              }
            }
          }
          callback()
        }
      },
      oneData: {
        virtualWarehouseId: null,
        assignType: null,
        assignValue: null
      },
      assignTypeList: [{ id: 1, name: this.$t('按比例') }, { id: 3, name: this.$t('共享') }],
      value: ''
    }
  },
  async mounted() {

  },
  methods: {
    hideDialog() {
      this.$emit('update:visible', !this.visible)
    },
    confirmDialog() {
      this.$refs['form'].validate((valid) => {
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
