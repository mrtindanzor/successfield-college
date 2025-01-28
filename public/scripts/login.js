const formEl = document.querySelector('form')
const inputEl = formEl.querySelectorAll('input:not([type="submit"])')
const showPassword = document.querySelectorAll('.form-eye-open')
const hidePassword = document.querySelectorAll('.form-eye-close')
const redirectUrl = formEl.dataset.url
      
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
    const uri =  `/users/login`,
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
  switch(res.status){
    case 201:
      success(res)
      return resetElHtml(result)
        break
    
    case 200:
      let count = 10
      function counter(){
        setInterval(()=> {
          if(count === 1) return
          count--
          document.querySelector('.timeout').textContent = count
        }, 1000)
      }
      function redirect(){
        setTimeout(() => {
          window.location.href = redirectUrl || '/'
        }, 5000);
      }
      result.innerHTML = `
        <span class="success">Login successfully, redirecting in <i class='timeout'>${count}</i> seconds</span>
      `
      counter()
      redirect()
        break
  
    default:
      failed(res)
      return resetElHtml(result)
  }
})