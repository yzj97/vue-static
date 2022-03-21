<template>
  <div>
    <ody-dialog
      :visible="visible"
      :before-close="handleMappingCancel"
      :title="$t('添加拟合库存')"
      width="600px"
    >
      <el-form ref="mappingParam" :model="mappingParam" :rules="rules" label-position="right" label-width="150px">
        <el-row>
          <el-col span="22" offset="1">
            <el-form-item :label="$t('拟合仓')" prop="virtualWarehouseId" required>
              <product-select-virtual-warehouse
                v-model="mappingParam.virtualWarehouseId"
                :merchant-id="merchantId"
                :selected.sync="virtualWarehouse"
                name="mappingParam_virtualWarehouseId" />
            </el-form-item>
            <el-form-item :label="$t('分配模式')" prop="assignType">
              <ody-select2
                v-model="mappingParam.assignType"
                :placeholder="$t('请选择')"
                name="mappingParam_assignType"
                list-key="mappingAssignTypes"
              />
            </el-form-item>
            <el-form-item :label="$t('分配值')" prop="assignValue">
              <el-input :disabled="mappingParam.assignType === 3" v-model="mappingParam.assignValue" name="mappingParam_assignValue">
                <template slot="append">%</template>
              </el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button name="handleMappingCancel" size="mini" @click="handleMappingCancel">{{ $t('取消') }}</el-button>
        <el-button name="handleMappingSubmit" size="mini" type="primary" @click="handleMappingSubmit">{{ $t('新增') }}</el-button>
      </span>
    </ody-dialog>
  </div>
</template>

<script>
import ProductSelectVirtualWarehouse from '@/components/select-virtual-warehouse'

export default {
  components: {
    ProductSelectVirtualWarehouse
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    config: {
      type: Array,
      default: () => []
    },
    merchantId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      virtualWarehouse: {},
      mappingParam: {
        virtualWarehouseId: '', // 拟合仓
        assignType: '', // 分配模式
        assignValue: '' // 分配值
      },
      rules: {
        virtualWarehouseId: [
          { required: true, message: this.$t('请选择拟合仓'), trigger: 'change' }
        ],
        assignType: [
          { required: true, message: this.$t('请选择分配模式'), trigger: 'change' }
        ],
        assignValue: [
          { required: true, message: this.$t('请输入分配值'), trigger: 'change' }
        ]
      }
    }
  },
  watch: {
    'mappingParam.assignType'(newVal) {
      if (newVal === 3) {
        this.mappingParam.assignValue = 100
      }
    }
  },
  mounted() {
  },
  methods: {
    handleMappingCancel() {
      this.$emit('update:visible', false)
    },
    async handleMappingSubmit() {
      const [err] = await this.formValidate('mappingParam')

      if (err) {
        return
      }

      const { virtualWarehouseId } = this.mappingParam

      const beforeItem = this.config.find(x => x.targetWarehouseId === virtualWarehouseId)

      if (beforeItem) {
        this.$message({
          type: 'warning',
          message: this.$t('有相同的配置了')
        })
        return
      }

      this.$emit('ok', {
        // ...this.virtualWarehouse,
        ...this.mappingParam,
        targetWarehouseId: virtualWarehouseId,
        targetWarehouseName: this.virtualWarehouse.warehouseName,
        targetWarehouseCode: this.virtualWarehouse.warehouseCode
        // 'isAvailable': 1,
        // 'sourceWarehouseId': 1910240000126468,
        // 'sourceWarehouseName': 'rf4tf',
        // 'sourceWarehouseCode': 'ttgrt',
        // 'targetWarehouseId': 1910240000111253,
        // 'targetWarehouseCode': 'BBC1111',
        // 'targetWarehouseName': 'BBC拟合仓',
        // 'assignType': 3,
        // 'assignValue': 100,
        // 'merchantId': 1908130000012848,
        // 'id': 1910240000111253
      })
    }
  }
}
</script>

<style scoped>

</style>
