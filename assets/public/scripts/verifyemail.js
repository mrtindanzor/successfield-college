const timeout = document.querySelector('.timeout'),
  inputEl = document.querySelector('.email'),
  resendBtn = document.querySelector('.resend-button'),
  result = document.querySelector('.result')

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

if(resendBtn){
  resendBtn.addEventListener('click', async () => {
    let email = inputEl.value
    email = JSON.stringify({email})
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
    if(res.status === 302) {
      result.innerHTML = `<span class="success">${res.msg}, redirecting in<span class="timeout"></span>secs</span>`
      const timeout = document.querySelector('.timeout')
      counter(timeout)
      redirect()
      return 
    }
    if(res.status === 200) result.innerHTML = `<span class="success">${res.msg}</span>`
    if(res.status !== 200) result.innerHTML = `<span class="failed">${res.msg}</span>`
    resetElHtml(result)
  })
}
