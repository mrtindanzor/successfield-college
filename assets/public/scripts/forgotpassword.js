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
    }

    fetch(uri, options)
    .then(res => res.json()) 
    .then(data => {
      if(data.status === 200) result.innerHTML = `<div class="email-sent">${data.msg}</div>`
      if(data.status !== 200) result.innerHTML = `<div class="email-not-sent">${data.msg}</div>`
    })
})