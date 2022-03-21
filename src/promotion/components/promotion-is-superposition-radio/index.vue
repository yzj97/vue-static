<template>
  <div class="cp-is-superposition-radio">
    <ody-radio2
      key="promotionGiftRule"
      v-model="value"
      :list-key="listKey"
      v-bind="$attrs"
      name="value"
      @change="handleGiftRuleChange"
      v-on="$listeners"
    />
    <ody-input-number
      v-if="value !== 2"
      v-model="limit"
      :disabled="value === 0"
      name="limit"
      style="width: 180px;"
      class="gift-limit-multy"
      @input="handleGiftRuleChangeLimit"
    >
      <template slot="append">{{ $t('次') }}</template>
    </ody-input-number>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      default: 0
    },
    selected: {
      type: Object,
      default: () => {}
    },
    limit: {
      type: Number,
      default: null
    },
    listKey: {
      type: String,
      default: 'isSuperpositionMap'
    }
  },
  data() {
    return {
    }
  },
  mounted() {

  },
  methods: {
    handleGiftRuleChangeLimit() {
      this.$emit('update:limit', this.limit)
    },
    handleGiftRuleChange(val) {
      this.$emit('changeSelf')
      this.$emit('input', this.value)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-is-superposition-radio {
  /deep/ {
    .el-radio {
      display: block;
      margin-bottom: 10px;
    }
  }
  .gift-limit-box {
    /deep/ {
      .el-input-group__append {
        width: 88px;
      }
    }
  }
  .gift-limit-multy {
    font-size: 14px;
    width: 80px;
    display: inline-block;
    line-height: 32px;
  }
}
</style>
