const formEl = document.querySelector('form.email-form')
const sendResult = document.querySelector('.send-result')
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
    sendResult.innerHTML = `
    <div class="mail-sent">
      <span class="text">
      ${res.mailIcon}
        ${success(res)}
      </span>
      <button>OK</button>
    </div>
  `
  formEl.reset()
  } 
  if(res.status !== 201) sendResult.innerHTML = `
    <div class="mail-not-sent">
      <span class="text">
        ${res.mailIcon}
        ${failed}
      </span>
      <button>OK</button>
    </div>
  `

  sendResult.classList.add('active')
  const closeBtn = document.querySelector('.result button')
  closeBtn.addEventListener('click', function(){
    result.classList.remove('active')
    loader.classList.remove('active')
  })
})