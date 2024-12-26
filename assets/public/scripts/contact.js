const formEl = document.querySelector('form.email-form'),
  result = document.querySelector('.result')

formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
  const formData = new FormData(formEl),
    jsonData = JSON.stringify(Object.fromEntries(formData)),
    uri = '/contact',
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    },
    response = await fetch(uri, options),
    res = await response.json()
  if(res.status === 201){
    result.innerHTML = `
    <div class="mail-sent">
      <span class="text">
      ${res.mailIcon}
        <span>${res.msg}</span>
      </span>
      <button>OK</button>
    </div>
  `
  formEl.reset()
  } 
  if(res.status !== 201) result.innerHTML = `
    <div class="mail-not-sent">
      <span class="text">
        ${res.mailIcon}
        <span>${res.msg}</span>
      </span>
      <button>OK</button>
    </div>
  `

  result.classList.add('active')
  const closeBtn = document.querySelector('.result button')
  closeBtn.addEventListener('click', function(){
    result.classList.remove('active')
    loader.classList.remove('active')
  })
})