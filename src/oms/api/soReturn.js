/* soReturn */
export default {
  /* 售后 */
  soReturnListPage: {
    url: 'oms-web/soReturn/listPage',
    method: 'post'
  },
  listSoReturnPage: {
    url: 'oms-web/soReturn/listSoPage',
    method: 'post'
  },
  soReturnList: {
    url: 'oms-web/soReturn/list',
    method: 'post'
  },
  soReturnUpdate: {
    url: 'oms-web/soReturn/update',
    method: 'post'
  },
  soReturnCancel: {
    url: 'oms-web/soReturn/cancel',
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soReturnListExport: {
    url: 'oms-web/soReturn/export',
    method: 'post'
  },
  /* 20180905 add by cl 售后详情 */
  soReturnDetailGet: {
    url: 'oms-web/soReturn/getReturnDetail',
    method: 'post'
  },
  /* 退货审核通过 */
  soReturnAuditPass: {
    url: 'oms-web/soReturn/auditReturnApplyPass',
    method: 'post'
  },
  /* 退货审核不通过 */
  soReturnAuditNotPass: {
    url: 'oms-web/soReturn/auditReturnApplyNotPass',
    method: 'post'
  },
  soReturnBatchAdd: {
    url: 'oms-web/soReturn/batchAdd',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soReturnBatchUpdate: {
    url: 'oms-web/soReturn/batchUpdate',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  soReturnCheckGoodsNotPassed: {
    url: 'oms-web/soReturn/checkGoodsNotPassed',
    method: 'post'
  },
  soReturnCheckGoodsPassed: {
    url: 'oms-web/soReturn/checkGoodsPassed',
    method: 'post'
  },
  soReturnSupportReturn: {
    url: 'oms-web/soReturn/supportReturn',
    method: 'get'
  },
  soReturnBatchUpdateReturnStatus: {
    url: 'oms-web/soReturn/batchUpdateReturnStatus',
    method: 'post'
  },
  soReturnTabsMsg: {
    url: 'ouser-web/public/page/get',
    method: 'get'
  },
  queryReturnExpressPackage: {
    url: 'oms-web/soReturn/queryReturnExpressPackage',
    method: 'post'
  },
  /*  输入天猫验证码 */
  sendTmallRefundCode: {
    url: 'odts-web/order/sendTmallRefundCode.do',
    method: 'post'
  },
  getTmallPicUrls: {
    url: 'odts-web/order/getPicUrls.do',
    method: 'post'
  },
  listReturnTypeWithoutClose: {
    url: 'oms-web/soReturn/listReturnTypeWithoutClose',
    method: 'post'
  },
  countByReturnStatus: {
    url: 'oms-web/soReturn/countByReturnStatus',
    method: 'post'
  },
  logisticsCompanies: {
    url: 'odts-web/order/pdd/logisticsCompanies.do',
    method: 'post'
  },
  pddRefundCheckGoods: {
    url: 'odts-web/order/pdd/pddRefundCheckGoods.do',
    method: 'post'
  }
}
