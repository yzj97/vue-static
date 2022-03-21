export default {
  mktTaskReport: {
    url: '/obi-web/crm/report/mktTaskReport.do',
    method: 'get'
  },
  mktNodeAnalysisReport: {
    // 获取节点分析报告
    url: '/obi-web/crm/report/mktNodeAnalysisReport.do',
    method: 'post',
    params: {
      taskId: null
    }
  },
  export: {
    url: '/crm-web/mktTask/export',
    method: 'post'
  }
}
