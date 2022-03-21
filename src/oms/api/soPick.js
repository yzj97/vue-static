/* soPick */
export default {
  /* 列表 */
  soPickListPage: {
    url: 'oms-web/soPick/listPage',
    method: 'post'
  },
  /* 分配分拣员 */
  soPickUpdatePickUser: {
    url: 'oms-web/soPick/updatePickUser',
    method: 'post'
  },
  soPickDetailGet: {
    url: 'oms-web/soPick/get',
    method: 'get',
    headers: {
      'Content-Type': 'application/json'
    }
  },
  noWarehouseConfirmSend: {
    url: 'oms-web/soPackage/confirmSend',
    method: 'post'
  },
  newNoWarehouseConfirmSend: {
    url: 'oms-web/newSoPackage/newConfirmSend',
    method: 'post'
  },
  warehouseConfirmSend: {
    url: 'oms-web/soPackage/warehouseConfirmSend',
    method: 'post'
  }
}
