/* interests */
export default {
  dataTask_listPage: {
    url: 'crm-web/public/data/task/listPage',
    method: 'post'
  },
  downloadTask: {
    url: 'ouser-web/asyncexport/getAsyncEventList.do',
    method: 'get'
  },
  /* 批量查询字典表 */
  codeListMulti: {
    url: 'crm-web/public/config/listMulti',
    method: 'post'
  },
  /* 批量查询字典表 */
  codeSelect: {
    url: 'crm-web/public/config/select',
    method: 'get'
  },
  getSocialRuleByType: {
    url: '/social-back-web/rule/getByType',
    method: 'post'
  },
  updateSocialRule: {
    url: '/social-back-web/rule/update',
    method: 'post'
  },
  getStringValue: {
    url: '/crm-web/public/page/getStringValue',
    method: 'get'
  },
  getUserId: {
    url: '/crm-web/api/userInfo/getUserId.do',
    method: 'post'
  }
}
