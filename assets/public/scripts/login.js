const formEl = document.querySelector('form'),
  inputEl = formEl.querySelectorAll('input:not([type="submit"])'),
  showPassword = document.querySelectorAll('.form-eye-open'),
  hidePassword = document.querySelectorAll('.form-eye-close')
      
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

inputEl.forEach(el => {
  el.style.background = 'transparent'
  el.value = ' '
})

formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  const uri = '/users/login',
    formData = new FormData(formEl),
    jsonData = Object.fromEntries(formData),
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    },
    response = await fetch(uri, options),
    res = await response.json()
    console.log(res)
  if(res.status === 201) return formEl.querySelector('i').innerHTML = `<span class="success">${res.msg}</span>`
  if(res.status === 200) {
    let count = 10
  function counter(){
    setInterval(()=> {
      if(count === 1) return
      count--
      formEl.querySelector('.timeout').textContent = count
    }, 1000)
  }
  function redirect(){
    setTimeout(() => {
      window.location.href = '/'
    }, 5000);
  }
  formEl.querySelector('i').innerHTML = `
    <span class="success">Login successfully, redirecting <i class='timeout'>${count}</i> seconds</span>
  `
  counter()
  redirect()
    return
  }
  return formEl.querySelector('i').innerHTML = `<span class="failed">${res.msg}</span>`
})