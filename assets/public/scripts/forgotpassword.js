const inputEl = document.querySelector('.email'),
  sendBtn = document.querySelector('.send-button'),
  result = document.querySelector('.result')

sendBtn.addEventListener('click', async () => {
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
  if(data.status === 200) result.innerHTML = `<div class="email-sent">${res.msg}</div>`
  if(data.status !== 200) result.innerHTML = `<div class="email-not-sent">${res.msg}</div>`
})