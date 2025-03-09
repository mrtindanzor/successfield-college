const formEl = document.querySelector('form.email-form')
formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loaderActive()
  const formData = new FormData(formEl)
  const jsonData = JSON.stringify(Object.fromEntries(formData))
  const uri = '/contact'
  const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    },
    response = await fetch(uri, options),
    res = await response.json()
  loaderInactive()
  switch(res.status){
    case 201:
      formEl.reset()
      success(res)
        break;
    default: 
      failed(res)
  }
  resetElHtml(result)
    
})