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