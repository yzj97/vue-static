export default {
  // 查询匹配商品
  listPage: {
    url: 'odts-web/product/thirdChannel/mapping/listPage.do',
    method: 'post'
  },
  // 更新映射关系
  updateChannelItemMapping: {
    url: 'odts-web/product/thirdChannel/mapping/updateChannelItemMapping.do',
    method: 'post'
  },
  // 根据渠道ItemId查询SKU列表
  listSku: {
    url: 'odts-web/product/thirdChannel/mapping/listSku.do',
    method: 'post'
  },
  // 获取支持的所有渠道
  supportChannel: {
    url: 'odts-web/product/thirdChannel/mapping/supportChannel.do',
    method: 'post'
  }
}
