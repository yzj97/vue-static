import Vue from 'vue'

export default function(form, params, beforeCall, callback) {
  const diveId = '__uploadParams__'
  var div = document.getElementById(diveId)
  if (!div) {
    div = document.createElement('div')
    div.id = diveId
    div.style.display = 'none'
    form.appendChild(div)
  }
  div.innerHTML = ''
  if (beforeCall) {
    beforeCall(form)
  }
  if (params) {
    for (var p in params) {
      var val = params[p]
      if (typeof (val) === 'undefined') continue
      var hideInput = document.createElement('input')
      hideInput.type = 'hidden'
      hideInput.name = p
      hideInput.value = val
      div.appendChild(hideInput)
    }
  }
  const iframeId = '__submitIFrame__'
  form.target = iframeId
  form.method = 'POST'
  form.enctype = 'multipart/form-data'
  let iframe = document.getElementById(iframeId)
  if (!iframe) {
    iframe = document.createElement('iframe')
    iframe.id = iframeId
    iframe.name = iframeId
    iframe.style.display = 'none'
    const onload = function() {
      var result = this.contentWindow.document.body.innerText
      if (!result) {
        return
      }
      // var jsonPrefix = '{\"code\":'
      const jsonPrefix = '{'
      if (result.substr(0, jsonPrefix.length) === jsonPrefix) {
        try {
          var json = JSON.parse(result)
          if (callback) {
            callback(json)
          }
        } catch (e) {
          Vue.$message({
            type: 'error',
            message: e.message
          })
        }
      }
      // 把iframe从页面移除
      document.body.removeChild(iframe)
      if (iframe.parentNode) iframe.parentNode.removeChild(iframe)
    }
    if (Object.prototype.toString.call(onload) === '[object Function]') {
      if (iframe.attachEvent) {
        iframe.attachEvent('onload', onload)
      } else if (iframe.addEventListener) {
        iframe.addEventListener('load', onload)
      } else {
        iframe.onload = onload
      }
    }
    document.body.appendChild(iframe)
  }
  form.submit()
}
