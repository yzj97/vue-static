export default {
  listPage: {
    url: 'back-finance-web/cashOut/listRecordsPage.do',
    method: 'post'
  },
  audits: {
    url: 'back-finance-web/cashOut/audits.do',
    method: 'post'
  },
  listRecordsPage: {
    url: 'back-finance-web/cashOutRecords/listPage.do',
    method: 'post'
  },
  repayRecords: {
    url: 'back-finance-web/cashOutRecords/repay.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  giveUpRecords: {
    url: 'back-finance-web/cashOutRecords/giveUp.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
