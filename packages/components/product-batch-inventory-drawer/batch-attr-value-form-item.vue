<template>
  <div class="batch-attr-value-form-item">
    <el-form-item
      :label="attr.name"
      :prop="'temp_batchAttrs.' + index + '.value'"
      :rules="{ required: attr.required, message: attr.name + $t('cant_be_empty'), trigger: 'blur' }"
    >
      <template v-if="attr.inputType === 'mp_date'">
        <el-date-picker
          v-model="attr.value"
          :placeholder="$t('请选择生产日期')"
          :picker-options="pickerOptions1"
          value-format="yyyy-MM-dd"
          type="date"/>
      </template>
      <template v-else-if="attr.inputType === 'to_date'">
        <el-date-picker
          v-model="attr.value"
          :placeholder="$t('请选择有效期至')"
          value-format="yyyy-MM-dd"
          type="date"/>
      </template>
      <template v-else-if="attr.inputType === 'list'">
        <el-radio-group v-model="attr.value" size="small">
          <el-radio
            v-for="(item, index) in attr.selectValues"
            :key="index"
            :label="item"
            class="radio-item"
            border>
            {{ item }}
          </el-radio>
        </el-radio-group>
      </template>
      <template v-else-if="attr.inputType === 'text'">
        <el-input v-model="attr.value" />
      </template>
      <template v-else-if="attr.inputType === 'date'">
        <el-date-picker
          v-model="attr.value"
          value-format="yyyy-MM-dd"
          type="date"
        />
      </template>
      <template v-else-if="attr.inputType === 'number'">
        <ody-input-number
          v-model="attr.value"
        />
      </template>
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    attr: {
      type: Object,
      default: () => {}
    },
    index: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
    }
  },
  computed: {
    pickerOptions1() {
      return {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.batch-attr-value-form-item {
  display: inline-block;
  .radio-item {
    margin: 0 10px 10px;
  }
}
</style>
