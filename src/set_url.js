(function() {

  var KEY = 'newTabUrl',
    keyMonitor = null

  function byId(id) {
    var element = document.getElementById(id)
    if (!element) {
      throw new Error('could not find DOM element ' + id)
    }
    return element
  }

  function forwardTo(url) {
    if (location.replace) {
      location.replace(url)
    } else {
      window.location = url
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    var location = window.location || {},
      url = localStorage.getItem(KEY),
      isConfiguring =
        (location.search || '').indexOf('configure=true') > -1
        || !url,
      form = byId('configureForm'),
      newTabUrl = byId('newTabUrl'),
      submit = byId('save')

    if (!isConfiguring) {
      forwardTo(url)
      return
    }

    newTabUrl.value = url
    form.style.display = 'block'

    function validateCurrentInput(save) {
      clearTimeout(keyMonitor)
      var newUrl = (newTabUrl.value || '').trim(),
        isValid = /https?:\/\/.+/.test(newUrl)
      submit.disabled = !isValid
      if (isValid && save) {
        localStorage.setItem(KEY, newUrl)
        if (isConfiguring) {
          form.innerHTML = 'Saved!'
        } else {
          forwardTo(newUrl)
        }
      }
    }

    function scheduleMonitorUpdate() {
      if (keyMonitor) {
        clearTimeout(keyMonitor)
      }
      keyMonitor = setTimeout(validateCurrentInput, 50)
    }

    newTabUrl.addEventListener('keyup', scheduleMonitorUpdate)
    newTabUrl.addEventListener('mouseup', scheduleMonitorUpdate)
    newTabUrl.addEventListener('paste', scheduleMonitorUpdate)
    newTabUrl.addEventListener('cut', scheduleMonitorUpdate)

    validateCurrentInput()

    form.addEventListener('submit', function(event) {
      validateCurrentInput(true)
      event.stopImmediatePropagation()
      event.preventDefault()
    })

  })

})()
