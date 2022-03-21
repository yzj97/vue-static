import 'babel-polyfill'

import wechatRouter from './router/wechat/wechatRouter'
import crmRouter from './router/crm/crmRouter'
import api from './api'
import packages from 'packages'
import main from 'packages/utils/main'

const namespace = process.env.POOL_NAME
const router = [wechatRouter, crmRouter]
main(namespace, router, api, packages)
