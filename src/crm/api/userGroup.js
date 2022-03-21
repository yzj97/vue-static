/* interests */
export default {
  list: {
    url: 'crm-web/userGroup/list',
    method: 'post'
  },
  listPage: {
    url: 'crm-web/userGroup/listPage',
    method: 'post'
  },
  delete: {
    url: 'crm-web/userGroup/delete',
    method: 'post'
  },
  add: {
    url: '/crm-web/userGroup/add',
    method: 'post',
    params: {
      // 'groupName': '分组名称',
      // 'userClassifyId': 1,
      // 'conditionValue': '{}'
    }
  },
  update: {
    url: '/crm-web/userGroup/update',
    method: 'post',
    params: {
      // 'groupName': '分组名称',
      // 'userClassifyId': 1,
      // 'conditionValue': '{}'
    }
  },
  getScreenItem1: {
    url: '/crm-web/userGroup/getScreenItem/1',
    method: 'get'
  },
  getScreenItem2: {
    url: '/crm-web/userGroup/getScreenItem/2',
    method: 'get'
  },
  downloadTemplate: {
    url: '/crm-web/userGroup/downloadTemplate',
    method: 'get'
  },
  asyncImport: {
    url: '/crm-web/userGroup/asyncImport',
    method: 'post'
  },
  refresh: {
    url: '/crm-web/userGroup/refresh',
    method: 'post'
  },
  searchMemberNum: {
    url: '/crm-web/userGroup/searchMemberNum',
    method: 'post'
  },
  configListMulti: {
    url: '/ouser-web/public/config/listMulti',
    method: 'post'
  },
  saveMkt: {
    url: '/crm-web/userGroup/saveMkt',
    method: 'post'
  }
}
