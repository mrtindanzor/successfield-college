const formEl = document.querySelector('form'),
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
formEl.addEventListener('submit', async (e) => {
  e.preventDefault()

  const formData = new FormData(formEl),
    jsonData = JSON.stringify(Object.fromEntries(formData))
  const uri = '/users/forgotpassword/newpassword',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    }

    fetch(uri, options)
    .then(res => res.json()) 
    .then(data => {
      if(data.status === 201){
        result.innerHTML = `<div class="password-updated">${data.msg}, redirecting to login page in<span class="timeout">${count}</span>secs</div>`
        const timeout = document.querySelector('.timeout')
        counter(timeout)
        redirect()
        return
      } 
      if(data.status !== 200) return result.innerHTML = `<div class="password-not-updated">${data.msg}</div>`
    })
})