let page = document.querySelector('[data-section]').dataset.section

if(page === 'request-password'){
  const inputEl = document.querySelector('.email'),
  formEl = document.querySelector('form.email-container')

  formEl.addEventListener('submit', async function(e){
    e.preventDefault()

    loaderActive()
    let email = inputEl.value
    email = JSON.stringify({email})
    const uri = '/users/forgotpassword',
      options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: email
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status === 201) success(res)
    if(res.status !== 201) failed(res)
    loaderInactive()
    resetElHtml(result)
  })
}

if(page === 'set-password'){
  const formEl = document.querySelector('form'),
    showPassword = document.querySelectorAll('.form-eye-open'),
    hidePassword = document.querySelectorAll('.form-eye-close')
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

    loaderActive()
    const formData = new FormData(formEl),
      jsonData = JSON.stringify(Object.fromEntries(formData))
    const uri = '/users/forgotpassword/newpassword',
      options = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      },
      response = await fetch(uri, options),
      res = await response.json()
    if(res.status === 201){
      result.innerHTML = `<span class="success">${res.msg}, redirecting to login page in<span class="timeout">${count}</span>secs</span>`
      const timeout = document.querySelector('.timeout')
      loaderInactive()
      counter(timeout)
      redirect()
      return
    } 
    if(res.status !== 201){
      failed(res)
      loaderInactive()
      return resetElHtml(result)
    } 
    
  })

  for(let show of showPassword){
    show.addEventListener('click', ()=>{
      show.classList.toggle('state-active')

    const hide = show.parentElement.querySelector('.form-eye-close')
      hide.classList.toggle('state-active')

    const showInput = show.parentElement.querySelector('input')
          showInput.setAttribute("type", 'text')
    })
  }

  for(let hide of hidePassword){
    hide.addEventListener('click', ()=>{
      hide.classList.toggle('state-active')

    const show = hide.parentElement.querySelector('.form-eye-open')
      show.classList.toggle('state-active')

    const hideInput = hide.parentElement.querySelector('input')
          hideInput.setAttribute("type", 'password')
    })
  }

}