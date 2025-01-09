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

setTimeout(function(){
  inputEl.forEach(el => {
    el.style.background = 'transparent'
    el.value = ''
  })
}, 1000)


formEl.addEventListener('submit', async function(e){
  e.preventDefault()

  loader.classList.add('active')
  const uri = '/users/join',
    formData = new FormData(formEl),
    jsonData = Object.fromEntries(formData),
    result = formEl.querySelector('i'),
    options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonData)
    },
    response = await fetch(uri, options),
    res = await response.json()
    loader.classList.remove('active')
    if(res.status !== 201){
      result.innerHTML = `<span class="failed">${res.msg}</span>`
      resetElHtml(result)
      return
    } 
    resetElHtml(result)
    return result.innerHTML = `<span class="success">${res.msg}</span>`
})