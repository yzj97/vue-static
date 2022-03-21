export default {
  getMessageWarnTypeStatus: {
    url: '/ouser-web/messageSetting/getMessageWarnTypeStatus4Json.do',
    method: 'post',
    timeout: 10000
  },
  getEmailConfig: {
    url: '/ouser-web/messageSetting/getEmailConfig4Json.do',
    method: 'post',
    timeout: 10000
  },
  getMessageTempalte: {
    url: '/ouser-web/messageSetting/getMessageTempalte.do',
    method: 'post',
    timeout: 10000
  },
  getSMSConfig: {
    url: '/ouser-web/messageSetting/getSMSConfig.do',
    method: 'post',
    timeout: 10000
  },
  saveDefineTemplate: {
    url: '/ouser-web/messageSetting/saveDefineTemplate.do',
    method: 'post',
    timeout: 10000
  },
  saveMessageWarnTypeStatus: {
    url: '/ouser-web/messageSetting/saveMessageWarnTypeStatus4Json.do',
    method: 'post',
    timeout: 10000
  },
  getMessageTemplate: {
    url: '/ouser-web/messageSetting/getMessageTemplate4Json.do',
    method: 'post',
    timeout: 10000
  },
  saveMessageTemplate: {
    url: '/ouser-web/messageSetting/saveMessageTemplate.do',
    method: 'post',
    timeout: 10000
  },
  saveOmcSmsKey: {
    url: '/ouser-web/messageSetting/saveOmcSmsKey4Json.do',
    method: 'post',
    timeout: 10000
  },
  deleteDefineTemplate: {
    url: '/ouser-web/messageSetting/deleteDefineTemplate.do',
    method: 'post',
    timeout: 10000
  },
  configListMulti: {
    url: '/ouser-web/public/config/listMulti',
    method: 'post',
    timeout: 10000
  },
  smsGetAll: {
    url: '/social-back-web/sms/getAll.do',
    method: 'post',
    timeout: 10000
  },
  batchUpdateCanSend: {
    url: '/social-back-web/sms/batchUpdateCanSend.do',
    method: 'post',
    timeout: 10000
  },
  smsUpdate: {
    url: '/social-back-web/sms/update.do',
    method: 'post',
    timeout: 10000
  }
  // saveSmsConfig4Json,saveOmcSmsKey
}
