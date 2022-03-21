
const PROMOTION_TYPE = [{ 'id': 1, 'text': '单一促销' }, { 'id': 2, 'text': '满额减' }, { 'id': 3, 'text': '满量' }, { 'id': 4, 'text': '赠送类' }, { 'id': 5, 'text': '招募' }, { 'id': 6, 'text': '升级' }, { 'id': 7, 'text': '秒杀' }, { 'id': 8, 'text': '组合' }, { 'id': 10, 'text': '组合' }, { 'id': 11, 'text': '买' }, { 'id': 14, 'text': '秒杀' }, { 'id': 15, 'text': '套餐优惠' }, { 'id': 17, 'text': '众筹' }, { 'id': 18, 'text': '单品X件优惠' }, { 'id': 9, 'text': '包邮' }, { 'id': 13, 'text': '预售' }, { 'id': 16, 'text': '试用活动' }]
const PATCH_GROUPON_STATUS_ALL = [{ 'id': -1, 'text': 'promotion.whole' }, { 'id': 0, 'text': 'promotion.to_be_submitted' }, { 'id': 1, 'text': 'promotion.to_be_audited' }, { 'id': 2, 'text': 'promotion.not_beginning' }, { 'id': 3, 'text': 'promotion.audit_failed_to_pass' }, { 'id': 4, 'text': 'promotion.have_in_hand' }, { 'id': 5, 'text': 'promotion.expired' }, { 'id': 6, 'text': 'promotion.closed' }]

const ACTIVITY_TYPE_ARRAY = [{ 'id': 1, 'text': '自建' }, { 'id': 2, 'text': '报名' }]

// 全局促销类型
const ALL_PROMOTION_TYPES = [{
  'id': 1, 'text': '单一促销', children: [{ 'id': 1, 'text': '特价' },
    { 'id': 7, 'text': '折扣' }, { 'id': 8, 'text': '直降' }]
},
{ 'id': 2, 'text': '满额促销', children: [{ 'id': 1001, 'text': '满额折' }, { 'id': 1002, 'text': '满额减' }] },
{ 'id': 3, 'text': '满量促销', children: [{ 'id': 1003, 'text': '满量折' }, { 'id': 1004, 'text': '满量减' }] },
{
  'id': 4, 'text': '赠送类促销', children: [{ 'id': 1005, 'text': '满额赠' }, { 'id': 1006, 'text': '满量赠' },
    { 'id': 1007, 'text': '买一赠一' }]
},
{ 'id': 7, 'text': '秒杀促销', children: [{ 'id': 1012, 'text': '秒杀' }] },
{ 'id': 8, 'text': '闪购', children: [{ 'id': 1013, 'text': '闪购' }] },
{ 'id': 9, 'text': '包邮促销', children: [{ 'id': 1014, 'text': '满额包邮' }, { 'id': 1015, 'text': '满量包邮' }] },
{ 'id': 10, 'text': '组合促销', children: [{ 'id': 1016, 'text': 'X元Y件' }, { 'id': 1017, 'text': 'X件付Y件' }] },
{ 'id': 11, 'text': '换购促销', children: [{ 'id': 1018, 'text': '满额换购' }, { 'id': 1019, 'text': '满量换购' }] },
{ 'id': 12, 'text': '支付优惠', children: [{ 'id': 1020, 'text': '满减优惠' }, { 'id': 1021, 'text': '打折优惠' }] },
{ 'id': 13, 'text': '预售', children: [{ 'id': 1022, 'text': '定金预售' }, { 'id': 1024, 'text': '全款预售' }] },
{ 'id': 14, 'text': '秒杀促销', children: [{ 'id': 1023, 'text': '秒杀促销' }] },
{ 'id': 15, 'text': '套餐', children: [{ 'id': 1025, 'text': '优惠套餐' }] },
{ 'id': 16, 'text': '试用活动', children: [{ 'id': 1026, 'text': '试用活动' }] },
{ 'id': 17, 'text': '众筹', children: [{ 'id': 1031, 'text': '众筹' }] },
{ 'id': 18, 'text': '第X件优惠', children: [{ 'id': 1032, 'text': '第X件Y折' }, { 'id': 1033, 'text': '第X件Y元' }, { 'id': 1034, 'text': '满X件Y折' }] },
{ 'id': 2000, 'text': '拼团', children: [{ 'id': 2001, 'text': '单拼' }, { 'id': 2002, 'text': '多拼' }] },
{ 'id': 3001, 'text': '砍价', children: [{ 'id': 3001, 'text': '砍价' }] },
{ 'id': 5001, 'text': '抽奖', children: [{ 'id': 5001, 'text': '抽奖' }] },
{
  'id': 6000, 'text': '优惠券', children: [{ 'id': 6001, 'text': '电子券' }, { 'id': 6002, 'text': '实体券' },
    { 'id': 6003, 'text': '红包' }]
},
{ 'id': 8000, 'text': '推荐码', children: [{ 'id': 8000, 'text': '推荐码' }] }
]

