const socialBackUrl = 'social-back-web'
const socialUrl = 'social-web'

export default {
  getSensitiveWord: {
    url: socialBackUrl + '/review/sensitiveWord/get',
    method: 'post'
  },
  updateSensitiveWord: {
    url: socialBackUrl + '/review/sensitiveWord/update',
    method: 'post'
  },
  updateConsultAndQaConfig: {
    url: socialUrl + '/public/page/update?pool=social',
    method: 'post'
  },
  getConsultConfig: {
    url: socialUrl + '/public/page/get?pool=social&key=consultConfig',
    method: 'get'
  },
  getQuestionAnswerConfig: {
    url: socialUrl + '/public/page/get?pool=social&key=qaConfig',
    method: 'get'
  },
  getMPCommentInfo: {
    url: socialBackUrl + '/review/comment/getMPCommentInfo',
    method: 'get'
  },
  listProductCommentPage: {
    url: socialBackUrl + '/review/comment/get',
    method: 'post'
  },
  listProductCommentReplyPage: {
    url: socialBackUrl + '/review/comment/getReply',
    method: 'post'
  },
  replyProductComment: {
    url: socialBackUrl + '/review/comment/reply',
    method: 'post'
  },
  passProductComment: {
    url: socialBackUrl + '/review/comment/check',
    method: 'post'
  },
  topProductComment: {
    url: socialBackUrl + '/review/comment/top',
    method: 'post'
  },
  passProductCommentByFilter: {
    url: socialBackUrl + '/review/comment/checkByfilter',
    method: 'post'
  },
  getConsultTypeList: {
    url: socialBackUrl + '/consultType/getConsultTypeList.do',
    method: 'post'
  },
  getMerchantCategoryTree: {
    url: socialBackUrl + '/merchantCategory/read/getMerchantCategoryTree',
    method: 'post'
  },
  getConsultList: {
    url: socialBackUrl + '/consult/getConsultList.do',
    method: 'post'
  },
  updateConsultStatus: {
    url: socialBackUrl + '/consult/updateConsultStatus',
    method: 'post'
  },
  auditStatus: {
    url: socialBackUrl + '/consult/auditStatus',
    method: 'post'
  },
  getConsultAnswerList: {
    url: socialBackUrl + '/consult/getConsultAnswerList',
    method: 'post'
  },
  answerTheConsult: {
    url: socialBackUrl + '/consult/answerTheConsult',
    method: 'post'
  },
  // APP 版本查询
  queryAllAppDict: {
    url: socialBackUrl + '/appDict/queryAllAppDict',
    method: 'post'
  },
  queryAppDetailList: {
    url: socialBackUrl + '/appDict/queryAppDetailList',
    method: 'post'
  },
  deleteApp: {
    url: socialBackUrl + '/appDict/deleteApp',
    method: 'post'
  },
  fixUpdateType: {
    url: socialBackUrl + '/appDict/fixUpdateType',
    method: 'post'
  },
  updateAppDetail: {
    url: socialBackUrl + '/appDict/updateAppDetail',
    method: 'post'
  },
  listPost: {
    url: socialBackUrl + '/postDev/listPage',
    method: 'post'
  },
  changePostTop: {
    url: socialBackUrl + '/post/changeTop',
    method: 'post'
  },
  changePostStatus: {
    url: socialBackUrl + '/post/changeStatus',
    method: 'post'
  },
  createPost: {
    url: socialBackUrl + '/post/createPost',
    method: 'post'
  },
  updatePost: {
    url: socialBackUrl + '/post/updatePost',
    method: 'post'
  },
  getPostInfo: {
    url: socialBackUrl + '/post/getPostInfo',
    method: 'post'
  },
  postCommentListPage: {
    url: socialBackUrl + '/postComment/listPage',
    method: 'post'
  },
  postCommentBatchAuditSuccess: {
    url: socialBackUrl + '/postDev/batchAuditSuccess',
    method: 'post'
  },
  postCommentBatchAuditFailure: {
    url: socialBackUrl + '/postComment/batchAuditFailure',
    method: 'post'
  },
  postCommentBatchCancelAudit: {
    url: socialBackUrl + '/postComment/batchCancelAudit',
    method: 'post'
  },
  newPostCommentBatchCancelAudit: {
    url: socialBackUrl + '/postClassify/newBatchCancelAudit',
    method: 'post'
  },
  createLive: {
    url: socialBackUrl + '/live/add',
    method: 'post'
  },
  updateLive: {
    url: socialBackUrl + '/live/update',
    method: 'post'
  },
  getLiveInfo: {
    url: socialBackUrl + '/live/getLiveInfo',
    method: 'post'
  },
  changeLiveTop: {
    url: socialBackUrl + '/live/changeTop',
    method: 'post'
  },
  changeLiveStatus: {
    url: socialBackUrl + '/live/update',
    method: 'post'
  },
  deleteLive: {
    url: socialBackUrl + '/live/deleteLive',
    method: 'post'
  },
  // 设置是否仅评论人可见
  setIsCommentatorSee: {
    url: socialBackUrl + '/review/comment/setIsCommentatorSee',
    method: 'post'
  },
  postCount: {
    url: socialBackUrl + '/post/postCount',
    method: 'post'
  },
  newPostCount: {
    url: socialBackUrl + '/postDev/newPostCount',
    method: 'post'
  },
  auditPost: {
    url: socialBackUrl + '/post/auditPost',
    method: 'post'
  },
  auditPostRedev: {
    url: socialBackUrl + '/postDev/auditPost',
    method: 'post'
  }

}
