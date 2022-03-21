<template>
  <div>
    <ody-dialog
      :visible.sync="visible"
      :before-close="handleClose"
      :modal-append-to-body="false"
      :title="$t('分发')"
      width="50%"
      class="product-list-dialog"
      @open="init"
    >
      <el-form class="form">
        <div class="content-up">
          <div class="cont-font-size">{{ $t('商品分发中') }}...</div>
          <div class="content-title">
            <div v-if="type===1">1.{{ $t('选择的商品和商家越多，分发所需的时间越长') }}。</div>
            <div v-if="type===2">1.{{ $t('选择的商品和店铺越多，分发所需的时间越长') }}。</div>
            <div>2.{{ $t('分发过程中可以关闭此页面，下次进入分发页面时如果依然显示"商品分发中"则说明尚未分发完成，否则说明已经分发结束') }}。</div>
          </div>
        </div>
      </el-form>
    </ody-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    type: {
      type: Number,
      default: null
    }
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', !this.visible)
    },
    init() {
      setTimeout(() => {
        if (this.visible === true) {
          this.$emit('update:visible', !this.visible)
        }
      }, 2000) // 等待1秒
    }
  }
}
</script>
<style lang="scss" scoped>
.product-list-dialog {
  .content {
    padding-bottom: 100px;
  }
  .content-title {
    margin-top: 20px;
    line-height: 32px;
    background: #f9f9f9;
  }
  .cont-font-size {
    text-align: center;
    font-size: 18px;
  }
}
</style>
