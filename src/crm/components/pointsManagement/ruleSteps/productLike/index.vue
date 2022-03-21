<template>
  <el-col :offset="5">
    <el-form ref="form" :disabled="disabled" :model="obj" label-width="160px" class="form" label-position="right">
      <el-form-item
        v-for="(i,index) in obj.values"
        :label="$t('累计被点赞数')+':'"
        :key="index"
        :prop="'value'+index"
        :rules="[
      { validator: validatorValue, trigger: 'change' }]">
        <span style="margin-left: 10px">{{ $t('满') }}</span>
        <el-input v-model="i.count" name="i_day" style="width: 80px" maxlength="4"/>
        <span style="margin-left: 10px">{{ $t('个') }}</span>
        <span style="margin-left: 10px">{{ '，'+ $t('送') }}</span>
        <el-input
          v-model="i.value"
          :placeholder="$t('最大10位正整数')"
          name="i_value"
          style="margin-left: 10px;width: 120px"
          maxlength="10"/>
        <span style="margin-left: 10px">{{ $t('积分') }}</span>
        <el-button v-if="index !== 0" name="deleteOne" size="mini" style="margin-left: 10px" @click="deleteOne(index)">{{ $t('删除') }}
        </el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button name="addDays" size="mini" @click="addDays">{{ $t('新增阶梯规则') }}</el-button>
    </div>
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
        values: []
      }
    }
  },
  async mounted() {
    if (this.param) {
      this.obj.values = this.$portal.deepClone(this.param.values)
    }
    if (!this.obj.values || this.obj.values.length === 0) {
      this.obj.values = [{ value: null, count: null }]
    }
  },
  methods: {
    addDays() {
      this.obj.values.push({ value: null, count: null })
    },
    validatorValue(rule, value, callback) {
      const index = parseInt(rule.field.replace('value', ''))
      const count = this.obj.values[index].count
      const b = !this.obj.values[index].value
      for (let i = 0; i < this.obj.values.length; i++) {
        if (i !== index) {
          if (this.obj.values[i].count === count) {
            return callback(new Error(this.$t('点赞数重复')))
          }
        }
      }
      if (!count) {
        return callback(new Error(this.$t('请输入点赞数')))
      }
      if (b) {
        return callback(new Error(this.$t('请输入赠送的积分数')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(this.obj.values[index].value)) {
        return callback(new Error(this.$t('积分数仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
      }
      return callback()
    },
    deleteOne(index) {
      this.obj.values.splice(index, 1)
    },
    getParamJson() {
      this.obj.values.sort((i1, i2) => {
        return i1.count - i2.count
      })
      return {
        values: this.obj.values
      }
    }
  }
}
</script>

<style scoped>

</style>