// 定金是否可退
// FIXME text国际化
const CAN_RETURN_PREMONEY = [{ 'id': 1, 'text': ('promotion.yes') }, { 'id': 0, 'text': ('promotion.no') }]

const CAN_USE_COUPON = [{ 'id': 0, 'text': 'promotion.yes' }, { 'id': 1, 'text': 'promotion.no' }]

const SINGLE_PROMOTION_OVERLIMIT_TYPE = [{ 'id': 1, 'text': 'promotion.purchase_at_the_original_price' },
  { 'id': 2, 'text': 'promotion.non_purchase' }]

const GIFT_TYPE = [{ 'id': 1, 'text': 'promotion.gift_of_goods' }, { 'id': 2, 'text': 'promotion.gift_coupon' }]

const GIFT_SAME_AS_PRODUCT_FLG = [{ 'id': 1, 'text': 'promotion.yes' }, { 'id': 2, 'text': 'promotion.no' }]

const GIFT_PROMOTION_GIFT_RULE = [{ 'id': 2, 'text': 'promotion.yes' + 'promotion.the_amount_of_times' },
  { 'id': 1, 'text': 'promotion.no' + 'promotion.excess' }]

const IS_SUPERPOSITION = [{
  'id': 1, 'text': 'promotion.yes' +
    '（' + 'promotion.the_amount_of_times' + '）'
},
{ 'id': 0, 'text': 'promotion.no' + '（' + 'promotion.excess' + '）' }]// 是否可叠加 0:否 超量 1:是 倍量

const PAYMENT_PROMOTION_CYCLE_TIME_WEEK = [{ 'id': 1, 'text': 'promotion.every_monday' },
  { 'id': 2, 'text': 'promotion.every_tuesday' },
  { 'id': 3, 'text': 'promotion.every_wednesday' },
  { 'id': 4, 'text': 'promotion.every_thursday' },
  { 'id': 5, 'text': 'promotion.every_friday' },
  { 'id': 6, 'text': 'promotion.every_saturday' },
  { 'id': 7, 'text': 'promotion.every_sunday' }]

