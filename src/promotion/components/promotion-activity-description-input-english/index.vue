<template>
  <div class="cp-activity-description">
    <el-input
      :rows="3"
      v-model="ruleDescLan"
      :placeholder="$t(placeholder)"
      :maxlength="maxlength"
      name="ruleDescLan"
      show-word-limit
      type="textarea"
      class="ruleDesc"
      @change="handleRuleDescLanChange"
    />
    <div>
      <!--
      <span class="tip">
        {{ $t('提示：') }}{{ $t('非必填字段，') }}{{ $t('不填将显示系统默认文案') }}{{ $t('（会存在某些促销类型无系统默认文案）。 ') }}
        {{ $t('自定义输入活动规则描述描述后将显示在前台商品详情页中，') }}{{ $t('请慎重填写。') }}
        <span
          name="handleLookExample"
          class="example"
          @click="handleLookExample"
        >{{ $t('查看示例') }}</span>
      </span>
      -->
    </div>

    <ody-dialog
      :title="$t('示例')"
      :visible.sync="dialogVisible"
      class="example-dialog"
      width="600px"
    >
      <img src="./images/promRule.png" alt >
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    maxlength: {
      type: Number,
      default: 100
    },
    ruleDescLan: {
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
    handleRuleDescLanChange(value) {
      this.$emit('update:ruleDescLan', value)
    },
    handleLookExample() {
      this.dialogVisible = true
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
