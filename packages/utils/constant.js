export default {
  storeBigTypeMap: {
    '0': '线上店铺',
    '1': '线下店铺'
  },
  storeBigTypeList: [
    { value: '0', label: '线上店铺' },
    { value: '1', label: '线下店铺' }
  ],
  allowList: [{ value: '1', label: '允许' }, { value: '0', label: '不允许' }],
  addressType: [
    { value: '0', label: '发货地址' },
    { value: '1', label: '退货地址' }
  ],
  isDefaultAddress: [{ value: '0', label: '否' }, { value: '1', label: '是' }],
  storeTypeList: [{ value: '1', label: '加盟' }, { value: '2', label: '直营' }],
  terminalSupplierList: [{ value: 'insight', label: 'insight' }],
  activityPlatformTypeList: [
    {
      value: 0,
      label: '自营平台'
    },
    {
      value: 1,
      label: '第三方平台'
    }
  ],
  givingTypeList: [
    {
      value: 0,
      label: '顺序'
    },
    {
      value: 1,
      label: '随机'
    }
  ],
  getGiftShowTypeList: [
    {
      value: 1,
      label: 'SPU'
    },
    {
      value: 2,
      label: 'SKU'
    }
  ],
  orderDateTypeList: [
    {
      value: 0,
      label: '付款时间'
    },
    {
      value: 2,
      label: '下单时间'
    }
  ],
  giftSameAsProductFlgList: [
    {
      value: 1,
      label: '是'
    },
    {
      value: 2,
      label: '否'
    }
  ],
  conditionTypeList: [
    {
      value: 1,
      label: '满金额赠'
    },
    {
      value: 2,
      label: '买商品赠'
    }
  ],
  overlayApplicationList: [
    {
      value: 1,
      label: '否（超量：按最高层级享受优惠）'
    },
    {
      value: 2,
      label: '是（倍量：每满一级优惠一次），上限'
    }
  ],
  giftTypeList: [
    {
      value: 1,
      label: '赠商品'
    },
    {
      value: 2,
      label: '赠优惠券'
    }
  ],
  warehouseTypes: [
    {
      value: 1,
      label: '中心仓'
    },
    {
      value: 2,
      label: '门店仓'
    }
  ],
  wmsSwitch: [{ value: 1, label: '是' }, { value: 0, label: '否' }],
  mappingAssignTypes: [
    {
      value: 1,
      label: '按比例'
    },
    {
      value: 3,
      label: '共享'
    }
  ],
  operPlatformPurchaseTypeMapping: [
    { value: 1, label: '普通采购' },
    { value: 2, label: '集团采购' }
  ],
  merchantPlatformPurchaseTypeMapping: [{ value: 1, label: '普通采购' }],
  purchasingStatusList: [
    { value: '1', label: '启用' },
    { value: '0', label: '停用' }
  ],
  cooperationMethod: [
    { value: '1', label: '启用' },
    { value: '2', label: '关闭' }
  ],
  cooperationMethodMapping: [
    { value: 1, label: '经销' },
    { value: 2, label: '代销' },
    { value: 3, label: '租赁' },
    { value: 4, label: '联营' }
  ],
  sexList: [{ value: 1, label: '男' }, { value: 2, label: '女' }],
  mainList: [{ value: 0, label: '否' }, { value: 1, label: '是' }],
  supplierBasicStatusList: [
    { value: 1, label: '启用' },
    { value: 0, label: '关闭' }
  ],
  attachTypeList: [
    { value: '1', label: '普通附件' },
    { value: '2', label: '资质证书' }
  ],
  enterpriseTypeMapping: [
    { value: '1', label: '国有企业' },
    { value: '2', label: '集体企业' },
    { value: '3', label: '股份制企业' },
    { value: '4', label: '中外合资企业' },
    { value: '5', label: '民营企业' },
    { value: '6', label: '外商独资企业' },
    { value: '7', label: '其他' }
  ],
  enterpriseTaxPayerTypeMapping: [
    { value: 1, label: '一般纳税人' },
    { value: 2, label: '小规模纳税人' }
  ],
  receiverAccountTypeMapping: [
    { value: 1, label: '支付宝' },
    { value: 6, label: '微信' },
    { value: 9, label: '网银' }
  ],
  isTaxIncludedMapping: [
    { value: 1, label: '含税' },
    { value: 2, label: '未税' }
  ],
  settlementPartyTypeMapping: [
    { value: 1, label: '总部' },
    { value: 2, label: '门店' }
  ],
  paymentSupplierMapping: [
    { value: 1, label: '自己' },
    { value: 2, label: '其他' }
  ],
  promotionSettingTypeList: [
    { value: 1 },
    { value: 2 }
  ],
  promotionActivityTypeList: [
    { value: 1, label: '自建' },
    { value: 2, label: '报名' }
  ],
  promotionActivityMoneyReturn: [
    { value: 1, label: '是' },
    { value: 0, label: '否' }
  ],
  promotionActivityPreType: [
    {
      value: 17,
      label: '定金（分定金、尾款两阶段支付）'
    }
  ],
  promotionActivityOneMoney: [
    { value: 1, label: '一口价' }
  ],
  promotionTogetherTimeLimit: [
    { value: 0, label: '不限制' },
    { value: 1, label: '限' }
  ],
  promotionGroupTime: [
    { value: 0, label: '不限制' },
    { value: 1, label: '限' }
  ],
  promotionCustomerLimit: [
    { value: 0, label: '不限制' },
    { value: 1, label: '仅限新用户' },
    { value: 2, label: '仅限老用户' }
  ],
  promotionCanUseCouponList: [
    { value: 0, label: '是' },
    { value: 1, label: '否' }
  ],
  promotionFreeShippingList: [
    { value: 1, label: '是' },
    { value: 0, label: '否' }
  ],
  promotionStatusList: [
    { value: 4, label: '进行中' },
    { value: 5, label: '已过期' },
    { value: 6, label: '已关闭' },
    { value: 2, label: '未开始' },
    { value: 0, label: '待提交' },
    { value: 1, label: '待审核' },
    { value: 3, label: '审核未通过' }
  ],
  lotteryType: [
    { value: 1, label: '大转盘' }
  ],
  rebateTypeList: [
    { value: 1, label: '佣金' }
  ],

  setRebateValue: [
    { value: 1, label: '订单实付商品金额百分比' },
    { value: 2, label: '或者按固定值：￥' }
  ],
  awardsLevelType: [
    { value: 1, label: '一等奖' },
    { value: 2, label: '二等奖' },
    { value: 3, label: '三等奖' },
    { value: 4, label: '四等奖' },
    { value: 5, label: '五等奖' },
    { value: 6, label: '六等奖' }
  ],
  prizeTypeList: [
    { value: 1, label: '商品' },
    { value: 2, label: '积分' },
    { value: 3, label: '优惠券' },
    { value: 4, label: '线下奖品' },
    { value: 0, label: '谢谢参与' }
  ],
  crmTaskTypeList: [
    { value: 1, label: '营销类' },
    { value: 2, label: '关怀类' },
    { value: 3, label: '通知类' },
    { value: 4, label: '其他' }
  ],
  crmTimeTypeList: [
    { value: 1, label: '定时一次执行' },
    { value: 2, label: '周期性执行' }
  ],
  crmCycleTypeList: [
    { value: 1, label: '每天' },
    { value: 2, label: '每周' },
    { value: 3, label: '每月' }
  ],
  crmCycleEndTypeList: [
    { value: 1, label: '无结束时间' },
    { value: 2, label: '执行次数' },
    { value: 3, label: '结束时间' }
  ],
  weekList: [
    { value: 1, label: '星期一' },
    { value: 2, label: '星期二' },
    { value: 3, label: '星期三' },
    { value: 4, label: '星期四' },
    { value: 5, label: '星期五' },
    { value: 6, label: '星期六' },
    { value: 7, label: '星期日' }
  ],
  conditionTypeMap: [
    { value: 1, label: '限购总额' },
    { value: 2, label: '限购商品' },
    { value: 3, label: '限购订单' }
  ],
  statusRestrictionsMap: [
    { value: '-1', label: '全部' },
    { value: '1', label: '已启用' },
    { value: '0', label: '已禁用' }
  ],
  timeScopeListMap: [
    { value: 3, label: '无期限，规则开始时间' },
    { value: 2, label: '按周期，每' },
    { value: 1, label: '自定义期限' }
  ],
  unitTypeMap: [
    { value: 1, label: '天' },
    { value: 2, label: '周' },
    { value: 3, label: '月' },
    { value: 4, label: '季度' },
    { value: 5, label: '年' }
  ],
  purchaseRestrictionsListMap: [
    { value: 1, label: '购买总额限制' },
    { value: 2, label: '下单数量限制' },
    { value: 3, label: '购买商品数量限制' }
  ],
  freeSettingPromotionList: [
    { id: 1 },
    { id: 2 }
  ],
  orderDrawTypeMap: [
    { value: 1, label: '单次消费订单金额' },
    { value: 2, label: '消费订单金额每满' },
    { value: 3, label: '累计消费订单金额' }
  ],
  selectionRangeTypeList: [
    { value: 2, label: ' 部分参与' },
    { value: 1, label: '全场参与' }
  ],
  promotionNumMethodList: [
    { value: 3, label: ' 满量减' },
    { value: 2, label: ' 满量折' }
  ],
  isSuperpositionMap: [
    { value: 0, label: '否（超量：按最高层级享受优惠）' },
    { value: 1, label: '是（倍量：每满一级优惠一次），上限' }
  ],
  advancePriceStatusList: [
    { value: '1', label: '启用' },
    { value: '2', label: '停用' }
  ],
  xofferPromotionMethod: [
    { value: 24, label: '第X件Y折' },
    { value: 25, label: '第X件Y元' },
    { value: 2, label: '满X件Y折' }
  ],
  xofferisSuperpositionMap: [
    { value: 0, label: '否（每层级优惠均能享受）' },
    { value: 1, label: '是（每满一级优惠一次），上限' }
  ],
  xofferisSuperpositionMaxMap: [
    { value: 0, label: '否（按最高层级仅减一次）' },
    { value: 1, label: '是（每满一级优惠一次），上限' }
  ],
  productScopeList: [
    { value: 0, label: '所有商品，每sku最多买' },
    { value: 1, label: '部分单品' }
  ],
  sendUserPhoneList: [
    { value: 1, label: '手动' },
    { value: 2, label: 'CSV模板导入' }
  ],
  effdateMethodKey: [
    { value: 1, label: '固定有效时间' },
    { value: 2, label: '自用户领取' }
  ],
  effdateMethodKeyOne: [
    { value: 1, label: '固定有效时间' }
  ],
  excludeCoupons: [
    { value: 0, label: '是' },
    { value: 1, label: '否' }
  ],
  excludePromotionActivities: [
    { value: 0, label: '是' },
    { value: 1, label: '否' }
  ],
  recommendDiscount: [
    { value: 1, label: '订单金额满' },
    { value: 2, label: '订单金额满' }
  ],
  promotionMethodList: [
    { value: 3, label: ' 满额减' },
    { value: 2, label: '满额折' }
  ],
  // 适用范围
  applicationScopeList: [
    { value: 0, label: '全平台（平台券）' },
    { value: 11, label: '商家券' }
  ],
  applicationScopeList1: [
    { value: 0, label: '全平台（平台券）' }
  ],
  applicationScopeList2: [
    { value: 11, label: '商家券' }
  ],
  // 优惠券面值种类
  couponFaceValueList: [
    { value: 0, label: '固定面值' },
    { value: 1, label: ' 随机面值' }
  ],
  couponSendTimingArr: [
    { 'id': 1, 'text': '订单已支付' },
    { 'id': 2, 'text': '订单已收货' },
    { 'id': 3, 'text': '订单已完成' }
  ],
  registrationTypeList: [
    { value: -1, label: '全部' },
    { value: 0, label: '待开始' },
    { value: 1, label: '报名中' },
    { value: 2, label: '已结束' }
  ],
  applyActivityTypeList: [
    { value: -1, label: '全部' },
    { value: 1, label: '单一促销' }
  ]
}
