<template>
  <div class="cms-choose-coupon">
    <div name="couponLookVisible" class="add-coupon" @click="couponLookVisible = true">
      <i class="el-icon-plus icon"/>
      <div>{{ $t('添加优惠券') }}</div>
    </div>
    <cms-choose-coupon-look
      v-if="couponLookVisible"
      :visible.sync="couponLookVisible"
      :module-id="moduleId"
      :page-id="pageId"
      :form-data="formData"/>
  </div>
</template>

<script>
import CmsChooseCouponLook from '@/components/cms-choose-coupon-look'
export default {
  components: {
    CmsChooseCouponLook
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    pageId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      moduleId: this.formData.id,
      couponLookVisible: false
    }
  }
}
</script>

<style scoped lang="scss">
.cms-choose-coupon {
  .add-coupon {
    display: flex;
    border: 1px dashed #CED4DA;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    padding: 10px;
    .icon {
      font-size: 30px;
      font-weight: 600;
      color: #1890FF;
    }
  }
}
</style>
