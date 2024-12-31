const page = document.querySelector('[data-section]').dataset.section,
  formEl = document.querySelector('.page-wrapper form.form-container'),
  result = document.querySelector('.result')
console.log(page)
formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
  let uri
  if(page === 'username') uri = '/users/account-information/username'
  if(page === 'phone') uri = '/users/account-information/phonenumber'
  if(page === 'email') uri = '/users/account-information/email'
  if(page === 'changepassword') uri = '/users/account-information/changepassword'
  if(page === 'region') uri = '/users/account-information/region'
  
  const formData = new FormData(formEl),
    jsonData = JSON.stringify(Object.fromEntries(formData)),
    options = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json'
    },
    body: jsonData
  },
  response = await fetch(uri, options),
  res = await response.json()

  if(res.status !== 201){
    result.innerHTML = `<span class="failed"> ${res.msg} </span>`
  }
  if(res.status === 201){
    result.innerHTML = `<span class="success"> ${res.msg} </span>`
    formEl.reset()
  }
  loader.classList.remove('active')
})
if(page == 'changepassword'){
  const showPassword = document.querySelectorAll('.form-eye-open'),
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
}