<template>
  <span>
    <!-- {{ detailData }} -->
    <div v-for="(e, index) in getFavourableList" :key="index">
      <span v-show="favourableShow(1,3)">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('元') }}，{{ $t('减') }}{{ e.favourableContent }}{{ $t('元') }}
      </span>
      <span v-show="favourableShow(1,2)">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('元') }}，{{ $t('打') }}{{ e.favourableContent }}{{ $t('折') }}
      </span>
      <span v-show="favourableShow(1,15)">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('元') }}，{{ $t('减') }}{{ e.favourableContent }}{{ $t('元') }}
      </span>
      <span v-show="favourableShow(1,16)">
        {{ $t('打') }}{{ e.favourableContent }}{{ $t('折') }}
        <span v-show="e.favourableContentLimit">
          ，{{ $t('优惠上限') }}{{ e.favourableContentLimit }}{{ $t('元') }}
        </span>
      </span>
      <span v-show="favourableShow(2,3)">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('减') }}{{ e.favourableContent }}{{ $t('元') }}
      </span>
      <span v-show="favourableShow(2,2) && detailData.promotionType != 18">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('打') }}{{ e.favourableContent }}{{ $t('折') }}
      </span>
      <span v-show="favourableShow(2,12)">
        {{ e.favourableContent }}{{ $t('元任选') }}{{ e.favourableCondition }}{{ $t('件') }}
      </span>
      <span v-show="favourableShow(2,13)">
        {{ $t('认选') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('付') }}{{ e.favourableContent }}{{ $t('件') }}
      </span>
      <span v-show="favourableShow(1,11)">
        {{ $t('订单满') }}{{ e.favourableCondition }}{{ $t('元包邮') }}
      </span>
      <span v-show="favourableShow(2,11)">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('件包邮') }}
      </span>
      <!--定金预售-->
      <span v-show="favourableShow(2,17)">
        {{ $t('一笔订单达') }}{{ e.favourableCondition }} {{ $t('件以上') }}，{{ $t('预售价') }}，{{ $t('减') }}{{ e.favourableContent }} {{ $t('元') }}
      </span>
      <span v-show="favourableShow(3,17)">
        {{ $t('前') }}{{ e.favourableCondition }} {{ getConditionValueUnitValue(e.conditionValueUnit) }}{{ $t('购买') }}，{{ $t('减') }}{{ e.favourableContent }} {{ $t('元') }}
      </span>
      <!--全款预售-->
      <span v-show="favourableShow(2,19)">
        {{ $t('一笔订单达') }}{{ e.favourableCondition }} {{ $t('件以上') }}，{{ $t('预售价') }}，{{ $t('减') }}{{ e.favourableContent }} {{ $t('元') }}
      </span>
      <span v-show="favourableShow(3,19)">
        {{ $t('前') }}{{ e.favourableCondition }} {{ getConditionValueUnitValue(e.conditionValueUnit) }}{{ $t('购买') }}，{{ $t('减') }}{{ e.favourableContent }} {{ $t('元') }}
      </span>
      <span v-show="favourableShow(6,24)">
        {{ $t('第') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('打') }}{{ e.favourableContent / 10 }} {{ $t('折') }}
      </span>
      <span v-show="favourableShow(6,25)">
        {{ $t('第') }}{{ e.favourableCondition }}{{ $t('件') }}{{ e.favourableContent / 100 }}{{ $t('元') }}
      </span>
      <!--满x件y折-->
      <span v-show="favourableShow(2,2) && detailData.promotionType == 18">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('打') }}{{ e.favourableContent / 10 }} {{ $t('折') }}
      </span>
      <span v-show="favourableShow(6,2) && detailData.promotionType == 18">
        {{ $t('满') }}{{ e.favourableCondition }}{{ $t('件') }}，{{ $t('打') }}{{ e.favourableContent / 10 }} {{ $t('折') }}
      </span>
    </div>
  </span>
</template>

<script>
import util from '@/utils/util'

export default {
  props: {
    detailData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
    }
  },
  computed: {
    getFavourableList() {
      return util.getFavourableList(this.detailData)
    }
  },
  methods: {
    favourableShow(conditionType, promotionMethod) {
      return (
        this.detailData.conditionType === conditionType &&
        this.detailData.promotionMethod === promotionMethod
      )
    },
    getConditionValueUnitValue(key) {
      const presellLadderTimeTypeConditionValueUnitArr = [{ 'id': 4, 'text': '天' }, { 'id': 5, 'text': '小时' }]
      const presellLadderTimeTypeConditionValueUnitArrMap = presellLadderTimeTypeConditionValueUnitArr.reduce((item, rtv) => {
        rtv[item.id] = item.text
        return rtv
      }, {})
      // 预售时间维度的条件单位
      return presellLadderTimeTypeConditionValueUnitArrMap[key]
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
