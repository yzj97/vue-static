import api from './api'
import router from './router'

export default {
  components: () => import('./components'),
  lang: () => import('./lang'),
  api,
  router
}
