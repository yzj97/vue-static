<template>
  <el-col :span="16" :offset="5">
    <el-form ref="form" :disabled="disabled" :model="paramJson" label-width="120px" class="form" label-position="right">
      <el-row
        v-for="(i,index) in paramJson.value"
        :key="index">
        <el-col :span="7">
          <el-form-item
            :label="$t('渠道')+':'"
            :prop="'channelCode'+index"
            :rules="[{ validator: validatorChannelCode, trigger: 'change' }]"
          >
            <el-select v-model="i.channelCode" :placeholder="$t('请选择')" name="i_channelCode" style="width: 150px">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            :label="$t('每消费')"
            :prop="'amount'+index"
            :rules="[{ validator: validatorAmount, trigger: 'change' }]"
          >
            <el-input v-model="i.amount" name="i_amount" style="width: 120px" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="5">
          <el-form-item
            :label="$t('元')+','+$t('赠送')"
            :prop="'value'+index"
            :rules="[{ validator: validatorValue, trigger: 'change' }]"
          >
            <el-input v-model="i.value" name="i_value" style="width: 120px" maxlength="10"/>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            :label="$t('积分')">
            <el-button name="deleteOne" size="mini" @click="deleteOne(index)">{{ $t('删除') }}</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <div>
        <el-button name="add" size="mini" @click="add">{{ $t('新增规则') }}</el-button>
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
      channelList: [],
      paramJson: {
        value: []
      }
    }
  },
  mounted() {
    if (this.param.value) {
      this.paramJson = this.param
    } else {
      this.add()
    }
    this.$crm.$api.growthValueList.queryChannelMap().then((res) => {
      const data = res.data
      for (const key in data) {
        this.channelList.push({ id: key, label: data[key].channelName })
      }
    })
  },
  methods: {
    getParamJson() {
      return this.paramJson
    },
    add() {
      this.paramJson.value.push({ value: null, amount: null, channelCode: null })
    },
    validatorValue(rule, value, callback) {
      const index = parseInt(rule.field.replace('value', ''))
      const element = this.paramJson.value[index]
      if (!element.value) {
        return callback(new Error(this.$t('请输入积分数')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(element.value)) {
        return callback(new Error(this.$t('积分数仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
      }
      return callback()
    },
    validatorAmount(rule, value, callback) {
      const index = parseInt(rule.field.replace('amount', ''))
      const element = this.paramJson.value[index]
      if (!element.amount) {
        return callback(new Error(this.$t('请输入金额')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(element.amount)) {
        return callback(new Error(this.$t('金额仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
      }
      return callback()
    },
    validatorChannelCode(rule, value, callback) {
      const index = parseInt(rule.field.replace('channelCode', ''))
      const element = this.paramJson.value[index]
      if (!element.channelCode) {
        return callback(new Error(this.$t('请选择渠道')))
      }
      return callback()
    },
    deleteOne(index) {
      this.paramJson.value.splice(index, 1)
    }
  }
}
</script>

<style scoped>

</style>
