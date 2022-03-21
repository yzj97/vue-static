<template>
  <div class="cp-member-group-edit-item">
    <!-- {{ config }} -->
    <div class="label">{{ config.keyName }}:</div>
    <template v-if="config.type === 'text' || config.type === 'amount'">
      <el-select
        key="text-amount-select"
        v-model="config.select"
        :clearable="false"
        :placeholder="$t('请选择')"
        name="config_select"
      >
        <el-option
          v-for="item in getCondition"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template v-if="isNull || isNotNull" />
      <template v-else-if="isValue">
        <el-form-item
          key="text-amount-value"
          :rules="[
            { required: true, message: '请输入', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.value'"
        >
          <ody-input-number
            v-model="config.value"
            :min="getMin"
            :max="getMax"
            :decimal="getDecimal"
            name="config_value"
          />
        </el-form-item>
        <span v-if="config.unitName">{{ config.unitName }}</span>
      </template>
      <template v-else>
        <el-form-item
          key="text-amount-values"
          :rules="[
            { required: true, validator: validateInputNumber, message: '请输入', trigger: 'blur' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
        >
          <ody-number-range
            v-model="config.values"
            :range="getRange"
            :decimal="getDecimal"
            name="config_values"
          />
        </el-form-item>
        <span v-if="config.unitName">
          {{ config.unitName }}
          {{ $t('内') }}
        </span>
      </template>
    </template>
    <template v-else-if="config.type === 'date'">
      <el-select
        key="date-select"
        v-model="config.select"
        :clearable="false"
        :placeholder="$t('请选择')"
        name="config_select4"
        @change="handleDateSelectChange(config)"
      >
        <el-option
          v-for="item in getCondition"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template v-if="isNull || isNotNull" />
      <template v-else-if="isValue">
        <el-form-item
          key="date-single-value"
          :rules="[
            { required: true, message: '请输入', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.value'"
        >
          <el-date-picker
            v-if="config.key === 'mmdd_birthday'"
            v-model="config.value"
            :picker-options="getPickerOptions(config)"
            :placeholder="$t('选择日期')"
            name="config_value2"
            format="MM-dd"
            value-format="MM-dd"
            type="date"
          />
          <el-date-picker
            v-else
            v-model="config.value"
            :picker-options="getPickerOptions(config)"
            :placeholder="$t('选择日期')"
            name="config_value9"
            value-format="yyyy-MM-dd"
            type="date"
          />
        </el-form-item>
        <span v-if="config.unitName">{{ config.unitName }}</span>
      </template>
      <template v-else>
        <el-select
          key="date-range-select"
          v-model="config.inputSelect"
          :clearable="false"
          :placeholder="$t('请选择')"
          name="config_inputSelect"
          class="small-select"
          @change="handleInputSelectChange(config)"
        >
          <el-option
            v-for="item in inputSelectOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-form-item
          v-if="config.inputSelect === 'input'"
          key="date-range-input-values"
          :rules="[
            { required: true, validator: validateInputNumber, message: '请输入', trigger: 'blur' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
          class="small-select"
        >
          <ody-number-range
            v-model="config.values"
            :range="getRange"
            :decimal="getDecimal"
            name="config_values2"
          />
        </el-form-item>
        <el-form-item
          v-else-if="config.inputSelect === 'date'"
          key="date-range-date-values"
          :rules="[
            { required: true, message: '请输入', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
        >
          <el-date-picker
            v-model="config.values"
            :range-separator="$t('至')"
            :start-placeholder="$t('开始日期')"
            :end-placeholder="$t('结束日期')"
            :value-format="config.key === 'birthday' ? 'MM-dd' : 'yyyy-MM-dd'"
            name="config_values0"
            type="daterange"
          />
        </el-form-item>
        <span v-if="config.unitName">
          {{ config.unitName }}
          {{ $t('内') }}
        </span>
      </template>
    </template>
    <template v-else-if="config.type === 'checkbox'">
      <el-form-item
        key="checkbox-values"
        :rules="[
          { required: true, message: '请勾选', trigger: 'change' }
        ]"
        :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
      >
        <el-checkbox-group v-model="config.values" name="config_values9">
          <el-checkbox
            v-for="item in getCondition"
            :label="item.value"
            :key="item.value"
          >{{ item.label }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </template>
    <template v-else-if="config.type === 'all'">
      <span key="all">{{ $t('平台全部会员') }}</span>
    </template>
    <template v-else>
      <el-select
        v-if="config.condition && config.condition.length > 1"
        key="other-select"
        v-model="config.select"
        :clearable="false"
        :placeholder="$t('请选择')"
        name="config_select42"
      >
        <el-option
          v-for="item in getCondition"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <template v-if="isNull || isNotNull" />
      <template v-else-if="config.type === 'province-city-region-select'" class="choose">
        <el-form-item
          key="province-city-region-select-values"
          :rules="[
            { required: true, validator: validateArea, message: '请勾选', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
        >
          <ody-province-city-region-select
            v-model="config.values"
            :selected.sync="config.selected"
            name="config_values4"
          />
        </el-form-item>
      </template>
      <template v-else-if="config.type === 'store-choose'">
        <el-form-item
          key="store-choose-values"
          :ref="`el_form_item_${p2Index}_${p3Index}_${p4Index}`"
          :rules="[
            { required: true, message: '请勾选', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
        >
          <ody-store-choose
            v-model="config.values"
            :search-field="['channelCode', 'merchantId', 'storeCode', 'storeName']"
            :result-field="['storeCode', 'storeName', 'merchantName', 'mobile', 'contactName']"
            :multiple="true"
            :view="true"
            :limit="30"
            name="config_values02"
            value-key="storeId"
            class="choose"
            @ok="handleTypeItemChange(config.values, p2Index, p3Index, p4Index)"
            @delete="handleTypeItemChange(config.values, p2Index, p3Index, p4Index)"
          />
        </el-form-item>
      </template>
      <template v-else>
        <el-form-item
          :key="config.type + '-values'"
          :ref="`el_form_item_${p2Index}_${p3Index}_${p4Index}`"
          :rules="[
            { required: true, message: '请勾选', trigger: 'change' }
          ]"
          :prop="'children.' + p2Index + '.children.' + p3Index + '.children.' + p4Index + '.values'"
        >
          <component
            :is="`ody-${config.type}`"
            v-model="config.values"
            :multiple="true"
            :view="true"
            :limit="30"
            name="config_values3"
            class="choose"
            @ok="handleTypeItemChange(config.values, p2Index, p3Index, p4Index)"
            @delete="handleTypeItemChange(config.values, p2Index, p3Index, p4Index)"
          />
        </el-form-item>
      </template>
    </template>
    <div class="right">
      <i name="handleDelete" class="el-icon-close" @click="handleDelete" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    p2Index: {
      type: Number,
      default: -1
    },
    p3Index: {
      type: Number,
      default: -1
    },
    p4Index: {
      type: Number,
      default: -1
    },
    config: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        },
        shortcuts: [
          {
            text: this.$t('今天'),
            onClick(picker) {
              picker.$emit('pick', new Date())
            }
          },
          {
            text: this.$t('昨天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('3天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('6天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 6)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('9天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 9)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('15天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 15)
              picker.$emit('pick', date)
            }
          },
          {
            text: this.$t('30天'),
            onClick(picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', date)
            }
          }
        ]
      },
      inputSelectOptions: [
        {
          value: 'date',
          label: '日期'
        },
        {
          value: 'input',
          label: '输入'
        }
      ]
    }
  },
  computed: {
    getCondition() {
      const labelList = this.config.conditionName
      return this.config.condition.map((value, index) => {
        const label = labelList[index]
        return {
          label,
          value
        }
      })
    },
    isValue() {
      return this.config.select !== 'between'
    },
    isNull() {
      return this.config.select === 'is_null'
    },
    isNotNull() {
      return this.config.select === 'is_not_null'
    },
    getMin() {
      if (this.config.type === 'amount') {
        return 0.01
      }

      if (this.config.key === 'rating_level') {
        return 1
      }

      return 0
    },
    getMax() {
      if (this.config.type === 'amount') {
        return 99999.99
      }

      if (this.config.key === 'rating_level') {
        return 5
      }

      return 99999
    },
    getRange() {
      return `[${this.getMin}, ${this.getMax}]`
    },
    getDecimal() {
      if (this.config.type === 'amount') {
        return 2
      }

      return 0
    }
  },
  mounted() {},
  methods: {
    handleInputSelectChange(config) {
      config.values = []
    },
    getPickerOptions(config) {
      if (config.key === 'birthday') {
        return {}
      }
      return this.pickerOptions
    },
    dispatch(componentName, eventName, params) {
      var parent = this.$parent || this.$root
      var name = parent.$options.componentName

      while (parent && (!name || name !== componentName)) {
        parent = parent.$parent

        if (parent) {
          name = parent.$options.componentName
        }
      }
      if (parent) {
        parent.$emit.apply(parent, [eventName].concat(params))
      }
    },
    handleTypeItemChange(values, p2Index, p3Index, p4Index) {
      this.$refs[`el_form_item_${p2Index}_${p3Index}_${p4Index}`].$emit(
        'el.form.change',
        values
      )
    },
    validateInputNumber(rule, value = [], callback) {
      const len = value.filter(x => x).length
      if (len < 2) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    },
    validateArea(rule, value = [], callback) {
      const len = value.filter(x => x).length
      if (len < 1) {
        callback(new Error('has error'))
      } else {
        callback()
      }
    },
    handleDelete() {
      this.$emit('delete')
    },
    handleDateSelectChange(config) {
      config.inputSelect = 'date'
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-member-group-edit-item {
  // background-color: #f1f1f1;
  margin-bottom: 5px;
  padding: 8px;
  position: relative;
  &:hover {
    background-color: #f6f7fa;
  }
  .label {
    width: 90px;
    text-align: left;
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
  }
  .choose {
    display: inline-block;
    vertical-align: middle;
  }
  /deep/ {
    .el-form-item {
      margin-right: 0;
      margin-bottom: 0;
    }
    .el-input {
      width: 180px;
    }
    .small-select {
      .el-input {
        width: 80px;
      }
    }
    .cp-number-range {
      display: inline-block;
      vertical-align: middle;
    }
    .cp-select-province-city-region {
      display: inline-block;
      vertical-align: middle;
    }
  }
  .right {
    position: absolute;
    top: 50%;
    right: 10px;
    transform: translateY(-50%);
    cursor: pointer;
    &:hover {
      color: var(--themeColor);
    }
  }
}
</style>
