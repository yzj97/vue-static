export default {
  list: {
    url: 'agent-web/distributor/list.do',
    method: 'post'
  },
  updateDistributor: {
    url: 'agent-web/distributor/update.do',
    method: 'post'
  },
  batchEnableDistributor: {
    url: 'agent-web/distributor/batchEnable.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  batchDisableDistributor: {
    url: 'agent-web/distributor/batchDisable.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  verificationUsers: {
    url: 'agent-web/distributor/verificationUsers.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  importUsers: {
    url: 'agent-web/distributor/importUsers.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
