<template>
  <el-form-item v-if="promType === 14 || promType === 1" :label="$t('overrun_rule')" required>
    <el-radio-group v-model="overlimitType" name="overlimitType" @change="overLimitChange">
      <el-radio v-for="item in overlimitTypeArr" :label="item.id" :key="item.id">
        {{ item.text }}
      </el-radio>
    </el-radio-group>
    <div>
      {{ $t('notes') }}：{{ $t('overrun_rule') }}{{ $t('that_the_number_of_goods_purchased_by_a_user_exceeds_the_number_of_active_purchases') }}（{{ $t('set_by_activity') }}"{{ $t('personal_limit_purchase_number') }}、{{ $t('total_number_of_activities') }}、{{ $t('every_single_purchase_number') }}"{{ $t('calculated') }}）{{ $t('post_purchase_rules') }}。
    </div>
  </el-form-item>
</template>

<script>
export default {
  props: {
    overlimitType: {
      type: Number,
      default() {
        return 1
      }
    },
    promType: {
      type: Number,
      default: -1
    }
  },
  data() {
    return {
      overlimitTypeArr: []
    }
  },
  async mounted() {
    const promotionAPI = this.$promotionStatic.$api.promotion
    // 获取超限规则信息
    await promotionAPI.loadOscConfigUrl('overlimitRule').then(response => {
      if (response.code === '0') {
        this.overlimitTypeArr = response.data.result
      }
    })
  },
  methods: {
    overLimitChange() {
      this.$emit('update:overlimitType', this.overlimitType)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
