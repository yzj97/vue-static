<template>
  <el-col :span="14" :offset="6">
    <el-form ref="form" :disabled="disabled" :model="obj" label-width="160px" class="form" label-position="right">
      <el-form-item :label="$t('规则类型')+':'" :rules="[{ required: true, message: this.$t('请选择规则类型'), trigger: 'change' }]" prop="type">
        <el-select v-model="obj.type" :placeholder="$t('请选择')" name="obj_type" style="width: 150px" @change="changeType" >
          <el-option
            v-for="item in types"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <div v-if="obj.type === 1">
        <el-form-item
          :label="$t('签到每日赠送')+':'"
          :rules="[
            { required: true, message: this.$t('请输入积分数量'), trigger: 'change' },
            { pattern: /^[1-9][0-9]{0,9}$/, message: this.$t('最大') + '10' + this.$t('位正整数'), trigger: 'change' }
          ]"
          prop="value">
          <el-input v-model="obj.value" name="obj_value" style="width: 120px" maxlength="10" /><span style="margin-left: 10px">{{ $t('积分') }}</span>
        </el-form-item>
      </div>
      <div v-if="obj.type === 2">
        <el-form-item
          v-for="(i,index) in obj.values"
          :label="$t('连续签到')+':'"
          :key="index"
          :prop="'value'+index"
          :rules="[
            { validator: validatorValue, trigger: 'change' }
        ]">
          <el-input v-if="index === 0" v-model="i.day" name="i_day" style="width: 80px" maxlength="4"/>
          <el-input v-if="index !== 0" v-model="i.day" name="i_day5" style="width: 80px" disabled/>
          <span style="margin-left: 10px">{{ $t('到') }}</span>
          <el-input v-if="index === obj.values.length -1" disabled style="margin-left: 10px;width: 80px" />
          <el-input v-if="index !== obj.values.length -1" v-model="obj.values[index+1].day" name="obj_values[index+1]_day" maxlength="4" style="margin-left: 10px;width: 80px" />
          <span style="margin-left: 10px">{{ $t('日') +','+$t('每日赠送') }}</span>
          <el-input v-model="i.value" name="i_value" style="margin-left: 10px;width: 120px" maxlength="10"/>
          <span style="margin-left: 10px">{{ $t('积分') }}</span>
          <el-button name="deleteOne" size="mini" style="margin-left: 10px" @click="deleteOne(index)">{{ $t('删除') }}</el-button>
        </el-form-item>
        <div>
          <el-button name="addDays" size="mini" @click="addDays">{{ $t('新增阶梯规则') }}</el-button>
        </div>
      </div>
    </el-form>
  </el-col>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      default: function() {
        return {
          value: []
        }
      }
    },
    disabled: {
      type: Object,
      default: function() {
        return true
      }
    }
  },
  data() {
    return {
      obj: {
        type: null,
        value: null,
        values: []
      },
      types: [
        { value: 1, label: this.$t('固定签到送积分') },
        { value: 2, label: this.$t('阶梯签到送积分') }
      ]
    }
  },
  async mounted() {
    if (this.param && this.param.type) {
      this.obj.type = this.param.type
      if (this.obj.type === 1) {
        this.obj.value = this.param.value
      } else {
        this.obj.values = this.param.value
        // for (let i = 0; i < this.obj.values.length; i++) {
        //   this.detailRule['value' + i.toString()] =
        // }
      }
    }
  },
  methods: {
    changeType() {
      if (this.obj.type === 2) {
        this.addDays()
      }
    },
    addDays() {
      this.obj.values.push({ value: null, day: null })
    },
    getParamJson() {
      const result = {
        type: this.obj.type
      }
      if (this.obj.type === 1) {
        result.value = this.obj.value
      } else {
        result.value = this.obj.values
      }
      return result
    },
    validatorValue(rule, value, callback) {
      const index = parseInt(rule.field.replace('value', ''))
      if (index === 0) {
        if (!this.obj.values[index].day) {
          return callback(new Error(this.$t('请输入连续签到起始天数')))
        }
        if (!/^[1-9][0-9]{0,3}$/.test(this.obj.values[index].day)) {
          return callback(new Error(this.$t('起始天数仅支持') + '1' + this.$t('到') + '4' + this.$t('位正整数')))
        }
      }
      if (this.obj.values.length > index + 1) {
        if (!this.obj.values[index + 1].day) {
          return callback(new Error(this.$t('请输入连续签到结束天数')))
        }
        if (!/^[1-9][0-9]{0,3}$/.test(this.obj.values[index + 1].day)) {
          return callback(new Error(this.$t('起始天数仅支持') + '1' + this.$t('到') + '4' + this.$t('位正整数')))
        }
        if (parseInt(this.obj.values[index + 1].day) <= parseInt(this.obj.values[index].day)) {
          return callback(new Error(this.$t('结束天数必须大于起始天数')))
        }
      }
      if (!this.obj.values[index].value) {
        return callback(new Error(this.$t('请输入赠送的积分数')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(this.obj.values[index].value)) {
        return callback(new Error(this.$t('积分数仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
      }
      return callback()
    },
    deleteOne(index) {
      this.obj.values.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
