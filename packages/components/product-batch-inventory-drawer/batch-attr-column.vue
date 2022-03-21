<template>
  <el-table-column
    :label="$t('批次特性')"
    width="280">
    <template slot-scope="scope">
      <el-form-item
        :key="'formItem' + scope.$index"
        :prop="tempName + '.' + scope.$index + '.batchAttrs'"
        :rules="{ type: 'array', required: true, message: $t('批次特性不能为空'), trigger: 'blur' }"
      >
        <div style="min-width: 200px;">
          {{ getBatchAttrs(scope.row.batchAttrs, scope.row) }}
        </div>
      </el-form-item>
      <el-popover
        v-if="!scope.row.batchNo"
        :value="visible && scope.row.temp_batchAttrVisible"
        :key="'popover' + scope.$index"
        width="800"
        trigger="manual">
        <el-form :ref="'batchAttrForm' + scope.$index" :model="scope.row" label-width="100px">
          <div
            v-for="(attr, index) in scope.row.temp_batchAttrs"
            :key="index">
            <batch-attr-value-form-item :attr="attr" :index="index" />
            <batch-attr-unit-value-form-item v-if="attr.inputType === 'mp_date'" :attr="attr" :index="index" />
          </div>

          <el-form-item>
            <el-button size="small" type="default" @click="handleBatchAttrCancel(scope.row)">{{ $t('取消') }}</el-button>
            <el-button size="small" type="primary" @click="handleBatchAttrSubmit(scope.row, scope.$index)">{{ $t('确定') }}</el-button>
          </el-form-item>
        </el-form>
        <i slot="reference" class="el-icon-edit" @click="handleBatchAttrOpen(scope.row)" />
      </el-popover>
    </template>
  </el-table-column>
</template>
<script>
import BatchAttrValueFormItem from './batch-attr-value-form-item'
import BatchAttrUnitValueFormItem from './batch-attr-unit-value-form-item'

export default {
  components: {
    BatchAttrValueFormItem,
    BatchAttrUnitValueFormItem
  },
  props: {
    tempName: {
      type: String,
      default: ''
    },
    product: {
      type: Object,
      default: () => ({
      })
    }
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {
    async handleBatchAttrSubmit(row, index) {
      const [err] = await this.formValidate('batchAttrForm' + index)

      if (err) {
        return
      }

      // debugger
      // 操作完毕，重新更新row.batchAttrs
      row.batchAttrs = this.$portal.deepClone(row.temp_batchAttrs)
      this.handleBatchAttrCancel(row)
    },
    async handleBatchAttrOpen(row) {
      // 更新到临时数据中
      let temp_batchAttrs

      if (row.batchAttrs && row.batchAttrs.length) {
        temp_batchAttrs = this.$portal.deepClone(row.batchAttrs)
      } else {
        // 调用 军辉接口
        temp_batchAttrs = await this.getBatchStrategyAttrs()
      }
      this.$set(row, 'temp_batchAttrs', temp_batchAttrs)
      this.$set(row, 'temp_batchAttrVisible', true)
      this.visible = true
    },
    handleBatchAttrCancel(row) {
      this.$set(row, 'temp_batchAttrVisible', false)
      this.visible = false
    },
    async getBatchStrategyAttrs() {
      const { data: { batchAttrs } = { batchAttrs: [] }} = await this.$api.batchStrategy.get({
        id: this.product.batchStrategyId
      })

      return batchAttrs
    },
    getBatchAttrs(batchAttrs) {
      return batchAttrs.map(x => {
        if (x.inputType === 'mp_date') {
          const { value, unitValue } = x
          let showUnitValue = ''
          let showValue = ''

          if (value !== undefined && value !== null) {
            showValue = value
          }

          if (unitValue !== undefined && unitValue !== null) {
            showUnitValue = `(${unitValue})`
          }

          return `${showValue}${showUnitValue}`
        }

        return x.value
      }).filter(x => x).join(';')
    }
  }
}
</script>
