const inputEl = document.querySelector('.email'),
  formEl = document.querySelector('form.email-container'),
  result = document.querySelector('.result')

formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
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
  if(res.status === 200) result.innerHTML = `<div class="success">${res.msg}</div>`
  if(res.status !== 200) result.innerHTML = `<div class="failed">${res.msg}</div>`
  loader.classList.remove('active')
})