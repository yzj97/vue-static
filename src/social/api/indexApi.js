export default {
  getRankGroupList: {
    url: 'index/rankGroup/getRankGroupList.do',
    method: 'post'
  },
  getChannelList: {
    url: 'index/channel/getChannelList.do',
    method: 'post'
  },
  changeGroupStatus: {
    url: 'index/rankGroup/changeGroupStatus.do',
    method: 'post',
    showMsg: false
  },
  getRankGroupById: {
    url: 'index/rankGroup/getRankGroupById.do',
    method: 'post'
  },
  saveRankGroup: {
    url: 'index/rankGroup/saveRankGroup.do',
    method: 'post'
  },
  getOrderingRuleByGroupId: {
    url: 'index/orderingRule/getOrderingRuleByGroupId.do',
    method: 'post'
  },
  getOrderingRuleList: {
    url: 'index/orderingRule/getOrderingRuleList.do',
    method: 'post'
  },
  getMainDictList: {
    url: 'index/dictionarySource/getMainDictList.do',
    method: 'post'
  },
  addMainDict: {
    url: 'index/dictionarySource/addMainDict.do',
    method: 'post'
  },
  updateMainDict: {
    url: 'index/dictionarySource/updateMainDict.do',
    method: 'post'
  },
  deleteMainDict: {
    url: 'index/dictionarySource/deleteMainDict.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  getExtendDictList: {
    url: 'index/dictionarySource/getExtendDictList.do',
    method: 'post'
  },
  addExtendDict: {
    url: 'index/dictionarySource/addExtendDict.do',
    method: 'post'
  },
  updateExtendDict: {
    url: 'index/dictionarySource/updateExtendDict.do',
    method: 'post'
  },
  deleteExtendDict: {
    url: 'index/dictionarySource/deleteExtendDict.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  getSynonymyDictList: {
    url: 'index/dictionarySource/getSynonymyDictList.do',
    method: 'post'
  },
  addSynonymyDict: {
    url: 'index/dictionarySource/addSynonymyDict.do',
    method: 'post'
  },
  updateSynonymyDict: {
    url: 'index/dictionarySource/updateSynonymyDict.do',
    method: 'post'
  },
  deleteSynonymyDict: {
    url: 'index/dictionarySource/deleteSynonymyDict.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
