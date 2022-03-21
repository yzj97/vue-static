<template>
  <el-col :span="16" :offset="5">
    <el-form ref="form" :disabled="disabled" :model="paramJson" label-width="120px" class="form" label-position="right">
      <el-form-item
        v-for="(i,index) in paramJson.value"
        :label="$t('渠道')+':'"
        :key="index"
        :prop="'value'+index"
        :rules="[{ validator: validatorValue, trigger: 'change' }]">
        <el-row>
          <el-col :span="7">
            <el-select v-model="i.channelCode" :placeholder="$t('请选择')" name="i_channelCode" style="width: 150px">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.label"
                :value="item.id"
              />
            </el-select>
          </el-col>
          <el-col :span="16">
            <span style="margin-left: 10px">{{ $t('每消费') }}</span>
            <el-input v-model="i.amount" name="i_amount" style="width: 120px;margin-left: 10px" maxlength="10"/>
            <span style="margin-left: 10px">{{ $t('元')+','+$t('赠送') }}</span>
            <el-input v-model="i.value" name="i_value" style="width: 120px;margin-left: 10px" maxlength="10"/>
            <span style="margin-left: 10px">{{ $t('积分') }}</span>
            <el-button name="deleteOne" size="mini" style="margin-left: 10px" @click="deleteOne(index)">{{ $t('删除') }}</el-button>
          </el-col>
        </el-row>
      </el-form-item>
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
    this.$ouserCenter.$api.growthValueList.queryChannelMap().then((res) => {
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
      if (!element.channelCode) {
        return callback(new Error(this.$t('请选择渠道')))
      }
      if (!element.amount) {
        return callback(new Error(this.$t('请输入金额')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(element.amount)) {
        return callback(new Error(this.$t('金额仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
      }
      if (!element.value) {
        return callback(new Error(this.$t('请输入积分数')))
      }
      if (!/^[1-9][0-9]{0,9}$/.test(element.value)) {
        return callback(new Error(this.$t('积分数仅支持') + '1' + this.$t('到') + '10' + this.$t('位正整数')))
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
