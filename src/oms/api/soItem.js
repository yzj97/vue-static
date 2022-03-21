/* soItem */
export default {
  soVirtualPost: {
    url: 'oms-web/soItem/virtualPost',
    method: 'post'
  },
  soListVirtualData: {
    url: 'oms-web/soItem/listVirtualData',
    method: 'post'
  },
  /* 订单管理 ->订单列表->订单详情->修改购买单价 */
  modifyPriceItem: {
    url: 'oms-web/soItem/modifyPriceItem',
    method: 'post'
  },
  /* 订单管理 ->订单列表->订单详情->商品明细 */
  orderSoItemListPage: {
    url: 'oms-web/soItem/listPage',
    method: 'post'
  },
  orderSoItemUpdateFields: {
    url: 'oms-web/soItem/updateFields',
    method: 'post'
  },
  orderSoItemAdd: {
    url: 'oms-web/soItem/add',
    method: 'post'
  },
  orderSoItemCancel: {
    url: 'oms-web/soItem/cancel',
    method: 'post'
  },
  orderSoItemUpdate: {
    url: 'oms-web/soItem/update',
    method: 'post'
  },
  orderSoItemUpdatePrice: {
    url: 'oms-web/soItem/updatePrice',
    method: 'post'
  },
  orderSoItemExport: {
    url: 'oms-web/soItem/export',
    method: 'post'
  },
  /* 附件信息弹框 */
  soItemGetBasicInfo: {
    url: 'oms-web/soItem/get',
    method: 'get'
  },
  siListItemRealWarehouse: {
    url: 'oms-web/soItem/listItemRealWarehouse',
    method: 'post'
  },
  siBatchListItemRealWarehouse: {
    url: 'oms-web/soItem/batchListItemRealWarehouse',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  siUpdateItemStock: {
    url: 'oms-web/soItem/updateItemStock',
    method: 'post'
  },
  updateItemsConvertDo: {
    url: 'oms-web/soItem/updateItemsConvertDo',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  }
}
