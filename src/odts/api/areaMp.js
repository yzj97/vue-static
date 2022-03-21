export default {
  // 查询所有第三方渠道
  listAreaMappingPage: {
    url: 'odts-web/areaMapping/listAreaMapping.do',
    method: 'post'
  },
  // 查询授权序信息列表
  queryAuthConfigList: {
    url: 'odts-web/areaMapping/listAuthConfig.do',
    method: 'post'
  },
  //
  deleteAreaMapping: {
    url: 'odts-web/areaMapping/delete.do',
    method: 'post'
  },
  batchDeleteAreaMapping: {
    url: 'odts-web/areaMapping/batchDelete.do',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  areaMappingAdd: {
    url: 'odts-web/areaMapping/saveAreaMapping.do',
    method: 'post',
    showMsg: false
  },
  areaMappingUpdate: {
    url: 'odts-web/areaMapping/updateAreaMapping.do',
    method: 'post',
    showMsg: false
  },
  batchImportAreaMapping: {
    url: 'odts-web/areaMapping/batchImportAreaMapping.do',
    method: 'post',
    showMsg: false,
    headers: {
      'Content-Type': undefined
    }
  }
}
