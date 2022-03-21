<template>
  <el-col :span="8" :offset="8">
    <el-form ref="form" :disabled="disabled" :model="paramJson" :rules="detailRule" label-width="120px" class="form" label-position="right">
      <el-form-item :label="$t('完善信息送')+':'" prop="value">
        <el-input v-model="paramJson.value" name="paramJson_value" style="width: 120px" maxlength="10"/><span style="margin-left: 10px">{{ $t('积分') }}</span>
      </el-form-item>
    </el-form>
  </el-col>
</template>

<script>
export default {
  props: {
    param: {
      type: Object,
      default: function() {
        return null
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
      paramJson: {
        value: null
      },
      detailRule: {
        value: [
          { required: true, message: this.$t('请输入积分数量'), trigger: 'change' },
          { pattern: /^[1-9][0-9]{0,9}$/, message: this.$t('最大') + '10' + this.$t('位正整数'), trigger: 'change' }
        ]
      }
    }
  },
  mounted() {
    if (this.param) {
      this.paramJson = this.$portal.deepClone(this.param)
    }
  },
  methods: {
    getParamJson() {
      return this.paramJson
    }
  }
}
</script>

<style scoped>

</style>