// 全局促销类型(精确到每个细节类型)
const ALL_FRONT_PROMOTION_TYPES = [{ 'id': 1, 'text': 'promotion.single_special_price' },
  { 'id': 7, 'text': 'promotion.single_discount' },
  { 'id': 8, 'text': 'promotion.a_single_drop' },
  { 'id': 1001, 'text': 'promotion.full_discounts' },
  { 'id': 1002, 'text': 'promotion.full_price_reductions' },
  { 'id': 1003, 'text': 'promotion.full_discount' },
  { 'id': 1004, 'text': 'promotion.full_price_reduction' },
  { 'id': 1005, 'text': 'promotion.gift_class' + '-' + 'promotion.full_gift' },
  { 'id': 1006, 'text': 'promotion.gift_class' + '-' + 'promotion.full_amount_gift' },
  { 'id': 1007, 'text': 'promotion.gift_class' + '-' + 'promotion.buy_one_get_one_free' },
  { 'id': 1008, 'text': 'promotion.agent_recruitment' + '-' + 'promotion.full_recruitment' },
  { 'id': 1009, 'text': 'promotion.agent_recruitment' + '-' + 'promotion.full_recruitment' },
  { 'id': 1010, 'text': 'promotion.agent_upgrading' + '-' + 'promotion.full_upgrade' },
  { 'id': 1011, 'text': 'promotion.agent_upgrading' + '-' + 'promotion.full_scale_upgrade' },
  { 'id': 1012, 'text': 'promotion.seckill' },
  { 'id': 1013, 'text': 'promotion.flash_purchase' },
  { 'id': 1014, 'text': 'promotion.free_shipping' + '-' + 'promotion.full' + 'promotion.free_shipping' },
  { 'id': 1015, 'text': 'promotion.free_shipping' + '-' + 'promotion.full_amount' + 'promotion.free_shipping' },
  { 'id': 1016, 'text': 'promotion.combination' + '-X' + 'promotion.element' + 'Y' + 'promotion.piece' },
  { 'id': 1017, 'text': 'promotion.combination' + '-X' + 'promotion.piece' + 'promotion.pay' + 'Y' + 'promotion.piece' },
  { 'id': 1018, 'text': 'promotion.buy' + '-' + 'promotion.full' + 'promotion.buy' },
  { 'id': 1019, 'text': 'promotion.buy' + '-' + 'promotion.full_amount' + 'promotion.buy' },
  { 'id': 1020, 'text': 'promotion.discount' + '-' + 'promotion.full_cut' + 'promotion.discount' },
  { 'id': 1021, 'text': 'promotion.discount' + '-' + 'promotion.discount' + 'promotion.discount' },
  { 'id': 1022, 'text': 'promotion.deposit_in_advance' },
  { 'id': 1023, 'text': 'promotion.seckill' },
  { 'id': 2001, 'text': 'promotion.fight_groups' + '-' + 'promotion.a_single_spell' },
  { 'id': 2002, 'text': 'promotion.fight_groups' + '-' + 'promotion.how_to_spell' },
  { 'id': 3001, 'text': 'promotion.bargain' },
  { 'id': 4001, 'text': 'promotion.free_single' },
  { 'id': 5001, 'text': 'promotion.luck_draw' },
  { 'id': 6001, 'text': 'promotion.electronic_coupons' },
  { 'id': 6002, 'text': 'promotion.entity_coupons' },
  { 'id': 6003, 'text': 'promotion.red_package_coupons' },
  { 'id': 1032, 'text': 'promotion.xth_y_fold' },
  { 'id': 1033, 'text': 'promotion.xth_y_yuan' },
  { 'id': 1025, 'text': 'promotion.package_discount' },
  { 'id': 1034, 'text': 'promotion.full_x_pieces_y_fold' },
  { 'id': 8000, 'text': 'promotion.recommendation_code' }
]

// 预售时间维度的条件单位
const PRESELL_LADDER_TIME_TYPE_CONDITION_VALUE_UNITS = [{ 'id': 4, 'text': 'promotion.day' },
  { 'id': 5, 'text': 'promotion.hour' }]

