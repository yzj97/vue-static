<template>
  <div class="el-dialog--center">
    <ody-list-search-area>
      <div slot="content">
        <ody-input-number v-model="value.param.value" :min= "1" :max="9999999999" name="value_param_value">
          <template slot="prepend">{{ $t('每日上限') }}</template>
        </ody-input-number>
      </div>
    </ody-list-search-area>
    <div slot="btn">
      <el-button name="saveBasicConfig" size="small" type="primary" @click="saveBasicConfig">{{ $t('保存') }}</el-button>
    </div>
  </div>
</template>

<script>

export default {
  props: {
    type: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      value: {
        id: null,
        param: {
          value: null
        }
      }
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      try {
        this.$ouserCenter.$api.crmService.getRuleByType({ type: 1, subType: 1, entityType: this.type }).then(res => {
          if (res.data.param) {
            this.value.id = res.data.id
            this.value.param = JSON.parse(res.data.param)
          }
        })
      } catch (e) {
        console.log(e)
      }
    },
    saveBasicConfig() {
      if (!this.value.param.value || !/^[1-9][0-9]{0,9}$/.test(this.value.param.value)) {
        this.$message({
          type: 'warn',
          message: this.$t('积分上限最多支持') + '1-10' + this.$t('位正整数')
        })
        return
      }
      // console.log(this.value)

      let op
      if (this.value.id) {
        op = this.$ouserCenter.$api.crmService.updateRule({ paramJson: this.value.param, id: this.value.id })
      } else {
        op = this.$ouserCenter.$api.crmService.addRule({
          paramJson: this.value.param,
          type: 1,
          subType: 1,
          entityType: this.type,
          status: 1
        })
      }
      op.then(res => {
        this.$message({
          type: 'success',
          message: this.$t('保存成功')
        })
        this.init()
      })
    }
  }
}

</script>
<style scoped>
  .el-form {
    padding-left: 38%;
  }
</style>
