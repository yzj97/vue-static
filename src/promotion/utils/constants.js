export default {
  applyActivityTypeList: [{
    value: -1,
    label: '全部'
  },
  {
    value: 1,
    label: '单一促销'
  }
  ],
  registrationTypeList: [
    {
      value: -1,
      label: '全部'
    },
    {
      value: 0,
      label: '待开始'
    },
    {
      value: 1,
      label: '报名中'
    },
    {
      value: 2,
      label: '已结束'
    }
  ],
  activityStatus: [{
    value: 0,
    label: '待提交'
  },
  {
    value: 1,
    label: '待审核'
  },
  {
    value: 2,
    label: '未开始'
  },
  {
    value: 3,
    label: '审核未通过'
  },
  {
    value: 4,
    label: '进行中'
  },
  {
    value: 5,
    label: '已过期'
  },
  {
    value: 6,
    label: '已关闭'
  }
  ],
  couponSendTimingList: [{
    value: 1,
    label: '订单已支付'
  },
  {
    value: 2,
    label: '订单已收货'
  },
  {
    value: 3,
    label: '订单已完成'
  }
  ],
  couponListStatus: [{
    value: -1,
    label: '全部'
  },
  {
    value: 4,
    label: '进行中'
  },
  {
    value: 5,
    label: '已失效'
  },
  {
    value: 6,
    label: '已关闭'
  },
  {
    value: 2,
    label: '未开始'
  },
  {
    value: 0,
    label: '待提交'
  },
  {
    value: 1,
    label: '待审核'
  },
  {
    value: 3,
    label: '审核未通过'
  }
  ],
  promotionTypeList: [{
    value: -1,
    label: '全部'
  },
  {
    value: 4,
    label: '进行中'
  },
  {
    value: 2,
    label: '未开始'
  }
  ],
  couponThemeListMap: [{
    value: -1,
    label: '全部'
  },
  {
    value: 0,
    label: '已发行'
  },
  {
    value: 1,
    label: '可使用'
  },
  {
    value: 2,
    label: '已使用'
  },
  {
    value: 4,
    label: '已过期'
  },
  {
    value: 3,
    label: '已作废'
  }
  ],
  freePromotionTypeList: [{
    id: 2,
    label: '整单包邮'
  },
  {
    id: 1,
    label: '单品包邮'
  }
  ],
  activityTypeList: [{
    value: 1,
    label: '自建'
  }, {
    value: 2,
    label: '报名'
  }],
  singlePromotionContentType: [{
    id: 1,
    text: '特价促销'
  },
  {
    id: 2,
    text: '折扣促销'
  },
  {
    id: 3,
    text: '直降促销'
  }
  ],
  repurchasePromotionContentType: [{
    id: 1,
    text: '满金额换购'
  },
  {
    id: 2,
    text: '买商品换购'
  }
  ],
  cycleTimeWeekListData: [{
    value: 1,
    label: '每周一'
  },
  {
    value: 2,
    label: '每周二'
  },
  {
    value: 3,
    label: '每周三'
  },
  {
    value: 4,
    label: '每周四'
  },
  {
    value: 5,
    label: '每周五'
  },
  {
    value: 6,
    label: '每周六'
  },
  {
    value: 7,
    label: '每周日'
  }
  ],
  paymentPreferencesMethod: [{
    id: 15,
    text: '满减'
  },
  {
    id: 16,
    text: '折扣'
  }
  ],
  composeMethod: [{
    id: 12,
    text: 'N元任选M件'
  },
  {
    id: 13,
    text: '任选M件付N件'
  }
  ],
  bargainPromotionType: [{
    id: 0,
    text: '固定金额'
  },
  {
    id: 1,
    text: '随机金额'
  },
  {
    id: 2,
    text: '限制次数'
  }
  ],
  xofferPromotion: [{
    'id': 1032,
    'text': '第X件Y折'
  }, {
    'id': 1033,
    'text': '第X件Y元'
  }, {
    'id': 1034,
    'text': '满X件Y折'
  }],
  // 全局促销类型
  allPromotionTypes: [{
    'id': 1,
    'text': '单一促销',
    'children': [{
      'id': 1,
      'text': '特价'
    }, {
      'id': 7,
      'text': '折扣'
    }, {
      'id': 8,
      'text': '直降'
    }]
  }, {
    'id': 2,
    'text': '满额促销',
    'children': [{
      'id': 1001,
      'text': '折扣'
    }, {
      'id': 1002,
      'text': '减价'
    }]
  }, {
    'id': 3,
    'text': '满量促销',
    'children': [{
      'id': 1003,
      'text': '折扣'
    }, {
      'id': 1004,
      'text': '减价'
    }]
  }, {
    'id': 4,
    'text': '赠送类促销',
    'children': [{
      'id': 1005,
      'text': '满额赠'
    }, {
      'id': 1006,
      'text': '满量赠送'
    }, {
      'id': 1007,
      'text': '买赠'
    }]
  }, {
    'id': 7,
    'text': '秒杀促销',
    'children': [{
      'id': 1012,
      'text': '秒杀'
    }]
  }, {
    'id': 8,
    'text': '闪购促销',
    'children': [{
      'id': 1013,
      'text': '闪购'
    }]
  }, {
    'id': 9,
    'text': '包邮促销',
    'children': [{
      'id': 1014,
      'text': '满额包邮'
    }, {
      'id': 1015,
      'text': '满量包邮'
    }]
  }, {
    'id': 10,
    'text': '组合促销',
    'children': [{
      'id': 1016,
      'text': 'X元Y件'
    }, {
      'id': 1017,
      'text': 'X件付Y件'
    }]
  }, {
    'id': 11,
    'text': '换购促销',
    'children': [{
      'id': 1018,
      'text': '满额换购'
    }, {
      'id': 1019,
      'text': '满量换购'
    }]
  }, {
    'id': 12,
    'text': '支付优惠',
    'children': [{
      'id': 1020,
      'text': '满减优惠'
    }, {
      'id': 1021,
      'text': '折扣'
    }]
  }, {
    'id': 13,
    'text': '预售促销',
    'children': [{
      'id': 1022,
      'text': '定金预售'
    }, {
      'id': 1024,
      'text': '全款预售'
    }]
  }, {
    'id': 14,
    'text': '秒杀促销',
    'children': [{
      'id': 1023,
      'text': '秒杀促销'
    }]
  }, {
    'id': 15,
    'text': '套餐优惠',
    'children': [{
      'id': 1025,
      'text': '套餐优惠'
    }]
  }, {
    'id': 16,
    'text': '试用活动',
    'children': [{
      'id': 1026,
      'text': '试用活动'
    }]
  }, {
    'id': 17,
    'text': '众筹促销',
    'children': [{
      'id': 1031,
      'text': '众筹促销'
    }]
  }, {
    'id': 18,
    'text': '单品X件优惠',
    'children': [{
      'id': 1032,
      'text': '第X件Y折'
    }, {
      'id': 1033,
      'text': '第X件Y元'
    }, {
      'id': 1034,
      'text': '满X件Y折'
    }]
  }, {
    'id': 2000,
    'text': '拼团',
    'children': [{
      'id': 2001,
      'text': '单拼'
    }, {
      'id': 2002,
      'text': '多拼'
    }]
  }, {
    'id': 3001,
    'text': '砍价',
    'children': [{
      'id': 3001,
      'text': '砍价'
    }]
  }, {
    'id': 5001,
    'text': '抽奖',
    'children': [{
      'id': 5001,
      'text': '抽奖'
    }]
  }, {
    'id': 6000,
    'text': '优惠券',
    'children': [{
      'id': 6001,
      'text': '电子券'
    }, {
      'id': 6002,
      'text': '实体券'
    }, {
      'id': 6002,
      'text': '红包券'
    }]
  }, { id: 8000, text: '推荐码', children: [{ id: 8000, text: '推荐码' }] }],
  // 优惠券发券类型
  couponGiveRuleList: {
    '1': [{
      value: 1,
      label: '指定用户发放'
    },
    {
      value: 2,
      label: '注册自动发放'
    },
    {
      value: 4,
      label: '前台领券'
    },
    {
      value: 8,
      label: '生日券'
    },
    {
      value: 11,
      label: '抽奖券'
    },
    {
      value: 12,
      label: '下单分享券'
    },
    {
      value: 17,
      label: '主动营销券'
    },
    {
      value: 18,
      label: '权益优惠券'
    },
    {
      value: 101,
      label: '发帖奖励券'
    },
    {
      value: 102,
      label: '福利券'
    }
    ],
    '2': [{
      value: 1,
      label: '指定用户发放'
    },
    {
      value: 2,
      label: '注册自动发放'
    },
    {
      value: 4,
      label: '前台领券'
    }
    ]
  },
  // 优惠方式
  couponTypeList: [{
    value: 0,
    label: '金额券'
  },
  {
    value: 1,
    label: '折扣券'
  }
  ],
  // 金额抵扣类型
  couponDeductionTypeList: [{
    value: 0,
    label: '商品券'
  },
  {
    value: 1,
    label: '运费券'
  }
  ],
  // 优惠券种类
  couponTypeMapList: [{
    value: 0,
    label: '电子券'
  },
  {
    value: 1,
    label: '实体券'
  }
  ],
  // 使用渠道
  channelArrList: [{
    value: 110001,
    label: '欧电云自建BBC'
  },
  {
    value: 110002,
    label: '欧电云自建B2B'
  },
  {
    value: 110003,
    label: '欧电云自建O2O'
  },
  {
    value: 120001,
    label: '欧电云自建POS'
  }
  ],
  // 适用范围
  applicationScopeList: [{
    value: 0,
    label: '全平台（平台券）'
  },
  {
    value: 11,
    label: '商家券'
  }
  ],
  applicationScopeList1: [{
    value: 0,
    label: '全平台（平台券）'
  }],
  applicationScopeList2: [
    {
      value: 11,
      label: '商家券'
    }
  ],
  // 优惠券-查看任务-任务状态
  sendCouponStatusList: [{
    value: 0,
    label: '发送中'
  },
  {
    value: 1,
    label: '成功'
  },
  {
    value: 2,
    label: '失败'
  }
  ],
  awardsLevelType: [{
    value: 0,
    label: '一等奖'
  },
  {
    value: 1,
    label: '二等奖'
  },
  {
    value: 2,
    label: '三等奖'
  },
  {
    value: 3,
    label: '四等奖'
  },
  {
    value: 4,
    label: '五等奖'
  },
  {
    value: 5,
    label: '六等奖'
  }
  ],
  statusRestrictionsMap: [{
    value: -1,
    label: '全部'
  },
  {
    value: 1,
    label: '已启用'
  },
  {
    value: 0,
    label: '已禁用'
  }
  ],
  channelCodesList: [{
    value: 110001,
    label: '欧电云自建BBC'
  },
  {
    value: 110002,
    label: '欧电云自建B2B'
  },
  {
    value: 110003,
    label: '欧电云自建O2O'
  }
  ],
  promotionMethodList: [{
    value: 3,
    label: ' 满额减'
  },
  {
    value: 2,
    label: '满额折'
  }
  ],
  selectionRangeTypeList: [{
    value: 2,
    label: ' 部分参与'
  },
  {
    value: 1,
    label: '全场参与'
  }
  ],
  promotionCanUseCouponList: [{
    value: 0,
    label: '是'
  },
  {
    value: 1,
    label: '否'
  }
  ],
  promotionFreeShippingList: [{
    value: 1,
    label: '是'
  },
  {
    value: 0,
    label: '否'
  }
  ],
  unitTypeMap: [{
    value: 0,
    label: '请选择周期'
  },
  {
    value: 1,
    label: '天'
  },
  {
    value: 2,
    label: '周'
  },
  {
    value: 3,
    label: '月'
  },
  {
    value: 4,
    label: '季度'
  },
  {
    value: 5,
    label: '年'
  }
  ],
  trialReportList: [
    {
      value: -1,
      label: '全部'
    },
    {
      value: 0,
      label: '待提交'
    },
    {
      value: 1,
      label: '待提交'
    },
    {
      value: 2,
      label: '待提交'
    },
    {
      value: 3,
      label: '待发布'
    },
    {
      value: 4,
      label: '已发布'
    }
  ],
  lotteryTemplateMap: [
    { value: 1, label: '大转盘' }
  ],
  lotteryTypeMap: [
    { value: 1, label: '无订单抽奖' },
    { value: 2, label: '订单抽奖' }
  ]
}