const CONTENT_TYPE_ARRS = [
  {
    id: 1,
    children: [
      { 'id': 1, 'text': 'promotion.special_sale_promotion' },
      { 'id': 2, 'text': 'promotion.discount_promotion' },
      { 'id': 3, 'text': 'promotion.direct_drop_promotion' }
    ]
  },
  {
    id: 2,
    children: [
      { 'id': 3, 'text': 'promotion.full_capacity_reduction' },
      { 'id': 2, 'text': 'promotion.promotion.full_folding' }
    ]
  },
  {
    id: 3,
    children: [
      { 'id': 3, 'text': 'promotion.full_volume_reduction' },
      { 'id': 2, 'text': 'promotion.full_volume_fold' }
    ]
  },
  {
    id: 4,
    children: [
      { 'id': 1, 'text': 'promotion.buy_amount_to_give' },
      { 'id': 2, 'text': 'promotion.buy_goods_to_give' }
    ]
  },
  {
    id: 11,
    children: [
      { 'id': 1, 'text': 'promotion.full_amount_change' },
      { 'id': 2, 'text': 'promotion.buy_goods_for_purchase' }
    ]
  },
  {
    id: 18,
    children: [
      { 'id': 24, 'text': 'promotion.xth_y_fold' },
      { 'id': 25, 'text': 'promotion.xth_y_yuan' },
      { 'id': 2, 'text': 'promotion.full_x_pieces_y_fold' }
    ]
  }
]

// 第三方渠道提示 --start
const THIRD_CHANNEL_TIPS_MEITUAN = [{ 'id': 1, 'text': '美团单一促销提示' }, { 'id': 2, 'text': '美团满额促销提示' }, { 'id': 4, 'text': '美团赠送促销提示' }, { 'id': 18, 'text': '美团x件促销提示' }]
const THIRD_CHANNEL_TIPS_JD = [{ 'id': 1, 'text': '京东单一促销提示' }, { 'id': 2, 'text': '京东满额促销提示' }, { 'id': 3, 'text': '京东满量促销提示' }, { 'id': 4, 'text': '京东赠送促销提示' }, { 'id': 10, 'text': '京东组合促销提示' }]
// 第三方渠道提示 --end

// 状态位
const SUCCESS = '0'// 成功
const FAILED = '-1'// 失败
const NO_LOGGED_IN = '99'// 未登录或登录超时

export function getMeituanTips() {
  return THIRD_CHANNEL_TIPS_MEITUAN
}

export function getPromotionTypeValue() {
  return PROMOTION_TYPE
}

// 拼团活动状态
export function getGroupStatus() {
  return PATCH_GROUPON_STATUS_ALL
}

export function getJDTips() {
  return THIRD_CHANNEL_TIPS_JD
}

export function getActivityTypeArray() {
  return ACTIVITY_TYPE_ARRAY
}

export function getAllPromotionTypes() {
  return ALL_PROMOTION_TYPES
}

export function getContentTypeArrs() {
  return CONTENT_TYPE_ARRS
}

export function getSuccessStatus() {
  return SUCCESS
}

export function getFailedStatus() {
  return FAILED
}

export function getNoLoggedInStatus() {
  return NO_LOGGED_IN
}

export function getCanReturnPremoney() {
  return CAN_RETURN_PREMONEY
}

// 是否能叠加使用优惠券
export function getCanUseCoupon() {
  return CAN_USE_COUPON
}

// 单一促销类型的超限规则类型
export function getSinglePromotionOverlimitType() {
  return SINGLE_PROMOTION_OVERLIMIT_TYPE
}

export function getGiftSameAsProductFlg() {
  return GIFT_SAME_AS_PRODUCT_FLG
}

// 赠品类型
export function getGiftType() {
  return GIFT_TYPE
}

// 是否可叠加 0:否 超量 1:是 倍量
export function getIsSuperposition() {
  return IS_SUPERPOSITION
}

export function getGiftPromotionGiftRule() {
  return GIFT_PROMOTION_GIFT_RULE
}

// 支付优惠的循环时间——星期
export function getPaymentCycleTimeWeek() {
  return PAYMENT_PROMOTION_CYCLE_TIME_WEEK
}

// 预售时间维度的条件单位
export function getPresellLadderTimeTypeConditionValueUnits() {
  return PRESELL_LADDER_TIME_TYPE_CONDITION_VALUE_UNITS
}

// 全局促销类型
export function getAllFrontPromotionTypes() {
  return ALL_FRONT_PROMOTION_TYPES
}

export default {
  getInfo(Vue) {
    return {
      getSuccessStatus,
      getGiftSameAsProductFlg,
      getGiftType
    }
  }
}
