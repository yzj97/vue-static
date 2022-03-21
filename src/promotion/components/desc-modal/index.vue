<template>
  <div class="cp-promotion-desc-modal">
    <div>
      {{ $t('single_promotion_text') }}
    <a name="handleLookExample" href="#" class="example" @click="handleLookExample">{{ $t('查看示例') }}</a></div>

    <ody-dialog
      :title="$t('示例')"
      :visible.sync="dialogVisible"
      class="example-dialog"
      width="600px"
    >
      <img src="../promotion-activity-description-input/images/promRule.png" alt >
    </ody-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    handleLookExample() {
      this.dialogVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-promotion-desc-modal {
  .example {
    color: #1890ff;
    cursor: pointer;
  }
  .example-dialog {
    img {
      display: inline-block;
      width: 100%;
    }
  }
}
</style>
