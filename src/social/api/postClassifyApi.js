const socialBackUrl = 'social-back-web'
export default {
  add: {
    url: socialBackUrl + '/postClassify/add',
    method: 'post'
  },
  update: {
    url: socialBackUrl + '/postClassify/update',
    method: 'post'
  },
  listPage: {
    url: socialBackUrl + '/postClassify/listPage',
    method: 'post'
  },
  enable: {
    url: socialBackUrl + '/postClassify/enable',
    method: 'post'
  },
  postClassifyRelation: {
    url: socialBackUrl + '/postClassify/postClassifyRelation',
    method: 'post'
  },
  listTopicCouponPage: {
    url: socialBackUrl + '/postTopicCoupon/listTopicCouponPage',
    method: 'post'
  },
  postTopicCouponRelation: {
    url: socialBackUrl + '/postTopicCoupon/postTopicCouponRelation',
    method: 'post'
  }
}
