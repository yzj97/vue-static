<template>
  <el-radio-group v-model="promotionMethod" name="promotionMethod" @change="changePromotionMethod">
    <!--多少元任选多少件-->
    <el-radio :label="12">
      <el-input v-model="xFavourableCondition" :disabled="promotionMethod === 13" name="xFavourableCondition" type="text" maxlength="10" style="width: 100px;" @blur="changeXyuanYjianActivity"/>
      <!--{{ $t('optional_element') }}-->
      元任选
      <el-input v-model="xFavourableContent" :disabled="promotionMethod === 13" name="xFavourableContent" type="text" maxlength="10" style="width: 100px;" @blur="changeXyuanYjianActivity"/>
      <!--{{ $t('piece') }}-->
      件
      <el-tooltip :content="getTips1()" class="item" effect="dark" placement="top">
        <i class="el-icon-question"/>
      </el-tooltip>
    </el-radio>
    <!--任选多少件付多少元-->
    <el-radio :label="13">
      <!--{{ $t('optional') }}-->
      任选
      <el-input v-model="yFavourableCondition" :disabled="promotionMethod === 12" name="yFavourableCondition" type="text" maxlength="10" style="width: 100px;" @blur="changeXjianYjianActivity"/>
      <!--{{ $t('piece') }},{{ $t('pay') }}-->
      件,付
      <el-input v-model="yFavourableContent" :disabled="promotionMethod === 12" name="yFavourableContent" type="text" maxlength="10" style="width: 100px;" @blur="changeXjianYjianActivity"/>
      <!--{{ $t('piece') }}-->
      件
      <el-tooltip :content="getTips2()" style="width: 500px;" class="item" effect="dark" placement="top">
        <i class="el-icon-question"/>
      </el-tooltip>
    </el-radio>
  </el-radio-group>
</template>

<script>
export default {
  props: {
    promotionMethod: {
      type: Number,
      default() {
        return 12
      }
    },
    xFavourableCondition: {
      type: Number,
      default() {
        return ''
      }
    },
    xFavourableContent: {
      type: Number,
      default() {
        return ''
      }
    },
    yFavourableCondition: {
      type: Number,
      default() {
        return ''
      }
    },
    yFavourableContent: {
      type: Number,
      default() {
        return ''
      }
    }
  },
  data() {
    return {

    }
  },
  async mounted() {

  },
  methods: {
    changePromotionMethod(value) {
      this.$emit('update:promotionMethod', value)
      if (value === 12) {
        this.pickXModel()
      } else if (value === 13) {
        this.pickYModel()
      }
    },
    changeXyuanYjianActivity() {
      this.$emit('update:xFavourableCondition', this.xFavourableCondition)
      this.$emit('update:xFavourableContent', this.xFavourableContent)
    },
    changeXjianYjianActivity() {
      this.$emit('update:yFavourableCondition', this.yFavourableCondition)
      this.$emit('update:yFavourableContent', this.yFavourableContent)
    },
    pickXModel() {
      this.yFavourableCondition = ''
      this.yFavourableContent = ''
      this.changeXjianYjianActivity()
    },
    pickYModel() {
      this.xFavourableCondition = ''
      this.xFavourableContent = ''
      this.changeXyuanYjianActivity()
    },
    getTips1() {
      return 'N' + this.$t('optional_element') + 'M' + this.$t('piece') + this.$t('for_example') + '：99' + this.$t('element') + '3' +
      this.$t('piece') + '，' + this.$t('free_shipping') + '。' + this.$t('if_the_order_is_only_purchased') + '3' + this.$t('goods_that_conform_to_the_scope_of_the_active_commodity') + '，' +
      this.$t('the_order_user_pays') + '99' + this.$t('element') + '；' + this.$t('if_the_order_is_purchased') + '4' + this.$t('piece') + this.$t('符合活动商品范围的商品，4') +
      this.$t('piece') + this.$t('中平台价最便宜的商品价格为40') + this.$t('element') + '，' + this.$t('the_order_user_pays') + '99+40=139' + this.$t('element') + '。'
    },
    getTips2() {
      return this.$t('optional') + 'M' + this.$t('a_pay') + 'N' + this.$t('piece') + this.$t('for_example') + '，' + this.$t('optional') + '3' +
        this.$t('a_pay') + '2' + this.$t('piece') + '，' + this.$t('free_shipping') + '，' + this.$t('if_the_order_is_only_purchased') + '3' +
        this.$t('goods_that_conform_to_the_scope_of_the_active_commodity') + '，' + this.$t('commodity_prices_are') + '70' + this.$t('element') + '、60' + this.$t('element') + '、50' +
        this.$t('element') + '，' + this.$t('the_order_user_pays') + '130' + this.$t('element') + '；' + this.$t('if_the_order_is_purchased') + '4' + this.$t('piece') + this.$t('符合活动商品范围的商品，') +
        this.$t('commodity_prices_are') + '70' + this.$t('element') + '、60' + this.$t('element') + '、50' + this.$t('element') + '，40' +
        this.$t('element') + '，4' + this.$t('piece') + this.$t('中平台价最便宜的商品价格为40') + this.$t('element') + '，' + this.$t('the_order_user_pays') + '130+40=170' + this.$t('element') + '。'
    }
  }
}
</script>
