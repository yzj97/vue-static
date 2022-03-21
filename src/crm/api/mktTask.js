export default {
  listPage: {
    url: '/crm-web/mktTask/listPage',
    method: 'post'
  },
  add: {
    url: '/crm-web/mktTask/add',
    method: 'post',
    params: {
      // 'taskName': 'test2',
      // 'taskType': 1,
      // 'taskNote': 'test2beizhu',
      // 'taskRules': {
      //   timeType: 1
      // }
    }
  },
  update: {
    url: '/crm-web/mktTask/update',
    method: 'post',
    params: {
      // id
      // 'taskName': 'test2',
      // 'taskType': 1,
      // 'taskNote': 'test2beizhu',
      // 'taskRules': {
      //   timeType: 1
      // }
    }
  },
  listConfigNodes: {
    url: '/crm-web/mktTask/listConfigNodes',
    method: 'post'
  },
  submitAudit: { // 提交审核
    url: '/crm-web/mktTask/submitAudit',
    method: 'post',
    params: {
      id: null // 要审核的id
    }
  },
  copy: { // 拷贝
    url: '/crm-web/mktTask/copy',
    method: 'post',
    params: {
      id: null // 要审核的id
    }
  },
  close: { // 关闭
    url: '/crm-web/mktTask/close',
    method: 'post',
    params: {
      id: null // 要审核的id
    }
  },
  audit: { // 提交审核
    url: '/crm-web/mktTask/audit',
    method: 'post',
    params: {
      id: null, // 要审核的id
      status: null // 2 通过 3 不通过
    }
  },
  listTemplates: {
    url: '/crm-web/mktTask/listTemplates',
    method: 'post'
  },
  queryRunNodeStatistics: {
    url: '/crm-web/mktTask/queryRunNodeStatistics',
    method: 'post'
  }
}
