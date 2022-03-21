export default {
  queryUserApproval: {
    url: '/ouser-web/activityApprovalProcInst/queryUserApproval.do',
    method: 'post',
    timeout: 10000
  },
  addWorkFlows: {
    url: '/ouser-web/workengine/addWorkFlows.do',
    method: 'post',
    timeout: 10000
  },
  operatorApproval: {
    url: '/ouser-web/workengine/operatorApproval.do',
    method: 'post',
    timeout: 10000
  },
  bacthOperatorApproval: {
    url: '/ouser-web/workengine/bacthOperatorApproval.do',
    method: 'post',
    timeout: 10000
  }
}
