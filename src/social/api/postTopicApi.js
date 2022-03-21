const socialBackUrl = 'social-back-web'
export default {
  add: {
    url: socialBackUrl + '/postTopic/add',
    method: 'post'
  },
  update: {
    url: socialBackUrl + '/postTopic/update',
    method: 'post'
  },
  listPage: {
    url: socialBackUrl + '/postTopic/listPage',
    method: 'post'
  },
  listPageRedev: {
    url: socialBackUrl + '/postTopicCoupon/listPage',
    method: 'post'
  },
  getById: {
    url: socialBackUrl + '/postTopic/getById',
    method: 'post'
  },
  delete: {
    url: socialBackUrl + '/postTopic/delete',
    method: 'post'
  },
  changeTopicTop: {
    url: socialBackUrl + '/postTopic/changeTopicTop',
    method: 'post'
  },
  addRelationTopic: {
    url: socialBackUrl + '/postTopic/addRelationTopic',
    method: 'post'
  },
  changeTopicStatus: {
    url: socialBackUrl + '/postTopic/changeTopicStatus',
    method: 'post'
  }
}
