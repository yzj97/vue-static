<template>
  <div class="recommend-discount-group-radio">
    <ody-radio2
      v-model="value"
      name="value"
      list-key="recommendDiscount"
      @input="changeValue"
    >
      <span slot="1" class="recommend-radio">
        <el-form-item prop="conditionValue" class="limit-item">
          <ody-input-number
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="99999999.99"
            v-model="recommendList.conditionValue1"
            :disabled="+value!==1"
            name="recommendList_conditionValue1"
          />
          <span>元，</span>
          <span>{{ $t('可减') }}</span>
          <ody-input-number
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="99999999.99"
            v-model="recommendList.contentValue1"
            :disabled="+value!==1"
            name="recommendList_contentValue1"
          />
          <span>{{ $t('元') }}</span>
        </el-form-item>
        <div v-if="notOrderDraw && +value === 1" class="color-red">
          <span>{{ $t('优惠条件不能为空') }}</span>
        </div>
      </span>
      <span slot="2" class="recommend-radio">
        <el-form-item prop="conditionValue" class="limit-item">
          <ody-input-number
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="99999999.99"
            v-model="recommendList.conditionValue2"
            :disabled="+value!==2"
            name="recommendList_conditionValue2"
          />
          <span>{{ $t('元') }}</span>
          <span>{{ $t('可打') }}</span>
          <ody-input-number
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="9.99"
            v-model="recommendList.contentValue2"
            :disabled="+value!==2"
            name="recommendList_contentValue2"
            aria-placeholder="0-10"
          />
          <span>折,</span>
          <span>{{ $t('折扣上限') }}</span>
          <ody-input-number
            :empty-tip="false"
            :decimal="2"
            :min="0.01"
            :max="99999999.99"
            v-model="recommendList.discountLimit"
            :disabled="+value!==2"
            name="recommendList_discountLimit"
          />
          <span>{{ $t('元') }}</span>
        </el-form-item>
        <div v-if="notOrderDraw && +value === 2" class="color-red">
          <span>{{ $t('优惠条件不能为空') }}</span>
        </div>
      </span>
    </ody-radio2>
  </div>
</template>
<script>

export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    selected: {
      type: Object,
      default: () => {}
    },
    recommendList: {
      type: Object,
      default: () => {}
    },
    singlePromotion: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      notOrderDraw: false
    }
  },
  watch: {

  },
  mounted() {
  },
  methods: {
    changeValue(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss" scoped>
.recommend-discount-group-radio{
    /deep/ {
        .el-radio{
    display:flex;
    align-items: center;
    margin-bottom:0.8rem;
        }
    }
}
.recommend-discount-group-radio{
    /deep/ {
        .el-radio__label{
    display:flex;
    align-items: center;
        }
    }
}
.recommend-radio{
    margin-left:0.5rem;
}
 .cp-restrictions-time-scope{
    /deep/ {
      .el-radio {
        display: block;
        margin-bottom: 10px;
      }
    }
    .gift-limit-box {

      /deep/{
        .el-input-group__append {
          width: 128px;
        }
      }
    }
    .gift-limit-multy{
      font-size: 14px;
      width: 80px;
      display: inline-block;
      line-height: 32px;
    }
    .color-red {
      color: #F56C6C;
    }
  }
</style>

