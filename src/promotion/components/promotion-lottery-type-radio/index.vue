<template>
  <div class="cp-restrictions-time-scope">
    <ody-radio2
      key="promotionGiftRule"
      v-model="lotteryThemeViewContent.orderDrawType"
      name="lotteryThemeViewContent_orderDrawType"
      list-key="orderDrawTypeMap"
      @change="handleGiftRuleChange"
    >
      <span slot="1" class="gift-limit-box">
        <el-form-item prop="startDate4NoLimit" class="gift-limit-multy">
          <ody-input-number
            :decimal="2"
            v-model="orderDrawObj.orderDrawAmount1"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 1"
            name="orderDrawObj_orderDrawAmount1"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('元') }}</span>
          <span>{{ $t('每个订单抽奖次数') }}</span>
          <ody-input-number
            v-model="orderDrawObj.drawTimesPerOrder1"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 1"
            name="orderDrawObj_drawTimesPerOrder1"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('次') }}</span>
        </el-form-item>
        <!-- <div v-if="notOrderDraw && +lotteryThemeViewContent.orderDrawType === 1" class="color-red">
          <span>{{ $t('订单金额或抽奖次数不能为空') }}</span>
        </div> -->
      </span>

      <span slot="2" class="gift-limit-box">
        <el-form-item prop="period" class="gift-limit-multy">
          <ody-input-number
            :decimal="2"
            v-model="orderDrawObj.orderDrawAmount2"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 2"
            name="orderDrawObj_orderDrawAmount2"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('元') }}</span>
          <span>{{ $t('可获得抽奖次数') }}</span>
          <ody-input-number
            v-model="orderDrawObj.drawTimesPerOrder2"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 2"
            name="orderDrawObj_drawTimesPerOrder2"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('次') }}</span>
        </el-form-item>
        <!-- <div v-if="notOrderDraw && +lotteryThemeViewContent.orderDrawType === 2" class="color-red">
          <span>{{ $t('订单金额或抽奖次数不能为空') }}</span>
        </div> -->
      </span>
      <span slot="3" class="gift-limit-box">
        <el-form-item prop="createTime" class="gift-limit-multy">
          <ody-input-number
            :decimal="2"
            v-model="orderDrawObj.orderDrawAmount3"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 3"
            name="orderDrawObj_orderDrawAmount3"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('元') }}</span>
          <span>{{ $t('可获得抽奖次数') }}</span>
          <ody-input-number
            v-model="orderDrawObj.drawTimesPerOrder3"
            :disabled="+lotteryThemeViewContent.orderDrawType !== 3"
            name="orderDrawObj_drawTimesPerOrder3"
            class="gift-limit-multy"
            @change="handleGiftRuleChange"
          />
          <span>{{ $t('次') }}</span>
        </el-form-item>
        <!-- <div v-if="notOrderDraw && +lotteryThemeViewContent.orderDrawType === 3" class="color-red">
          <span>{{ $t('订单金额或抽奖次数不能为空') }}</span>
        </div> -->
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
    orderDraw: {
      type: Object,
      default: () => {}
    },
    selected: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      notOrderDraw: false,
      lotteryThemeViewContent: {
        orderDrawType: 1
      },
      orderDrawObj: {
        orderDrawAmount1: '',
        drawTimesPerOrder1: '',
        orderDrawAmount2: '',
        drawTimesPerOrder2: '',
        orderDrawAmount3: '',
        drawTimesPerOrder3: '',
        orderDrawType: ''
      },
      giftPromotion: {
        giftLimit4Multy: '',
        promotionGiftRule: ''
      }
    }
  },
  mounted() {
    console.log(this.orderDraw)
    if (this.orderDraw) {
      if (this.orderDraw.orderDrawType) {
        this.orderDrawObj = this.orderDraw
        this.lotteryThemeViewContent.orderDrawType = this.orderDrawObj.orderDrawType
      }
    }
  },
  methods: {
    async remote() {
      if (this.lotteryThemeViewContent.orderDrawType === 1) {
        if (
          this.orderDrawObj.orderDrawAmount1 === '' ||
          this.orderDrawObj.drawTimesPerOrder1 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else if (this.lotteryThemeViewContent.orderDrawType === 2) {
        if (
          this.orderDrawObj.orderDrawAmount2 === '' ||
          this.orderDrawObj.drawTimesPerOrder2 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else if (this.lotteryThemeViewContent.orderDrawType === 3) {
        if (
          this.orderDrawObj.orderDrawAmount3 === '' ||
          this.orderDrawObj.drawTimesPerOrder3 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else {
        this.notOrderDraw = false
      }
    },
    handleGiftRuleChange(val) {
      if (this.lotteryThemeViewContent.orderDrawType === 1) {
        if (
          this.orderDrawObj.orderDrawAmount1 === '' ||
          this.orderDrawObj.drawTimesPerOrder1 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else if (this.lotteryThemeViewContent.orderDrawType === 2) {
        if (
          this.orderDrawObj.orderDrawAmount2 === '' ||
          this.orderDrawObj.drawTimesPerOrder2 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else if (this.lotteryThemeViewContent.orderDrawType === 3) {
        if (
          this.orderDrawObj.orderDrawAmount3 === '' ||
          this.orderDrawObj.drawTimesPerOrder3 === ''
        ) {
          this.notOrderDraw = true
          return false
        }
      } else {
        this.notOrderDraw = false
      }
      this.orderDrawObj.orderDrawType = this.lotteryThemeViewContent.orderDrawType
      if (val === 1) {
        this.giftPromotion.giftLimit4Multy = null
      }
      this.$emit('orderDrawObj', this.orderDrawObj)
    }
  }
}
</script>

<style lang="scss" scoped>
.cp-restrictions-time-scope {
  /deep/ {
    .el-radio {
      display: block;
      margin-bottom: 10px;
    }
  }
  .gift-limit-box {
    /deep/ {
      .el-input-group__append {
        width: 128px;
      }
    }
  }
  .gift-limit-multy {
    font-size: 14px;
    width: 80px;
    display: inline-block;
    line-height: 32px;
  }
  .color-red {
    color: #f56c6c;
  }
}
</style>
