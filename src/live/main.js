import 'babel-polyfill'
import router from './router'
import api from './api'
import packages from 'packages'
import main from 'packages/utils/main'

const namespace = process.env.POOL_NAME

main(namespace, router, api, packages)
