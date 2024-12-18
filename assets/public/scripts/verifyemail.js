const timeout = document.querySelector('.timeout'),
  inputEl = document.querySelector('.email'),
  resendBtn = document.querySelector('.resend-button'),
  result = document.querySelector('.result')
let count = 10
function counter(object){
  setInterval(()=> {
    if(count === 1) return
    count--
    object.textContent = count
  }, 1000)
}
function redirect(){
  setTimeout(() => {
    window.location.href = '/users/login'
  }, 5000);
}

if(timeout){
  timeout.textContent = count
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
      }

     fetch(uri, options)
      .then(res => res.json()) 
      .then(data => {
        if(data.status === 302) {
          result.innerHTML = `<div class="email-not-sent">${data.msg}, redirecting in<span class="timeout">${count}</span>secs</div>`
          const timeout = document.querySelector('.timeout')
          counter(timeout)
          redirect()
          return 
        }
        if(data.status === 200) result.innerHTML = `<div class="email-sent">${data.msg}</div>`
        if(data.status !== 200) result.innerHTML = `<div class="email-not-sent">${data.msg}</div>`
      })
  })
}