import 'babel-polyfill'
// 运营平台-商品中心
import mpPlatformRouter from './router/platform/mpRouter'
// 商家平台-商品中心
import mpMerchantRouter from './router/merchant/mpRouter'
// 商家平台-库存中心
import stockMerchantRouter from './router/merchant/stockRouter'
// 请求
import api from './api'
import packages from 'packages'
import main from 'packages/utils/main'

const namespace = process.env.POOL_NAME
const router = [mpPlatformRouter, mpMerchantRouter, stockMerchantRouter]

main(namespace, router, api, packages)

