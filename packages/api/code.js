export default {
  listByCategorys: {
    url: '/oms-web/public/order/code/listByCategorys',
    method: 'post',
    params: { 'categorys': ['ORDER_LABLE', 'ORDER_SOURCE', 'ORDER_PAYMENT_STATUS'] }
  },
  select: {
    url: '/ouser-web/public/config/select',
    method: 'get'
  }
}
