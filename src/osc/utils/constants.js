export default {
  warnMessageType: {
    '.MEMBER': '会员',
    '.CONSUMER': '消费商',
    '.MANAGER': '客户经理'
  },
  mcAuditStatusOptions: [{
    value: 0,
    label: '请选择'
  },
  {
    value: 1,
    label: '用户未提交'
  },
  {
    value: 2,
    label: '用户已提交'
  },
  {
    value: 3,
    label: '运营未审核'
  },
  {
    value: 4,
    label: '运营审核通过'
  },
  {
    value: 5,
    label: '运营审核拒绝'
  }],
  smsTypeOptions: [{
    value: 0,
    label: '请选择'
  },
  {
    value: 1,
    label: '验证码类'
  },
  {
    value: 2,
    label: '普通营销类'
  }],
  typeOptions: [{
    value: 1,
    label: '财务审批'
  },
  {
    value: 2,
    label: '报销审批'
  },
  {
    value: 3,
    label: '采购计划审批'
  },
  {
    value: 4,
    label: '采购单'
  }],
  isAvailable: [
    {
      value: 0,
      label: '停用'
    },
    {
      value: 1,
      label: '启用'
    },
    {
      value: 2,
      label: '已注销'
    }
  ],
  sex: [
    {
      value: 0,
      label: '男'
    },
    {
      value: 1,
      label: '女'
    },
    {
      value: 2,
      label: '保密'
    }
  ],
  datePickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now()
    },
    shortcuts: [
      {
        text: '今天',
        onClick(picker) {
          picker.$emit('pick', new Date())
        }
      }
    ]
  },
  identitySubTypes: [
    {
      value: 11,
      label: '运营员工'
    },
    {
      value: 20,
      label: '商家主账号'
    },
    {
      value: 21,
      label: '商家员工'
    },
    {
      value: 30,
      label: '店铺主账号'
    },
    {
      value: 31,
      label: '店铺员工'
    }
  ],
  approvalResult: [
    {
      value: 0,
      label: '不通过'
    },
    {
      value: 1,
      label: '通过'
    }
  ],
  messageWarnType: {
    'REGISTER_SUCCESS': '注册成功',
    'CHANGE_LOGIN_PWD_SUC': '登入密码修改成功',
    'LOGIN_UNUSUAL': '会员异常登录',
    'USER_BIRTHDAY': '会员生日',
    'ORDER_CREATED': '会员下单完成',
    'ORDER_TO_PAID': '会员下单完成（未付款状态）',
    'ORDER_PAID': '会员下单完成（已付款状态）',
    'ORDER_CANCELLED': '取消订单付款失效',
    'ORDER_CANCELLED_PARTIAL': '取消订单部分发货',
    'ORDER_CANCELLED_USER': '取消订单手动取消',
    'BRANDMANU_DESPATCH': '品牌商发货',
    'ORDER_DESPATCH': '订单已发货',
    'PRODUCT_RETURN': '发起退货',
    'PRODUCT_RETURN_SUC': '退货成功',
    'PRODUCT_RETURN_OVER': '退货完成',
    'PRODUCT_RETURN_FAIL': '退货失败',
    'LEVEL_UPDATE': '会员/消费商等级升级',
    'REFUND_INITIAL': '发起退款',
    'REFUND_SUC': '退款成功',
    'REFUND_FAIL': '退款失败',
    'COUPON_EXPIRED': '优惠券过期提醒',
    'WITHDRAW_DEPOSIT_SUC': '提现成功',
    'WITHDRAW_DEPOSIT_FAIL': '提现失败',
    'COMMENTS_RECEIVE': '收到评论',
    'PRAISES_RECEIVE': '收到点赞',
    'REWARD_RECEIVE': '收到打赏',
    'NEW_FANS': '新粉丝',
    'CHANT_ROOM_CREATE': '直播私密聊天室创建成功',
    'DEPOSIT_PAYMENT': '定金支付成功',
    'REST_PAYMENT_BEGIN': '活动尾款支付前24小时',
    'REST_PAYMENT_END': '活动尾款支付结束前24小时',
    'FREE_ORDER': '免单',
    'ARRIVAL_GOODS': '到货通知',
    'CERTIFY_SYS_PASS': '实名认证系统审核通过',
    'CERTIFY_SYS_FAIL': '实名认证系统审核拒绝',
    'CERTIFY_MANUAL_PASS': '实名认证人工审核通过',
    'CERTIFY_MANUAL_FAIL': '实名认证人工审核拒绝',
    'CERTIFY_PASS_FIRORD': '实名认证完成通过并完成首单',
    'COUPON_PROVIDE': '优惠券发送',
    'COUPON_ACTIVITY': '优惠券活动提醒',
    'POINTS_RECEIVE': '积分到账',
    'POINTS_EXPIRED': '积分过期',
    'POINTSDEDUT_DEAL': '积分扣除-交易',
    'POINTSDEDUT_OTHERS': '积分扣除-其他',
    'RECEIVE_CONFIRM': '确认收货',
    'AUDIT_SUCCESS': '审核通过',
    'AUDIT_FAIL': '审核不通过',
    'SUBORDINATE': '有新下属加入',
    'DISTRIBUTOR_SUCCESS': '推客申请成功',
    'INCENTIVE_FUND': '有鼓励金收入',
    'REPRESENT_GAIN': '代言人资格获得',
    'BONUS_GAIN': '分红收入提醒',
    'CONFIRM_RECEIVE': '确认收货',
    'AFTER_SERVICE_START': '发起售后' }
}
