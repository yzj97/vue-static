export default {
  getPrivateTemplate: {
    url: `crm-web/api/wechat/getPrivateTemplate.do`,
    method: 'post'
  },
  batchSendMessage: {
    url: 'crm-web/wechatMessage/batchSendMessage.do',
    method: 'post'
  },
  listAuthDevice: {
    url: '/crm-web/guideDevice/listAuthDevice',
    method: 'post'
  },
  queryLastChatInfo: {
    url: '/crm-web/wechatMessage/queryLastChatInfo',
    method: 'post'
  },
  mpSalesRankingList: {
    url: '/obi-web/rankingList/mpSalesRankingList.do',
    method: 'get'
  },
  listStoreMpByName: {
    url: '/back-product-web2/extra/merchantProduct/listStoreMpByName',
    method: 'post'
  },
  // 查询朋友圈列表
  listPage: {
    url: '/crm-web/wechatMoment/listPage',
    method: 'post'
  },
  // 点赞朋友圈
  interact: {
    url: '/crm-web/wechatMoment/interact',
    method: 'post'
  },
  // 同意好友申请
  acceptFriend: {
    url: '/crm-web/wechatNewFriend/acceptFriend',
    method: 'post'
  },
  // 查询新的朋友列表
  wechatNewFriend: {
    url: '/crm-web/wechatNewFriend/listPage',
    method: 'post'
  },
  // 查询消息列表
  queryMessage: {
    url: '/crm-web/wechatMessage/queryMessage',
    method: 'post'
  },
  // 发送聊天内容
  sendMessage: {
    url: '/crm-web/wechatMessage/sendMessage',
    method: 'post'
  },
  // 查询微信群成员
  wechatGroupMember: {
    url: '/crm-web/wechatGroupMember/listPage',
    method: 'post'
  },
  guideTalkSkill: {
    url: '/crm-web/guideTalkSkill/add',
    method: 'post'
  },
  getTalkListPage: {
    url: '/crm-web/guideTalkSkill/listPage',
    method: 'post'
  },
  getStringValue: {
    url: '/crm-web/public/page/getStringValue.do',
    method: 'get'
  },
  queryAllChannelSchema: {
    url: 'ouser-web/api/channel/queryAllChannelSchema.do',
    method: 'post'
  }
}
