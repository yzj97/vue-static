export default {
  addSalesAreaInfo: {
    url: '/ouser-web/salesAreaAction/addSalesAreaInfo.do',
    method: 'post'
  },
  delSalesAreaInfo: {
    url: '/ouser-web/salesAreaAction/delSalesAreaInfo.do',
    method: 'post'
  },
  updateSalesAreaInfo: {
    url: '/ouser-web/salesAreaAction/updateSalesAreaInfo.do',
    method: 'post'
  },
  queryStoreLocation: {
    url: '/ouser-web/storeCalendarAction/queryStoreLocation',
    method: 'post'
  },
  queryEquipments: {
    url: '/ouser-web/storeCalendarAction/queryEquipments',
    method: 'post'
  },
  addStoreLocation: {
    url: '/ouser-web/storeTerminalAction/addStoreLocation.do',
    method: 'post'
  },
  delStoreArea: {
    url: '/ouser-web/storeCalendarAction/delStoreArea',
    method: 'post'
  },
  updateStoreLocation: {
    url: '/ouser-web/storeTerminalAction/updateStoreLocation.do',
    method: 'post'
  },
  saveEquipment: {
    url: '/ouser-web/storeCalendarAction/saveEquipment',
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  },
  delEquipment: {
    url: '/ouser-web/storeCalendarAction/delEquipment',
    method: 'post'
  },
  checkRepeatEquipment: {
    url: '/ouser-web/storeCalendarAction/checkRepeatEquipment',
    method: 'post'
  }

}
