<template>
  <div class="cp-activity-description">
    <el-input
      :rows="3"
      v-model="ruleDesc"
      :placeholder="$t(placeholder)"
      :maxlength="maxlength"
      name="ruleDesc"
      show-word-limit
      type="textarea"
      class="ruleDesc"
      @change="handleRuleDescChange"
    />
  </div>
</template>

<script>
export default {
  props: {
    maxlength: {
      type: Number,
      default: 100
    },
    ruleDesc: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请输入描述'
    }
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  mounted() {},
  methods: {
    handleRuleDescChange(value) {
      this.$emit('update:ruleDesc', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-activity-description {
  .ruleDesc {
    margin-bottom: 10px;
  }
  .tip {
    display: inline-block;
    height: 32px;
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(69, 90, 100, 1);
    line-height: 16px;

    .example {
      color: #1890ff;
      cursor: pointer;
    }
  }

  .example-dialog {
    img {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
