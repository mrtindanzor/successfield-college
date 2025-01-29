const timeout = document.querySelector('.timeout'),
  formEl = document.querySelector('form.resend-form')

if(formEl){
  formEl.addEventListener('submit', async function(e){
    e.preventDefault()

    loaderActive()
    const formData = new FormData(formEl)
    let email = Object.fromEntries(formData)
    email = JSON.stringify(email)
    const uri = '/users/resend',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: email
      },
     response = await fetch(uri, options),
     res = await response.json()
    switch(res.status){
    case 201:
        success(res)
        resetElHtml(result)
      break

    case 200: 
        result.innerHTML = `<span class="success">${res.msg}, redirecting in<span class="timeout"></span>secs</span>`
        const timeout = document.querySelector('.timeout')
        counter(timeout)
        redirect()
      break

    default:
        failed(res)
        resetElHtml(result)
    }
    
    loaderInactive()
  })

  resetElHtml(result)
}

function counter(object){
  let count = 10
  object.textContent = count
  setInterval(()=> {
    if(count < 1) return
    count--
    object.textContent = count
  }, 1000)
}
function redirect(){ setTimeout(() => { window.location.href = '/users/login' }, 5000) }
if(timeout){
  counter(timeout)
  redirect()
}